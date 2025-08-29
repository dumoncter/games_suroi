# Multi-stage Dockerfile for Suroi game
FROM node:20-bullseye-slim AS base

# Install system dependencies for skia-canvas and other native modules
RUN apt-get update && apt-get install -y \
    fontconfig \
    libfreetype6 \
    libpng-dev \
    libjpeg-dev \





    libicu-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy client package
COPY client/package.json ./client/

# Copy server package
COPY server/package.json ./server/

# Copy common package
COPY common/package.json ./common/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS build

# Copy source code
COPY . .

# Build client
RUN cd client && pnpm build

# Build server
RUN cd server && pnpm build

# Production stage
FROM node:20-bullseye-slim AS production

# Install system dependencies for skia-canvas and other native modules
RUN apt-get update && apt-get install -y \
    fontconfig \
    libfreetype6 \
    libpng-dev \
    libjpeg-dev \





    libicu-dev \
    curl \
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

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built client
COPY --from=build /app/client/dist ./client/dist

# Copy built server
COPY --from=build /app/server/dist ./server/dist

# Copy common source (needed for runtime)
COPY common/src ./common/src
COPY common/package.json ./common/

# Copy server config
COPY server/config.production.json ./server/config.json

# Copy production scripts
COPY scripts/ ./scripts/

# Create non-root user
RUN groupadd -g 1001 nodejs
RUN useradd -u 1001 -g nodejs -s /bin/bash -m nodejs

# Change ownership
RUN chown -R nodejs:nodejs /app
USER 1001

# Expose ports
EXPOSE 3000 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start the application
CMD ["pnpm", "start"]
