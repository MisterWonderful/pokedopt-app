"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Package } from "lucide-react";
import { ORDER_STATUS_STYLES } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  orderNum: string;
  status: string;
  placedAt: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  donation: number;
  customerName: string;
  customerEmail: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  orderItems: {
    id: string;
    qty: number;
    priceAt: number;
    nameAt: string;
    middleAt: string;
    lastAt: string;
  }[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders || []);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    }
  };

  const filtered = orders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      o.orderNum.toLowerCase().includes(s) ||
      o.customerEmail.toLowerCase().includes(s) ||
      o.customerName.toLowerCase().includes(s)
    );
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-pd-ink/10" />
        <div className="h-64 animate-pulse rounded-2xl bg-pd-ink/5" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} /> Back
          </Button>
        </Link>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-pd-violet">
            Orders
          </div>
          <h1 className="font-fraunces text-2xl font-bold">Order management</h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-[1_1_240px]">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, name, email…"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-11 rounded-xl border-2 border-pd-ink/20 bg-white px-3 text-sm"
        >
          <option value="all">All statuses</option>
          {["placed", "shipped", "delivered", "cancelled"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-pd-ink/10 bg-white">
        <div className="grid grid-cols-[1.2fr_1.5fr_auto_auto_auto_auto] gap-3.5 border-b border-pd-ink/10 bg-[#f7f3e8] px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-pd-ink-muted">
          <div>Order</div>
          <div>Customer</div>
          <div>Items</div>
          <div>Total</div>
          <div>Status</div>
          <div></div>
        </div>
        {filtered.map((o) => {
          const sc = ORDER_STATUS_STYLES[o.status] || ORDER_STATUS_STYLES.placed;
          const itemCount = o.orderItems.reduce((n, i) => n + i.qty, 0);
          return (
            <div
              key={o.id}
              className="grid grid-cols-[1.2fr_1.5fr_auto_auto_auto_auto] items-center gap-3.5 border-b border-pd-ink/5 px-4 py-2.5"
            >
              <div>
                <div className="text-[13px] font-bold">#{o.orderNum}</div>
                <div className="text-[11px] text-pd-ink-muted">
                  {formatDate(o.placedAt)}
                </div>
              </div>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold">
                  {o.customerName}
                </div>
                <div className="truncate text-xs text-pd-ink-muted">
                  {o.customerEmail}
                </div>
              </div>
              <div className="text-[13px] text-pd-ink-soft">
                {itemCount} card{itemCount === 1 ? "" : "s"}
              </div>
              <div className="text-sm font-bold tabular-nums">
                ${o.total.toFixed(2)}
              </div>
              <div>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className="cursor-pointer rounded-full border-none px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
                  style={{ background: sc.bg, color: sc.fg }}
                >
                  {["placed", "shipped", "delivered", "cancelled"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-lg text-pd-ink-muted">⌄</div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-10 text-center text-pd-ink-muted">
            No orders match.
          </div>
        )}
      </div>
    </div>
  );
}
