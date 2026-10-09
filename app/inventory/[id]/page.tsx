import Link from "next/link";
import { notFound } from "next/navigation";
import LocalTime from "@/components/local-time";
import Sidebar from "@/components/sidebar";
import StockAdjustForm from "@/components/stock-adjust-form";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { REASON_LABELS } from "@/lib/validations/stocks";

export default async function ProductHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  const { id } = await params;

  // Scoped by userId so nobody can open another user's product
  const product = await prisma.product.findFirst({
    where: { id, userId: user.id },
  });
  if (!product) notFound();

  const movements = await prisma.stockMovement.findMany({
    where: { productId: id, userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const stockLevel =
    product.quantity === 0
      ? 0
      : product.quantity <= (product.lowStockAt || 5)
      ? 1
      : 2;

  const statusStyles = [
    { label: "Out of stock", pill: "bg-[#D6453D]/10 text-[#B3342D]" },
    { label: "Low stock", pill: "bg-[#F5B83D]/20 text-[#8A5A00]" },
    { label: "In stock", pill: "bg-[#5B3FD9]/10 text-[#4A31BD]" },
  ];
  const status = statusStyles[stockLevel];

  const cardClass =
    "min-w-0 rounded-2xl border border-[#1B1635]/10 bg-white shadow-sm shadow-[#1B1635]/[0.04] sm:rounded-3xl";

  return (
    <div className="min-h-screen bg-[#F6F5FA] text-[#1B1635] antialiased">
      <Sidebar currentPath="/inventory" />

      <main className="px-4 pb-8 pt-20 sm:px-6 lg:ml-64 lg:p-12">
        <Link
          href="/inventory"
          className="group mb-5 inline-flex items-center gap-2 rounded-full border border-[#1B1635]/10 bg-white px-4 py-2.5 text-sm font-medium text-[#1B1635]/70 shadow-sm transition-colors hover:border-[#1B1635]/20 hover:text-[#1B1635] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD9]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          Back to inventory
        </Link>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-1.5 text-sm text-[#1B1635]/60">
              {product.sku || "No SKU"} · ${Number(product.price).toFixed(2)}
            </p>
          </div>
          <span
            className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${status.pill}`}
          >
            {status.label}
          </span>
        </div>

        {/* Summary */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-4">
          <div className={`${cardClass} p-4 sm:p-6`}>
            <p className="text-xs text-[#1B1635]/50">On hand</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">
              {product.quantity}
            </p>
          </div>
          <div className={`${cardClass} p-4 sm:p-6`}>
            <p className="text-xs text-[#1B1635]/50">Low stock at</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">
              {product.lowStockAt ?? 5}
            </p>
          </div>
        </div>

        <div className="grid items-start gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1.6fr)_1fr]">
          {/* History */}
          <section className={`${cardClass} overflow-hidden`}>
            <div className="px-4 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-7">
              <h2 className="text-lg font-semibold tracking-tight">
                Stock history
              </h2>
              <p className="mt-0.5 text-sm text-[#1B1635]/50">
                Every change to this product&apos;s quantity
                {movements.length === 50 ? " (latest 50)" : ""}
              </p>
            </div>

            {movements.length === 0 ? (
              <p className="mx-4 mb-5 rounded-2xl bg-[#F6F5FA] px-4 py-10 text-center text-sm text-[#1B1635]/55 sm:mx-7 sm:mb-7">
                No stock changes recorded yet. Use the form to add the first one.
              </p>
            ) : (
              <ul className="divide-y divide-[#1B1635]/[0.07] border-t border-[#1B1635]/10">
                {movements.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-start justify-between gap-4 px-4 py-4 sm:px-7"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        {REASON_LABELS[m.reason]}
                      </p>
                      {m.note && (
                        <p className="mt-0.5 break-words text-xs text-[#1B1635]/60">
                          {m.note}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-[#1B1635]/45">
                        <LocalTime iso={m.createdAt.toISOString()} />
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className={`text-sm font-semibold tabular-nums ${
                          m.change > 0 ? "text-[#1F7A4D]" : "text-[#B3342D]"
                        }`}
                      >
                        {m.change > 0 ? "+" : ""}
                        {m.change}
                      </p>
                      <p className="mt-0.5 text-xs tabular-nums text-[#1B1635]/45">
                        Balance {m.quantityAfter}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Adjust form */}
          <section className={`${cardClass} p-5 sm:p-7`}>
            <h2 className="text-lg font-semibold tracking-tight">
              Adjust stock
            </h2>
            <p className="mb-5 mt-0.5 text-sm text-[#1B1635]/50">
              Record stock arriving, selling or being corrected.
            </p>
            <StockAdjustForm productId={product.id} />
          </section>
        </div>
      </main>
    </div>
  );
}