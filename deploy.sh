#!/usr/bin/env bash
set -euo pipefail

echo "==> GoldenHook deploy: build backend & frontend"

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
export NODE_OPTIONS=${NODE_OPTIONS:-"--max-old-space-size=2048"}

echo "-- Node version --"
if ! command -v node >/dev/null 2>&1; then
	echo "ERROR: node not found in PATH. Enter cPanel Node.js App virtualenv or install nvm (see README)." >&2
	exit 1
fi
node -v
if ! command -v npm >/dev/null 2>&1; then
	echo "ERROR: npm not found in PATH." >&2
	exit 1
fi
npm -v

install_deps() {
	if [ -f package-lock.json ]; then
		npm ci
	else
		npm install
	fi
}

echo "-- Backend build --"
cd "$BASE_DIR/backend"
install_deps
npm run build

echo "-- Frontend build --"
cd "$BASE_DIR/frontend"
install_deps
npm run build

echo "==> Done. Start backend: node dist/main.js (via cPanel Node App)."
echo "==> Start frontend: node server.js (requires prior 'npm run build')."
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
