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
  artCropX?: number | null;
  artCropY?: number | null;
  artCropWidth?: number | null;
  artCropHeight?: number | null;
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
              display: "flex",
              alignItems: "baseline",
              gap: w * 0.025,
            }}
          >
            {card.hp > 0 && (
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
            )}
            {card.imageUrl1 && card.cardNumber && (
              <div
                style={{
                  fontWeight: 700,
                  fontSize: w * 0.04,
                  color: "#7a6e5a",
                  letterSpacing: "0.02em",
                }}
              >
                {card.cardNumber}
              </div>
            )}
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
            className="pd-shimmer pointer-events-none absolute inset-0 z-[2]"
            style={{
              background:
                "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.65) 45%, transparent 60%)",
              backgroundSize: "300% 100%",
              backgroundPosition: "120% 0",
              mixBlendMode: "overlay",
            }}
          />
          {card.imageUrl1 ? (
            <CroppedArt
              src={card.imageUrl1}
              alt={card.name}
              cropX={card.artCropX ?? 0.07}
              cropY={card.artCropY ?? 0.11}
              cropW={card.artCropWidth ?? 0.86}
              cropH={card.artCropHeight ?? 0.5}
            />
          ) : (
            <Image
              src={card.sprite}
              alt={card.name}
              width={Math.round(w * 0.7)}
              height={Math.round(w * 0.7)}
              className="relative z-[1] object-contain"
              style={{ width: "85%", height: "85%" }}
              unoptimized
            />
          )}
          {card.pokeId > 0 && !card.imageUrl1 && (
            <div
              className="absolute top-1.5 left-1.5 z-[3] font-bold"
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
          )}
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
    </div>
  );
}

// Render a cropped portion of an image, scaled to fill the parent container.
// Crop coords are normalized 0-1 within the source image.
export function CroppedArt({
  src,
  alt,
  cropX,
  cropY,
  cropW,
  cropH,
}: {
  src: string;
  alt: string;
  cropX: number;
  cropY: number;
  cropW: number;
  cropH: number;
}) {
  // Image is scaled so the crop area fills 100% of the container.
  // Inverse-scale = 1/cropW (horizontal) and 1/cropH (vertical).
  // The image's top-left sits at (-cropX/cropW, -cropY/cropH) relative to the container.
  return (
    <div className="relative z-[1] h-full w-full overflow-hidden">
      <img
        src={src}
        alt={alt}
        style={{
          position: "absolute",
          width: `${100 / cropW}%`,
          height: `${100 / cropH}%`,
          left: `${(-cropX * 100) / cropW}%`,
          top: `${(-cropY * 100) / cropH}%`,
          maxWidth: "none",
          objectFit: "fill",
        }}
        draggable={false}
      />
    </div>
  );
}
