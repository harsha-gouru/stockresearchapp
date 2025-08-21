# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    curl

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY src/ ./src/
COPY sql/ ./sql/
COPY .env* ./

# Install tsx globally for TypeScript execution
RUN npm install -g tsx

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S stockapp -u 1001

# Change ownership of app directory
RUN chown -R stockapp:nodejs /app
USER stockapp

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Default command
CMD ["tsx", "src/server-database-integration.ts"]
