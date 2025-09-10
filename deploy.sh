#!/usr/bin/env bash
set -euo pipefail

# Ensure Node 18 with nvm (optional)
export NVM_DIR="$HOME/.nvm"
if [ -d "$NVM_DIR" ]; then . "$NVM_DIR/nvm.sh"; fi
command -v nvm >/dev/null 2>&1 && nvm install 18 && nvm use 18 || true

export NODE_OPTIONS=--max-old-space-size=2048

echo "[1/4] Install backend deps"
cd backend
npm ci
echo "[2/4] Build backend"
npm run build

echo "[3/4] Install frontend deps"
cd ../frontend
npm ci
echo "[4/4] Build frontend"
npm run build

echo "Done. Backend dist/ and Frontend .next are ready."
