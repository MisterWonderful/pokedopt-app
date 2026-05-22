"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { GradedSlab } from "./graded-slab";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface CardTileProps {
  card: {
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
  };
}

export function CardTile({ card }: CardTileProps) {
  const [hover, setHover] = useState(false);
  const { addItem } = useCart();
  const price = typeof card.price === "number" ? card.price : Number(card.price);

  return (
    <div
      className="flex cursor-pointer flex-col items-center gap-3 transition-transform duration-200"
      style={{ transform: hover ? "translateY(-6px)" : "translateY(0)" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link href={`/card/${card.id}`} className="w-full flex justify-center">
        <div
          className="transition-all duration-200"
          style={{
            filter: hover
              ? "drop-shadow(0 14px 24px rgba(40,30,20,0.22))"
              : "drop-shadow(0 4px 8px rgba(40,30,20,0.06))",
          }}
        >
          <GradedSlab card={card} size="md" />
        </div>
      </Link>
      <div className="w-full text-center">
        <div className="font-fraunces text-sm italic leading-tight text-pd-ink-soft">
          {card.middle} {card.last}
        </div>
        <div className="mt-0.5 text-lg font-bold tabular-nums text-pd-ink">
          ${price.toFixed(2)}
        </div>
        <div className="mt-2 flex justify-center gap-1.5">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(card as any);
            }}
          >
            <ShoppingCart size={13} strokeWidth={2} /> Adopt
          </Button>
        </div>
      </div>
    </div>
  );
}
