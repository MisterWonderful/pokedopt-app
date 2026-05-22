import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { GradedSlab } from "@/components/cards/graded-slab";
import { CardTile } from "@/components/cards/card-tile";
import { Paw, Sparkles, ArrowRight, Heart } from "lucide-react";

async function getHomeData() {
  const cards = await prisma.card.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    take: 10,
  });
  const serialize = (c: any) => ({ ...c, price: Number(c.price), donation: Number(c.donation) });
  return {
    featured: cards.slice(0, 4).map(serialize),
    newlyAdded: cards.slice(4, 10).map(serialize),
  };
}

export default async function HomePage() {
  const { featured, newlyAdded } = await getHomeData();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b-[1.5px] border-pd-ink/10 bg-gradient-to-b from-[#fff5e8] to-pd-bg px-8 pb-12 pt-16">
        <div className="absolute -right-10 -top-10 opacity-[0.07]">
          <img src="/images/pokedopt-logo.png" alt="" width={300} height={300} />
        </div>
        <div className="absolute bottom-[-60px] left-[38%] opacity-[0.05]">
          <img src="/images/pokedopt-logo.png" alt="" width={180} height={180} />
        </div>

        <div className="relative mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-[1.5px] border-pd-ink bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest shadow-[0_2px_0_#29261b]">
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-pd-primary-soft text-pd-primary">
                <Paw size={12} strokeWidth={2} />
              </span>
              Every card supports a shelter
            </div>

            <h1 className="font-fraunces text-[clamp(40px,5.5vw,72px)] font-bold leading-[1.02] tracking-tight text-pd-ink">
              Adopt a <em className="text-pd-primary">well-loved</em> Pokémon card.
            </h1>

            <p className="mt-4 max-w-[520px] text-lg leading-relaxed text-pd-ink-soft">
              Each card is graded, slabbed, and given a one-of-a-kind middle and last name —
              just like the trainer who loved it before you. A portion of every adoption
              supports real animal shelters.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/browse">
                <Button size="lg">
                  Browse all cards <ArrowRight size={16} strokeWidth={2.4} />
                </Button>
              </Link>
              <Link href="/olive">
                <Button size="lg" variant="secondary">
                  <Sparkles size={16} strokeWidth={2} /> Meet Professor Olive
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-pd-ink-muted">
              <Stat n="2,847" label="cards adopted" />
              <Stat n="$28k+" label="raised for shelters" />
              <Stat n="14" label="shelter partners" />
            </div>
          </div>

          {/* Hero card stack */}
          <div className="relative hidden h-[460px] justify-center lg:flex">
            {featured[1] && (
              <div className="absolute left-[5%] top-[30px] animate-pd-float" style={{ animationDelay: "0.4s" }}>
                <GradedSlab card={featured[1]} size="md" />
              </div>
            )}
            {featured[2] && (
              <div className="absolute right-[5%] top-[60px] animate-pd-float" style={{ animationDelay: "1.6s" }}>
                <GradedSlab card={featured[2]} size="md" />
              </div>
            )}
            {featured[0] && (
              <div className="absolute left-1/2 top-0 z-[2] -translate-x-1/2 animate-pd-float" style={{ animationDelay: "0.8s" }}>
                <GradedSlab card={featured[0]} size="md" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-[1180px] px-8 py-[72px]">
        <SectionHeader eyebrow="How it works" title="Three steps to a new friend." />
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { n: "01", title: "Browse or get matched", body: "Search by name and type, or let Professor Olive pair you with a card based on your personality." },
            { n: "02", title: "Meet your card", body: "Read its hypothetical backstory — every card has a name, a past trainer, and a quirk all its own." },
            { n: "03", title: "Adopt for $10", body: "A portion of every adoption supports one of our partner animal shelters. Your card arrives in its slab." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border-[1.5px] border-pd-ink/10 bg-pd-cream p-6">
              <div className="mb-3 font-fraunces text-4xl italic leading-none text-pd-primary">{s.n}</div>
              <div className="mb-1.5 text-lg font-bold text-pd-ink">{s.title}</div>
              <div className="text-sm leading-relaxed text-pd-ink-soft">{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured cards */}
      <section className="mx-auto max-w-[1180px] px-8 pb-[72px] pt-6">
        <SectionHeader
          eyebrow="Recently arrived"
          title="Newly adopted into the slab."
          action={
            <Link href="/browse">
              <Button variant="ghost" size="sm">See all →</Button>
            </Link>
          }
        />
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {newlyAdded.map((c) => (
            <CardTile key={c.id} card={c} />
          ))}
        </div>
      </section>

      {/* Shelter strip */}
      <section className="relative overflow-hidden border-y-[1.5px] border-pd-ink bg-pd-primary px-8 py-16 text-pd-cream">
        <div className="absolute -right-[60px] -top-[60px] opacity-[0.08]">
          <Heart size={300} className="fill-white" strokeWidth={0} />
        </div>
        <div className="relative mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-3.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] opacity-85">
              <Heart size={12} className="fill-pd-cream" strokeWidth={0} /> Our shelter pledge
            </div>
            <h2 className="font-fraunces text-[clamp(28px,3.2vw,44px)] font-bold leading-[1.1]">
              <em>Every card</em> helps a real animal find a home.
            </h2>
            <p className="mt-4 max-w-[520px] text-base leading-relaxed opacity-90">
              15% of every adoption goes directly to one of our partner animal shelters. Each card lists the
              shelter it sponsors — adopt a Pikachu, help a real puppy.
            </p>
            <div className="mt-6">
              <Link href="/shelter">
                <Button variant="secondary">See our impact <ArrowRight size={14} strokeWidth={2.4} /></Button>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border-2 border-pd-ink bg-pd-cream p-6 text-pd-ink shadow-[0_6px_0_#29261b]">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-pd-ink-muted">This month</div>
            <div className="font-fraunces text-6xl font-bold leading-none text-pd-primary tabular-nums">$3,420</div>
            <div className="mt-1 text-sm text-pd-ink-soft">donated to 14 partner shelters</div>
            <div className="my-4 h-px bg-pd-ink/10" />
            <div className="flex flex-wrap gap-2">
              {["Honeybrook", "Mossy Pines", "Lakeside Paws", "Silver Whiskers"].map((s) => (
                <div key={s} className="inline-flex items-center gap-1 rounded-full border border-pd-ink/10 bg-white px-2.5 py-1 text-xs text-pd-ink-soft">
                  <Heart size={9} className="fill-pd-primary" strokeWidth={0} /> {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Olive teaser */}
      <section className="mx-auto max-w-[1180px] px-8 py-[72px]">
        <div className="relative grid items-center gap-8 overflow-hidden rounded-3xl border-[1.5px] border-pd-ink/10 bg-gradient-to-br from-[#f0e8ff] to-[#fff0e8] p-10 lg:grid-cols-[auto_1fr_auto]">
          <div className="absolute -right-5 -top-5 opacity-[0.06]">
            <Sparkles size={180} strokeWidth={1} className="text-pd-violet" />
          </div>
          <ProfessorAvatar size={120} />
          <div className="relative">
            <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-pd-violet">
              <Sparkles size={12} strokeWidth={2} /> Get matched
            </div>
            <h3 className="font-fraunces text-[32px] font-bold leading-[1.1]">Not sure which card is yours?</h3>
            <p className="mt-2 max-w-[520px] text-base leading-relaxed text-pd-ink-soft">
              Professor Olive will ask you a few friendly questions and find the Pokémon
              card that fits you best. Takes about a minute.
            </p>
          </div>
          <Link href="/olive">
            <Button size="lg">Start matching <ArrowRight size={16} strokeWidth={2.4} /></Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-fraunces text-2xl font-bold leading-none text-pd-ink">{n}</div>
      <div className="mt-0.5 text-xs text-pd-ink-muted">{label}</div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="mb-1.5 text-xs font-bold uppercase tracking-widest text-pd-ink-muted">{eyebrow}</div>}
        <h2 className="font-fraunces text-[clamp(26px,3vw,36px)] font-bold leading-[1.1] text-pd-ink">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function ProfessorAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className="flex-shrink-0">
      <ellipse cx="60" cy="108" rx="32" ry="5" fill="#29261b" opacity="0.15" />
      <circle cx="60" cy="64" r="42" fill="#8a9a4e" stroke="#29261b" strokeWidth="2.5" />
      <ellipse cx="60" cy="74" rx="26" ry="22" fill="#c8d49a" />
      <path d="M60 24 Q52 12, 44 16 Q44 26, 56 28 Q60 26, 60 24 Z" fill="#5a8a3a" stroke="#29261b" strokeWidth="2" />
      <path d="M60 24 Q60 18, 56 14" stroke="#29261b" strokeWidth="1.5" fill="none" />
      <circle cx="38" cy="64" r="5" fill="#e58fa0" opacity="0.7" />
      <circle cx="82" cy="64" r="5" fill="#e58fa0" opacity="0.7" />
      <circle cx="48" cy="56" r="4" fill="#29261b" />
      <circle cx="72" cy="56" r="4" fill="#29261b" />
      <circle cx="49" cy="55" r="1.2" fill="#fff" />
      <circle cx="73" cy="55" r="1.2" fill="#fff" />
      <circle cx="48" cy="56" r="8" fill="none" stroke="#29261b" strokeWidth="1.5" />
      <circle cx="72" cy="56" r="8" fill="none" stroke="#29261b" strokeWidth="1.5" />
      <line x1="56" y1="56" x2="64" y2="56" stroke="#29261b" strokeWidth="1.5" />
      <path d="M52 72 Q60 78, 68 72" stroke="#29261b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
