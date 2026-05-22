"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Package, Bird } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_STYLES } from "@/lib/constants";

interface Order {
  id: string;
  orderNum: string;
  status: string;
  placedAt: string;
  subtotal: number;
  donation: number;
  shippingFee: number;
  total: number;
  orderItems: {
    id: string;
    qty: number;
    priceAt: number;
    nameAt: string;
    middleAt: string;
    lastAt: string;
    cardId: string;
  }[];
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((data) => {
          setOrders(data.orders || []);
          setLoading(false);
        });
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="mx-auto max-w-[1180px] px-8 py-10">
        <div className="h-8 w-48 animate-pulse rounded bg-pd-ink/10" />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-pd-ink/5" />
          ))}
        </div>
      </div>
    );
  }

  if (!session) return null;

  const totalAdopted = orders.reduce(
    (s, o) => s + o.orderItems.reduce((n, i) => n + i.qty, 0),
    0
  );
  const totalDonated = orders.reduce((s, o) => s + o.donation, 0);
  const totalSpent = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="mx-auto max-w-[1180px] px-8 py-10 pb-20">
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-pd-ink-muted">
          My account
        </div>
        <h1 className="font-fraunces text-[clamp(32px,4.4vw,48px)] font-bold leading-[1.05]">
          Hi, {session.user?.name?.split(" ")[0]}.
        </h1>
        <div className="mt-1 text-[15px] text-pd-ink-soft">{session.user?.email}</div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Cards adopted" value={totalAdopted} accent="#c44a2a" />
        <StatCard label="Total spent" value={formatPrice(totalSpent)} accent="#29261b" />
        <StatCard label="Donated to shelters" value={formatPrice(totalDonated)} accent="#3a7a4e" hearted />
        <StatCard label="Orders" value={orders.length} accent="#7a4a8a" />
      </div>

      {/* Orders */}
      <div className="mb-3.5 text-xs font-bold uppercase tracking-widest text-pd-ink-muted">
        Adoption history
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-pd-ink/20 bg-pd-cream p-12 text-center">
          <div className="mb-3.5 flex justify-center text-pd-ink-muted">
            <Bird size={56} strokeWidth={1.6} />
          </div>
          <div className="font-fraunces text-[22px] font-bold">No adoptions yet.</div>
          <div className="mt-1.5 text-pd-ink-soft">The shelter is full of cards waiting for a trainer.</div>
          <div className="mt-4">
            <Link href="/browse">
              <Button>Browse cards</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent, hearted }: { label: string; value: string | number; accent: string; hearted?: boolean }) {
  return (
    <div className="rounded-2xl border border-pd-ink/10 bg-white p-5">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-pd-ink-muted">
        {hearted && <span className="mr-1 inline-block text-pd-primary"><Heart size={11} className="fill-pd-primary" strokeWidth={0} /></span>}
        {label}
      </div>
      <div className="font-fraunces text-[32px] font-bold leading-none tabular-nums" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const sc = ORDER_STATUS_STYLES[order.status] || ORDER_STATUS_STYLES.placed;
  const dateStr = formatDate(order.placedAt);
  const itemCount = order.orderItems.reduce((n, i) => n + i.qty, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-pd-ink/15 bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="grid w-full grid-cols-[auto_1fr_auto_auto] items-center gap-4 p-5 text-left"
      >
        <div className="flex gap-[-8px]">
          {order.orderItems.slice(0, 3).map((it, i) => (
            <div
              key={it.id}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-pd-ink bg-pd-cream"
              style={{ marginLeft: i === 0 ? 0 : -10, zIndex: 3 - i }}
            >
              <span className="text-[10px] font-bold">{it.nameAt[0]}</span>
            </div>
          ))}
          {order.orderItems.length > 3 && (
            <div className="ml-[-10px] flex h-11 w-11 items-center justify-center rounded-xl border border-pd-ink bg-pd-cream text-[13px] font-bold">
              +{order.orderItems.length - 3}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-[15px] font-bold">Order #{order.orderNum}</div>
          <div className="text-[13px] text-pd-ink-muted">
            {dateStr} · {itemCount} card{itemCount === 1 ? "" : "s"}
          </div>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
          style={{ background: sc.bg, color: sc.fg }}
        >
          {sc.label}
        </span>
        <div className="flex items-center gap-3">
          <div className="text-base font-bold tabular-nums">${order.total.toFixed(2)}</div>
          <div className="text-lg text-pd-ink-muted" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 200ms" }}>
            ⌄
          </div>
        </div>
      </button>

      {open && (
        <div className="border-t border-dashed border-pd-ink/15 bg-[#fffaf0] px-5 py-4">
          {order.orderItems.map((it) => (
            <div key={it.id} className="flex items-center gap-3 border-b border-dashed border-pd-ink/10 py-2">
              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-lg border border-pd-ink bg-pd-cream">
                <span className="text-sm font-bold">{it.nameAt[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-springwood text-[17px] font-bold tracking-wide text-pd-ink">{it.nameAt}</span>
                <span className="ml-2 font-fraunces text-sm italic text-pd-violet">“{it.middleAt} {it.lastAt}”</span>
                <div className="text-xs text-pd-ink-muted">×{it.qty} · supports a shelter</div>
              </div>
              <div className="text-sm font-semibold">${(Number(it.priceAt) * it.qty).toFixed(2)}</div>
            </div>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-4 border-t border-pd-ink/10 pt-3">
            <div className="text-right">
              <div className="text-[13px] text-pd-ink-soft">Subtotal <span className="ml-2">${order.subtotal.toFixed(2)}</span></div>
              <div className="text-[13px] text-pd-ink-soft">Shipping <span className="ml-2">${order.shippingFee.toFixed(2)}</span></div>
              <div className="mt-1.5 text-[15px] font-bold">Total <span className="ml-2">${order.total.toFixed(2)}</span></div>
              <div className="mt-1 inline-flex items-center gap-1 text-xs text-pd-primary">
                <Heart size={11} className="fill-pd-primary" strokeWidth={0} /> Shelter proceeds included
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
