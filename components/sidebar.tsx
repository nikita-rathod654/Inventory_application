import { UserButton } from "@stackframe/stack";
import { BarChart3, Package, Plus, Settings } from "lucide-react";
import Link from "next/link";

export default function Sidebar({
  currentPath = "/dashboard",
}: {
  currentPath: string;
}) {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Add Product", href: "/add-product", icon: Plus },
    { name: "Settings", href: "/settings", icon: Settings },
  ];
  return (
    <div className="fixed left-0 top-0 z-10 flex h-screen w-64 flex-col overflow-hidden bg-[#1B1635] p-5 text-white">
      {/* Soft glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#5B3FD9]/30 blur-3xl"
      />

      {/* Brand */}
      <div className="relative mb-10 flex items-center gap-2.5 px-2 pt-1">
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
        <span className="text-base font-semibold tracking-tight">
          Inventory App
        </span>
      </div>

      {/* Navigation */}
      <nav className="relative space-y-1" aria-label="Main">
        <div className="mb-3 px-3 text-xs font-medium text-white/40">Menu</div>
        {navigation.map((item, key) => {
          const IconComponent = item.icon;
          const isActive = currentPath === item.href;
          return (
            <Link
              href={item.href}
              key={key}
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
                  isActive ? "text-[#B5A6FF]" : "text-white/50 group-hover:text-white/80"
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
    </div>
  );
}