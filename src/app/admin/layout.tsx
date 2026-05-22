import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  CreditCard,
  Package,
  Users,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#f7f3e8]">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-pd-ink/10 bg-white lg:block">
        <div className="p-6">
          <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-pd-violet">
            Admin · Back office
          </div>
          <h1 className="font-fraunces text-2xl font-bold leading-tight">
            The shelter's clipboard.
          </h1>
        </div>

        <nav className="px-3">
          {[
            { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
            { href: "/admin/cards", icon: CreditCard, label: "Cards" },
            { href: "/admin/orders", icon: Package, label: "Orders" },
            { href: "/admin/customers", icon: Users, label: "Customers" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-pd-ink transition-colors hover:bg-pd-cream"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
