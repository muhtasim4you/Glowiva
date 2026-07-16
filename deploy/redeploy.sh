#!/bin/bash
# ============================================================
# Glowivaa - Quick Redeploy Script
# Run this on VPS after pushing new code to GitHub
# Usage: bash /var/www/glowivaa/deploy/redeploy.sh
# ============================================================

set -e

APP_DIR="/var/www/glowivaa"

echo "Pulling latest code..."
cd $APP_DIR
git pull origin main

echo "Installing backend dependencies..."
cd $APP_DIR/backend
npm install --production

echo "Building frontend..."
cd $APP_DIR/frontend
npm install
npm run build

echo "Restarting backend..."
pm2 restart glowivaa-api

echo "Done! Site updated at https://glowivaa.cloud"
