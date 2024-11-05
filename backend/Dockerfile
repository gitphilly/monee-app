# Use node with debian (instead of alpine)
FROM node:18-slim

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Clean install dependencies
RUN npm ci

COPY . .

EXPOSE 3001

CMD ["node", "src/server.js"]