# Dockerfile

FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

FROM base AS development
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS builder
RUN npm ci
COPY . .
RUN DATABASE_URL="postgresql://build:build@localhost/build" npx prisma generate
ENV NODE_OPTIONS="--max-old-space-size=1536"
RUN npm run build

# Full node_modules for running migrations and seeds
FROM builder AS migrator

# Lean runtime — only the standalone Next.js server
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Run as non-root for defense in depth.
USER node
EXPOSE 3000
CMD ["node", "server.js"]
