import PageShell from "@/components/page-shell";
import PurchaseOrderForm from "@/components/purchase-order-form";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { card, primaryBtn } from "@/lib/ui";
import Link from "next/link";

export default async function NewPurchaseOrderPage() {
  const user = await getCurrentUser();

  const [suppliers, products] = await Promise.all([
    prisma.supplier.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.product.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true, sku: true },
      take: 500,
    }),
  ]);

  return (
    <PageShell currentPath="/purchase-orders" title="New purchase order">
      {suppliers.length === 0 || products.length === 0 ? (
        <div className={`${card} max-w-2xl p-8 text-center`}>
          <p className="text-base font-semibold">
            {suppliers.length === 0 ? "Add a supplier first" : "Add a product first"}
          </p>
          <p className="mt-1.5 text-sm text-[#1B1635]/55">
            An order needs at least one supplier and one product.
          </p>
          <Link
            href={suppliers.length === 0 ? "/suppliers/new" : "/add-product"}
            className={`${primaryBtn} mt-5 inline-block`}
          >
            {suppliers.length === 0 ? "Add supplier" : "Add product"}
          </Link>
        </div>
      ) : (
        <PurchaseOrderForm suppliers={suppliers} products={products} />
      )}
    </PageShell>
  );
}