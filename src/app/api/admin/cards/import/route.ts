import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseCsv } from "@/lib/csv";

const HEADER_ALIASES: Record<string, string> = {
  "sku": "sku",
  "set name": "setName",
  "card number": "cardNumber",
  "year": "year",
  "rarity": "rarity",
  "card name (pokemon)": "name",
  "card name": "name",
  "unique full name": "fullName",
  "type / attribute": "type",
  "type/attribute": "type",
  "type": "type",
  "stage": "stage",
  "illustrator": "illustrator",
  "original title": "originalTitle",
  "price ($)": "price",
  "price": "price",
  "condition": "condition",
  "image 1 url": "imageUrl1",
  "image 2 url": "imageUrl2",
};

const RARITY_MAP: Record<string, "common" | "uncommon" | "rare" | "legendary"> = {
  "common": "common",
  "uncommon": "uncommon",
  "rare": "rare",
  "rare holo": "rare",
  "holo rare": "rare",
  "ultra rare": "rare",
  "secret rare": "legendary",
  "legendary": "legendary",
  "promo": "rare",
};

function splitFullName(name: string, fullName: string): { middle: string; last: string } {
  const remainder = fullName.replace(new RegExp("^" + name.trim() + "\\s+", "i"), "").trim();
  if (!remainder) return { middle: "", last: "" };
  const parts = remainder.split(/\s+/);
  if (parts.length === 1) return { middle: parts[0], last: "" };
  return { middle: parts[0], last: parts.slice(1).join(" ") };
}

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  let csvText: string;
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await request.json();
    csvText = body?.csv;
    if (typeof csvText !== "string") {
      return NextResponse.json({ error: "Missing csv string in body" }, { status: 400 });
    }
  } else {
    csvText = await request.text();
  }

  if (!csvText.trim()) {
    return NextResponse.json({ error: "Empty CSV" }, { status: 400 });
  }

  const rows = parseCsv(csvText);
  if (rows.length < 2) {
    return NextResponse.json({ error: "CSV needs a header row and at least one data row" }, { status: 400 });
  }

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const colIdx: Record<string, number> = {};
  header.forEach((h, i) => {
    const key = HEADER_ALIASES[h];
    if (key) colIdx[key] = i;
  });

  const required = ["sku", "name", "fullName", "rarity", "type", "price"];
  const missing = required.filter((k) => colIdx[k] === undefined);
  if (missing.length) {
    return NextResponse.json(
      { error: `CSV missing required columns: ${missing.join(", ")}`, headerSeen: header },
      { status: 400 },
    );
  }

  let created = 0;
  let updated = 0;
  const errors: { row: number; sku?: string; message: string }[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const get = (k: string) => (colIdx[k] !== undefined ? (row[colIdx[k]] ?? "").trim() : "");
    const sku = get("sku");
    if (!sku) {
      errors.push({ row: r + 1, message: "Missing SKU" });
      continue;
    }
    try {
      const name = get("name");
      const fullName = get("fullName") || name;
      const { middle, last } = splitFullName(name, fullName);
      const rarityRaw = get("rarity").toLowerCase();
      const rarity = RARITY_MAP[rarityRaw] || "common";
      const types = get("type")
        .split(/[,;/]/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
      const price = Number(get("price")) || 0;
      const donation = Math.round(price * 0.15 * 100) / 100;

      const data = {
        sku,
        name,
        middle,
        last,
        fullName,
        types: types.length ? types : ["normal"],
        rarity: rarity as any,
        price,
        donation,
        setName: get("setName") || null,
        cardNumber: get("cardNumber") || null,
        year: get("year") || null,
        stage: get("stage") || null,
        illustrator: get("illustrator") || null,
        originalTitle: get("originalTitle") || null,
        condition: get("condition") || null,
        imageUrl1: get("imageUrl1") || null,
        imageUrl2: get("imageUrl2") || null,
        isActive: true,
      };

      const existing = await prisma.card.findUnique({ where: { sku } });
      if (existing) {
        await prisma.card.update({ where: { sku }, data });
        updated++;
      } else {
        await prisma.card.create({ data });
        created++;
      }
    } catch (e: any) {
      errors.push({ row: r + 1, sku, message: e?.message || "Unknown error" });
    }
  }

  return NextResponse.json({ created, updated, errors, total: rows.length - 1 });
}
