# Dockerfile for Suroi Client Production
FROM nginx:alpine

# Install curl for health check
RUN apk add --no-cache curl

# Copy nginx configuration first
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy all necessary static files and directories
COPY index.html /usr/share/nginx/html/
COPY manifest.json /usr/share/nginx/html/
COPY robots.txt /usr/share/nginx/html/
COPY favicon.ico /usr/share/nginx/html/
COPY apple-app-site-association.json /usr/share/nginx/html/
COPY img/ /usr/share/nginx/html/img/
COPY audio/ /usr/share/nginx/html/audio/
COPY fonts/ /usr/share/nginx/html/fonts/
COPY scripts/ /usr/share/nginx/html/scripts/
COPY styles/ /usr/share/nginx/html/styles/
COPY changelog/ /usr/share/nginx/html/changelog/
COPY editor/ /usr/share/nginx/html/editor/
COPY news/ /usr/share/nginx/html/news/
COPY privacy/ /usr/share/nginx/html/privacy/
COPY rules/ /usr/share/nginx/html/rules/

# Expose port 8081 for client
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8081 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
