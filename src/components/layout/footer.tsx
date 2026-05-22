import Link from "next/link";
import { Heart } from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "Browse cards", href: "/browse" },
    { label: "Professor Olive", href: "/olive" },
  ],
  Mission: [
    { label: "Shelter impact", href: "/shelter" },
    { label: "Verify a card", href: "/lookup" },
    { label: "About us", href: "/about" },
  ],
  Account: [
    { label: "My orders", href: "/account" },
    { label: "Sign in", href: "/login" },
    { label: "Create account", href: "/signup" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-pd-ink text-pd-cream">
      <div className="mx-auto max-w-[1180px] px-8 py-14">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="mb-3 flex items-center gap-2.5">
              <img src="/images/pokedopt-logo.png" alt="" width={26} height={26} />
              <span className="font-springwood text-[26px] font-bold tracking-wide">
                POKEDOPT
              </span>
            </div>
            <p className="max-w-[280px] text-[13.5px] leading-relaxed opacity-70">
              Well-loved Pokémon cards, rehomed with care. 15% of every adoption goes to animal shelters.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest opacity-70">
              <Heart size={11} className="fill-pd-cream" strokeWidth={0} />
              14 shelter partners
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.14em] opacity-55">
                {title}
              </div>
              <div className="flex flex-col gap-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-pd-cream/85 transition-all hover:translate-x-0.5 hover:text-pd-cream"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-pd-cream/15 pt-5 text-xs opacity-55">
          <span>© 2026 Pokedopt · A Pokémon-inspired adoption project.</span>
          <span>Not affiliated with Nintendo / The Pokémon Company.</span>
        </div>
      </div>
    </footer>
  );
}
