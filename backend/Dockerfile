FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate \
    && addgroup -S appgroup \
    && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app \
    && chmod +x entrypoint.sh

USER appuser

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
