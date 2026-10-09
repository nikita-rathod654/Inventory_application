import type { Metadata } from "next";
import {
  BarChart3,
  BellRing,
  Check,
  FileSpreadsheet,
  Gauge,
  History,
  Package,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack/server";

export const metadata: Metadata = {
  title: "Inventory Management | Know what is on your shelves",
  description:
    "Track products, follow every stock change, import in bulk and get emailed the moment an item runs low.",
};

const features = [
  {
    icon: Package,
    title: "Products and SKUs",
    text: "Keep names, SKUs, prices and reorder levels in one tidy list you can search in seconds.",
  },
  {
    icon: Gauge,
    title: "Live stock levels",
    text: "See what is in stock, low or out at a glance, with clear colour flags on every product.",
  },
  {
    icon: History,
    title: "Stock history",
    text: "Every quantity change is recorded with its reason, who made it and when.",
  },
  {
    icon: FileSpreadsheet,
    title: "CSV import and export",
    text: "Add hundreds of products from a spreadsheet, or download your inventory in one click.",
  },
  {
    icon: BellRing,
    title: "Low stock alerts",
    text: "Get an email the moment an item crosses its reorder level, plus a daily summary.",
  },
  {
    icon: BarChart3,
    title: "Dashboard insights",
    text: "Total inventory value, products added per week and a stock status breakdown.",
  },
];

const alsoIncluded = [
  "Search and pagination",
  "Secure personal accounts",
  "Works on phone, tablet and desktop",
  "Clear form validation",
];

const steps = [
  {
    title: "Add or import your products",
    text: "Enter items one by one, or upload a CSV and add many at once. Every row is checked before anything is saved.",
  },
  {
    title: "Set reorder levels",
    text: "Choose the quantity at which an item counts as low, so the warning shows up before the shelf is empty.",
  },
  {
    title: "Record changes, let alerts do the rest",
    text: "Log restocks and sales with a reason. The dashboard adds it up and an email warns you when stock runs low.",
  },
];

// UI-only sample data (not real data)
const previewRows = [
  { name: "Oak shelf bracket", sku: "OSB-210", qty: 148, max: 200, low: false },
  { name: "Canvas tote, natural", sku: "CTN-044", qty: 62, max: 120, low: false },
  { name: "Ceramic mug, 350 ml", sku: "CRM-350", qty: 9, max: 80, low: true },
  { name: "Steel water bottle", sku: "SWB-118", qty: 91, max: 100, low: false },
];

const history = [
  { reason: "Sale", note: "Online order #1042", change: -3, balance: 9, when: "Today, 09:15" },
  { reason: "Sale", note: "", change: -17, balance: 12, when: "Yesterday" },
  { reason: "Damaged or lost", note: "Cracked in storage", change: -3, balance: 29, when: "Mon, 14:20" },
  { reason: "Initial stock", note: "", change: 80, balance: 80, when: "1 Oct" },
];

const visualCard =
  "min-w-0 overflow-hidden rounded-2xl border border-[#1B1635]/10 bg-white shadow-xl shadow-[#1B1635]/[0.06]";

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
        dark ? "bg-white" : "bg-[#1B1635]"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-4 w-4 ${dark ? "text-[#1B1635]" : "text-white"}`}
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
  );
}

function DetailSection({
  eyebrow,
  title,
  text,
  points,
  reverse = false,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  points: string[];
  reverse?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-14 lg:py-24">
      <div className={reverse ? "lg:order-2" : ""}>
        <p className="text-sm font-semibold text-[#5B3FD9]">{eyebrow}</p>
        <h2 className="mt-3 max-w-md text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        <p className="mt-5 max-w-md leading-relaxed text-[#1B1635]/65">{text}</p>
        <ul className="mt-6 space-y-3">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm text-[#1B1635]/80">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5B3FD9]/10 text-[#5B3FD9]">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div className={reverse ? "lg:order-1" : ""}>{children}</div>
    </div>
  );
}

export default async function Home() {
  const user = await stackServerApp.getUser();
  if (user) {
    redirect("/dashboard");
  }

  const signUpHref = stackServerApp.urls.signUp;

  return (
    <div className="min-h-dvh bg-[#F6F5FA] text-[#1B1635] antialiased">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-[#1B1635]/5 bg-[#F6F5FA]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="hidden text-base font-semibold tracking-tight min-[420px]:inline">
              Inventory Management
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
            <Link
              href="#features"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-[#1B1635]/65 transition-colors hover:text-[#1B1635] md:block"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-[#1B1635]/65 transition-colors hover:text-[#1B1635] md:block"
            >
              How it works
            </Link>
            <Link
              href="/sign-in"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#1B1635]/75 transition-colors hover:text-[#1B1635] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD9]"
            >
              Sign in
            </Link>
            <Link
              href={signUpHref}
              className="rounded-xl bg-[#5B3FD9] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#5B3FD9]/25 transition-colors hover:bg-[#4A31BD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD9]"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-8 sm:px-6 sm:pb-24 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-16">
          <div className="min-w-0">
            <h1 className="max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Know what is on your shelves before you run out.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#1B1635]/65">
              Track products, follow every stock change, import in bulk and get
              an email the moment something runs low, all from one calm,
              easy-to-use workspace.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
              <Link
                href={signUpHref}
                className="rounded-xl bg-[#5B3FD9] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#5B3FD9]/25 transition-colors hover:bg-[#4A31BD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD9]"
              >
                Get started
              </Link>
              <Link
                href="#features"
                className="rounded-xl border border-[#1B1635]/15 bg-white px-7 py-3.5 text-sm font-semibold text-[#1B1635] transition-colors hover:border-[#1B1635]/30 hover:bg-[#1B1635]/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD9]"
              >
                See features
              </Link>
            </div>
          </div>

          {/* Stock preview */}
          <div className="relative min-w-0">
            <div
              aria-hidden="true"
              className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-[#5B3FD9]/10 to-[#F5B83D]/10 blur-2xl"
            />
            <div className={visualCard}>
              <div className="flex items-center justify-between gap-3 border-b border-[#1B1635]/10 px-4 py-4 sm:px-6">
                <div>
                  <p className="text-sm font-semibold">Stock overview</p>
                  <p className="text-xs text-[#1B1635]/50">Sample products</p>
                </div>
                <span className="shrink-0 rounded-full bg-[#F5B83D]/20 px-3 py-1 text-xs font-medium text-[#8A5A00]">
                  1 item low
                </span>
              </div>

              <ul className="divide-y divide-[#1B1635]/[0.07]">
                {previewRows.map((row) => (
                  <li key={row.sku} className="px-4 py-4 sm:px-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{row.name}</p>
                        <p className="text-xs text-[#1B1635]/45">{row.sku}</p>
                      </div>
                      <p
                        className={`shrink-0 text-sm font-semibold tabular-nums ${
                          row.low ? "text-[#B26B00]" : "text-[#1B1635]"
                        }`}
                      >
                        {row.qty}
                        <span className="font-normal text-[#1B1635]/40"> in stock</span>
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
          className="scroll-mt-16 border-t border-[#1B1635]/10 bg-white"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="max-w-lg text-2xl font-semibold tracking-tight sm:text-3xl">
              Everything you need to keep stock under control.
            </h2>

            <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="rounded-2xl border border-[#1B1635]/10 bg-[#F6F5FA]/60 p-6"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5B3FD9]/10 text-[#5B3FD9]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-base font-semibold tracking-tight">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#1B1635]/65">
                      {f.text}
                    </p>
                  </div>
                );
              })}
            </div>

            <ul className="mt-8 flex flex-wrap gap-2.5">
              {alsoIncluded.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-[#1B1635]/10 bg-white px-4 py-2 text-xs font-medium text-[#1B1635]/65 sm:text-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Feature details */}
        <div className="divide-y divide-[#1B1635]/10">
          {/* Stock history */}
          <DetailSection
            eyebrow="Stock history"
            title="Know exactly why your numbers changed."
            text="Quantities are never just overwritten. Each restock, sale or correction becomes a record, so you can trace any count back to the moment it changed."
            points={[
              "Every change saved with a reason, a note and a time",
              "Running balance after each change",
              "Stock can never drop below zero",
            ]}
          >
            <div className={visualCard}>
              <div className="flex items-start justify-between gap-3 border-b border-[#1B1635]/10 px-4 py-4 sm:px-5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">Ceramic mug, 350 ml</p>
                  <p className="text-xs text-[#1B1635]/45">Stock history</p>
                </div>
                <span className="shrink-0 rounded-full bg-[#F5B83D]/20 px-3 py-1 text-xs font-medium text-[#8A5A00]">
                  9 on hand
                </span>
              </div>
              <ul className="divide-y divide-[#1B1635]/[0.07]">
                {history.map((h) => (
                  <li
                    key={`${h.reason}-${h.balance}`}
                    className="flex items-start justify-between gap-4 px-4 py-3.5 sm:px-5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{h.reason}</p>
                      {h.note && (
                        <p className="mt-0.5 truncate text-xs text-[#1B1635]/60">{h.note}</p>
                      )}
                      <p className="mt-1 text-xs text-[#1B1635]/45">{h.when}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className={`text-sm font-semibold tabular-nums ${
                          h.change > 0 ? "text-[#1F7A4D]" : "text-[#B3342D]"
                        }`}
                      >
                        {h.change > 0 ? "+" : ""}
                        {h.change}
                      </p>
                      <p className="mt-0.5 text-xs tabular-nums text-[#1B1635]/45">
                        Balance {h.balance}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </DetailSection>

          {/* CSV */}
          <DetailSection
            reverse
            eyebrow="CSV import and export"
            title="Move your whole catalogue in minutes."
            text="Upload a spreadsheet to add many products at once. Problems are reported by row number, and nothing is saved until the whole file is clean."
            points={[
              "Every row checked, with clear row-by-row errors",
              "All or nothing, so you never get half an import",
              "Export your inventory to a file Excel can open",
            ]}
          >
            <div className={`${visualCard} p-4 sm:p-5`}>
              <div className="flex items-center gap-3 rounded-xl bg-[#F6F5FA] px-4 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#5B3FD9]/10 text-[#5B3FD9]">
                  <FileSpreadsheet className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">products.csv</p>
                  <p className="text-xs text-[#1B1635]/50">6 rows</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-[#D6453D]/25 bg-[#D6453D]/[0.06] p-4">
                <p className="text-sm font-semibold text-[#B3342D]">
                  Nothing was imported. 2 rows need fixing.
                </p>
                <ul className="mt-3 space-y-2">
                  <li className="rounded-lg bg-white p-3 text-xs shadow-sm shadow-[#1B1635]/[0.04]">
                    <p className="text-sm font-semibold text-[#1B1635]">Row 3</p>
                    <p className="mt-0.5 text-[#B3342D]">name: Name is required</p>
                  </li>
                  <li className="rounded-lg bg-white p-3 text-xs shadow-sm shadow-[#1B1635]/[0.04]">
                    <p className="text-sm font-semibold text-[#1B1635]">Row 4</p>
                    <p className="mt-0.5 text-[#B3342D]">price: Price can&apos;t be negative</p>
                  </li>
                </ul>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#1B1635]/15 px-4 py-2 text-xs font-medium">
                  Import CSV
                </span>
                <span className="rounded-full bg-[#5B3FD9] px-4 py-2 text-xs font-medium text-white">
                  Export CSV
                </span>
              </div>
            </div>
          </DetailSection>

          {/* Alerts */}
          <DetailSection
            eyebrow="Low stock alerts"
            title="Hear about low stock while there is still time to act."
            text="Each product has its own reorder level. The moment the count drops to it, you get an email. No more checking the shelves just in case."
            points={[
              "One email when an item crosses its level, no repeats",
              "A second alert if it runs out completely",
              "A daily summary of everything that needs attention",
            ]}
          >
            <div className={visualCard}>
              <div className="border-b border-[#1B1635]/10 px-4 py-4 sm:px-6">
                <p className="text-xs text-[#1B1635]/45">From: Inventory App</p>
                <p className="mt-1 text-sm font-semibold">
                  Low stock: Ceramic mug, 350 ml (9 left)
                </p>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <p className="text-sm leading-relaxed text-[#1B1635]/80">
                  <strong>Ceramic mug, 350 ml</strong> is down to{" "}
                  <strong>9</strong> units, which is at or below its low stock
                  level of 20.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#F6F5FA] p-4">
                    <p className="text-xs text-[#1B1635]/50">On hand</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums text-[#B26B00]">9</p>
                  </div>
                  <div className="rounded-xl bg-[#F6F5FA] p-4">
                    <p className="text-xs text-[#1B1635]/50">Reorder level</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums">20</p>
                  </div>
                </div>
                <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[#1B1635]/[0.08]">
                  <div className="h-full w-[11%] rounded-full bg-[#F5B83D]" />
                </div>
                <span className="mt-6 inline-block rounded-xl bg-[#5B3FD9] px-5 py-3 text-sm font-semibold text-white">
                  View product
                </span>
              </div>
            </div>
          </DetailSection>
        </div>

        {/* Steps */}
        <section
          id="how-it-works"
          className="scroll-mt-16 border-y border-[#1B1635]/10 bg-white"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <h2 className="max-w-md text-2xl font-semibold tracking-tight sm:text-3xl">
              Up and running in three steps.
            </h2>
            <ol className="mt-10 grid gap-10 sm:mt-12 md:grid-cols-3 md:gap-12">
              {steps.map((s, i) => (
                <li key={s.title}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#5B3FD9]/30 bg-[#5B3FD9]/[0.07] text-sm font-semibold text-[#5B3FD9]">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#1B1635]/65">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Closing call to action */}
        <section className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl rounded-3xl bg-[#1B1635] px-6 py-14 text-center sm:px-16 sm:py-16">
            <h2 className="mx-auto max-w-xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Ready to see your own stock in one place?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/65">
              Create an account and add your first product today.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href={signUpHref}
                className="rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-[#1B1635] transition-colors hover:bg-[#F6F5FA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Sign up
              </Link>
              <Link
                href="/sign-in"
                className="rounded-xl border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1B1635]/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-[#1B1635]/55 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2.5 text-[#1B1635]">
            <Logo />
            <span className="font-semibold tracking-tight">Inventory Management</span>
          </div>
          <p>Simple stock tracking for growing shops.</p>
        </div>
      </footer>
    </div>
  );
}