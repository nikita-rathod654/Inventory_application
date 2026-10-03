import { SignIn } from "@stackframe/stack";
import Link from "next/link";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const user = await stackServerApp.getUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="grid min-h-screen bg-[#F6F5FA] text-[#1B1635] antialiased lg:grid-cols-[1fr_1.1fr]">
      {/* Brand panel (desktop only) */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#1B1635] p-12 text-white lg:flex">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#5B3FD9]/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-[#F5B83D]/10 blur-3xl"
        />

        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-[#1B1635]"
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
        </Link>

        <div className="relative ml-10">
          <h1 className="max-w-sm text-4xl font-semibold leading-[1.15] tracking-tight">
            Pick up right where your stock left off.
          </h1>
          <p className="mt-5 max-w-sm leading-relaxed text-white/65">
            Sign in to see your products, check what is running low and keep
            every count up to date.
          </p>

          {/* Small sample card */}
          <div className="mt-10 max-w-sm rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Ceramic mug, 350 ml</p>
                <p className="text-xs text-white/45">Sample product</p>
              </div>
              <span className="rounded-full bg-[#F5B83D]/20 px-3 py-1 text-xs font-medium text-[#F5B83D]">
                Low stock
              </span>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[11%] rounded-full bg-[#F5B83D]" />
            </div>
            <p className="mt-3 text-xs text-white/50">9 of 80 units remaining</p>
          </div>
        </div>

        <p className="relative text-sm text-white/40 ml-10">
          Simple stock tracking for growing shops.
        </p>
      </aside>

      {/* Form side */}
      <main className="flex flex-col px-6 py-8 sm:px-10">
        {/* Mobile brand */}
        <Link href="/" className="flex items-center gap-2.5 lg:hidden">
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
        </Link>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md space-y-8">

            <SignIn />

            <div className="text-center mr-10">
  <Link
    href="/"
    className="group inline-flex items-center gap-2 rounded-full border border-[#1B1635]/10 bg-white px-4 py-2 text-sm font-medium text-[#1B1635]/70 shadow-sm transition-colors hover:border-[#1B1635]/20 hover:text-[#1B1635] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD9]"
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
    Back to home
  </Link>
</div>
          </div>
        </div>
      </main>
    </div>
  );
}