#!/bin/sh
# entrypoint.sh — runs on every container start before the server
set -e

echo "==> Running database migrations"
npx prisma migrate deploy

echo "==> Starting server"
exec node server.js
