import Pagination from "@/components/pagination";
import Sidebar from "@/components/sidebar";
import { deleteProduct } from "@/lib/actions/products";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const user = await getCurrentUser();
  const userId = user.id;

  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const page = Math.max(1, Number(params.page ?? 1));
  const pageSize = 5;

  const where = {
    userId,
    ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
  };

  const [totalCount, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // ---- UI-only styles for the status pill ----
  const stockStyles = [
    {
      label: "Out of stock",
      pill: "bg-[#D6453D]/10 text-[#B3342D]",
      dot: "bg-[#D6453D]",
      qty: "text-[#B3342D]",
    },
    {
      label: "Low stock",
      pill: "bg-[#F5B83D]/20 text-[#8A5A00]",
      dot: "bg-[#F5B83D]",
      qty: "text-[#B26B00]",
    },
    {
      label: "In stock",
      pill: "bg-[#5B3FD9]/10 text-[#4A31BD]",
      dot: "bg-[#5B3FD9]",
      qty: "text-[#1B1635]",
    },
  ];

  const headCell =
    "px-4 py-3 text-left text-xs font-medium text-[#1B1635]/50";

  return (
    <div className="min-h-screen bg-[#F6F5FA] text-[#1B1635] antialiased">
      <Sidebar currentPath="/inventory" />
      <main className="ml-64 p-8 lg:p-12">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Inventory</h1>
            <p className="mt-1.5 text-sm text-[#1B1635]/60">
              Manage your products and track inventory levels.
            </p>
          </div>
          <p className="rounded-full border border-[#1B1635]/10 bg-white px-4 py-2 text-sm text-[#1B1635]/65">
            {totalCount} {totalCount === 1 ? "product" : "products"}
            {q ? ` matching "${q}"` : ""}
          </p>
        </div>

        <div className="space-y-6">
          {/* Search */}
          <div className="rounded-3xl border border-[#1B1635]/10 bg-white p-4 shadow-sm shadow-[#1B1635]/[0.04]">
            <form className="flex flex-wrap gap-3" action="/inventory" method="GET">
              <div className="relative min-w-[220px] flex-1">
                <svg
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1B1635]/40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Search products by name"
                  aria-label="Search products"
                  className="w-full rounded-xl border border-[#1B1635]/15 bg-[#F6F5FA]/60 py-3 pl-11 pr-4 text-sm placeholder:text-[#1B1635]/40 focus:border-[#5B3FD9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#5B3FD9]/15"
                />
              </div>
              <button className="rounded-xl bg-[#5B3FD9] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#5B3FD9]/25 transition-colors hover:bg-[#4A31BD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD9]">
                Search
              </button>
              {q && (
                <Link
                  href="/inventory"
                  className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-[#1B1635]/65 transition-colors hover:bg-[#1B1635]/5 hover:text-[#1B1635] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD9]"
                >
                  Clear
                </Link>
              )}
            </form>
          </div>

          {/* Products Table */}
          <div className="overflow-hidden rounded-3xl border border-[#1B1635]/10 bg-white shadow-sm shadow-[#1B1635]/[0.04]">
            {items.length === 0 ? (
              <div className="px-6 py-20 text-center">
                <p className="text-base font-semibold">
                  {q ? "No products match your search" : "No products yet"}
                </p>
                <p className="mt-1.5 text-sm text-[#1B1635]/55">
                  {q
                    ? "Try a different name or clear the search."
                    : "Add your first product to start tracking stock."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead className="border-b border-[#1B1635]/10 bg-[#F6F5FA]/70">
                    <tr>
                      <th className={`${headCell} pl-7`}>Product</th>
                      <th className={headCell}>Price</th>
                      <th className={headCell}>Quantity</th>
                      <th className={headCell}>Status</th>
                      <th className={headCell}>Low stock at</th>
                      <th className={`${headCell} pr-7 text-right`}>Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#1B1635]/[0.07]">
                    {items.map((product, key) => {
                      const stockLevel =
                        product.quantity === 0
                          ? 0
                          : product.quantity <= (product.lowStockAt || 5)
                          ? 1
                          : 2;
                      const style = stockStyles[stockLevel];

                      return (
                        <tr
                          key={key}
                          className="transition-colors hover:bg-[#F6F5FA]/60"
                        >
                          <td className="py-4 pl-7 pr-4">
                            <p className="text-sm font-medium">{product.name}</p>
                            <p className="mt-0.5 text-xs text-[#1B1635]/45">
                              {product.sku || "No SKU"}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-sm tabular-nums">
                            ${Number(product.price).toFixed(2)}
                          </td>
                          <td
                            className={`px-4 py-4 text-sm font-semibold tabular-nums ${style.qty}`}
                          >
                            {product.quantity}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${style.pill}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                                aria-hidden="true"
                              />
                              {style.label}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm tabular-nums text-[#1B1635]/60">
                            {product.lowStockAt || "-"}
                          </td>
                          <td className="py-4 pl-4 pr-7 text-right">
                            <form
                              action={async (formData: FormData) => {
                                "use server";
                                await deleteProduct(formData);
                              }}
                            >
                              <input
                                type="hidden"
                                name="id"
                                value={product.id}
                              />
                              <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[#B3342D] transition-colors hover:bg-[#D6453D]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6453D]">
                                <svg
                                  viewBox="0 0 24 24"
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5" />
                                </svg>
                                Delete
                              </button>
                            </form>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="rounded-3xl border border-[#1B1635]/10 bg-white p-5 shadow-sm shadow-[#1B1635]/[0.04]">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl="/inventory"
                searchParams={{
                  q,
                  pageSize: String(pageSize),
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}