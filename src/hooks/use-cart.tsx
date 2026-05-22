"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { CartItem } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (card: CartItem["card"]) => void;
  removeItem: (cardId: string) => void;
  updateQty: (cardId: string, qty: number) => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
  donation: number;
  shipping: number;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("pokedopt-cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("pokedopt-cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((card: CartItem["card"]) => {
    setItems((prev) => {
      const found = prev.find((i) => i.card.id === card.id);
      if (found) {
        return prev.map((i) =>
          i.card.id === card.id ? { ...i, qty: Math.min(i.qty + 1, 5) } : i
        );
      }
      return [...prev, { card, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((cardId: string) => {
    setItems((prev) => prev.filter((i) => i.card.id !== cardId));
  }, []);

  const updateQty = useCallback((cardId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.card.id !== cardId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.card.id === cardId ? { ...i, qty: Math.min(qty, 5) } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.card.price * i.qty, 0);
  const donation = items.reduce((s, i) => s + i.card.donation * i.qty, 0);
  const shipping = items.length === 0 ? 0 : 4.99;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, count, subtotal, donation, shipping, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
