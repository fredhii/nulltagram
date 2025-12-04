#!/bin/sh

# Generate runtime config from environment variables
cat > /usr/share/nginx/html/config.js <<EOF
window.__ENV__ = {
  VITE_FIREBASE_API_KEY: "${VITE_FIREBASE_API_KEY}",
  VITE_FIREBASE_AUTH_DOMAIN: "${VITE_FIREBASE_AUTH_DOMAIN}",
  VITE_FIREBASE_PROJECT_ID: "${VITE_FIREBASE_PROJECT_ID}",
  VITE_FIREBASE_STORAGE_BUCKET: "${VITE_FIREBASE_STORAGE_BUCKET}",
  VITE_FIREBASE_MESSAGING_SENDER_ID: "${VITE_FIREBASE_MESSAGING_SENDER_ID}",
  VITE_FIREBASE_APP_ID: "${VITE_FIREBASE_APP_ID}",
  VITE_API_URL: "${VITE_API_URL:-http://backend:5001}"
};
EOF

# Inject config script into index.html before the first script tag in head
sed -i '/<script type="module"/i\    <script src="/config.js"></script>' /usr/share/nginx/html/index.html

# Start nginx
exec nginx -g "daemon off;"

