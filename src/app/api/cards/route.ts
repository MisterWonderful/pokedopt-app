import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const types = searchParams.get("types")?.split(",").filter(Boolean) || [];
  const rarity = searchParams.get("rarity") || "all";
  const sort = searchParams.get("sort") || "default";

  const where: any = { isActive: true };

  if (search.trim()) {
    const q = search.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { middle: { contains: q, mode: "insensitive" } },
      { last: { contains: q, mode: "insensitive" } },
      { fullName: { contains: q, mode: "insensitive" } },
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
