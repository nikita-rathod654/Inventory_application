"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Package, Plus, Settings } from "lucide-react";

// Skeleton component for loading states
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

// Mobile / tablet top bar (matches the real Sidebar, below lg)
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

// Desktop sidebar (lg and up only)
function LoadingSidebar() {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Add Product", href: "/add-product", icon: Plus },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

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
          const IconComponent = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <IconComponent className="h-[18px] w-[18px] text-white/50 group-hover:text-white/80" />
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

// Main content skeleton
function MainContentSkeleton({
  showSidebar = true,
}: {
  showSidebar?: boolean;
}) {
  const cardClass =
    "min-w-0 rounded-2xl border border-[#1B1635]/10 bg-white p-5 shadow-sm shadow-[#1B1635]/[0.04] sm:rounded-3xl sm:p-7";

  return (
    <main
      className={
        showSidebar
          ? "px-4 pb-8 pt-20 sm:px-6 lg:ml-64 lg:p-8"
          : "p-4 sm:p-6 lg:p-12"
      }
      aria-busy="true"
      aria-label="Loading"
    >
      {/* Header skeleton */}
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
        <div>
          <Skeleton className="mb-3 h-7 w-36 sm:h-8 sm:w-40" />
          <Skeleton className="h-4 w-60 max-w-full sm:w-72" />
        </div>
        <Skeleton className="h-9 w-40 rounded-full sm:w-44" />
      </div>

      {/* Hero band skeleton */}
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

      {/* Chart + ring skeleton */}
      <div className="mb-5 grid grid-cols-1 gap-5 sm:mb-6 sm:gap-6 xl:grid-cols-[1.8fr_1fr]">
        <div className={cardClass}>
          <Skeleton className="mb-2 h-6 w-48 max-w-full" />
          <Skeleton className="mb-6 h-4 w-24 sm:mb-8" />
          <Skeleton className="h-52 w-full rounded-xl sm:h-56" />
        </div>

        <div className={cardClass}>
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

      {/* Table skeleton */}
      <div className="min-w-0 overflow-hidden rounded-2xl border border-[#1B1635]/10 bg-white shadow-sm shadow-[#1B1635]/[0.04] sm:rounded-3xl">
        <div className="px-4 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-7">
          <Skeleton className="mb-2 h-6 w-32" />
          <Skeleton className="h-4 w-48 max-w-full" />
        </div>
        <div className="divide-y divide-[#1B1635]/[0.07] border-t border-[#1B1635]/10">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3.5 sm:grid-cols-[1.5fr_1fr_0.6fr] sm:gap-4 sm:px-7 sm:py-4 md:grid-cols-[1.5fr_1fr_2fr_0.6fr]"
            >
              <Skeleton className="h-4 w-28 sm:w-32" />
              <Skeleton className="hidden h-6 w-24 rounded-full sm:block" />
              <Skeleton className="hidden h-1.5 w-full rounded-full md:block" />
              <Skeleton className="ml-auto h-4 w-12 sm:w-14" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function Loading() {
  const pathname = usePathname();

  // Don't show sidebar on public routes
  const showSidebar = !["/", "/sign-in", "/sign-up"].includes(pathname);

  return (
    <div className="min-h-screen bg-[#F6F5FA]">
      {showSidebar && (
        <>
          <LoadingTopBar />
          <LoadingSidebar />
        </>
      )}
      <MainContentSkeleton showSidebar={showSidebar} />
    </div>
  );
}