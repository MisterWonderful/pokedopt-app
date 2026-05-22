"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TypeChip } from "@/components/cards/type-chip";
import { RarityBadge } from "@/components/cards/rarity-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CreditCard } from "lucide-react";

interface Card {
  id: string;
  pokeId: number;
  name: string;
  middle: string;
  last: string;
  types: string[];
  rarity: string;
  hp: number;
  price: number;
  isActive: boolean;
  sprite: string;
}

export default function AdminCardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/cards")
      .then((r) => r.json())
      .then((d) => {
        setCards(d.cards || []);
        setLoading(false);
      });
  }, []);

  const filtered = cards.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(s) ||
      c.middle.toLowerCase().includes(s) ||
      c.last.toLowerCase().includes(s)
    );
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-pd-ink/10" />
        <div className="h-64 animate-pulse rounded-2xl bg-pd-ink/5" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} /> Back
          </Button>
        </Link>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-pd-violet">
            Cards
          </div>
          <h1 className="font-fraunces text-2xl font-bold">Card catalog</h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-[1_1_240px]">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards…"
          />
        </div>
        <div className="ml-auto">
          <Button disabled>
            <CreditCard size={16} /> + New card
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-pd-ink/10 bg-white">
        <div className="grid grid-cols-[60px_2fr_1.5fr_auto_auto_auto_auto] gap-3.5 border-b border-pd-ink/10 bg-[#f7f3e8] px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-pd-ink-muted">
          <div></div>
          <div>Name</div>
          <div>Types</div>
          <div>Rarity</div>
          <div>HP</div>
          <div>Price</div>
          <div></div>
        </div>
        {filtered.map((c) => (
          <div
            key={c.id}
            className="grid grid-cols-[60px_2fr_1.5fr_auto_auto_auto_auto] items-center gap-3.5 border-b border-pd-ink/5 px-4 py-2.5"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-pd-ink/10 bg-pd-cream">
              <img
                src={c.sprite}
                alt=""
                className="h-[85%] w-[85%] object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-pd-ink">{c.name}</div>
              <div className="font-fraunces text-[13px] italic text-pd-violet">
                “{c.middle} {c.last}”
              </div>
              <div className="text-[11px] tabular-nums text-pd-ink-muted">
                {c.id}
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {c.types.map((t) => (
                <TypeChip key={t} type={t} size="sm" />
              ))}
            </div>
            <RarityBadge rarity={c.rarity} />
            <div className="text-[13px] font-bold tabular-nums">{c.hp}</div>
            <div className="text-sm font-bold tabular-nums">
              ${c.price.toFixed(2)}
            </div>
            <div className="flex gap-1.5">
              <Link href={`/card/${c.id}`}>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </Link>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-10 text-center text-pd-ink-muted">
            No cards match.
          </div>
        )}
      </div>
    </div>
  );
}
