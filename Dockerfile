# Railway-optimized Dockerfile for Suroi
FROM node:20-bookworm-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    fontconfig \
    libfreetype6 \
    libpng-dev \
    libjpeg-dev \
    libicu-dev \
    curl \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json ./client/
COPY server/package.json ./server/
COPY common/package.json ./common/

# Install production dependencies
RUN pnpm install --frozen-lockfile --prod || pnpm install --no-frozen-lockfile --prod

# Copy built files
COPY client-dist ./client/dist
COPY server-dist ./server/dist
COPY common/src ./common/src
COPY common/package.json ./common/

# Copy server config
COPY server-dist/config.json ./server/config.json

# Copy scripts
COPY scripts ./scripts

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create non-root user
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -s /bin/bash -m nodejs

# Setup permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx /run /var/lib/nginx/body /var/lib/nginx/proxy /var/lib/nginx/fastcgi /var/lib/nginx/uwsgi /var/lib/nginx/scgi && \
    chown -R nodejs:nodejs /app && \
    chown -R nodejs:nodejs /var/log/nginx && \
    chown -R nodejs:nodejs /var/cache/nginx && \
    chown -R nodejs:nodejs /var/lib/nginx && \
    touch /run/nginx.pid && \
    chown nodejs:nodejs /run/nginx.pid

USER 1001

# Railway uses PORT environment variable (defaults to 8000 if not set)
ENV PORT=8000
EXPOSE $PORT

# Health check for Railway
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/api/serverInfo || exit 1

# Start server with Railway port using environment variable
# Suroi server reads port from PORT environment variable or config
CMD PORT=$PORT node server/dist/server/src/server.js
