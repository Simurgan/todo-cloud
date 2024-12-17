# Stage 1: Build React app
FROM node:22.11.0-alpine AS build
WORKDIR /app

COPY . .

# Install dependencies and build the app
RUN npm install
RUN npm run build

# Stage 2: Serve static files using NGINX
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom NGINX configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Add entrypoint script to replace environment variables
COPY ./entrypoint.sh /docker-entrypoint.d/entrypoint.sh
RUN chmod +x /docker-entrypoint.d/entrypoint.sh

# Expose the NGINX port
EXPOSE 80

# Start the entrypoint script and NGINX
ENTRYPOINT ["/docker-entrypoint.d/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
