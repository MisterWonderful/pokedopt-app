import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const types = searchParams.get("types")?.split(",").filter(Boolean) || [];
  const rarity = searchParams.get("rarity") || "all";
  const sort = searchParams.get("sort") || "default";
  const scope = searchParams.get("scope") || "active";

  const where: any = {};
  if (scope !== "all") where.isActive = true;

  if (search.trim()) {
    const q = search.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { middle: { contains: q, mode: "insensitive" } },
      { last: { contains: q, mode: "insensitive" } },
      { fullName: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
      { setName: { contains: q, mode: "insensitive" } },
      { cardNumber: { contains: q, mode: "insensitive" } },
      { originalTitle: { contains: q, mode: "insensitive" } },
      { illustrator: { contains: q, mode: "insensitive" } },
    ];
  }

  if (types.length > 0) {
    where.types = { hasSome: types };
  }

  if (rarity !== "all") {
    where.rarity = rarity;
  }

  let orderBy: any = {};
  if (sort === "name") {
    orderBy = { name: "asc" };
  } else if (sort === "rarity") {
    orderBy = { rarity: "desc" };
  } else {
    orderBy = { createdAt: "asc" };
  }

  const cards = await prisma.card.findMany({
    where,
    orderBy,
  });

  return NextResponse.json({ cards });
}

const cardSchema = z.object({
  pokeId: z.coerce.number().int().min(1),
  name: z.string().min(1),
  middle: z.string().min(1),
  last: z.string().min(1),
  types: z.array(z.string()).min(1),
  rarity: z.enum(["common", "uncommon", "rare", "legendary"]),
  hp: z.coerce.number().int().min(1),
  grade: z.string().min(1),
  price: z.coerce.number().min(0),
  donation: z.coerce.number().min(0),
  backstory: z.string().default(""),
  wear: z.string().default(""),
  birthday: z.string().default(""),
  birthMonth: z.string().default(""),
  birthYear: z.string().default(""),
  sprite: z.string().default(""),
  spritePixel: z.string().default(""),
  isActive: z.boolean().default(true),
});

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = cardSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid card data", issues: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;
  const fullName = `${d.name} ${d.middle} ${d.last}`.trim();

  const card = await prisma.card.create({
    data: { ...d, fullName },
  });

  return NextResponse.json({ card }, { status: 201 });
}
