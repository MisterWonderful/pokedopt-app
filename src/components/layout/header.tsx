"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/hooks/use-cart";
import {
  ShoppingCart,
  Menu,
  X,
  Package,
  Search,
  Shield,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/browse", label: "Browse" },
  { href: "/olive", label: "Professor Olive" },
  { href: "/lookup", label: "Verify card" },
  { href: "/shelter", label: "Shelter impact" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count } = useCart();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-[100] border-b-[1.5px] border-pd-line-strong bg-pd-bg/85 backdrop-blur-[14px]"
    >
      <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-6 py-3.5"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 font-springwood text-[26px] font-bold tracking-wide text-pd-ink"
        >
          <img src="/images/pokedopt-logo.png" alt="" width={30} height={30} />
          POKEDOPT
        </Link>

        <nav className="ml-5 hidden items-center gap-0.5 md:flex"
        >
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 text-sm font-semibold tracking-wide transition-colors ${
                  active ? "text-pd-primary" : "text-pd-ink hover:text-pd-primary"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-pd-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2"
        >
          <Link href="/cart"
          >
            <button className="relative flex items-center gap-2 rounded-xl border-[1.5px] border-pd-ink bg-white px-3.5 py-2 shadow-[0_2px_0_#29261b] transition-all hover:-translate-y-px hover:shadow-[0_3px_0_#29261b]">
              <ShoppingCart size={16} />
              {count > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-pd-primary px-1.5 text-[11px] font-extrabold text-pd-cream tabular-nums"
                >
                  {count}
                </span>
              )}
            </button>
          </Link>

          {session?.user ? (
            <AccountDropdown />
          ) : (
            <Link href="/login"
            >
              <button className="rounded-xl border border-pd-ink/20 bg-transparent px-4 py-2 text-sm font-semibold text-pd-ink transition-colors hover:bg-pd-cream"
              >
                Sign in
              </button>
            </Link>
          )}

          <button
            aria-label="Open menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-[1.5px] border-pd-ink bg-white shadow-[0_2px_0_#29261b] md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-pd-line-strong bg-pd-bg/97 md:hidden"
        >
          <nav className="mx-auto flex max-w-[1280px] flex-col px-4 py-2"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`border-b border-dashed border-pd-line-strong px-2 py-3.5 text-left text-base font-semibold ${
                  pathname === item.href ? "text-pd-primary" : "text-pd-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function AccountDropdown() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const initial = (session?.user?.name || session?.user?.email || "?")[0].toUpperCase();
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="relative"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-pd-ink bg-white py-1 pl-1 pr-3 shadow-[0_2px_0_#29261b]"
      >
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-extrabold text-pd-cream ${
            isAdmin ? "bg-pd-violet" : "bg-pd-primary"
          }`}
        >
          {initial}
        </div>
        <span className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-bold"
        >
          {session?.user?.name?.split(" ")[0]}
        </span>
        <span className="text-[10px] opacity-60"
        >▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-[calc(100%+8px)] z-20 min-w-[240px] rounded-2xl border-2 border-pd-ink bg-white p-2 shadow-[0_8px_24px_rgba(40,30,20,0.15),0_4px_0_#29261b]"
          >
            <div className="border-b border-dashed border-pd-line-strong px-3 py-2.5 pb-3"
            >
              <div className="text-sm font-bold"
              >{session?.user?.name}</div>
              <div className="text-xs text-pd-ink-muted"
              >{session?.user?.email}</div>
              {isAdmin && (
                <span className="mt-1.5 inline-block rounded bg-pd-violet/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pd-violet"
                >
                  Admin
                </span>
              )}
            </div>
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-pd-ink hover:bg-pd-cream"
            >
              <Package size={16} /> My orders
            </Link>
            <Link
              href="/browse"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-pd-ink hover:bg-pd-cream"
            >
              <Search size={16} /> Browse cards
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-pd-violet hover:bg-pd-cream"
              >
                <Shield size={16} /> Admin panel
              </Link>
            )}
            <div className="my-1.5 border-t border-dashed border-pd-line-strong" />
            <button
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-pd-ink hover:bg-pd-cream"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
