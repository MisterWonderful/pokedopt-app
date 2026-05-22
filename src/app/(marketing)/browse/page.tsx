"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CardTile } from "@/components/cards/card-tile";
import { TypeChip } from "@/components/cards/type-chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bird } from "lucide-react";
import { POKEMON_TYPES } from "@/lib/constants";

interface Card {
  id: string;
  pokeId: number;
  name: string;
  middle: string;
  last: string;
  types: string[];
  rarity: string;
  hp: number;
  grade: string;
  price: number;
  sprite: string;
  spritePixel: string;
}

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [activeRarity, setActiveRarity] = useState("all");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    fetch("/api/cards")
      .then((r) => r.json())
      .then((data) => {
        setCards(data.cards || []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let list = [...cards];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.middle.toLowerCase().includes(q) ||
          c.last.toLowerCase().includes(q)
      );
    }
    if (activeTypes.length) {
      list = list.filter((c) => c.types.some((t) => activeTypes.includes(t)));
    }
    if (activeRarity !== "all") {
      list = list.filter((c) => c.rarity === activeRarity);
    }
    if (sort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === "rarity") {
      const r: Record<string, number> = {
        common: 0,
        uncommon: 1,
        rare: 2,
        legendary: 3,
      };
      list.sort((a, b) => r[b.rarity] - r[a.rarity]);
    }
    return list;
  }, [cards, query, activeTypes, activeRarity, sort]);

  const toggleType = (t: string) => {
    setActiveTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1280px] px-8 py-10">
        <div className="h-8 w-48 animate-pulse rounded bg-pd-ink/10" />
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-[320px] animate-pulse rounded-2xl bg-pd-ink/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] px-8 py-10 pb-20">
      <div className="mb-1 text-xs font-bold uppercase tracking-widest text-pd-ink-muted">
        The shelter
      </div>
      <h1 className="font-fraunces text-[clamp(26px,3vw,36px)] font-bold leading-[1.1] text-pd-ink">
        Every card here is looking for a trainer.
      </h1>

      {/* Search */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-[1_1_320px]">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name… try 'Pikachu' or 'Buttercup'"
            className="pl-12 text-base shadow-[0_3px_0_#29261b]"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pd-ink-muted">
            <Search size={18} strokeWidth={2} />
          </span>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-11 rounded-xl border-2 border-pd-ink bg-white px-4 text-sm shadow-[0_3px_0_#29261b]"
        >
          <option value="default">Sort: Featured</option>
          <option value="name">Name (A–Z)</option>
          <option value="rarity">Rarity</option>
        </select>
      </div>

      {/* Type filters */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-bold uppercase tracking-widest text-pd-ink-muted">
          Type:
        </span>
        {Object.keys(POKEMON_TYPES).map((t) => (
          <button
            key={t}
            onClick={() => toggleType(t)}
            className="transition-all"
            style={{
              opacity:
                activeTypes.length === 0 || activeTypes.includes(t) ? 1 : 0.35,
              transform: activeTypes.includes(t) ? "scale(1.05)" : "scale(1)",
            }}
          >
            <TypeChip type={t} size="md" />
          </button>
        ))}
        {activeTypes.length > 0 && (
          <button
            onClick={() => setActiveTypes([])}
            className="text-xs font-bold text-pd-primary underline"
          >
            clear
          </button>
        )}
      </div>

      {/* Rarity filters */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-bold uppercase tracking-widest text-pd-ink-muted">
          Rarity:
        </span>
        {["all", "common", "uncommon", "rare", "legendary"].map((r) => (
          <button
            key={r}
            onClick={() => setActiveRarity(r)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold capitalize tracking-wide transition-colors ${
              activeRarity === r
                ? "border-[1.5px] border-pd-ink bg-pd-ink text-pd-cream"
                : "border-[1.5px] border-pd-ink/10 bg-white text-pd-ink"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mt-6 text-sm text-pd-ink-muted">
        Showing <strong className="text-pd-ink">{filtered.length}</strong>{" "}
        {filtered.length === 1 ? "card" : "cards"}
        {query && (
          <>
            {" "}
            matching "<em>{query}</em>"
          </>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 rounded-2xl border-[1.5px] border-dashed border-pd-ink/20 bg-pd-cream p-12 text-center">
          <div className="mb-3 flex justify-center text-pd-ink-muted">
            <Bird size={56} strokeWidth={1.6} />
          </div>
          <div className="font-fraunces text-[22px] font-bold text-pd-ink">
            No cards match yet.
          </div>
          <div className="mt-1.5 text-sm text-pd-ink-muted">
            Try a different name or clear some filters.
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((c) => (
            <CardTile key={c.id} card={c} />
          ))}
        </div>
      )}
    </div>
  );
}
