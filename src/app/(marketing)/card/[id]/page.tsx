import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { POKEMON_TYPES } from "@/lib/constants";
import { GradedSlab } from "@/components/cards/graded-slab";
import { TypeChip } from "@/components/cards/type-chip";
import { RarityBadge } from "@/components/cards/rarity-badge";
import { ShelterBadge } from "@/components/cards/shelter-badge";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { CardTile } from "@/components/cards/card-tile";
import { BookOpen, Heart } from "lucide-react";

export default async function CardDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const card = await prisma.card.findUnique({
    where: { id: params.id },
  });

  if (!card) notFound();

  const related = await prisma.card.findMany({
    where: {
      id: { not: card.id },
      isActive: true,
      types: { hasSome: card.types },
    },
    take: 4,
  });

  const primary = POKEMON_TYPES[card.types[0]] || POKEMON_TYPES.normal;

  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${primary.bg} 0%, #fef9ed 240px)`,
      }}
    >
      <div className="mx-auto max-w-[1180px] px-8 py-6 pb-20">
        {/* Breadcrumb */}
        <div className="mb-5 text-sm text-pd-ink-muted">
          <Link href="/" className="hover:text-pd-ink">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/browse" className="hover:text-pd-ink">
            Browse
          </Link>
          <span className="mx-2">/</span>
          <span className="text-pd-ink">{card.fullName}</span>
        </div>

        <div className="grid gap-16 lg:grid-cols-[380px_1fr]">
          {/* Card slab */}
          <div className="flex justify-center lg:sticky lg:top-24">
            <GradedSlab card={card} size="lg" />
          </div>

          {/* Info */}
          <div>
            <div className="mb-3.5 flex flex-wrap gap-2">
              {card.types.map((t) => (
                <TypeChip key={t} type={t} size="md" />
              ))}
              <RarityBadge rarity={card.rarity} />
              <ShelterBadge />
            </div>

            <h1 className="font-springwood text-[clamp(40px,5vw,64px)] font-bold leading-[1.05] tracking-wide text-pd-ink">
              {card.name}
            </h1>
            <div className="mt-1 font-fraunces text-[22px] italic text-pd-violet">
              “{card.middle} {card.last}”
            </div>

            {/* Stats */}
            <div className="mt-6 overflow-hidden rounded-2xl border-[1.5px] border-pd-ink bg-white shadow-[0_4px_0_#29261b]">
              <div className="grid grid-cols-4">
                <DetailStat label="Grade" value={card.grade} hint="Well-Loved" />
                <DetailStat label="HP" value={card.hp} hint="Hit Points" />
                <DetailStat
                  label="Pokédex"
                  value={`#${String(card.pokeId).padStart(3, "0")}`}
                  hint="Number"
                />
                <DetailStat
                  label="Birthday"
                  value={card.birthday}
                  hint="approx."
                  last
                />
              </div>
            </div>

            {/* Backstory */}
            <div className="mt-5 rounded-2xl border-[1.5px] border-pd-ink/10 bg-white p-6">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen size={16} strokeWidth={1.8} className="text-pd-ink-muted" />
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-pd-ink-muted">
                  Backstory
                </div>
              </div>
              <p className="font-fraunces text-lg leading-relaxed text-pd-ink">
                {card.backstory}
              </p>
              <div className="mt-4 rounded-xl bg-pd-cream p-3.5 text-sm leading-relaxed text-pd-ink-soft">
                <strong className="text-pd-ink">Slab notes: </strong>
                {card.wear}
              </div>
            </div>

            {/* Shelter */}
            <div className="mt-5 rounded-2xl border border-[#f0d4c8] bg-pd-primary-soft p-5">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#f0d4c8] bg-white text-pd-primary">
                  <Heart size={20} className="fill-pd-primary" strokeWidth={0} />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-pd-primary">
                    Sponsors a shelter
                  </div>
                  <div className="font-fraunces text-xl font-bold leading-tight text-pd-ink">
                    Proceeds from your adoption support our shelter partners.
                  </div>
                  <div className="mt-1 text-sm text-pd-ink-soft">
                    Choose a specific partner at checkout, or let us split it
                    across all 14.
                  </div>
                </div>
              </div>
            </div>

            {/* Adopt CTA */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-pd-ink px-6 py-6 text-pd-cream">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-65">
                  Adoption fee
                </div>
                <div className="font-fraunces text-[40px] font-bold leading-none tabular-nums">
                  ${card.price.toFixed(2)}
                </div>
                <div className="mt-1 text-[13px] opacity-75">
                  Includes shelter proceeds
                </div>
              </div>
              <AddToCartButton card={card} size="lg" />
            </div>
          </div>
        </div>

        {/* Similar */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-pd-ink-muted">
              You might also love
            </div>
            <h2 className="font-fraunces text-[clamp(26px,3vw,36px)] font-bold leading-[1.1] text-pd-ink">
              Other {card.types[0]}-type friends
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((c) => (
                <CardTile key={c.id} card={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailStat({
  label,
  value,
  hint,
  last,
}: {
  label: string;
  value: string | number;
  hint: string;
  last?: boolean;
}) {
  return (
    <div
      className={`py-4 text-center ${
        !last ? "border-r border-pd-ink/10" : ""
      }`}
    >
      <div className="text-[11px] font-bold uppercase tracking-wider text-pd-ink-muted">
        {label}
      </div>
      <div className="font-fraunces text-[22px] font-bold leading-none text-pd-ink">
        {value}
      </div>
      <div className="mt-1 text-[11px] text-pd-ink-muted">{hint}</div>
    </div>
  );
}
