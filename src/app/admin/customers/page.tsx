"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  ordersCount: number;
  adopted: number;
  spent: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => {
        setCustomers(d.customers || []);
        setLoading(false);
      });
  }, []);

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
            Customers
          </div>
          <h1 className="font-fraunces text-2xl font-bold">
            {customers.length} trainers
          </h1>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-pd-ink/10 bg-white">
        <div className="grid grid-cols-[2fr_auto_auto_auto_auto] gap-3.5 border-b border-pd-ink/10 bg-[#f7f3e8] px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-pd-ink-muted">
          <div>Trainer</div>
          <div>Joined</div>
          <div>Orders</div>
          <div>Cards</div>
          <div>Spent</div>
        </div>
        {customers.map((c) => (
          <div
            key={c.id}
            className="grid grid-cols-[2fr_auto_auto_auto_auto] items-center gap-3.5 border-b border-pd-ink/5 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pd-primary text-sm font-extrabold text-pd-cream">
                {c.name[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold">{c.name}</div>
                <div className="truncate text-xs text-pd-ink-muted">
                  {c.email}
                </div>
              </div>
            </div>
            <div className="text-[13px] text-pd-ink-soft">
              {formatDate(c.createdAt)}
            </div>
            <div className="text-sm font-semibold tabular-nums">
              {c.ordersCount}
            </div>
            <div className="text-sm font-semibold tabular-nums">
              {c.adopted}
            </div>
            <div className="text-sm font-bold tabular-nums">
              ${c.spent.toFixed(2)}
            </div>
          </div>
        ))}
        {customers.length === 0 && (
          <div className="py-10 text-center text-pd-ink-muted">
            No trainers signed up yet.
          </div>
        )}
      </div>
    </div>
  );
}
