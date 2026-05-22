"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

export default function CheckoutSuccessPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[720px] px-8 py-16 text-center">
          <h1 className="font-fraunces text-2xl font-bold text-pd-ink">Confirming your order…</h1>
        </div>
      }
    >
      <CheckoutSuccessPage />
    </Suspense>
  );
}

function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    const verify = async () => {
      try {
        const res = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
          clearCart();
        }
      } catch (error) {
        console.error("Verify error:", error);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [sessionId, clearCart]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[720px] px-8 py-16 text-center">
        <div className="mb-4 inline-block animate-spin">
          <svg className="h-10 w-10 text-pd-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <h1 className="font-fraunces text-2xl font-bold text-pd-ink">Confirming your order...</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[720px] px-8 py-16">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex">
          <img src="/images/pokedopt-logo.png" alt="" width={80} height={80} />
        </div>
        <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-pd-green">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12.5l5 5L20 6.5" />
          </svg>
          Order placed
        </div>
        <h1 className="font-fraunces text-[clamp(32px,4.4vw,48px)] font-bold leading-[1.05] text-pd-ink">
          They&apos;re on their way home!
        </h1>
        <div className="mt-2 text-base text-pd-ink-soft">
          Order <strong>#{order?.orderNum || "N/A"}</strong> — confirmation sent to your email.
        </div>
      </div>

      <div className="mb-5 rounded-2xl border-2 border-pd-ink bg-pd-cream p-6 shadow-[0_4px_0_#29261b]">
        <div className="mb-3 text-xs font-bold uppercase tracking-widest text-pd-ink-muted">
          You adopted
        </div>
        {order?.orderItems?.map((item: any) => (
          <div key={item.id} className="flex items-center gap-3 border-b border-dashed border-pd-ink/10 py-2">
            <div className="h-11 w-11 rounded-lg bg-pd-cream flex items-center justify-center border border-pd-ink/10">
              <span className="text-xs font-bold">{item.qty}×</span>
            </div>
            <div className="flex-1">
              <span className="font-springwood font-bold text-pd-ink">{item.nameAt}</span>
              <span className="ml-2 font-fraunces text-sm italic text-pd-violet">"{item.middleAt} {item.lastAt}"</span>
            </div>
            <div className="font-semibold">${(Number(item.priceAt) * item.qty).toFixed(2)}</div>
          </div>
        ))}
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-pd-primary-soft p-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f0d4c8] bg-white text-pd-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5 6 5c2 0 3.5 1 6 3.5C14.5 6 16 5 18 5c3.5 0 5 4 3.5 7-2.5 4.5-9.5 9-9.5 9z" className="fill-pd-primary" />
            </svg>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-pd-primary">Your shelter proceeds</div>
            <div className="font-fraunces text-xl font-bold text-pd-primary">Sent to our partner shelters</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/account">
          <Button size="lg">
            <img src="/images/pokedopt-logo.png" alt="" width={16} height={16} /> View my orders
          </Button>
        </Link>
        <Link href="/browse">
          <Button size="lg" variant="secondary">Adopt another card</Button>
        </Link>
      </div>
    </div>
  );
}
