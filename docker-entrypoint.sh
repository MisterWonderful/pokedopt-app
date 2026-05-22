#!/bin/sh
set -e

PRISMA="node node_modules/prisma/build/index.js"
TSX="node node_modules/tsx/dist/cli.mjs"

echo "[entrypoint] Applying database migrations…"
$PRISMA migrate deploy

# Seed only if the cards table is empty (idempotent first-run seed)
COUNT=$(node -e "const{PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.card.count().then(n=>{console.log(n);process.exit(0)}).catch(e=>{console.error(e);process.exit(1)})")

if [ "$COUNT" = "0" ]; then
  echo "[entrypoint] Cards table is empty — running seed…"
  $TSX prisma/seed.ts || echo "[entrypoint] Seed failed, continuing anyway"
else
  echo "[entrypoint] Cards table has $COUNT rows — skipping seed."
fi

echo "[entrypoint] Starting Next.js server…"
exec node server.js
