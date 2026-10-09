"use client";

import { navigation } from "@/lib/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Skeleton({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`motion-safe:animate-pulse rounded-md ${
        dark ? "bg-white/10" : "bg-[#1B1635]/[0.08]"
      } ${className}`}
    ></div>
  );
}

const cardBase =
  "min-w-0 rounded-2xl border border-[#1B1635]/10 bg-white shadow-sm shadow-[#1B1635]/[0.04] sm:rounded-3xl";

function BrandMark() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px] text-[#1B1635]"
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

/* ---------- Sidebar and top bar ---------- */

function LoadingTopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between bg-[#1B1635] px-4 text-white lg:hidden">
      <div className="flex items-center gap-2.5">
        <BrandMark />
        <span className="text-base font-semibold tracking-tight">
          Inventory App
        </span>
      </div>
      <Skeleton dark className="h-6 w-6 rounded-md" />
    </header>
  );
}

function LoadingSidebar({ pathname }: { pathname: string }) {
  return (
    <div className="fixed left-0 top-0 z-10 hidden h-dvh w-64 flex-col overflow-hidden bg-[#1B1635] p-5 text-white lg:flex">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#5B3FD9]/30 blur-3xl"
      />

      <div className="relative mb-10 flex items-center gap-2.5 px-2 pt-1">
        <BrandMark />
        <span className="text-base font-semibold tracking-tight">
          Inventory App
        </span>
      </div>

      <nav className="relative space-y-1" aria-label="Main">
        <div className="mb-3 px-3 text-xs font-medium text-white/40">Menu</div>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute -left-5 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#8F7BFF]"
                />
              )}
              <Icon
                className={`h-[18px] w-[18px] ${
                  isActive
                    ? "text-[#B5A6FF]"
                    : "text-white/50 group-hover:text-white/80"
                }`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="relative mt-auto border-t border-white/10 pt-5">
        <div className="flex h-16 items-center gap-3 rounded-xl bg-white/[0.06] px-3">
          <Skeleton dark className="h-9 w-9 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1">
            <Skeleton dark className="mb-1.5 h-3.5 w-20" />
            <Skeleton dark className="h-3 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable skeleton pieces ---------- */

function HeaderSkeleton({ actions = 1 }: { actions?: number }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
      <div>
        <Skeleton className="mb-3 h-7 w-36 sm:h-8 sm:w-40" />
        <Skeleton className="h-4 w-60 max-w-full sm:w-72" />
      </div>
      {actions > 0 && (
        <div className="flex gap-2">
          {Array.from({ length: actions }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-full sm:w-32" />
          ))}
        </div>
      )}
    </div>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className={`${cardBase} overflow-hidden`}>
      <div className="hidden border-b border-[#1B1635]/10 bg-[#F6F5FA]/70 px-5 py-3.5 sm:grid sm:grid-cols-[1.6fr_1fr_1fr_0.7fr] sm:gap-4 lg:px-7">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-3 w-16" />
        ))}
      </div>
      <div className="divide-y divide-[#1B1635]/[0.07]">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-4 sm:grid-cols-[1.6fr_1fr_1fr_0.7fr] sm:gap-4 sm:px-5 lg:px-7"
          >
            <div>
              <Skeleton className="mb-1.5 h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="hidden h-4 w-16 sm:block" />
            <Skeleton className="hidden h-6 w-24 rounded-full sm:block" />
            <Skeleton className="ml-auto h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- One skeleton per page type ---------- */

function DashboardSkeleton() {
  return (
    <>
      <HeaderSkeleton actions={1} />

      <div className="mb-5 rounded-2xl bg-[#1B1635] p-5 sm:mb-6 sm:rounded-3xl sm:p-8 lg:p-10">
        <div className="grid items-end gap-6 sm:gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Skeleton dark className="mb-4 h-4 w-36" />
            <Skeleton dark className="mb-4 h-10 w-44 sm:h-14 sm:w-56" />
            <Skeleton dark className="h-4 w-32" />
          </div>
          <div className="grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.06] py-4 sm:py-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-3 sm:px-5">
                <Skeleton dark className="mb-2 h-7 w-10 sm:h-8 sm:w-12" />
                <Skeleton dark className="h-3 w-12 sm:w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 sm:mb-6 sm:gap-6 xl:grid-cols-[1.8fr_1fr]">
        <div className={`${cardBase} p-5 sm:p-7`}>
          <Skeleton className="mb-2 h-6 w-48 max-w-full" />
          <Skeleton className="mb-6 h-4 w-24 sm:mb-8" />
          <Skeleton className="h-52 w-full rounded-xl sm:h-56" />
        </div>

        <div className={`${cardBase} p-5 sm:p-7`}>
          <Skeleton className="mb-2 h-6 w-24" />
          <Skeleton className="mb-6 h-4 w-40 max-w-full" />
          <div className="flex justify-center">
            <Skeleton className="h-36 w-36 rounded-full sm:h-44 sm:w-44" />
          </div>
          <div className="mt-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-2.5 w-2.5 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <TableSkeleton rows={5} />
    </>
  );
}

// search = inventory list, tabs = purchase orders (status filter pills)
function ListSkeleton({
  search = false,
  tabs = false,
  actions = 2,
}: {
  search?: boolean;
  tabs?: boolean;
  actions?: number;
}) {
  return (
    <>
      <HeaderSkeleton actions={actions} />
      <div className="space-y-5 sm:space-y-6">
        {tabs && (
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        )}
        {search && (
          <div className={`${cardBase} p-3 sm:p-4`}>
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        )}
        <TableSkeleton rows={5} />
      </div>
    </>
  );
}

function DetailSkeleton() {
  return (
    <>
      <HeaderSkeleton actions={2} />
      <div className="space-y-5 sm:space-y-6">
        <div className={`${cardBase} p-5 sm:p-6`}>
          <div className="grid gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="mb-2 h-3 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
        <TableSkeleton rows={3} />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-36 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
      </div>
    </>
  );
}

function FormSkeleton({ aside = false }: { aside?: boolean }) {
  return (
    <>
      <HeaderSkeleton actions={0} />
      <div className={aside ? "grid gap-6 lg:grid-cols-[1.6fr_1fr]" : "max-w-2xl"}>
        <div className={`${cardBase} space-y-6 p-5 sm:p-8`}>
          <Skeleton className="h-5 w-32" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <Skeleton className="mb-2 h-4 w-28" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-11 w-36 rounded-xl" />
            <Skeleton className="h-11 w-24 rounded-xl" />
          </div>
        </div>

        {aside && (
          <div className="hidden rounded-2xl bg-[#1B1635] p-6 sm:rounded-3xl lg:block">
            <Skeleton dark className="mb-4 h-5 w-40" />
            <Skeleton dark className="mb-2 h-4 w-full" />
            <Skeleton dark className="mb-2 h-4 w-full" />
            <Skeleton dark className="mb-6 h-4 w-2/3" />
            <Skeleton dark className="h-24 w-full rounded-2xl" />
          </div>
        )}
      </div>
    </>
  );
}

/* ---------- Choose the skeleton from the URL ---------- */

type Variant =
  | "dashboard"
  | "inventory"
  | "suppliers"
  | "orders"
  | "detail"
  | "form"
  | "form-aside";

function getVariant(pathname: string): Variant {
  if (pathname === "/dashboard") return "dashboard";
  if (pathname === "/add-product") return "form-aside";
  if (
    pathname === "/settings" ||
    pathname === "/inventory/import" ||
    pathname === "/suppliers/new" ||
    pathname === "/suppliers/import" ||
    pathname === "/purchase-orders/new" ||
    pathname.endsWith("/edit")
  ) {
    return "form";
  }
  if (pathname === "/inventory") return "inventory";
  if (pathname === "/suppliers") return "suppliers";
  if (pathname === "/purchase-orders") return "orders";
  if (
    pathname.startsWith("/inventory/") ||
    pathname.startsWith("/purchase-orders/")
  ) {
    return "detail";
  }
  return "inventory"; // sensible default for any other page
}

const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"];

export default function Loading() {
  const pathname = usePathname();

  const showSidebar =
    !PUBLIC_ROUTES.includes(pathname) && !pathname.startsWith("/handler");
  const variant = getVariant(pathname);

  const mainClass = showSidebar
    ? `px-4 pb-8 pt-20 sm:px-6 lg:ml-64 ${
        variant === "dashboard" ? "lg:p-8" : "lg:p-12"
      }`
    : "p-4 sm:p-6 lg:p-12";

  return (
    <div className="min-h-screen bg-[#F6F5FA]">
      {showSidebar && (
        <>
          <LoadingTopBar />
          <LoadingSidebar pathname={pathname} />
        </>
      )}

      <main className={mainClass} aria-busy="true" aria-label="Loading">
        {variant === "dashboard" && <DashboardSkeleton />}
        {variant === "inventory" && <ListSkeleton search actions={2} />}
        {variant === "suppliers" && <ListSkeleton actions={2} />}
        {variant === "orders" && <ListSkeleton tabs actions={1} />}
        {variant === "detail" && <DetailSkeleton />}
        {variant === "form" && <FormSkeleton />}
        {variant === "form-aside" && <FormSkeleton aside />}
      </main>
    </div>
  );
}