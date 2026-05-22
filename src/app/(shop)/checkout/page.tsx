"use client";

import { useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0) return;

    const createCheckout = async () => {
      try {
        const res = await fetch("/api/checkout/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              cardId: i.card.id,
              name: i.card.name,
              middle: i.card.middle,
              last: i.card.last,
              price: i.card.price,
              qty: i.qty,
              sprite: i.card.sprite,
            })),
            customerEmail: session?.user?.email || undefined,
          }),
        });

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } catch (error) {
        console.error("Checkout error:", error);
      }
    };

    createCheckout();
  }, [items, session]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[720px] px-8 py-16 text-center">
        <p className="text-lg text-pd-ink-soft">Your cart is empty.</p>
        <Link href="/browse" className="mt-4 inline-block">
          <button className="rounded-xl bg-pd-primary px-6 py-3 font-bold text-pd-cream">Browse cards</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[720px] px-8 py-16 text-center">
      <div className="mb-4 inline-block animate-spin">
        <svg className="h-10 w-10 text-pd-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      </div>
      <h1 className="font-fraunces text-2xl font-bold text-pd-ink">Redirecting to secure checkout...</h1>
      <p className="mt-2 text-pd-ink-soft">Please wait while we prepare your order.</p>
    </div>
  );
}
