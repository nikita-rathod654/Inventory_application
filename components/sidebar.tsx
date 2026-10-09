"use client";

import { UserButton } from "@stackframe/stack";
import { BarChart3, Menu, Package, Plus, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Add Product", href: "/add-product", icon: Plus },
  { name: "Settings", href: "/settings", icon: Settings },
];

function BrandLogo() {
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

export default function Sidebar({ currentPath }: { currentPath?: string }) {
  const pathname = usePathname();
  const activePath = currentPath ?? pathname;
  const [open, setOpen] = useState(false);

  // Close drawer when the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape + lock body scroll while drawer is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      {/* Mobile / tablet top bar */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between bg-[#1B1635] px-4 text-white lg:hidden">
        <div className="flex items-center gap-2.5">
          <BrandLogo />
          <span className="text-base font-semibold tracking-tight">
            Inventory App
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="app-sidebar"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8F7BFF]"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Overlay (mobile / tablet only) */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar: drawer on small screens, fixed on lg+ */}
      <aside
        id="app-sidebar"
        className={`fixed left-0 top-0 z-50 flex h-dvh w-64 max-w-[85vw] flex-col overflow-y-auto overflow-x-hidden bg-[#1B1635] p-5 text-white transition-transform duration-300 ease-in-out lg:z-10 lg:max-w-none lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Soft glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#5B3FD9]/30 blur-3xl"
        />

        {/* Brand + close button */}
        <div className="relative mb-10 flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2.5">
            <BrandLogo />
            <span className="text-base font-semibold tracking-tight">
              Inventory App
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative space-y-1" aria-label="Main">
          <div className="mb-3 px-3 text-xs font-medium text-white/40">Menu</div>
          {navigation.map((item) => {
            const IconComponent = item.icon;
            const isActive = activePath === item.href;
            return (
              <Link
                href={item.href}
                key={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8F7BFF] ${
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
                <IconComponent
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

        {/* User */}
        <div className="relative mt-auto border-t border-white/10 pt-5">
          <div className="flex h-16 items-center overflow-hidden rounded-xl bg-white/[0.06] px-2 text-white [&_p]:!text-white [&_button]:w-full [&_button]:justify-start">
            <UserButton showUserInfo />
          </div>
        </div>
      </aside>
    </>
  );
}