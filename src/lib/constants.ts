export const POKEMON_TYPES: Record<string, { color: string; bg: string; glyph: string }> = {
  fire: { color: "#ef6b3a", bg: "#fff1ea", glyph: "🔥" },
  water: { color: "#3a8dde", bg: "#eaf3ff", glyph: "💧" },
  grass: { color: "#4ea84e", bg: "#ecf7ec", glyph: "🌱" },
  electric: { color: "#e3b630", bg: "#fff7d6", glyph: "⚡" },
  psychic: { color: "#c462a8", bg: "#fbeef6", glyph: "✨" },
  fairy: { color: "#e58fb0", bg: "#fdf0f5", glyph: "🌸" },
  fighting: { color: "#a04a3a", bg: "#f5e9e6", glyph: "🥊" },
  bug: { color: "#8aa83a", bg: "#f3f6e3", glyph: "🐛" },
  ghost: { color: "#6a5a9a", bg: "#ece9f4", glyph: "👻" },
  rock: { color: "#9c8a55", bg: "#f3eedf", glyph: "🪨" },
  ice: { color: "#5fb8c6", bg: "#e8f6f8", glyph: "❄️" },
  dark: { color: "#4d3f3a", bg: "#ece8e6", glyph: "🌙" },
  dragon: { color: "#6c5cd1", bg: "#ece9fb", glyph: "🐉" },
  normal: { color: "#9a8e7a", bg: "#f4f1ec", glyph: "⭐" },
};

export const RARITY_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  common: { label: "Common", color: "#7a7062", bg: "#f0ebe0" },
  uncommon: { label: "Uncommon", color: "#3a7a4e", bg: "#e3f1e8" },
  rare: { label: "Rare", color: "#7a4a8a", bg: "#f0e3f3" },
  legendary: { label: "Legendary", color: "#a85a1a", bg: "#fbeed8" },
};

export const ORDER_STATUS_STYLES: Record<string, { label: string; bg: string; fg: string }> = {
  placed: { label: "Placed", bg: "#fff8e8", fg: "#a85a1a" },
  shipped: { label: "Shipped", bg: "#eaf3ff", fg: "#3a8dde" },
  delivered: { label: "Delivered", bg: "#e3f1e8", fg: "#3a7a4e" },
  cancelled: { label: "Cancelled", bg: "#f4ead7", fg: "#7a6e5a" },
};

export const SHIPPING_FEE = 4.99;
export const CARD_PRICE = 10;
export const DONATION_PER_CARD = 1.5;
