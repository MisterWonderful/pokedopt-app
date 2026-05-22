import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const [
    totalRevenue,
    totalCardsSold,
    totalDonations,
    totalOrders,
    totalUsers,
    totalCards,
  ] = await Promise.all([
    prisma.order
      .aggregate({
        where: { status: { not: "cancelled" } },
        _sum: { total: true },
      })
      .then((r) => r._sum.total || 0),
    prisma.orderItem
      .aggregate({
        where: { order: { status: { not: "cancelled" } } },
        _sum: { qty: true },
      })
      .then((r) => r._sum.qty || 0),
    prisma.order
      .aggregate({
        where: { status: { not: "cancelled" } },
        _sum: { donation: true },
      })
      .then((r) => r._sum.donation || 0),
    prisma.order.count(),
    prisma.user.count({ where: { role: "customer" } }),
    prisma.card.count(),
  ]);

  // Last 14 days revenue
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: { date: Date; revenue: number; orders: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({ date: d, revenue: 0, orders: 0 });
  }

  const recentOrders = await prisma.order.findMany({
    where: {
      placedAt: {
        gte: days[0].date,
      },
      status: { not: "cancelled" },
    },
  });

  recentOrders.forEach((o) => {
    const od = new Date(o.placedAt);
    od.setHours(0, 0, 0, 0);
    const day = days.find((d) => d.date.getTime() === od.getTime());
    if (day) {
      day.revenue += Number(o.total);
      day.orders += 1;
    }
  });

  // Top sellers
  const topSellers = await prisma.orderItem.groupBy({
    by: ["cardId"],
    where: { order: { status: { not: "cancelled" } } },
    _sum: { qty: true },
    orderBy: { _sum: { qty: "desc" } },
    take: 5,
  });

  const topSellerCards = await Promise.all(
    topSellers.map(async (s) => {
      const card = await prisma.card.findUnique({ where: { id: s.cardId } });
      return {
        card,
        qty: s._sum.qty || 0,
        revenue: (s._sum.qty || 0) * Number(card?.price || 0),
      };
    })
  );

  // Type distribution
  const allOrderItems = await prisma.orderItem.findMany({
    where: { order: { status: { not: "cancelled" } } },
    include: { card: true },
  });

  const typeSales: Record<string, number> = {};
  allOrderItems.forEach((item) => {
    item.card.types.forEach((t) => {
      typeSales[t] = (typeSales[t] || 0) + item.qty;
    });
  });

  return NextResponse.json({
    stats: {
      totalRevenue,
      totalCardsSold,
      totalDonations,
      totalOrders,
      totalUsers,
      totalCards,
    },
    days,
    topSellers: topSellerCards,
    typeSales,
  });
}
