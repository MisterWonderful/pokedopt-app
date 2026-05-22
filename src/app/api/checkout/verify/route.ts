import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "No session ID" }, { status: 400 });
    }

    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    // Check if order already exists
    const existing = await prisma.order.findUnique({
      where: { stripePaymentIntentId: session.payment_intent as string },
    });

    if (existing) {
      return NextResponse.json({ order: existing });
    }

    const items = JSON.parse(session.metadata?.items || "[]");

    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.qty,
      0
    );
    const donation = items.reduce((sum: number) => sum + 1.5, 0);
    const shippingFee = 4.99;
    const total = subtotal + shippingFee;

    const orderNum = "PD-" + (100000 + Math.floor(Math.random() * 900000));

    const order = await prisma.order.create({
      data: {
        orderNum,
        status: "placed",
        subtotal,
        donation,
        shippingFee,
        total,
        shelterPref: "auto",
        customerName: session.customer_details?.name || "",
        customerEmail: session.customer_details?.email || "",
        shippingName: session.customer_details?.name || "",
        shippingAddress: session.customer_details?.address?.line1 || "",
        shippingCity: session.customer_details?.address?.city || "",
        shippingZip: session.customer_details?.address?.postal_code || "",
        shippingCountry: session.customer_details?.address?.country || "United States",
        stripePaymentIntentId: session.payment_intent as string,
        stripeCustomerId: session.customer as string,
        paidAt: new Date(),
        orderItems: {
          create: items.map((item: any) => ({
            cardId: item.cardId,
            qty: item.qty,
            priceAt: item.price,
            nameAt: item.name,
            middleAt: item.middle,
            lastAt: item.last,
          })),
        },
      },
      include: { orderItems: true },
    });

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Checkout verify error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
