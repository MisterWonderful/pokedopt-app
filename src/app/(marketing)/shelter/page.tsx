import { prisma } from "@/lib/prisma";
import { Heart } from "lucide-react";

async function getShelterData() {
  const shelters = await prisma.shelter.findMany({
    where: { isActive: true },
    orderBy: { raised: "desc" },
  });

  const totalRaised = shelters.reduce((s, p) => s + Number(p.raised), 0);
  const totalHelped = shelters.reduce((s, p) => s + p.helped, 0);

  return { shelters, totalRaised, totalHelped };
}

export default async function ShelterPage() {
  const { shelters, totalRaised, totalHelped } = await getShelterData();

  return (
    <div>
      <section className="relative overflow-hidden border-b-[1.5px] border-pd-ink bg-pd-primary px-8 py-16 text-pd-cream">
        <div className="absolute -right-20 -top-10 opacity-[0.08]">
          <Heart size={360} className="fill-white" strokeWidth={0} />
        </div>
        <div className="relative mx-auto max-w-[1180px] text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.16em] opacity-90">
            <Heart size={14} className="fill-pd-cream" strokeWidth={0} /> Our shelter pledge
          </div>
          <h1 className="font-fraunces text-[clamp(40px,5.5vw,72px)] font-bold leading-[1.05]">
            <em>Every adoption</em> finds two homes.
          </h1>
          <p className="mx-auto mt-4 max-w-[680px] text-lg leading-relaxed opacity-90">
            15% of every Pokedopt adoption goes directly to one of our partner animal shelters —
            the same shelter listed on the back of your card.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-8 py-[60px]">
        <div className="mb-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <BigStat n={`$${totalRaised.toLocaleString()}`} label="raised this year" />
          <BigStat n={totalHelped.toString()} label="animals helped" />
          <BigStat n={shelters.length.toString()} label="partner shelters" />
          <BigStat n="2,847" label="cards adopted" />
        </div>

        <div className="mb-3 text-xs font-bold uppercase tracking-widest text-pd-ink-muted">
          Our partners
        </div>
        <h2 className="font-fraunces text-[clamp(26px,3vw,36px)] font-bold leading-[1.1]">
          {shelters.length} shelters. One growing family.
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shelters.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-3 rounded-2xl border border-pd-ink/10 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-pd-ink/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-fraunces text-lg font-bold leading-tight text-pd-ink">
                    {s.name}
                  </div>
                  <div className="mt-0.5 text-[13px] text-pd-ink-muted">{s.location}</div>
                </div>
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[#f0d4c8] bg-pd-primary-soft text-pd-primary">
                  <Heart size={14} className="fill-pd-primary" strokeWidth={0} />
                </div>
              </div>
              <div className="flex gap-5 border-t border-dashed border-pd-ink/10 pt-3">
                <div>
                  <div className="font-fraunces text-lg font-bold text-pd-primary tabular-nums">
                    ${Number(s.raised).toLocaleString()}
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-pd-ink-muted">
                    raised
                  </div>
                </div>
                <div>
                  <div className="font-fraunces text-lg font-bold tabular-nums">{s.helped}</div>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-pd-ink-muted">
                    animals helped
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function BigStat({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-2xl border border-pd-ink/10 bg-pd-cream p-5 text-center">
      <div className="font-fraunces text-4xl font-bold text-pd-primary tabular-nums">{n}</div>
      <div className="mt-1.5 text-[13px] tracking-wide text-pd-ink-soft">{label}</div>
    </div>
  );
}
