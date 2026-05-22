"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { GradedSlab } from "@/components/cards/graded-slab";
import { TypeChip } from "@/components/cards/type-chip";
import { RarityBadge } from "@/components/cards/rarity-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Sparkles,
  Check,
  ArrowRight,
  Tag,
  BookOpen,
  Package,
  Bird,
  Heart,
} from "lucide-react";
import { certFor } from "@/lib/utils";

interface Card {
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
}

interface LookupResult {
  card: Card;
  score: number;
  kind: string;
  order?: any;
}

function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export default function LookupPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [results, setResults] = useState<LookupResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const doSubmit = async (v: string) => {
    const trimmed = v.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setSubmitted(trimmed);
    setSelectedCard(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/lookup?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const exactCertMatch =
    results.length === 1 &&
    results[0].kind === "cert" &&
    results[0].score >= 95;

  const displayCard = selectedCard || (exactCertMatch ? results[0].card : null);

  const exampleCerts = [
    { cert: "PD-2018-04293", label: "Pikachu Buttercup" },
    { cert: "PD-2018-00837", label: "Mewtwo Stardust" },
    { cert: "PD-2010-06117", label: "Articuno Ember" },
    { cert: "PD-2015-05017", label: "Dragonite Sunny" },
  ];

  let resultArea = null;

  if (displayCard) {
    resultArea = <Certificate card={displayCard} onReset={() => { setQuery(""); setSubmitted(""); setSelectedCard(null); }} />;
  } else if (submitted && results.length === 0) {
    resultArea = (
      <div className="mt-9 rounded-3xl border-[1.5px] border-dashed border-pd-ink/20 bg-pd-cream p-12 text-center">
        <div className="mb-3 flex justify-center text-pd-ink-muted">
          <Bird size={56} strokeWidth={1.6} />
        </div>
        <div className="font-fraunces text-[26px] font-bold leading-[1.1] text-pd-ink">
          We couldn't find that card.
        </div>
        <div className="mx-auto mt-2 max-w-[520px] text-[15px] leading-relaxed text-pd-ink-soft">
          No record matches <strong className="text-pd-ink">"{query}"</strong>. Certificate numbers
          look like <span className="font-bold tabular-nums text-pd-ink">PD-YYYY-NNNNN</span>.
          Double-check the slab label, or try searching by your card's middle and last name.
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          <Button variant="secondary" onClick={() => { setQuery(""); setSubmitted(""); }}>
            Try another search
          </Button>
        </div>
      </div>
    );
  } else if (submitted && results.length > 0) {
    resultArea = (
      <div className="mt-7">
        <div className="mb-4 text-sm text-pd-ink-muted">
          We found <strong className="text-pd-ink">{results.length}</strong> possible{" "}
          {results.length === 1 ? "match" : "matches"}. Pick the one that's yours to verify it.
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {results.map(({ card }) => (
            <button
              key={card.id}
              onClick={() => setSelectedCard(card)}
              className="flex items-center gap-3.5 rounded-2xl border border-pd-ink/10 bg-white p-3 text-left transition-all hover:-translate-y-0.5 hover:border-pd-ink/20 hover:shadow-[0_6px_16px_rgba(40,30,20,0.08)]"
            >
              <div className="flex-shrink-0" style={{ transform: "scale(0.55)", transformOrigin: "left center" }}>
                <GradedSlab card={card} size="sm" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-springwood text-[22px] font-bold leading-[1.05] text-pd-ink">
                  {card.name}
                </div>
                <div className="font-fraunces text-[15px] italic text-pd-violet">
                  {card.middle} {card.last}
                </div>
                <div className="mt-2 text-xs tabular-nums tracking-wide text-pd-ink-muted">
                  {certFor(card)}
                </div>
              </div>
              <ArrowRight size={16} className="flex-shrink-0 text-pd-ink-muted" />
            </button>
          ))}
        </div>
      </div>
    );
  } else {
    resultArea = (
      <LookupIntro
        exampleCerts={exampleCerts}
        onTry={(v: string) => doSubmit(v)}
      />
    );
  }

  return (
    <div>
      <section className="relative overflow-hidden border-b-[1.5px] border-pd-ink/10 bg-gradient-to-b from-[#fff5e8] to-pd-bg px-8 py-14">
        <div className="absolute -right-10 -top-10 opacity-[0.06]">
          <img src="/images/pokedopt-logo.png" alt="" width={260} height={260} />
        </div>
        <div className="absolute -bottom-[60px] -left-10 opacity-[0.05]">
          <Sparkles size={220} strokeWidth={1} className="text-pd-violet" />
        </div>

        <div className="relative mx-auto max-w-[880px]">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border-[1.5px] border-pd-ink bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest shadow-[0_2px_0_#29261b]">
            <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-pd-primary-soft text-pd-primary">
              <Check size={12} strokeWidth={2.4} />
            </span>
            Authenticity registry
          </div>
          <h1 className="font-fraunces text-[clamp(38px,5vw,64px)] font-bold leading-[1.02] tracking-tight text-pd-ink">
            Look up <em className="text-pd-primary">your card</em>.
          </h1>
          <p className="mt-3.5 max-w-[640px] text-lg leading-relaxed text-pd-ink-soft">
            Already adopted a card from us? Enter its certificate number or unique
            full name to verify authenticity and pull up its full record — including
            the shelter it sponsored.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); doSubmit(query); }}
            className="mt-7 flex flex-wrap items-stretch gap-2.5"
          >
            <div className="relative flex-[1_1_360px]">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="PD-2018-02437  ·  or  ·  Pikachu Buttercup Hollowby"
                autoFocus
                className="pl-14 text-lg shadow-[0_4px_0_#29261b]"
              />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-pd-ink-muted">
                <Search size={22} strokeWidth={2} />
              </span>
            </div>
            <Button type="submit" size="lg">
              Verify card <ArrowRight size={16} strokeWidth={2.4} />
            </Button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-[1080px] px-8 pb-20 pt-2">
        {loading ? (
          <div className="mt-12 text-center">
            <div className="inline-block animate-spin">
              <svg className="h-8 w-8 text-pd-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <p className="mt-3 text-pd-ink-muted">Searching the registry...</p>
          </div>
        ) : (
          resultArea
        )}
      </section>
    </div>
  );
}

function LookupIntro({ exampleCerts, onTry }: { exampleCerts: { cert: string; label: string }[]; onTry: (v: string) => void }) {
  return (
    <div>
      <div className="mt-9 grid gap-4 sm:grid-cols-3">
        {[
          { Icon: Tag, n: "01", title: "Find your certificate number", body: "Printed on the slab label, next to the Pokédex number. Looks like PD-2018-02437." },
          { Icon: Search, n: "02", title: "Enter it above", body: "Or search by your card's unique full name — e.g. \"Pikachu Buttercup Hollowby.\"" },
          { Icon: Check, n: "03", title: "Get the full record", body: "Authenticity, grade, shelter supported, and the card's backstory — all in one place." },
        ].map((s) => (
          <div key={s.n} className="rounded-2xl border border-pd-ink/10 bg-pd-cream p-5">
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-pd-ink/10 bg-white text-pd-primary">
                <s.Icon size={18} strokeWidth={1.8} />
              </div>
              <div className="font-fraunces text-[22px] italic leading-none text-pd-primary/40">
                {s.n}
              </div>
            </div>
            <div className="mb-1 text-base font-bold text-pd-ink">{s.title}</div>
            <div className="text-[13.5px] leading-relaxed text-pd-ink-soft">{s.body}</div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-pd-ink-muted">
          Try one of these
        </div>
        <div className="flex flex-wrap gap-2">
          {exampleCerts.map(({ cert, label }) => (
            <button
              key={cert}
              onClick={() => onTry(cert)}
              className="inline-flex items-center gap-2 rounded-full border border-pd-ink/20 bg-white px-3.5 py-1.5 text-[13px] text-pd-ink transition-all hover:bg-pd-cream hover:border-pd-ink/30"
            >
              <span className="font-bold tabular-nums">{cert}</span>
              <span className="text-xs text-pd-ink-muted">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Certificate({ card, onReset }: { card: Card; onReset: () => void }) {
  const cert = certFor(card);

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-2.5">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-sm text-pd-ink-muted transition-colors hover:text-pd-ink"
        >
          <ArrowRight size={14} strokeWidth={2} className="rotate-180" /> Search again
        </button>
        <div className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#1f5230] bg-pd-green px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.1em] text-[#f0fbe8] shadow-[0_2px_0_#1f5230]">
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#f0fbe8] text-[#1f5230]">
            <Check size={11} strokeWidth={3} />
          </span>
          Verified authentic
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[22px] border-2 border-pd-ink bg-gradient-to-b from-[#fffbef] to-[#fdf3da] shadow-[0_24px_48px_-20px_rgba(40,30,20,0.25),0_6px_0_#29261b]">
        {/* Decorative inner border */}
        <div className="pointer-events-none absolute inset-3 rounded-[14px] border border-dashed border-[#c9a96a]" />

        {/* Header */}
        <div className="relative px-10 pb-3 pt-9 text-center">
          <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#8a6a2a]">
            <img src="/images/pokedopt-logo.png" alt="" width={14} height={14} /> Pokedopt Authenticity Registry
          </div>
          <h1 className="mt-2 font-springwood text-[clamp(36px,4.6vw,56px)] font-bold leading-[1.04] tracking-wide text-pd-ink">
            Certificate of Adoption
          </h1>
          <div className="font-fraunces text-base italic text-pd-ink-muted">
            This card has been verified against the Pokedopt registry.
          </div>
        </div>

        {/* Body */}
        <div className="grid gap-10 px-10 pb-7 pt-5 lg:grid-cols-[340px_1fr]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative" style={{ filter: "drop-shadow(0 18px 30px rgba(40,30,20,0.25))" }}>
              <GradedSlab card={card} size="lg" />
              <div className="absolute -bottom-7 -right-5 -rotate-9" style={{ filter: "drop-shadow(0 6px 12px rgba(122,42,20,0.45))" }}>
                <VerifiedSeal size={120} />
              </div>
            </div>
            <div className="mt-4 max-w-[280px] text-center text-xs leading-relaxed text-pd-ink-muted">
              Card image generated from the registry record. Compare to the slab in your hand.
            </div>
          </div>

          <div>
            <div className="mb-4">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-pd-ink-muted">
                Issued to bearer of
              </div>
              <div className="font-springwood text-[clamp(28px,3.4vw,40px)] font-bold leading-[1.05] tracking-wide text-pd-ink">
                {card.name}
              </div>
              <div className="mt-1 font-fraunces text-[22px] italic text-pd-violet">
                "{card.middle} {card.last}"
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {card.types.map((t) => (
                  <TypeChip key={t} type={t} size="md" />
                ))}
                <RarityBadge rarity={card.rarity} />
              </div>
            </div>

            <div className="mb-4 overflow-hidden rounded-2xl border-[1.5px] border-pd-ink bg-white shadow-[0_3px_0_#29261b]">
              <CertRow label="Certificate number" value={cert} mono accent />
              <CertRow label="Pokédex number" value={`#${String(card.pokeId).padStart(3, "0")}`} mono />
              <CertRow label="Grade" value={`${card.grade} · Well-loved`} />
              <CertRow label="HP" value={card.hp} mono />
              <CertRow label="Card birthday" value={card.birthday} />
              <CertRow label="Order number" value={`PD-${String((card.pokeId * 41) % 900000 + 100000)}`} mono last />
            </div>

            <div className="mb-4 flex items-start gap-3.5 rounded-2xl border border-[#f0d4c8] bg-pd-primary-soft p-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#f0d4c8] bg-white text-pd-primary">
                <Heart size={20} className="fill-pd-primary" strokeWidth={0} />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-pd-primary">
                  This card sponsored
                </div>
                <div className="font-fraunces text-xl font-bold leading-tight text-pd-ink">
                  A partner shelter
                </div>
                <div className="mt-1 text-[13.5px] text-pd-ink-soft">
                  ${Number(card.donation).toFixed(2)} donated when this card was adopted.
                </div>
              </div>
            </div>

            <div className="mb-5 rounded-2xl border border-pd-ink/10 bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <BookOpen size={14} strokeWidth={1.8} className="text-pd-ink-muted" />
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-pd-ink-muted">
                  Backstory on record
                </div>
              </div>
              <p className="font-fraunces text-[17px] leading-relaxed text-pd-ink">
                {card.backstory}
              </p>
              <div className="mt-3 border-t border-dashed border-pd-ink/20 pt-3 text-[13.5px] leading-relaxed text-pd-ink-soft">
                <strong className="text-pd-ink">Slab notes: </strong>
                {card.wear}
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Button onClick={() => window.print()}>
                <Package size={15} strokeWidth={1.8} /> Save / print certificate
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-[#c9a96a] px-10 py-4 text-xs text-pd-ink-muted" style={{ background: "rgba(255,251,239,0.6)" }}>
          <div className="inline-flex items-center gap-2">
            <img src="/images/pokedopt-logo.png" alt="" width={14} height={14} />
            <span>
              Registered with <strong className="text-pd-ink">Pokedopt</strong> · All cards graded and rehomed in good faith.
            </span>
          </div>
          <div className="tabular-nums">
            Verified {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CertRow({ label, value, mono, accent, last }: { label: string; value: string | number; mono?: boolean; accent?: boolean; last?: boolean }) {
  return (
    <div
      className={`grid grid-cols-[160px_1fr] items-baseline gap-3 px-5 py-3 ${
        !last ? "border-b border-dashed border-pd-ink/10" : ""
      } ${accent ? "bg-[#fff8e8]" : ""}`}
    >
      <div className="text-[11px] font-bold uppercase tracking-wider text-pd-ink-muted">
        {label}
      </div>
      <div
        className={`text-pd-ink ${mono ? "font-mono tabular-nums tracking-wide" : ""} ${
          accent ? "text-[17px] font-extrabold" : "text-[15px] font-semibold"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function VerifiedSeal({ size = 132 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-label="Verified authentic">
      <defs>
        <path id="seal-path" d="M 100,100 m -76,0 a 76,76 0 1,1 152,0 a 76,76 0 1,1 -152,0" />
        <radialGradient id="seal-g" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#e26a4a" />
          <stop offset="60%" stopColor="#c44a2a" />
          <stop offset="100%" stopColor="#8a2e16" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="none" stroke="#c44a2a" strokeWidth="1.5" opacity="0.4" strokeDasharray="2 4" />
      <circle cx="100" cy="100" r="84" fill="url(#seal-g)" stroke="#7a2a14" strokeWidth="1.5" />
      <ellipse cx="78" cy="74" rx="34" ry="20" fill="#fff" opacity="0.18" />
      <circle cx="100" cy="100" r="62" fill="none" stroke="#fff8ec" strokeWidth="1.5" opacity="0.6" />
      <text fill="#fff8ec" fontSize="11" fontWeight="700" letterSpacing="3" fontFamily="Nunito, sans-serif">
        <textPath href="#seal-path" startOffset="2%">
          POKEDOPT · AUTHENTICITY REGISTRY · VERIFIED
        </textPath>
      </text>
      <g transform="translate(100 104)">
        <path d="M -22 0 L -6 16 L 24 -14" stroke="#fff8ec" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(100 142)">
        <circle r="9" fill="#fff8ec" />
        <path d="M -9 0 A 9 9 0 0 1 9 0" fill="#c44a2a" />
        <line x1="-9" y1="0" x2="9" y2="0" stroke="#7a2a14" strokeWidth="1.6" />
        <circle r="2.6" fill="#fff8ec" stroke="#7a2a14" strokeWidth="1.4" />
      </g>
    </svg>
  );
}
