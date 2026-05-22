"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { TypeChip } from "@/components/cards/type-chip";
import { ShelterBadge } from "@/components/cards/shelter-badge";
import { POKEMON_TYPES } from "@/lib/constants";
import { Bird, ArrowRight, Minus, Plus } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, shipping, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[720px] px-8 py-16 text-center">
        <div className="mb-4 flex justify-center text-pd-ink-muted">
          <Bird size={72} strokeWidth={1.6} />
        </div>
        <h1 className="font-fraunces text-[clamp(32px,4.4vw,48px)] font-bold leading-[1.05] text-pd-ink">
          Your cart is empty.
        </h1>
        <p className="mt-3 text-lg text-pd-ink-soft">
          Plenty of cards are still looking for a trainer. Want a hand finding the right one?
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/browse">
            <Button size="lg">Browse cards</Button>
          </Link>
          <Link href="/olive">
            <Button size="lg" variant="secondary">
              Ask Professor Olive
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1180px] px-8 py-10 pb-20">
      <div className="mb-1 text-xs font-bold uppercase tracking-widest text-pd-ink-muted">
        Your cart
      </div>
      <h1 className="font-fraunces text-[clamp(26px,3vw,36px)] font-bold leading-[1.1] text-pd-ink">
        {items.length} {items.length === 1 ? "card" : "cards"} ready to come home.
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="overflow-hidden rounded-2xl border-[1.5px] border-pd-ink/10 bg-white">
          {items.map((item, i) => {
            const type = POKEMON_TYPES[item.card.types[0]] || POKEMON_TYPES.normal;
            return (
              <div
                key={item.card.id}
                className={`grid items-center gap-4 p-4 sm:grid-cols-[90px_1fr_auto] ${
                  i < items.length - 1 ? "border-b border-pd-ink/5" : ""
                }`}
              >
                <div
                  className="flex h-[90px] w-[90px] items-center justify-center rounded-xl border-[1.5px] border-pd-ink"
                  style={{ background: type.bg }}
                >
                  <img
                    src={item.card.sprite}
                    alt={item.card.name}
                    className="h-[85%] w-[85%] object-contain"
                  />
                </div>
                <div>
                  <div className="font-springwood text-xl font-bold tracking-wide text-pd-ink">
                    {item.card.name}
                  </div>
                  <div className="font-fraunces text-sm italic text-pd-violet">
                    "{item.card.middle} {item.card.last}"
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {item.card.types.map((t) => (
                      <TypeChip key={t} type={t} size="sm" />
                    ))}
                    <ShelterBadge small />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-lg font-bold">
                    ${(item.card.price * item.qty).toFixed(2)}
                  </div>
                  <div className="flex items-center gap-1 rounded-lg border-[1.5px] border-pd-ink/20">
                    <button
                      onClick={() => updateQty(item.card.id, item.qty - 1)}
                      className="flex h-7 w-7 items-center justify-center text-pd-ink transition-colors hover:bg-pd-cream"
                    >
                      <Minus size={14} />
                    </button>
                    <div className="w-6 text-center text-sm font-semibold">
                      {item.qty}
                    </div>
                    <button
                      onClick={() => updateQty(item.card.id, item.qty + 1)}
                      className="flex h-7 w-7 items-center justify-center text-pd-ink transition-colors hover:bg-pd-cream"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.card.id)}
                    className="text-xs font-bold text-pd-primary underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-2xl border-2 border-pd-ink bg-pd-cream p-6 shadow-[0_4px_0_#29261b]">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-pd-ink-muted">
              Order summary
            </div>
            <SummaryLine label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
            <SummaryLine label="Shipping (slab-safe)" value={`$${shipping.toFixed(2)}`} />
            <div className="my-3 border-t border-dashed border-pd-ink/20" />
            <SummaryLine label="Total" value={`$${total.toFixed(2)}`} bold big />

            <div className="mt-4 rounded-xl border-[1.5px] border-[#f0d4c8] bg-pd-primary-soft p-3.5">
              <div className="mb-1 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-pd-primary">
                <Heart size={11} className="fill-pd-primary" strokeWidth={0} /> Shelter proceeds
              </div>
              <div className="font-fraunces text-lg font-bold leading-tight text-pd-primary">
                A portion of every adoption
              </div>
              <div className="mt-1 text-xs text-pd-ink-soft">
                goes directly to our partner shelters.
              </div>
            </div>

            <div className="mt-4">
              <Link href="/checkout">
                <Button full size="lg" className="w-full">
                  <img src="/images/pokedopt-logo.png" alt="" width={18} height={18} /> Checkout
                </Button>
              </Link>
            </div>
            <div className="mt-2.5 text-center">
              <Link
                href="/browse"
                className="text-sm text-pd-ink-muted underline"
              >
                ← Keep browsing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryLine({ label, value, bold, big }: { label: string; value: string; bold?: boolean; big?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between py-1 ${big ? "text-lg" : "text-sm"} ${bold ? "font-bold text-pd-ink" : "text-pd-ink-soft"}`}>
      <span>{label}</span>
      <span className={`tabular-nums ${big ? "font-fraunces font-bold" : ""}`}>{value}</span>
    </div>
  );
}

function Heart(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5 6 5c2 0 3.5 1 6 3.5C14.5 6 16 5 18 5c3.5 0 5 4 3.5 7-2.5 4.5-9.5 9-9.5 9z" />
    </svg>
  );
}
