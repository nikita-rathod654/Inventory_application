import PageShell from "@/components/page-shell";
import {
  cancelOrder,
  deleteDraftOrder,
  markOrdered,
  receiveOrder,
} from "@/lib/actions/purchase-orders";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  STATUS_LABELS,
  STATUS_STYLES,
  TRANSITIONS,
  formatPoNumber,
} from "@/lib/purchase-order-status";
import { card, dangerBtn, headCell, primaryBtn, secondaryBtn } from "@/lib/ui";
import Link from "next/link";
import { notFound } from "next/navigation";

const fmtDate = (d: Date | null) =>
  d
    ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "-";

export default async function PurchaseOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  const { id } = await params;

  const order = await prisma.purchaseOrder.findFirst({
    where: { id, userId: user.id }, // ownership check
    include: {
      supplier: { select: { name: true, email: true, phone: true } },
      items: {
        include: { product: { select: { id: true, name: true, sku: true } } },
        orderBy: { id: "asc" },
      },
    },
  });
  if (!order) notFound();

  const next = TRANSITIONS[order.status];
  const total = order.items.reduce((s, i) => s + i.quantity * Number(i.unitCost), 0);
  const units = order.items.reduce((s, i) => s + i.quantity, 0);

  const hidden = <input type="hidden" name="id" value={order.id} />;

  return (
    <PageShell
      currentPath="/purchase-orders"
      title={formatPoNumber(order.number)}
      description={`Supplier: ${order.supplier.name}`}
      actions={
        <>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm ${STATUS_STYLES[order.status]}`}
          >
            {STATUS_LABELS[order.status]}
          </span>
          <Link href="/purchase-orders" className={secondaryBtn}>Back</Link>
        </>
      }
    >
      <div className={`${card} p-5 sm:p-6`}>
        <dl className="grid gap-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs text-[#1B1635]/50">Created</dt>
            <dd className="mt-0.5">{fmtDate(order.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-xs text-[#1B1635]/50">Ordered</dt>
            <dd className="mt-0.5">{fmtDate(order.orderedAt)}</dd>
          </div>
          <div>
            <dt className="text-xs text-[#1B1635]/50">Expected</dt>
            <dd className="mt-0.5">{fmtDate(order.expectedAt)}</dd>
          </div>
          <div>
            <dt className="text-xs text-[#1B1635]/50">
              {order.status === "CANCELLED" ? "Cancelled" : "Received"}
            </dt>
            <dd className="mt-0.5">
              {fmtDate(order.status === "CANCELLED" ? order.cancelledAt : order.receivedAt)}
            </dd>
          </div>
        </dl>
        {order.notes && (
          <p className="mt-4 border-t border-[#1B1635]/10 pt-4 text-sm text-[#1B1635]/70">
            {order.notes}
          </p>
        )}
      </div>

      <div className={`${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#1B1635]/10 bg-[#F6F5FA]/70">
              <tr>
                <th className={`${headCell} pl-5`}>Product</th>
                <th className={headCell}>Quantity</th>
                <th className={headCell}>Unit cost</th>
                <th className={`${headCell} pr-5 text-right`}>Line total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B1635]/[0.07]">
              {order.items.map((i) => (
                <tr key={i.id}>
                  <td className="py-4 pl-5 pr-4">
                    <Link
                      href={`/inventory/${i.product.id}`}
                      className="text-sm font-medium hover:text-[#5B3FD9]"
                    >
                      {i.product.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-[#1B1635]/45">
                      {i.product.sku || "No SKU"}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm tabular-nums">{i.quantity}</td>
                  <td className="px-4 py-4 text-sm tabular-nums">
                    ${Number(i.unitCost).toFixed(2)}
                  </td>
                  <td className="py-4 pl-4 pr-5 text-right text-sm tabular-nums">
                    ${(i.quantity * Number(i.unitCost)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[#1B1635]/10 bg-[#F6F5FA]/70 px-5 py-4 text-sm">
          <span className="text-[#1B1635]/60">{units} units</span>
          <span className="font-semibold tabular-nums">Total ${total.toFixed(2)}</span>
        </div>
      </div>

      {(next.length > 0 || order.status === "DRAFT") && (
        <div className="flex flex-wrap gap-3">
          {next.includes("ORDERED") && (
            <form action={markOrdered}>
              {hidden}
              <button className={primaryBtn}>Mark as ordered</button>
            </form>
          )}
          {next.includes("RECEIVED") && (
            <form action={receiveOrder}>
              {hidden}
              <button className={primaryBtn}>Receive stock</button>
            </form>
          )}
          {next.includes("CANCELLED") && (
            <form action={cancelOrder}>
              {hidden}
              <button className={dangerBtn}>Cancel order</button>
            </form>
          )}
          {order.status === "DRAFT" && (
            <form action={deleteDraftOrder}>
              {hidden}
              <button className={dangerBtn}>Delete draft</button>
            </form>
          )}
        </div>
      )}
    </PageShell>
  );
}