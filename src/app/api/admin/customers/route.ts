import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: { role: "customer" },
    orderBy: { createdAt: "desc" },
    include: {
      orders: {
        where: { status: { not: "cancelled" } },
        include: { orderItems: true },
      },
    },
  });

  const customers = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    createdAt: u.createdAt,
    ordersCount: u.orders.length,
    adopted: u.orders.reduce((s, o) => s + o.orderItems.reduce((n, i) => n + i.qty, 0), 0),
    spent: u.orders.reduce((s, o) => s + Number(o.total), 0),
  }));

  return NextResponse.json({ customers });
}
