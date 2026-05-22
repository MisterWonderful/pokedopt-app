"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-[720px] px-8 py-16 text-center">
      <div className="mb-4 inline-block">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#c44a2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6M9 9l6 6" />
        </svg>
      </div>
      <h1 className="font-fraunces text-[clamp(32px,4.4vw,48px)] font-bold leading-[1.05] text-pd-ink">
        Checkout cancelled.
      </h1>
      <p className="mt-3 text-lg text-pd-ink-soft">
        No worries — your cart is still here. Take your time.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/cart">
          <Button>
            <ArrowLeft size={16} /> Back to cart
          </Button>
        </Link>
        <Link href="/browse">
          <Button variant="secondary">Keep browsing</Button>
        </Link>
      </div>
    </div>
  );
}
