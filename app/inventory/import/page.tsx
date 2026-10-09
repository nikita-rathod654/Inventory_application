import Link from "next/link";
import CsvImportForm from "@/components/csv-import-form";
import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";

const columns = [
  { name: "name", note: "Required. Up to 120 characters." },
  { name: "sku", note: "Optional. Must be unique." },
  { name: "price", note: "Required. A number like 24.50, without a currency symbol." },
  { name: "quantity", note: "Required. A whole number, 0 or more." },
  { name: "lowStockAt", note: "Optional. A whole number." },
];

export default async function ImportPage() {
  await getCurrentUser();

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

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Import products
          </h1>
          <p className="mt-1.5 text-sm text-[#1B1635]/60">
            Add many products at once from a CSV file.
          </p>
        </div>

        <div className="grid items-start gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1.6fr)_1fr]">
          <section className="min-w-0 rounded-2xl border border-[#1B1635]/10 bg-white p-5 shadow-sm shadow-[#1B1635]/[0.04] sm:rounded-3xl sm:p-8">
            <CsvImportForm />
          </section>

          <aside className="relative min-w-0 overflow-hidden rounded-2xl bg-[#1B1635] p-5 text-white sm:rounded-3xl sm:p-8">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#5B3FD9]/40 blur-3xl"
            />
            <div className="relative">
              <h2 className="text-lg font-semibold tracking-tight">
                CSV format
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                The first row holds the column names. Columns can be in any
                order.
              </p>

              <dl className="mt-5 space-y-3">
                {columns.map((c) => (
                  <div
                    key={c.name}
                    className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3"
                  >
                    <dt className="font-mono text-sm font-medium">{c.name}</dt>
                    <dd className="mt-0.5 text-xs text-white/55">{c.note}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-5 text-xs leading-relaxed text-white/55">
                If any row has a problem, nothing is imported, so you never end
                up with half a file. Products with a quantity above 0 also get
                an &quot;Initial stock&quot; entry in their stock history.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}