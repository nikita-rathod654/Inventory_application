import ActionForm from "@/components/action-form";
import PageShell from "@/components/page-shell";
import { deleteSupplier } from "@/lib/actions/suppliers";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { card, dangerBtn, headCell, primaryBtn, secondaryBtn } from "@/lib/ui";
import Link from "next/link";

export default async function SuppliersPage() {
  const user = await getCurrentUser();

  const suppliers = await prisma.supplier.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <PageShell
      currentPath="/suppliers"
      title="Suppliers"
      description="The companies you buy stock from."
      actions={
        <>
          <Link href="/suppliers/import" className={secondaryBtn}>
            Import CSV
          </Link>
          <Link href="/suppliers/new" className={primaryBtn}>
            Add supplier
          </Link>
        </>
      }
    >
      <div className={`${card} overflow-hidden`}>
        {suppliers.length === 0 ? (
          <div className="px-6 py-14 text-center sm:py-20">
            <p className="text-base font-semibold">No suppliers yet</p>
            <p className="mt-1.5 text-sm text-[#1B1635]/55">
              Add a supplier before creating a purchase order.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#1B1635]/10 bg-[#F6F5FA]/70">
                <tr>
                  <th className={`${headCell} pl-5`}>Supplier</th>
                  <th className={headCell}>Contact</th>
                  <th className={headCell}>Orders</th>
                  <th className={`${headCell} pr-5 text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1B1635]/[0.07]">
                {suppliers.map((s) => (
                  <tr key={s.id}>
                    <td className="py-4 pl-5 pr-4 text-sm font-medium">{s.name}</td>
                    <td className="px-4 py-4 text-sm text-[#1B1635]/60">
                      {s.email || s.phone || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm tabular-nums">{s._count.orders}</td>
                    <td className="py-4 pl-4 pr-5 text-right">
                      {s._count.orders === 0 ? (
                        <ActionForm action={deleteSupplier} success="Supplier deleted">
                          <input type="hidden" name="id" value={s.id} />
                          <button className={dangerBtn}>Delete</button>
                        </ActionForm>
                      ) : (
                        <span className="text-xs text-[#1B1635]/40">Has orders</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageShell>
  );
}