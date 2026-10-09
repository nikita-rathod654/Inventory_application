import { toCsv } from "@/lib/csv";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Optional ?q=... so the export matches the inventory search
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  const products = await prisma.product.findMany({
    where: {
      userId: user.id,
      ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
    },
    orderBy: { name: "asc" },
  });

  const csv = toCsv(
    ["name", "sku", "price", "quantity", "lowStockAt"],
    products.map((p) => [
      p.name,
      p.sku ?? "",
      Number(p.price).toFixed(2),
      p.quantity,
      p.lowStockAt ?? "",
    ])
  );

  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inventory-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}