import Link from "next/link";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";

const steps = [
  {
    title: "Add your products",
    text: "Enter each item with its name, SKU, price and starting quantity. It takes a minute per product.",
  },
  {
    title: "Set reorder levels",
    text: "Choose the quantity at which an item counts as low, so the warning shows up before the shelf is empty.",
  },
  {
    title: "Keep counts up to date",
    text: "Update quantities as stock arrives or sells and let the dashboard do the adding up.",
  },
];

// UI-only sample rows for the preview panel (not real data)
const previewRows = [
  { name: "Oak shelf bracket", sku: "OSB-210", qty: 148, max: 200, low: false },
  { name: "Canvas tote, natural", sku: "CTN-044", qty: 62, max: 120, low: false },
  { name: "Ceramic mug, 350 ml", sku: "CRM-350", qty: 9, max: 80, low: true },
  { name: "Steel water bottle", sku: "SWB-118", qty: 91, max: 100, low: false },
];

// UI-only sample activity (not real data)
const movements = [
  { label: "Oak shelf bracket", note: "Received", change: "+120", time: "Today, 10:42" },
  { label: "Canvas tote, natural", note: "Sold", change: "-3", time: "Today, 09:15" },
  { label: "Steel water bottle", note: "Sold", change: "-8", time: "Yesterday" },
  { label: "Ceramic mug, 350 ml", note: "Sold", change: "-12", time: "Yesterday" },
];

const features = [
  {
    title: "Products",
    text: "Add items once and keep names, SKUs, prices and categories in one tidy list.",
  },
  {
    title: "Stock levels",
    text: "See what is on hand at a glance and get a clear flag when an item runs low.",
  },
  {
    title: "Insights",
    text: "Spot your best sellers and slow movers so you reorder with confidence.",
  },
];

export default async function Home() {
  const user = await stackServerApp.getUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#F6F5FA] text-[#1B1635] antialiased">
      {/* Top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B1635]">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
              <path d="M3 8l9 5 9-5M12 13v8" />
            </svg>
          </span>
          <span className="text-base font-semibold tracking-tight">
            Inventory Management
          </span>
        </div>
       
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-10 lg:grid-cols-[1.05fr_1fr] lg:pt-16">
          <div>
            <h1 className="max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Know what is on your shelves before you run out.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#1B1635]/65">
              Track products, watch stock levels and see what needs reordering,
              all from one calm, easy-to-use workspace.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/sign-in"
                className="rounded-xl bg-[#5B3FD9] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#5B3FD9]/25 transition-colors hover:bg-[#4A31BD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD9]"
              >
                Sign in
              </Link>
              <Link
                href="#features"
                className="rounded-xl border border-[#1B1635]/15 bg-white px-7 py-3.5 text-sm font-semibold text-[#1B1635] transition-colors hover:border-[#1B1635]/30 hover:bg-[#1B1635]/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD9]"
              >
                Learn more
              </Link>
            </div>
          </div>

          {/* Stock preview */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-[#5B3FD9]/10 to-[#F5B83D]/10 blur-2xl"
            />
            <div className="overflow-hidden rounded-2xl border border-[#1B1635]/10 bg-white shadow-xl shadow-[#1B1635]/10">
              <div className="flex items-center justify-between border-b border-[#1B1635]/10 px-6 py-4">
                <div>
                  <p className="text-sm font-semibold">Stock overview</p>
                  <p className="text-xs text-[#1B1635]/50">Sample products</p>
                </div>
                <span className="rounded-full bg-[#F5B83D]/20 px-3 py-1 text-xs font-medium text-[#8A5A00]">
                  1 item low
                </span>
              </div>

              <ul className="divide-y divide-[#1B1635]/[0.07]">
                {previewRows.map((row) => (
                  <li key={row.sku} className="px-6 py-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {row.name}
                        </p>
                        <p className="text-xs text-[#1B1635]/45">{row.sku}</p>
                      </div>
                      <p
                        className={`text-sm font-semibold tabular-nums ${
                          row.low ? "text-[#B26B00]" : "text-[#1B1635]"
                        }`}
                      >
                        {row.qty}
                        <span className="font-normal text-[#1B1635]/40">
                          {" "}
                          in stock
                        </span>
                      </p>
                    </div>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#1B1635]/[0.07]">
                      <div
                        className={`h-full rounded-full ${
                          row.low ? "bg-[#F5B83D]" : "bg-[#5B3FD9]"
                        }`}
                        style={{ width: `${(row.qty / row.max) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="scroll-mt-4 border-t border-[#1B1635]/10 bg-white"
        >
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="max-w-md text-2xl font-semibold tracking-tight sm:text-3xl">
              Everything you need to keep stock under control.
            </h2>
            <dl className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-[#1B1635]/10">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="sm:px-8 sm:first:pl-0 sm:last:pr-0"
                >
                  <dt className="text-base font-semibold">{f.title}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-[#1B1635]/65">
                    {f.text}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Steps (a real sequence, so numbered) */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="max-w-md text-2xl font-semibold tracking-tight sm:text-3xl">
            Up and running in three steps.
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#5B3FD9]/30 bg-[#5B3FD9]/[0.07] text-sm font-semibold text-[#5B3FD9]">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1B1635]/65">
                  {s.text}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Detail: low stock */}
        <section className="border-y border-[#1B1635]/10 bg-white">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
            <div>
              <h2 className="max-w-md text-2xl font-semibold tracking-tight sm:text-3xl">
                See low stock while there is still time to act.
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-[#1B1635]/65">
                Each product has its own reorder level. When the count drops
                below it, the item is flagged in amber so it stands out from
                everything that is fine.
              </p>
            </div>

            <div className="rounded-2xl border border-[#1B1635]/10 bg-[#F6F5FA] p-6 shadow-xl shadow-[#1B1635]/[0.06]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Ceramic mug, 350 ml</p>
                  <p className="text-xs text-[#1B1635]/45">CRM-350</p>
                </div>
                <span className="rounded-full bg-[#F5B83D]/20 px-3 py-1 text-xs font-medium text-[#8A5A00]">
                  Low stock
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs text-[#1B1635]/50">On hand</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums text-[#B26B00]">
                    9
                  </p>
                </div>
                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs text-[#1B1635]/50">Reorder level</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">20</p>
                </div>
              </div>

              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[#1B1635]/[0.08]">
                <div className="h-full w-[11%] rounded-full bg-[#F5B83D]" />
              </div>
              <p className="mt-3 text-xs text-[#1B1635]/50">
                9 of 80 units remaining
              </p>
            </div>
          </div>
        </section>


        {/* Closing call to action */}
        <section className="px-6 pb-24 pm-80">
          <div className="mx-auto max-w-6xl rounded-3xl bg-[#1B1635] px-8 py-16 text-center sm:px-16">
            <h2 className="mx-auto max-w-xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Ready to see your own stock in one place?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/65">
              Sign in and add your first product today.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/sign-in"
                className="rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-[#1B1635] transition-colors hover:bg-[#F6F5FA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}