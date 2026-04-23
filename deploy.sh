#!/bin/bash
# deploy.sh — run on the server after cloning or pulling updates
set -e

COMPOSE="docker compose -f docker-compose.yml -f docker-compose.prod.yml"
REPO_DIR="/opt/simplerms"

echo "==> Changing to repo directory"
cd "$REPO_DIR"

echo "==> Ensuring .env.local exists"
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "    Created .env.local from .env.example"
fi

if ! grep -q "^AUTH_SECRET=" .env.local 2>/dev/null; then
  echo "AUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
  echo "    Generated AUTH_SECRET"
fi

if ! grep -q "^APP_ENCRYPTION_KEY=" .env.local 2>/dev/null || grep -q "replace-with" .env.local 2>/dev/null; then
  sed -i "s|APP_ENCRYPTION_KEY=.*|APP_ENCRYPTION_KEY=$(openssl rand -hex 32)|" .env.local
  echo "    Generated APP_ENCRYPTION_KEY"
fi

if ! grep -q "^AUTH_TRUST_HOST=" .env.local 2>/dev/null; then
  echo "AUTH_TRUST_HOST=true" >> .env.local
  echo "    Set AUTH_TRUST_HOST=true (required behind reverse proxy)"
fi

echo "==> Ensuring swap space (prevents OOM during build)"
if [ ! -f /swapfile ]; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab > /dev/null
  echo "    Created 2GB swap"
elif ! swapon --show | grep -q /swapfile; then
  sudo swapon /swapfile
  echo "    Enabled existing swap"
else
  echo "    Swap already active"
fi

echo "==> Ensuring database is running"
$COMPOSE up -d db
echo "    Waiting for database..."
until $COMPOSE exec -T db pg_isready -U simplerms > /dev/null 2>&1; do
  sleep 2
done
echo "    Database ready"

echo "==> Building new image (old app keeps serving traffic)"
$COMPOSE build --no-cache

echo "==> Pushing schema to database"
$COMPOSE run --rm migrator npx prisma db push --skip-generate

echo "==> Checking if seed is needed"
USER_COUNT=$($COMPOSE exec -T db \
  psql -U simplerms -d simplerms -tAc "SELECT COUNT(*) FROM \"User\";" 2>/dev/null || echo "0")
SERVICE_COUNT=$($COMPOSE exec -T db \
  psql -U simplerms -d simplerms -tAc "SELECT COUNT(*) FROM \"Service\";" 2>/dev/null || echo "0")
if [ "${USER_COUNT// /}" = "0" ] || [ "${SERVICE_COUNT// /}" = "0" ]; then
  echo "==> Seeding database (users: ${USER_COUNT// /}, services: ${SERVICE_COUNT// /})"
  $COMPOSE run --rm migrator npx prisma db seed
else
  echo "    Database already seeded (${USER_COUNT// /} users, ${SERVICE_COUNT// /} services)"
fi

echo "==> Seeding blog content (idempotent via upsert)"
# Every seed-blog-*.ts uses upsert, so running these on every deploy safely
# creates new posts and updates edits to existing ones. No flags, no drift.
shopt -s nullglob
for seed_file in prisma/seed-blog-*.ts; do
  seed_name=$(basename "$seed_file" .ts)
  echo "    Running $seed_name"
  $COMPOSE run --rm migrator npx tsx "$seed_file"
done
shopt -u nullglob

echo "==> Swapping to new container"
$COMPOSE up -d --no-deps --remove-orphans app

echo "==> Waiting for app to be ready (max 120s)..."
WAIT=0
until curl -sf http://localhost:3000/api/health > /dev/null 2>&1; do
  sleep 3
  WAIT=$((WAIT + 3))
  if [ $WAIT -ge 120 ]; then
    echo "ERROR: app did not become healthy after 120s"
    $COMPOSE logs --tail=50 app
    exit 1
  fi
done
echo "    App is up"

echo "==> Cleaning up old images"
docker image prune -f > /dev/null 2>&1

echo "==> Configuring nginx"
# Extract domain — use sed instead of grep -oP for portability.
NGINX_DOMAIN=$(sed -n 's|^NEXT_PUBLIC_APP_URL=https\?://\([^/:]*\).*|\1|p' .env.local 2>/dev/null)
NGINX_DOMAIN="${NGINX_DOMAIN:-_}"
echo "    Detected domain: $NGINX_DOMAIN"

# Only write nginx config if it doesn't exist or if --force-nginx was passed.
# This prevents deploy from clobbering a working nginx config every time.
if [ -f /etc/nginx/sites-available/simplerms ] && [ "$1" != "--force-nginx" ]; then
  echo "    nginx config already exists — skipping (use --force-nginx to overwrite)"
  sudo nginx -t && sudo systemctl reload nginx
else
  if [ -d "/etc/letsencrypt/live/$NGINX_DOMAIN" ]; then
    echo "    SSL certificate found — configuring HTTPS"
    sudo tee /etc/nginx/sites-available/simplerms > /dev/null << 'NGINX'
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name DOMAIN_PLACEHOLDER;

    ssl_certificate /etc/letsencrypt/live/DOMAIN_PLACEHOLDER/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/DOMAIN_PLACEHOLDER/privkey.pem;

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }
}
NGINX
    sudo sed -i "s/DOMAIN_PLACEHOLDER/$NGINX_DOMAIN/g" /etc/nginx/sites-available/simplerms
  else
    echo "    No SSL certificate — configuring HTTP only"
    sudo tee /etc/nginx/sites-available/simplerms > /dev/null << 'NGINX'
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER;

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }
}
NGINX
    sudo sed -i "s/DOMAIN_PLACEHOLDER/$NGINX_DOMAIN/g" /etc/nginx/sites-available/simplerms
  fi

  sudo ln -sf /etc/nginx/sites-available/simplerms /etc/nginx/sites-enabled/
  sudo rm -f /etc/nginx/sites-enabled/default
  sudo nginx -t && sudo systemctl reload nginx
  echo "    nginx configured for $NGINX_DOMAIN"
fi

echo "==> Checking HTTPS"
if [ -n "$NGINX_DOMAIN" ] && [ "$NGINX_DOMAIN" != "_" ] && [ "$NGINX_DOMAIN" != "localhost" ]; then
  if ! command -v certbot &> /dev/null; then
    echo "    Installing certbot"
    sudo apt-get update -qq && sudo apt-get install -y -qq certbot python3-certbot-nginx > /dev/null
  fi
  if [ ! -d "/etc/letsencrypt/live/$NGINX_DOMAIN" ]; then
    echo "    Requesting certificate for $NGINX_DOMAIN"
    sudo certbot --nginx -d "$NGINX_DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email
  else
    echo "    Certificate exists for $NGINX_DOMAIN"
  fi
else
  echo "    Skipping HTTPS (set NEXT_PUBLIC_APP_URL to enable)"
fi

echo ""
echo "============================================"
echo " Akritos is running"
echo " http://$(curl -sf ifconfig.me 2>/dev/null || echo 'YOUR_IP')"
echo ""
echo " Admin login: admin@example.com"
echo " Password:    changeme123"
echo " CHANGE THIS PASSWORD IMMEDIATELY"
echo "============================================"
