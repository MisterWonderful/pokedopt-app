#!/bin/sh
set -e

echo "[entrypoint] Applying database migrations…"
npx prisma migrate deploy

# Seed only if the cards table is empty (idempotent first-run seed)
EMPTY=$(node -e "const{PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.card.count().then(n=>{console.log(n);process.exit(0)}).catch(e=>{console.error(e);process.exit(1)})")

if [ "$EMPTY" = "0" ]; then
  echo "[entrypoint] Cards table is empty — running seed…"
  npx tsx prisma/seed.ts || echo "[entrypoint] Seed failed, continuing anyway"
else
  echo "[entrypoint] Cards table has $EMPTY rows — skipping seed."
fi

echo "[entrypoint] Starting Next.js server…"
exec node server.js
