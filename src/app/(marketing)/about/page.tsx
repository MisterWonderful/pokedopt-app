import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, Tag, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[820px] px-8 py-[60px] pb-20">
      <div className="mb-3 text-xs font-bold uppercase tracking-widest text-pd-ink-muted">
        Our story
      </div>
      <h1 className="font-fraunces text-[clamp(40px,5vw,60px)] font-bold leading-[1.05]">
        We rehome <em className="text-pd-primary">well-loved</em> cards. And help shelters.
      </h1>

      <p className="mt-8 font-fraunces text-[22px] leading-relaxed text-pd-ink">
        Pokedopt started in a small bookshop in 2022, when a kid named Theo brought in a shoebox of his
        grandmother's old Pokémon cards and asked if they could "go to good homes." We said yes.
      </p>

      <p className="mt-5 text-[17px] leading-[1.7] text-pd-ink-soft">
        Today, every card that comes through our doors is graded, slabbed, and given a unique
        middle and last name — a small ceremony to honor the trainer who loved it before. Each card's
        backstory is hypothetical, but the care is real. So is the shelter donation.
      </p>

      <div className="my-10 grid gap-4 sm:grid-cols-3">
        {[
          { Icon: Package, title: "No card conditions", body: "Every card is \"well-loved.\" No grading anxiety, no condition haggling.", tone: "#7a4a8a" },
          { Icon: Tag, title: "Unique names", body: "Middle and last names assigned by hand, never repeated.", tone: "#3a7a4e" },
          { Icon: Heart, title: "15% to shelters", body: "Direct donations to partner shelters with every adoption.", tone: "#c44a2a" },
        ].map((b) => (
          <div key={b.title} className="rounded-2xl border border-pd-ink/10 bg-pd-cream p-5">
            <div
              className="mb-3 flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-pd-ink/10 bg-white"
              style={{ color: b.tone }}
            >
              <b.Icon size={18} strokeWidth={1.8} />
            </div>
            <div className="mb-1 text-base font-bold text-pd-ink">{b.title}</div>
            <div className="text-[13.5px] leading-relaxed text-pd-ink-soft">{b.body}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/browse">
          <Button size="lg">Browse cards</Button>
        </Link>
        <Link href="/shelter">
          <Button size="lg" variant="secondary">See shelter impact</Button>
        </Link>
      </div>
    </div>
  );
}
