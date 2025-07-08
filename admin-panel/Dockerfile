FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the admin panel
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S admingroup && \
    adduser -S adminuser -u 1001 -G admingroup

RUN chown -R adminuser:admingroup /app
USER adminuser

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

CMD ["npm", "start"]
