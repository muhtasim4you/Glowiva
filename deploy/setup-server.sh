#!/bin/bash
# ============================================================
# Glowivaa.cloud - Full Server Setup Script
# Run this on your Hostinger VPS as root
# Usage: bash setup-server.sh
# ============================================================

set -e

DOMAIN="glowivaa.cloud"
APP_DIR="/var/www/glowivaa"
REPO_URL="https://github.com/mdmuhtasimrashid-bit/beauty-ecommerce.git"

echo "========================================="
echo "  Glowivaa Server Setup - Starting..."
echo "========================================="

# ---- Step 1: System Update ----
echo ""
echo "[1/9] Updating system packages..."
apt update && apt upgrade -y

# ---- Step 2: Install Node.js 20 LTS ----
echo ""
echo "[2/9] Installing Node.js 20 LTS..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# ---- Step 3: Install MongoDB 7 ----
echo ""
echo "[3/9] Installing MongoDB..."
if ! command -v mongod &> /dev/null; then
    # Import MongoDB GPG key
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
        gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

    # Add MongoDB repo (Ubuntu 22.04)
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
        tee /etc/apt/sources.list.d/mongodb-org-7.0.list

    apt update
    apt install -y mongodb-org

    # Start and enable MongoDB
    systemctl start mongod
    systemctl enable mongod
    echo "MongoDB installed and started."
else
    echo "MongoDB already installed."
    systemctl start mongod
fi

# ---- Step 4: Install Nginx ----
echo ""
echo "[4/9] Installing Nginx..."
apt install -y nginx
systemctl enable nginx

# ---- Step 5: Install PM2 & Build Tools ----
echo ""
echo "[5/9] Installing PM2 and build tools..."
npm install -g pm2
apt install -y git build-essential

# ---- Step 6: Clone/Pull Repository ----
echo ""
echo "[6/9] Setting up application..."
if [ -d "$APP_DIR" ]; then
    echo "App directory exists. Pulling latest code..."
    cd $APP_DIR
    git pull origin main
else
    echo "Cloning repository..."
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# Create required directories
mkdir -p $APP_DIR/backend/uploads
mkdir -p $APP_DIR/logs

# ---- Step 7: Install Dependencies & Build ----
echo ""
echo "[7/9] Installing dependencies..."

# Backend
echo "Installing backend dependencies..."
cd $APP_DIR/backend
npm install --production

# Frontend
echo "Installing frontend dependencies and building..."
cd $APP_DIR/frontend
npm install
npm run build

echo "Frontend build complete."

# ---- Step 8: Configure Nginx ----
echo ""
echo "[8/9] Configuring Nginx..."

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Copy our nginx config
cat > /etc/nginx/sites-available/glowivaa << 'NGINX_CONF'
server {
    listen 80;
    server_name glowivaa.cloud www.glowivaa.cloud;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Max upload size
    client_max_body_size 10M;

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90s;
    }

    # Uploaded files
    location /uploads/ {
        alias /var/www/glowivaa/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Frontend
    location / {
        root /var/www/glowivaa/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;

        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }
}
NGINX_CONF

# Enable the site
ln -sf /etc/nginx/sites-available/glowivaa /etc/nginx/sites-enabled/glowivaa

# Test nginx config
nginx -t
systemctl restart nginx

# ---- Step 9: SSL Certificate ----
echo ""
echo "[9/9] Setting up SSL with Let's Encrypt..."
apt install -y certbot python3-certbot-nginx
certbot --nginx -d glowivaa.cloud -d www.glowivaa.cloud --non-interactive --agree-tos --email studycrip@gmail.com --redirect

echo ""
echo "========================================="
echo "  Setup Complete!"
echo "========================================="
echo ""
echo "IMPORTANT: You still need to:"
echo "  1. Create the backend .env file (see instructions below)"
echo "  2. Start the backend with PM2"
echo "  3. Seed the database (if fresh install)"
echo ""
echo "Run these commands:"
echo ""
echo "  # Create .env file:"
echo "  nano /var/www/glowivaa/backend/.env"
echo ""
echo "  # Start the backend:"
echo "  cd /var/www/glowivaa"
echo "  pm2 start deploy/ecosystem.config.js"
echo "  pm2 save"
echo "  pm2 startup"
echo ""
echo "  # (Optional) Seed admin user:"
echo "  cd /var/www/glowivaa/backend"
echo "  node scripts/createAdmin.js"
echo ""
echo "  # (Optional) Seed categories & brands:"
echo "  node scripts/seedCategoriesBrands.js"
echo ""
echo "Your site will be live at: https://glowivaa.cloud"
echo "========================================="
