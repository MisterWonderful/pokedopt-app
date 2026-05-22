"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";

interface Props {
  card: {
    id: string;
    pokeId: number;
    name: string;
    middle: string;
    last: string;
    fullName: string;
    types: string[];
    rarity: string;
    hp: number;
    grade: string;
    price: number;
    donation: number;
    backstory: string;
    wear: string;
    birthday: string;
    birthMonth: string;
    birthYear: string;
    sprite: string;
    spritePixel: string;
  };
  size?: "default" | "lg";
}

export function AddToCartButton({ card, size = "default" }: Props) {
  const { addItem } = useCart();
  const { toast } = useToast();

  return (
    <Button
      size={size}
      onClick={() => {
        addItem(card);
        toast(`${card.name} added to cart!`);
      }}
    >
      <ShoppingCart size={16} strokeWidth={2} /> Adopt this card
    </Button>
  );
}
