import Sidebar from "@/components/sidebar";
import type { ReactNode } from "react";

export default function PageShell({
  currentPath,
  title,
  description,
  actions,
  children,
}: {
  currentPath: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F6F5FA] text-[#1B1635] antialiased">
      <Sidebar currentPath={currentPath} />
      <main className="px-4 pb-8 pt-20 sm:px-6 lg:ml-64 lg:p-12">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-1.5 text-sm text-[#1B1635]/60">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          )}
        </div>
        <div className="space-y-5 sm:space-y-6">{children}</div>
      </main>
    </div>
  );
}