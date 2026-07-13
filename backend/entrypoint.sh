#!/bin/sh
set -e

export DATABASE_URL="$(node -e '
const enc = encodeURIComponent;
const url = `postgresql://${enc(process.env.POSTGRES_USER)}:${enc(process.env.POSTGRES_PASSWORD)}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${enc(process.env.POSTGRES_DB)}`;
process.stdout.write(url);
')"

npx prisma migrate deploy
exec node server.js
