import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
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

const patchSchema = z.object({
  pokeId: z.coerce.number().int().min(0).optional(),
  name: z.string().min(1).optional(),
  middle: z.string().optional(),
  last: z.string().optional(),
  types: z.array(z.string()).optional(),
  rarity: z.enum(["common", "uncommon", "rare", "legendary"]).optional(),
  hp: z.coerce.number().int().min(0).optional(),
  grade: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  donation: z.coerce.number().min(0).optional(),
  backstory: z.string().optional(),
  wear: z.string().optional(),
  birthday: z.string().optional(),
  birthMonth: z.string().optional(),
  birthYear: z.string().optional(),
  sprite: z.string().optional(),
  spritePixel: z.string().optional(),
  setName: z.string().nullable().optional(),
  cardNumber: z.string().nullable().optional(),
  year: z.string().nullable().optional(),
  stage: z.string().nullable().optional(),
  illustrator: z.string().nullable().optional(),
  originalTitle: z.string().nullable().optional(),
  condition: z.string().nullable().optional(),
  imageUrl1: z.string().nullable().optional(),
  imageUrl2: z.string().nullable().optional(),
  artCropX: z.coerce.number().min(0).max(1).optional(),
  artCropY: z.coerce.number().min(0).max(1).optional(),
  artCropWidth: z.coerce.number().min(0.01).max(1).optional(),
  artCropHeight: z.coerce.number().min(0.01).max(1).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid card data", issues: parsed.error.flatten() }, { status: 400 });
  }

  const data: any = { ...parsed.data };
  if (parsed.data.name || parsed.data.middle || parsed.data.last) {
    const existing = await prisma.card.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }
    const name = parsed.data.name ?? existing.name;
    const middle = parsed.data.middle ?? existing.middle;
    const last = parsed.data.last ?? existing.last;
    data.fullName = `${name} ${middle} ${last}`.trim();
  }

  const card = await prisma.card.update({
    where: { id },
    data,
  });

  return NextResponse.json({ card });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const orderItemCount = await prisma.orderItem.count({ where: { cardId: id } });
  if (orderItemCount > 0) {
    const card = await prisma.card.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.json({ card, archived: true });
  }

  await prisma.card.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
