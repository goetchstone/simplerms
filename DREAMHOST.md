# Deploying SimpleRMS on DreamHost OpenStack (DreamCompute)

DreamHost's OpenStack cloud (DreamCompute) gives you a full Linux VM — this is exactly what SimpleRMS needs.

---

## 1. Create a DreamCompute instance

1. Log in to [panel.dreamhost.com](https://panel.dreamhost.com) → **DreamCompute**
2. Create a new instance:
   - **Flavor:** `subsonic.2` or larger (2 vCPU, 4 GB RAM minimum)
   - **Image:** Ubuntu 22.04 LTS
   - **Key pair:** Upload your SSH public key during setup
3. Note your instance's **floating IP** (assign one if not auto-assigned)

---

## 2. Point your domain

In DreamHost DNS, add an **A record** pointing your domain to the floating IP.

---

## 3. SSH into the instance and install Docker

```bash
ssh ubuntu@YOUR_FLOATING_IP

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu
newgrp docker

# Install Docker Compose plugin
sudo apt-get install -y docker-compose-plugin

# Install nginx and certbot
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

---

## 4. Clone the repo

```bash
git clone https://github.com/goetchstone/simplerms.git /opt/simplerms
cd /opt/simplerms
```

---

## 5. Configure environment

```bash
cp .env.example .env
nano .env
```

Fill in every variable:

```
DATABASE_URL=postgresql://simplerms:STRONG_PASSWORD@db:5432/simplerms
AUTH_SECRET=<run: openssl rand -base64 32>
APP_ENCRYPTION_KEY=<run: openssl rand -hex 32>

STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

SMTP_HOST=smtp.dreamhost.com
SMTP_PORT=587
SMTP_USER=your@domain.com
SMTP_PASS=your_email_password
EMAIL_FROM="Your Company <your@domain.com>"

NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 6. Start the app

```bash
# Build and start (production mode, no mailpit)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Run database migrations
docker compose exec app npx prisma migrate deploy

# Seed initial data (first deploy only)
docker compose exec app npm run db:seed
```

---

## 7. Configure nginx reverse proxy

```bash
sudo nano /etc/nginx/sites-available/simplerms
```

```nginx
server {
    server_name yourdomain.com;

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
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/simplerms /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Get a free TLS certificate
sudo certbot --nginx -d yourdomain.com
```

---

## 8. Configure GitHub Actions CI/CD

Add these secrets to your GitHub repo (`Settings → Secrets → Actions`):

| Secret | Value |
|--------|-------|
| `DEPLOY_HOST` | Your floating IP |
| `DEPLOY_USER` | `ubuntu` |
| `DEPLOY_SSH_KEY` | Your private SSH key (full content of `~/.ssh/id_rsa`) |

Push to `main` and GitHub Actions will automatically:
1. Run type checks and tests
2. Build the Docker image
3. SSH into your VPS and `docker compose pull && docker compose up -d`

---

## 9. Register the Stripe webhook

In the Stripe dashboard, add a webhook endpoint:
```
https://yourdomain.com/api/webhooks/stripe
```

Subscribe to: `payment_link.completed`, `checkout.session.completed`

Copy the webhook signing secret into your `.env` as `STRIPE_WEBHOOK_SECRET`.

---

## 10. Verify everything

```bash
# Check app is running
curl https://yourdomain.com/api/health

# View logs
docker compose logs -f app
```

The seed creates an admin account: `admin@example.com` / `changeme123` — **change this immediately** in Settings → Users after first login.
