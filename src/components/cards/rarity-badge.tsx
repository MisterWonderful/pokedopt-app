import { RARITY_STYLES } from "@/lib/constants";

interface RarityBadgeProps {
  rarity: string;
}

export function RarityBadge({ rarity }: RarityBadgeProps) {
  const r = RARITY_STYLES[rarity] || RARITY_STYLES.common;
  return (
    <span
      className="inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{ color: r.color, backgroundColor: r.bg }}
    >
      {r.label}
    </span>
  );
}
