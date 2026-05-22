import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerEmail } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${item.name} "${item.middle} ${item.last}"`,
          images: [item.sprite],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    // Add shipping as line item (simpler for fixed rate)
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Shipping (slab-safe)",
        },
        unit_amount: 499, // $4.99 in cents
      },
      quantity: 1,
    });

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      customer_email: customerEmail,
      metadata: {
        items: JSON.stringify(
          items.map((i: any) => ({
            cardId: i.cardId,
            qty: i.qty,
            price: i.price,
            name: i.name,
            middle: i.middle,
            last: i.last,
          }))
        ),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Checkout session error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
