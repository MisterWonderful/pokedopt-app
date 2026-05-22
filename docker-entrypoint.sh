#!/bin/sh
set -e

# node_modules/.bin is on PATH so npx-installed binaries work
export PATH="/app/node_modules/.bin:$PATH"

echo "[entrypoint] Applying database migrations…"
prisma migrate deploy

# Seed only if the cards table is empty (idempotent first-run seed)
COUNT=$(node -e "const{PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.card.count().then(n=>{console.log(n);process.exit(0)}).catch(e=>{console.error(e);process.exit(1)})")

if [ "$COUNT" = "0" ]; then
  echo "[entrypoint] Cards table is empty — running seed…"
  tsx prisma/seed.ts || echo "[entrypoint] Seed failed, continuing anyway"
else
  echo "[entrypoint] Cards table has $COUNT rows — skipping seed."
fi

echo "[entrypoint] Starting Next.js server…"
exec node server.js
