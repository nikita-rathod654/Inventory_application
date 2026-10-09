"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { importProducts } from "@/lib/actions/csv";
import type { ImportState } from "@/lib/csv";

const TEMPLATE =
  "name,sku,price,quantity,lowStockAt\n" +
  "Oak shelf bracket,SAMPLE-001,24.50,148,20\n" +
  "Ceramic mug 350 ml,SAMPLE-002,8.00,9,15\n";

export default function CsvImportForm() {
  const [state, formAction, pending] = useActionState<ImportState, FormData>(
    importProducts,
    { ok: false }
  );

  useEffect(() => {
    if (state.ok) toast.success(state.message ?? "Import complete");
    else if (state.fileError) toast.error(state.fileError);
    else if (state.message) toast.error(`${state.errorRowCount ?? ""} row(s) need fixing`.trim());
  }, [state]);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-5">
        <div>
          <label
            htmlFor="file"
            className="mb-2 block text-sm font-medium text-[#1B1635]"
          >
            CSV file
          </label>
          <input
            type="file"
            id="file"
            name="file"
            accept=".csv,text/csv"
            required
            className="block w-full rounded-xl border border-[#1B1635]/15 bg-[#F6F5FA]/60 p-2 text-sm text-[#1B1635]/70 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#5B3FD9]/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#4A31BD] hover:file:bg-[#5B3FD9]/15"
          />
          <p className="mt-2 text-xs text-[#1B1635]/50">
            Up to 500 rows and 500 KB. The first row must be the column names.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-[#5B3FD9] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#5B3FD9]/25 transition-colors hover:bg-[#4A31BD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD9] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Checking and importing..." : "Import products"}
          </button>
          <a
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(TEMPLATE)}`}
            download="products-template.csv"
            className="rounded-xl border border-[#1B1635]/15 bg-white px-7 py-3.5 text-center text-sm font-semibold text-[#1B1635] transition-colors hover:border-[#1B1635]/30 hover:bg-[#1B1635]/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD9]"
          >
            Download template
          </a>
        </div>
      </form>

      {/* Success */}
      {state.ok && (
        <div
          role="status"
          className="rounded-2xl border border-[#1F7A4D]/20 bg-[#1F7A4D]/[0.07] p-5"
        >
          <p className="text-sm font-semibold text-[#1F7A4D]">{state.message}</p>
          <Link
            href="/inventory"
            className="mt-2 inline-block text-sm font-medium text-[#4A31BD] underline-offset-4 hover:underline"
          >
            View inventory
          </Link>
        </div>
      )}

      {/* File-level error */}
      {state.fileError && (
        <div
          role="alert"
          className="rounded-2xl border border-[#D6453D]/25 bg-[#D6453D]/[0.06] p-5"
        >
          <p className="break-words text-sm font-medium text-[#B3342D]">
            {state.fileError}
          </p>
        </div>
      )}

      {/* Row-level errors */}
      {state.rowErrors && state.rowErrors.length > 0 && (
        <div
          role="alert"
          className="rounded-2xl border border-[#D6453D]/25 bg-[#D6453D]/[0.06] p-4 sm:p-5"
        >
          <p className="text-sm font-semibold text-[#B3342D]">{state.message}</p>
          <p className="mt-1 text-xs text-[#1B1635]/60">
            {state.errorRowCount} of {state.totalRows} rows have problems.
            {state.errorRowCount &&
            state.errorRowCount > state.rowErrors.length
              ? ` Showing the first ${state.rowErrors.length}.`
              : ""}
          </p>

          <ul className="mt-4 max-h-96 space-y-2 overflow-y-auto pr-1">
            {state.rowErrors.map((err) => (
              <li
                key={err.row}
                className="rounded-xl bg-white p-3 text-sm shadow-sm shadow-[#1B1635]/[0.04]"
              >
                <p className="font-semibold text-[#1B1635]">Row {err.row}</p>
                <ul className="mt-1 space-y-0.5 text-xs text-[#B3342D]">
                  {err.messages.map((m) => (
                    <li key={m} className="break-words">
                      {m}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}