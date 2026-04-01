#!/bin/bash
# deploy.sh — run this on the server after cloning or pulling updates
set -e

REPO_DIR="/opt/simplerms"

echo "==> Changing to repo directory"
cd "$REPO_DIR"

echo "==> Ensuring .env.local exists"
if [ ! -f .env.local ]; then
  cp .env .env.local
  echo "    Created .env.local from .env"
else
  echo "    .env.local already exists"
fi

echo "==> Stopping existing containers"
docker compose -f docker-compose.yml -f docker-compose.prod.yml down --remove-orphans

echo "==> Pulling latest images and rebuilding"
docker compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache

echo "==> Starting containers"
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

echo "==> Waiting for app to migrate and start..."
# Migrations run inside the container entrypoint before the server starts.
# Wait for the health endpoint to confirm everything is up.

echo "==> Waiting for app to be ready (max 120s)..."
WAIT=0
until curl -sf http://localhost:3000/api/health > /dev/null 2>&1; do
  sleep 3
  WAIT=$((WAIT + 3))
  if [ $WAIT -ge 120 ]; then
    echo "ERROR: app did not become healthy after 120s"
    docker compose -f docker-compose.yml -f docker-compose.prod.yml logs --tail=50 app
    exit 1
  fi
done
echo "    App is up"

echo "==> Checking if seed is needed"
USER_COUNT=$(docker compose -f docker-compose.yml -f docker-compose.prod.yml exec -T db \
  psql -U simplerms -d simplerms -tAc "SELECT COUNT(*) FROM \"User\";" 2>/dev/null || echo "0")
if [ "${USER_COUNT// /}" = "0" ]; then
  echo "==> Seeding database"
  docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm app npm run db:seed
else
  echo "    Database already seeded (${USER_COUNT// /} users), skipping"
fi

echo "==> Configuring nginx"
sudo tee /etc/nginx/sites-available/simplerms > /dev/null << 'NGINX'
server {
    listen 80;
    server_name _;

    # Allow large file uploads
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

sudo ln -sf /etc/nginx/sites-available/simplerms /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
echo "    nginx configured"

echo ""
echo "============================================"
echo " Akritos is running"
echo " http://$(curl -sf ifconfig.me 2>/dev/null || echo 'YOUR_IP')"
echo ""
echo " Admin login: admin@example.com"
echo " Password:    changeme123"
echo " CHANGE THIS PASSWORD IMMEDIATELY"
echo "============================================"
