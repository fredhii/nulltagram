#!/bin/sh
set -e

echo "=== Nulltagram Frontend Entrypoint ==="
echo "Generating runtime config..."

# Generate runtime config from environment variables
cat > /usr/share/nginx/html/config.js <<EOF
window.__ENV__ = {
  VITE_FIREBASE_API_KEY: "${VITE_FIREBASE_API_KEY}",
  VITE_FIREBASE_AUTH_DOMAIN: "${VITE_FIREBASE_AUTH_DOMAIN}",
  VITE_FIREBASE_PROJECT_ID: "${VITE_FIREBASE_PROJECT_ID}",
  VITE_FIREBASE_STORAGE_BUCKET: "${VITE_FIREBASE_STORAGE_BUCKET}",
  VITE_FIREBASE_MESSAGING_SENDER_ID: "${VITE_FIREBASE_MESSAGING_SENDER_ID}",
  VITE_FIREBASE_APP_ID: "${VITE_FIREBASE_APP_ID}",
  VITE_API_URL: "${VITE_API_URL}"
};
console.log('[Nulltagram] Runtime config loaded:', window.__ENV__.VITE_API_URL ? 'API URL set' : 'WARNING: No API URL');
EOF

echo "Config generated with API URL: ${VITE_API_URL:-'NOT SET'}"

# Inject config script into index.html in the head section
if grep -q 'config.js' /usr/share/nginx/html/index.html; then
    echo "config.js already injected, skipping..."
else
    echo "Injecting config.js into index.html..."
    sed -i 's|<head>|<head>\n    <script src="/config.js"></script>|' /usr/share/nginx/html/index.html
    echo "Injection complete"
fi

echo "=== Starting Nginx ==="
exec nginx -g "daemon off;"
