import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { certFor } from "@/lib/utils";

function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }

  const query = norm(q);
  const allCards = await prisma.card.findMany({ where: { isActive: true } });

  // Search by cert number or name
  const results = allCards
    .map((card) => {
      const cert = norm(certFor(card));
      const full = norm(card.fullName);
      const name = norm(card.name);
      const mid = norm(card.middle);
      const last = norm(card.last);

      let score = 0;
      let kind = "name";

      if (cert === query) {
        score = 100;
        kind = "cert";
      } else if (cert.includes(query)) {
        score = 70;
        kind = "cert";
      } else if (full === query) {
        score = 95;
      } else if (name === query) {
        score = 80;
      } else if (mid === query || last === query) {
        score = 75;
      } else if (full.includes(query)) {
        score = 60;
      } else if (name.includes(query) || mid.includes(query) || last.includes(query)) {
        score = 40;
      }

      return { card, score, kind };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  // For cert exact matches, include order info
  for (const r of results) {
    if (r.kind === "cert" && r.score >= 95) {
      const order = await prisma.order.findFirst({
        where: {
          orderItems: { some: { cardId: r.card.id } },
        },
        orderBy: { placedAt: "desc" },
      });
      (r as any).order = order;
    }
  }

  return NextResponse.json({ results });
}
