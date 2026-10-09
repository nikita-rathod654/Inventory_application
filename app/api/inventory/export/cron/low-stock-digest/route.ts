import { sendLowStockDigest } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { getLowStockThreshold } from "@/lib/stock-alerts";
import { stackServerApp } from "@/stack/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: Request) {
  // Vercel Cron sends "Authorization: Bearer <CRON_SECRET>" automatically.
  // In production anything else is rejected. Locally you can open the URL.
  if (process.env.NODE_ENV === "production") {
    const secret = process.env.CRON_SECRET;
    if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  // The per-product level can't be compared in a simple filter, so fetch every
  // product that could be low (quantity <= 5, or a custom level above 5)
  // and apply the exact rule in code.
  const candidates = await prisma.product.findMany({
    where: { OR: [{ quantity: { lte: 5 } }, { lowStockAt: { gt: 5 } }] },
    select: {
      id: true,
      userId: true,
      name: true,
      sku: true,
      quantity: true,
      lowStockAt: true,
    },
    orderBy: [{ userId: "asc" }, { quantity: "asc" }, { name: "asc" }],
  });

  const low = candidates.filter(
    (p) => p.quantity <= getLowStockThreshold(p.lowStockAt)
  );

  const byUser = new Map<string, typeof low>();
  for (const product of low) {
    const list = byUser.get(product.userId) ?? [];
    list.push(product);
    byUser.set(product.userId, list);
  }

  let emailed = 0;
  let skipped = 0;

  for (const [userId, products] of byUser) {
    const user = await stackServerApp.getUser(userId);
    const to = user?.primaryEmail;

    if (!to) {
      skipped++;
      continue;
    }

    const sent = await sendLowStockDigest({
      to,
      items: products.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        quantity: p.quantity,
        threshold: getLowStockThreshold(p.lowStockAt),
      })),
    });

    if (sent) emailed++;
    else skipped++;

    // Resend's default limit is 2 requests per second
    await sleep(600);
  }

  return Response.json({ users: byUser.size, emailed, skipped });
}