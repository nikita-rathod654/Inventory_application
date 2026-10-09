import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { AccountSettings } from "@stackframe/stack";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[#F6F5FA] text-[#1B1635] antialiased">
      <Sidebar currentPath="/settings" />

      <main className="px-4 pb-8 pt-20 sm:px-6 lg:ml-64 lg:p-12">
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
