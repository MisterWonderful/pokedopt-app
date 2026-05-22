"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { POKEMON_TYPES } from "@/lib/constants";
import { Heart, ArrowRight } from "lucide-react";

interface DashboardData {
  stats: {
    totalRevenue: number;
    totalCardsSold: number;
    totalDonations: number;
    totalOrders: number;
    totalUsers: number;
    totalCards: number;
  };
  days: { date: string; revenue: number; orders: number }[];
  topSellers: { card: { name: string; middle: string; sprite: string; types: string[] } | null; qty: number; revenue: number }[];
  typeSales: Record<string, number>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-pd-ink/10" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-pd-ink/5" />
          ))}
        </div>
      </div>
    );
  }

  const { stats, days, topSellers, typeSales } = data;
  const maxRev = Math.max(1, ...days.map((d) => d.revenue));
  const typeTotal = Object.values(typeSales).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <BigStat label="Revenue" value={formatPrice(stats.totalRevenue)} sub={`from ${stats.totalOrders} orders`} accent="#29261b" />
        <BigStat label="Cards adopted" value={stats.totalCardsSold} sub={`${stats.totalCards} in shelter`} accent="#c44a2a" />
        <BigStat label="Donated to shelters" value={formatPrice(stats.totalDonations)} sub="15% of revenue" accent="#3a7a4e" hearted />
        <BigStat label="Trainers" value={stats.totalUsers} sub="registered customers" accent="#7a4a8a" />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-pd-ink/10 bg-white p-5">
          <div className="mb-1 font-fraunces text-lg font-bold">Revenue · last 14 days</div>
          <div className="text-xs text-pd-ink-muted">
            ${days.reduce((s, d) => s + d.revenue, 0).toFixed(2)} total
          </div>
          <div className="flex items-end gap-1.5 pt-3" style={{ height: 180 }}>
            {days.map((d, i) => {
              const h = (d.revenue / maxRev) * 100;
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                  <div
                    title={`$${d.revenue.toFixed(2)}`}
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${Math.max(2, h)}%`,
                      background: i === days.length - 1 ? "#c44a2a" : "#29261b",
                    }}
                  />
                  <div className="text-[10px] font-semibold text-pd-ink-muted">
                    {new Date(d.date).toLocaleDateString("en-US", { day: "numeric" })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-pd-ink/10 bg-white p-5">
          <div className="mb-1 font-fraunces text-lg font-bold">Sales by type</div>
          <div className="text-xs text-pd-ink-muted">across all orders</div>
          {Object.keys(typeSales).length === 0 ? (
            <div className="py-5 text-sm text-pd-ink-muted">No sales yet.</div>
          ) : (
            <div className="mt-2 flex flex-col gap-2">
              {Object.entries(typeSales)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 7)
                .map(([t, qty]) => {
                  const pct = (qty / typeTotal) * 100;
                  const tt = POKEMON_TYPES[t] || POKEMON_TYPES.normal;
                  return (
                    <div key={t} className="flex items-center gap-2">
                      <div className="flex w-[70px] items-center gap-1 text-xs font-semibold capitalize" style={{ color: tt.color }}>
                        <span>{tt.glyph}</span>
                        {t}
                      </div>
                      <div className="flex-1">
                        <div className="h-2.5 rounded-full bg-pd-cream">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: tt.color }} />
                        </div>
                      </div>
                      <div className="w-7 text-right text-xs font-bold tabular-nums">{qty}</div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Top sellers + recent orders placeholder */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-pd-ink/10 bg-white p-5">
          <div className="mb-1 font-fraunces text-lg font-bold">Top adopted cards</div>
          <div className="text-xs text-pd-ink-muted">by units</div>
          {topSellers.length === 0 ? (
            <div className="py-5 text-sm text-pd-ink-muted">No sales yet.</div>
          ) : (
            <div className="mt-2 flex flex-col gap-2.5">
              {topSellers.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 font-fraunces text-lg font-bold text-pd-ink-muted">#{i + 1}</div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-pd-ink/10 bg-pd-cream">
                    {s.card?.sprite ? (
                      <img src={s.card.sprite} alt="" className="h-[85%] w-[85%] object-contain" />
                    ) : (
                      <span className="text-xs font-bold">?</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold">
                      {s.card?.name}{" "}
                      <span className="font-fraunces font-normal italic text-pd-violet">“{s.card?.middle}”</span>
                    </div>
                    <div className="text-xs text-pd-ink-muted">${s.revenue.toFixed(2)} revenue</div>
                  </div>
                  <div className="text-base font-bold tabular-nums">×{s.qty}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-pd-ink/10 bg-white p-5">
          <div className="mb-1 font-fraunces text-lg font-bold">Quick links</div>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/admin/cards" className="flex items-center justify-between rounded-xl bg-pd-cream p-4 transition-colors hover:bg-pd-primary-soft">
              <span className="font-semibold">Manage cards</span>
              <ArrowRight size={16} />
            </Link>
            <Link href="/admin/orders" className="flex items-center justify-between rounded-xl bg-pd-cream p-4 transition-colors hover:bg-pd-primary-soft">
              <span className="font-semibold">Manage orders</span>
              <ArrowRight size={16} />
            </Link>
            <Link href="/admin/customers" className="flex items-center justify-between rounded-xl bg-pd-cream p-4 transition-colors hover:bg-pd-primary-soft">
              <span className="font-semibold">View customers</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function BigStat({ label, value, sub, accent, hearted }: { label: string; value: string | number; sub: string; accent: string; hearted?: boolean }) {
  return (
    <div className="rounded-2xl border border-pd-ink/10 bg-white p-5">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-pd-ink-muted">
        {hearted && <span className="mr-1 inline-block text-pd-primary"><Heart size={11} className="fill-pd-primary" strokeWidth={0} /></span>}
        {label}
      </div>
      <div className="font-fraunces text-[30px] font-bold leading-none tabular-nums" style={{ color: accent }}>
        {value}
      </div>
      <div className="mt-1.5 text-xs text-pd-ink-muted">{sub}</div>
    </div>
  );
}
