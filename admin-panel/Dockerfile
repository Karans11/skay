FROM node:18-alpine AS builder

RUN apk update && apk upgrade && apk add --no-cache dumb-init

WORKDIR /app

COPY package*.json ./
RUN npm install && npm cache clean --force

COPY src/ ./src/
COPY public/ ./public/

RUN npm run build

FROM nginx:alpine

RUN apk update && apk upgrade && apk add --no-cache curl

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup && \
    chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid

USER appuser

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/ || exit 1

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]
