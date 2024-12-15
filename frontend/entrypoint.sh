#!/bin/sh

# Replace placeholder in JS and HTML files
echo "Replacing backend URL placeholder..."
find /usr/share/nginx/html -type f \( -name "*.js" -o -name "*.html" \) \
  -exec sed -i "s|__VITE_BACKEND_URL__|${VITE_BACKEND_URL}|g" {} +

# Start NGINX
echo "Starting NGINX..."
exec "$@"
