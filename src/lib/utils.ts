import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Certificate number generation (must match lookup algorithm)
export function certFor(card: { id: string; pokeId: number; birthYear: string }) {
  const idx = parseInt((card.id || "").split("-")[1] || "0", 10) || 0;
  const h = (card.pokeId * 9301 + idx * 49297 + 233) % 100000;
  return `PD-${card.birthYear}-${String(h).padStart(5, "0")}`;
}

// Shelter assignment (stable per card)
export function shelterFor(card: { id: string; pokeId: number }, shelters: string[]) {
  const idx = parseInt((card.id || "").split("-")[1] || "0", 10) || 0;
  const seed = (card.pokeId * 7 + idx * 3) % shelters.length;
  return shelters[seed] || shelters[0];
}

// Seeded random for demo consistency
export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function formatPrice(amount: number | string | null | undefined) {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (num == null || isNaN(num)) return "$0.00";
  return `$${num.toFixed(2)}`;
}

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
