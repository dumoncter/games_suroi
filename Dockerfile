# Multi-stage Dockerfile for Suroi game
FROM node:20-bookworm-slim AS base

# Install system dependencies for skia-canvas and other native modules
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

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy server package from main repo
COPY package.json ./server-package.json

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install --no-frozen-lockfile

# Production stage (no build needed - using pre-compiled code)
FROM node:20-bookworm-slim AS production

# Install system dependencies for skia-canvas and other native modules
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

# Copy package files from main repo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY package.json ./server-package.json

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod || pnpm install --no-frozen-lockfile --prod

# Copy pre-compiled code from main repo (includes common modules)
COPY dist ./dist

# Copy only solo server config (already renamed to config.json in build process)
COPY config.json ./config.json

# Copy start script
COPY start-server.js ./start-server.js

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create non-root user
RUN groupadd -g 1001 nodejs
RUN useradd -u 1001 -g nodejs -s /bin/bash -m nodejs

# Change ownership and nginx permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx /run /var/lib/nginx/body /var/lib/nginx/proxy /var/lib/nginx/fastcgi /var/lib/nginx/uwsgi /var/lib/nginx/scgi && \
    chown -R nodejs:nodejs /app && \
    chown -R nodejs:nodejs /var/log/nginx && \
    chown -R nodejs:nodejs /var/cache/nginx && \
    chown -R nodejs:nodejs /var/lib/nginx && \
    touch /run/nginx.pid && \
    chown nodejs:nodejs /run/nginx.pid
USER 1001

# Expose port for solo server
EXPOSE 8080

# Health check - check solo server API (Railway provides PORT)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8080}/api/serverInfo || exit 1

# Start the application
CMD ["node", "start-server.js"]
