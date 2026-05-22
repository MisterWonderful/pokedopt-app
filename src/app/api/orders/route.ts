import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { orderItems: true },
    orderBy: { placedAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const session = await auth();
  const body = await request.json();
  const { items, customer, shipping, stripePaymentIntentId, stripeCustomerId } = body;

  if (!items?.length) {
    return NextResponse.json({ error: "No items" }, { status: 400 });
  }

  // Validate items against database
  const cardIds = items.map((i: any) => i.cardId);
  const cards = await prisma.card.findMany({
    where: { id: { in: cardIds } },
  });

  if (cards.length !== cardIds.length) {
    return NextResponse.json({ error: "Invalid items" }, { status: 400 });
  }

  const subtotal = items.reduce((sum: number, item: any) => {
    const card = cards.find((c) => c.id === item.cardId);
    return sum + (card ? Number(card.price) * item.qty : 0);
  }, 0);

  const donation = items.reduce((sum: number, item: any) => {
    const card = cards.find((c) => c.id === item.cardId);
    return sum + (card ? Number(card.donation) * item.qty : 0);
  }, 0);

  const shippingFee = 4.99;
  const total = subtotal + shippingFee;

  const orderNum = "PD-" + (100000 + Math.floor(Math.random() * 900000));

  const order = await prisma.order.create({
    data: {
      orderNum,
      userId: session?.user?.id || null,
      status: "placed",
      subtotal,
      donation,
      shippingFee,
      total,
      shelterPref: shipping?.shelter || "auto",
      customerName: customer?.name || shipping?.name || "",
      customerEmail: customer?.email || "",
      shippingName: shipping?.name || "",
      shippingAddress: shipping?.address || "",
      shippingCity: shipping?.city || "",
      shippingZip: shipping?.zip || "",
      shippingCountry: shipping?.country || "United States",
      stripePaymentIntentId,
      stripeCustomerId,
      paidAt: new Date(),
      orderItems: {
        create: items.map((item: any) => {
          const card = cards.find((c) => c.id === item.cardId)!;
          return {
            cardId: item.cardId,
            qty: item.qty,
            priceAt: card.price,
            nameAt: card.name,
            middleAt: card.middle,
            lastAt: card.last,
          };
        }),
      },
    },
    include: { orderItems: true },
  });

  return NextResponse.json({ order });
}
