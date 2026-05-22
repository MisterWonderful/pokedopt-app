import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const card = await prisma.card.findUnique({
    where: { id: params.id },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const related = await prisma.card.findMany({
    where: {
      id: { not: card.id },
      isActive: true,
      types: { hasSome: card.types },
    },
    take: 4,
  });

  return NextResponse.json({ related });
}
