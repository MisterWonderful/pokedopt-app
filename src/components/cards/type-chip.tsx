import { POKEMON_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface TypeChipProps {
  type: string;
  size?: "sm" | "md" | "lg";
  style?: "soft" | "outline" | "solid" | "pill";
  className?: string;
}

export function TypeChip({ type, size = "md", style = "soft", className }: TypeChipProps) {
  const t = POKEMON_TYPES[type] || POKEMON_TYPES.normal;

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-[11px]",
    lg: "px-3.5 py-1.5 text-[13px]",
  };

  const variants = {
    soft: { backgroundColor: t.bg, color: t.color },
    outline: { backgroundColor: "transparent", color: t.color, border: `1.5px solid ${t.color}` },
    solid: { backgroundColor: t.color, color: "#fff" },
    pill: { backgroundColor: t.bg, color: t.color, border: `1px solid ${t.color}40`, boxShadow: `inset 0 -1.5px 0 ${t.color}30` },
  };

  const v = variants[style];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold capitalize whitespace-nowrap",
        sizes[size],
        className
      )}
      style={v}
    >
      <span className="text-[0.9em]">{t.glyph}</span>
      {type}
    </span>
  );
}
