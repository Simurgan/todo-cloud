#!/bin/sh

REAL_BACKEND_URL="http://${HOST_IP}:${BACKEND_PORT}/"
echo "Replacing backend URL placeholder with ${REAL_BACKEND_URL}..."

find /usr/share/nginx/html -type f \( -name "*.js" -o -name "*.html" \) \
  -exec sed -i "s|__VITE_BACKEND_URL__|${REAL_BACKEND_URL}|g" {} +

echo "Starting NGINX..."
exec "$@"
