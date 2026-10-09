import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { AccountSettings } from "@stackframe/stack";
import Link from "next/link";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[#F6F5FA] text-[#1B1635] antialiased">
      <Sidebar currentPath="/settings" />

      <main className="px-4 pb-8 pt-20 sm:px-6 lg:ml-64 lg:p-12">
        {/* Back button */}
        <Link
          href="/dashboard"
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
          Back to dashboard
        </Link>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Settings
          </h1>
          <p className="mt-1.5 text-sm text-[#1B1635]/60">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="max-w-6xl">
          <div className="min-w-0 overflow-hidden rounded-2xl border border-[#1B1635]/10 bg-white p-3 shadow-sm shadow-[#1B1635]/[0.04] sm:rounded-3xl sm:p-6">
            <AccountSettings fullPage />
          </div>
        </div>
      </main>
    </div>
  );
}