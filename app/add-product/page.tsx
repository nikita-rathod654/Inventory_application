import ProductForm from "@/components/product-form";
import Sidebar from "@/components/sidebar";
import { createProduct } from "@/lib/actions/products";
import { getCurrentUser } from "@/lib/auth";

export default async function AddProductPage() {
  await getCurrentUser();

  return (
    <div className="min-h-screen bg-[#F6F5FA] text-[#1B1635] antialiased">
      <Sidebar currentPath="/add-product" />

      <main className="px-4 pb-8 pt-20 sm:px-6 lg:ml-64 lg:p-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Add product
          </h1>
          <p className="mt-1.5 text-sm text-[#1B1635]/60">
            Add a new product to your inventory.
          </p>
        </div>

        <div className="grid items-start gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1.6fr)_1fr]">
          {/* Form card */}
          <div className="min-w-0 rounded-2xl border border-[#1B1635]/10 bg-white p-5 shadow-sm shadow-[#1B1635]/[0.04] sm:rounded-3xl sm:p-8">
            <ProductForm action={createProduct} submitLabel="Add product" />
          </div>

          {/* Side note */}
          <aside className="relative min-w-0 overflow-hidden rounded-2xl bg-[#1B1635] p-5 text-white sm:rounded-3xl sm:p-8">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#5B3FD9]/40 blur-3xl"
            />
            <div className="relative">
              <h2 className="text-lg font-semibold tracking-tight">
                How low stock works
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                When a product&apos;s quantity falls to its low stock level, it
                is flagged in amber on your dashboard and inventory list. If you
                leave the level blank, products are flagged at 5 units or fewer.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-4 sm:mt-8 sm:p-5">
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  <p className="text-sm font-medium">Sample product</p>
                  <span className="shrink-0 rounded-full bg-[#F5B83D]/20 px-3 py-1 text-xs font-medium text-[#F5B83D]">
                    Low stock
                  </span>
                </div>
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[12%] rounded-full bg-[#F5B83D]" />
                </div>
                <p className="mt-3 text-xs text-white/50">
                  9 units left, flagged at 10
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}