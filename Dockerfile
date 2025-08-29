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

# Copy package files (with fallbacks)
RUN (test -f package.json && cp package.json .) || echo '{"name":"suroi","version":"0.28.2"}' > package.json && \
    (test -f pnpm-lock.yaml && cp pnpm-lock.yaml .) || echo "lockfileVersion: 5.4" > pnpm-lock.yaml && \
    (test -f pnpm-workspace.yaml && cp pnpm-workspace.yaml .) || echo "packages: []" > pnpm-workspace.yaml && \
    mkdir -p ./client ./server ./common && \
    (test -f client/package.json && cp client/package.json ./client/) || echo '{"name":"@suroi/client","version":"0.28.2"}' > ./client/package.json && \
    (test -f server/package.json && cp server/package.json ./server/) || echo '{"name":"@suroi/server","version":"0.28.2"}' > ./server/package.json && \
    (test -f common/package.json && cp common/package.json ./common/) || echo '{"name":"@suroi/common","version":"0.28.2"}' > ./common/package.json

# Install production dependencies
RUN pnpm install --frozen-lockfile --prod || pnpm install --no-frozen-lockfile --prod

# Copy built files (with fallbacks)
RUN mkdir -p ./client/dist ./server/dist ./common/src ./common && \
    (test -d client-dist && cp -r client-dist/* ./client/dist/ 2>/dev/null) || echo "Client files not found" && \
    (test -d server-dist && cp -r server-dist/* ./server/dist/ 2>/dev/null) || echo "Server files not found" && \
    (test -d common/src && cp -r common/src/* ./common/src/ 2>/dev/null) || echo "Common src not found" && \
    (test -f common/package.json && cp common/package.json ./common/) || echo "Common package.json not found" && \
    (test -f server/package.json && cp server/package.json ./server/) || echo "Server package.json not found"

# Create server config (use default if config.json not found)
RUN mkdir -p ./server && \
    if test -f server-dist/config.json; then \
        cp server-dist/config.json ./server/config.json; \
    else \
        printf '{\n\
  "host": "0.0.0.0",\n\
  "port": 8000,\n\
  "maxPlayersPerGame": 80,\n\
  "maxGames": 100,\n\
  "rateLimit": {\n\
    "windowMs": 1000,\n\
    "maxRequests": 10\n\
  },\n\
  "gas": {\n\
    "mode": "normal"\n\
  },\n\
  "map": {\n\
    "width": 1344,\n\
    "height": 1344\n\
  }\n\
}' > ./server/config.json; \
    fi

# Copy scripts (if exists)
RUN mkdir -p ./scripts && \
    (test -d scripts && cp -r scripts/* ./scripts/ 2>/dev/null) || echo "Scripts not found, skipping"

# Copy nginx config (if exists)
RUN if test -f nginx.conf; then \
        cp nginx.conf /etc/nginx/nginx.conf; \
    else \
        printf 'events {\n\
    worker_connections 1024;\n\
}\n\
http {\n\
    include /etc/nginx/mime.types;\n\
    default_type application/octet-stream;\n\
\n\
    server {\n\
        listen 80;\n\
        server_name localhost;\n\
        root /app/client/dist;\n\
        index index.html;\n\
\n\
        location / {\n\
            try_files \$uri \$uri/ /index.html;\n\
        }\n\
\n\
        location /api/ {\n\
            proxy_pass http://localhost:8000/;\n\
            proxy_set_header Host \$host;\n\
            proxy_set_header X-Real-IP \$remote_addr;\n\
        }\n\
    }\n\
}' > /etc/nginx/nginx.conf; \
    fi

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
