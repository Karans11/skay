FROM node:18-alpine

RUN apk update && apk upgrade && apk add --no-cache dumb-init

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production && npm cache clean --force

COPY src/ ./src/

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

CMD ["dumb-init", "node", "src/app.js"]
