# Dockerfile for Suroi Client Production
FROM nginx:alpine

# Copy built client files
COPY . /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8081 for client
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8081 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
