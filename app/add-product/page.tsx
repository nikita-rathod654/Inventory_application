import Sidebar from "@/components/sidebar";
import { createProduct } from "@/lib/actions/products";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function AddProductPage() {
  const user = await getCurrentUser();

  // ---- UI-only class strings ----
  const labelClass = "mb-2 block text-sm font-medium text-[#1B1635]";
  const inputClass =
    "w-full rounded-xl border border-[#1B1635]/15 bg-[#F6F5FA]/60 px-4 py-3 text-sm placeholder:text-[#1B1635]/35 transition-colors focus:border-[#5B3FD9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#5B3FD9]/15";
  const hintClass = "mt-2 text-xs text-[#1B1635]/50";
  const required = (
    <span className="text-[#5B3FD9]" aria-hidden="true">
      {" "}
      *
    </span>
  );

  return (
    <div className="min-h-screen bg-[#F6F5FA] text-[#1B1635] antialiased">
      <Sidebar currentPath="/add-product" />

      <main className="ml-64 p-8 lg:p-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Add product</h1>
          <p className="mt-1.5 text-sm text-[#1B1635]/60">
            Add a new product to your inventory.
          </p>
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.6fr)_1fr]">
          {/* Form card */}
          <div className="rounded-3xl border border-[#1B1635]/10 bg-white p-8 shadow-sm shadow-[#1B1635]/[0.04]">
            <form className="space-y-10" action={createProduct}>
              {/* Basics */}
              <fieldset className="space-y-6">
                <legend className="mb-1 text-base font-semibold tracking-tight">
                  Product details
                </legend>

                <div>
                  <label htmlFor="name" className={labelClass}>
                    Product name{required}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className={inputClass}
                    placeholder="For example, Ceramic mug, 350 ml"
                  />
                </div>

                <div>
                  <label htmlFor="sku" className={labelClass}>
                    SKU{" "}
                    <span className="font-normal text-[#1B1635]/45">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    className={inputClass}
                    placeholder="For example, CRM-350"
                  />
                  <p className={hintClass}>
                    Your own code for this product, if you use one.
                  </p>
                </div>
              </fieldset>

              <div className="border-t border-[#1B1635]/10" />

              {/* Stock and price */}
              <fieldset className="space-y-6">
                <legend className="mb-1 text-base font-semibold tracking-tight">
                  Stock and price
                </legend>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="quantity" className={labelClass}>
                      Quantity{required}
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="0"
                      required
                      className={`${inputClass} tabular-nums`}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className={labelClass}>
                      Price{required}
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#1B1635]/45">
                        $
                      </span>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        step="0.01"
                        min="0"
                        required
                        className={`${inputClass} pl-8 tabular-nums`}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="lowStockAt" className={labelClass}>
                    Low stock at{" "}
                    <span className="font-normal text-[#1B1635]/45">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="number"
                    id="lowStockAt"
                    name="lowStockAt"
                    min="0"
                    className={`${inputClass} tabular-nums`}
                    placeholder="For example, 10"
                  />
                  <p className={hintClass}>
                    The quantity at which this product is flagged as low.
                  </p>
                </div>
              </fieldset>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 border-t border-[#1B1635]/10 pt-8">
                <button
                  type="submit"
                  className="rounded-xl bg-[#5B3FD9] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#5B3FD9]/25 transition-colors hover:bg-[#4A31BD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD9]"
                >
                  Add product
                </button>
                <Link
                  href="/inventory"
                  className="rounded-xl border border-[#1B1635]/15 bg-white px-7 py-3.5 text-sm font-semibold text-[#1B1635] transition-colors hover:border-[#1B1635]/30 hover:bg-[#1B1635]/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD9]"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* Side note */}
          <aside className="relative overflow-hidden rounded-3xl bg-[#1B1635] p-8 text-white">
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

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium">Sample product</p>
                  <span className="rounded-full bg-[#F5B83D]/20 px-3 py-1 text-xs font-medium text-[#F5B83D]">
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