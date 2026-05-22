import { Heart } from "lucide-react";

interface ShelterBadgeProps {
  small?: boolean;
  label?: string;
}

export function ShelterBadge({ small, label }: ShelterBadgeProps) {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-full bg-pd-primary-soft text-pd-primary border border-[#f0d4c8] font-bold uppercase"
      style={{
        padding: small ? "2px 7px" : "4px 10px",
        fontSize: small ? 9 : 10,
        letterSpacing: "0.04em",
      }}
    >
      <Heart size={small ? 9 : 11} className="fill-pd-primary" strokeWidth={0} />
      {label || "Sponsors a shelter"}
    </div>
  );
}
