import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const card = await prisma.card.findUnique({
    where: { id },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  // Get related cards (same type)
  const related = await prisma.card.findMany({
    where: {
      id: { not: card.id },
      isActive: true,
      types: { hasSome: card.types },
    },
    take: 4,
  });

  return NextResponse.json({ card, related });
}
