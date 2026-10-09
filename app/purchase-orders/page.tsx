import Pagination from "@/components/pagination";
import PageShell from "@/components/page-shell";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  PO_STATUSES,
  STATUS_LABELS,
  STATUS_STYLES,
  formatPoNumber,
} from "@/lib/purchase-order-status";
import { card, headCell, primaryBtn } from "@/lib/ui";
import type { PurchaseOrderStatus } from "@prisma/client";
import Link from "next/link";

export default async function PurchaseOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const user = await getCurrentUser();

  const params = await searchParams;
  const status = PO_STATUSES.find((s) => s === params.status) as
    | PurchaseOrderStatus
    | undefined;
  const page = Math.max(1, Number(params.page ?? 1));
  const pageSize = 8;

  const where = { userId: user.id, ...(status ? { status } : {}) };

  const [totalCount, orders] = await Promise.all([
    prisma.purchaseOrder.count({ where }),
    prisma.purchaseOrder.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        supplier: { select: { name: true } },
        items: { select: { quantity: true, unitCost: true } },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const tab = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
      active
        ? "bg-[#1B1635] text-white"
        : "border border-[#1B1635]/15 bg-white text-[#1B1635]/70 hover:bg-[#1B1635]/[0.04]"
    }`;

  return (
    <PageShell
      currentPath="/purchase-orders"
      title="Purchase orders"
      description="Order stock from suppliers and receive it into inventory."
      actions={
        <Link href="/purchase-orders/new" className={primaryBtn}>
          New order
        </Link>
      }
    >
      <div className="flex flex-wrap gap-2">
        <Link href="/purchase-orders" className={tab(!status)}>All</Link>
        {PO_STATUSES.map((s) => (
          <Link key={s} href={`/purchase-orders?status=${s}`} className={tab(status === s)}>
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className={`${card} overflow-hidden`}>
        {orders.length === 0 ? (
          <div className="px-6 py-14 text-center sm:py-20">
            <p className="text-base font-semibold">No purchase orders</p>
            <p className="mt-1.5 text-sm text-[#1B1635]/55">
              Create an order to restock from a supplier.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#1B1635]/10 bg-[#F6F5FA]/70">
                <tr>
                  <th className={`${headCell} pl-5`}>Order</th>
                  <th className={headCell}>Supplier</th>
                  <th className={headCell}>Status</th>
                  <th className={headCell}>Lines</th>
                  <th className={`${headCell} pr-5 text-right`}>Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B1635]/[0.07]">
                {orders.map((o) => {
                  const total = o.items.reduce(
                    (sum, i) => sum + i.quantity * Number(i.unitCost),
                    0
                  );
                  return (
                    <tr key={o.id} className="hover:bg-[#F6F5FA]/60">
                      <td className="py-4 pl-5 pr-4 text-sm font-medium">
                        <Link
                          href={`/purchase-orders/${o.id}`}
                          className="text-[#5B3FD9] hover:underline"
                        >
                          {formatPoNumber(o.number)}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-sm">{o.supplier.name}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[o.status]}`}
                        >
                          {STATUS_LABELS[o.status]}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm tabular-nums">{o.items.length}</td>
                      <td className="py-4 pl-4 pr-5 text-right text-sm tabular-nums">
                        ${total.toFixed(2)}
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
        <div className={`${card} p-4 sm:p-5`}>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/purchase-orders"
            searchParams={{ status: status ?? "", pageSize: String(pageSize) }}
          />
        </div>
      )}
    </PageShell>
  );
}