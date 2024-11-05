FROM node:18-slim

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files first for better caching
COPY package*.json ./

# Clean install dependencies, including only production dependencies
RUN npm ci --production

# Copy source
COPY . .

EXPOSE 3001

# Use non-root user for security
USER node

CMD ["node", "src/server.js"]