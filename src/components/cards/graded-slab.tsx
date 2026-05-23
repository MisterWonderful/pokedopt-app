"use client";

import Image from "next/image";
import { TypeChip } from "./type-chip";
import { RarityBadge } from "./rarity-badge";
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
  sprite: string;
  spritePixel: string;
  imageUrl1?: string | null;
  imageUrl2?: string | null;
  setName?: string | null;
  cardNumber?: string | null;
}

interface GradedSlabProps {
  card: Card;
  size?: "sm" | "md" | "lg";
  chipStyle?: "soft" | "outline" | "solid" | "pill";
  frameStyle?: "classic" | "holo" | "vintage";
}

export function GradedSlab({
  card,
  size = "md",
  chipStyle = "soft",
  frameStyle = "classic",
}: GradedSlabProps) {
  const sizes = {
    sm: { w: 180, scale: 0.7 },
    md: { w: 240, scale: 1 },
    lg: { w: 320, scale: 1.35 },
  };
  const { w } = sizes[size];
  const h = w * 1.27;

  const primary = POKEMON_TYPES[card.types[0]] || POKEMON_TYPES.normal;
  const hasScan = !!card.imageUrl1;

  const frames = {
    classic: {
      slabBg: "linear-gradient(180deg, #fafaf7 0%, #f0ede4 100%)",
      slabBorder: "#1a1a1a",
    },
    holo: {
      slabBg: "linear-gradient(135deg, #fce8d4 0%, #f8e0e8 50%, #e0e8f8 100%)",
      slabBorder: "#3a2e1a",
    },
    vintage: {
      slabBg: "linear-gradient(180deg, #f4ead7 0%, #e8d8b8 100%)",
      slabBorder: "#5a3e1a",
    },
  };
  const frame = frames[frameStyle];

  return (
    <div
      style={{
        width: w,
        height: h,
        position: "relative",
        borderRadius: 14,
        background: frame.slabBg,
        boxShadow: `0 1px 0 rgba(255,255,255,0.8) inset, 0 0 0 2px ${frame.slabBorder}, 0 18px 30px -12px rgba(40,30,20,0.25), 0 4px 8px -2px rgba(40,30,20,0.15)`,
        padding: w * 0.045,
        display: "flex",
        flexDirection: "column",
        gap: w * 0.025,
        flexShrink: 0,
      }}
    >
      {hasScan ? (
        <div
          style={{
            flex: 1,
            background: "#fff",
            border: "1.5px solid #29261b",
            borderRadius: 8,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Image
            src={card.imageUrl1 as string}
            alt={card.name}
            width={Math.round(w)}
            height={Math.round(w * 1.4)}
            className="absolute inset-0 h-full w-full object-cover"
            unoptimized
          />
          <div
            className="pd-shimmer pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.35) 45%, transparent 60%)",
              backgroundSize: "300% 100%",
              backgroundPosition: "120% 0",
              mixBlendMode: "overlay",
            }}
          />
          <div
            className="absolute bottom-1.5 left-1.5 right-1.5 flex items-end justify-between gap-1"
            style={{ pointerEvents: "none" }}
          >
            <div className="flex flex-wrap gap-1">
              {card.types.slice(0, 2).map((t) => (
                <TypeChip key={t} type={t} size="sm" style={chipStyle} />
              ))}
            </div>
            <RarityBadge rarity={card.rarity} />
          </div>
          {(card.middle || card.last) && (
            <div
              className="absolute top-1.5 left-1.5 right-1.5"
              style={{ pointerEvents: "none" }}
            >
              <div
                className="rounded font-fraunces italic"
                style={{
                  background: "rgba(255, 248, 232, 0.94)",
                  border: "1px dashed #c9a96a",
                  color: "#3a2818",
                  fontSize: w * 0.05,
                  padding: `${w * 0.012}px ${w * 0.025}px`,
                  lineHeight: 1.15,
                  display: "inline-block",
                  maxWidth: "100%",
                }}
              >
                “{card.middle} {card.last}”
              </div>
            </div>
          )}
        </div>
      ) : (
      <div
        style={{
          flex: 1,
          background: `linear-gradient(180deg, ${primary.bg} 0%, #fff 100%)`,
          border: "1.5px solid #29261b",
          borderRadius: 8,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: `${w * 0.03}px ${w * 0.04}px ${w * 0.02}px`,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 6,
          }}
        >
          <div
            style={{
              fontFamily: "'Springwood Display', 'Fraunces', Georgia, serif",
              fontWeight: 700,
              fontSize: w * 0.082,
              color: "#1a1a1a",
              lineHeight: 1,
              letterSpacing: "0.01em",
            }}
          >
            {card.name}
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: w * 0.055,
              color: "#c44a2a",
              letterSpacing: "0.02em",
            }}
          >
            HP {card.hp}
          </div>
        </div>

        <div
          className="relative mx-auto flex items-center justify-center overflow-hidden"
          style={{
            margin: `0 ${w * 0.04}px`,
            height: w * 0.7,
            background: `radial-gradient(ellipse at center, ${primary.bg} 0%, #fff 70%)`,
            border: `2px solid ${primary.color}`,
            borderRadius: 6,
          }}
        >
          <div
            className="pd-shimmer pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.65) 45%, transparent 60%)",
              backgroundSize: "300% 100%",
              backgroundPosition: "120% 0",
              mixBlendMode: "overlay",
            }}
          />
          <Image
            src={card.sprite}
            alt={card.name}
            width={Math.round(w * 0.7)}
            height={Math.round(w * 0.7)}
            className="relative z-[1] object-contain"
            style={{ width: "85%", height: "85%" }}
            unoptimized
          />
          <div
            className="absolute top-1.5 left-1.5 font-bold"
            style={{
              fontSize: w * 0.04,
              color: primary.color,
              background: "#fff",
              padding: "2px 6px",
              borderRadius: 4,
              border: `1px solid ${primary.color}`,
              letterSpacing: "0.05em",
            }}
          >
            #{String(card.pokeId).padStart(3, "0")}
          </div>
        </div>

        <div
          className="text-center"
          style={{
            margin: `${w * 0.025}px ${w * 0.04}px ${w * 0.015}px`,
            padding: `${w * 0.02}px ${w * 0.03}px`,
            background: "#fff8e8",
            border: "1px dashed #c9a96a",
            borderRadius: 4,
          }}
        >
          <div
            className="font-semibold uppercase tracking-widest"
            style={{
              fontSize: w * 0.035,
              color: "#8a6a2a",
              letterSpacing: "0.1em",
            }}
          >
            also known as
          </div>
          <div
            className="font-fraunces italic"
            style={{
              fontSize: w * 0.058,
              color: "#3a2818",
              lineHeight: 1.1,
              marginTop: 2,
            }}
          >
            &ldquo;{card.middle} {card.last}&rdquo;
          </div>
        </div>

        <div
          className="flex flex-wrap gap-1"
          style={{ padding: `0 ${w * 0.04}px ${w * 0.03}px` }}
        >
          {card.types.map((t) => (
            <TypeChip key={t} type={t} size="sm" style={chipStyle} />
          ))}
          <div className="ml-auto">
            <RarityBadge rarity={card.rarity} />
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
