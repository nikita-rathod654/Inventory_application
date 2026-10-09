"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { adjustStock } from "@/lib/actions/stocks";


import {
  ADJUST_REASONS,
  REASON_HINTS,
  REASON_LABELS,
  type AdjustReason,
  type StockFormState,
} from "@/lib/validations/stocks";


const labelClass = "mb-2 block text-sm font-medium text-[#1B1635]";
const baseInput =
  "w-full rounded-xl border bg-[#F6F5FA]/60 px-4 py-3 text-base sm:text-sm placeholder:text-[#1B1635]/35 transition-colors focus:bg-white focus:outline-none focus:ring-4";
const okInput =
  "border-[#1B1635]/15 focus:border-[#5B3FD9] focus:ring-[#5B3FD9]/15";
const badInput =
  "border-[#D6453D] focus:border-[#D6453D] focus:ring-[#D6453D]/15";

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-xs font-medium text-[#B3342D]">
      {errors[0]}
    </p>
  );
}

export default function StockAdjustForm({ productId }: { productId: string }) {
  const [state, formAction, pending] = useActionState<StockFormState, FormData>(
    adjustStock,
    { ok: false }
  );
  const [reason, setReason] = useState<AdjustReason>("RESTOCK");

  useEffect(() => {
    if (state.ok) toast.success(state.message ?? "Stock updated");
    else if (state.message) toast.error(state.message);
  }, [state]);

  const inputClass = (field: "amount" | "note" | "reason") =>
    `${baseInput} ${state.errors?.[field] ? badInput : okInput}`;

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="productId" value={productId} />

      <div>
        <label htmlFor="reason" className={labelClass}>
          Reason
        </label>
        <select
          id="reason"
          name="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value as AdjustReason)}
          className={inputClass("reason")}
        >
          {ADJUST_REASONS.map((r) => (
            <option key={r} value={r}>
              {REASON_LABELS[r]}
            </option>
          ))}
        </select>
        <FieldError id="reason-error" errors={state.errors?.reason} />
      </div>

      <div>
        <label htmlFor="amount" className={labelClass}>
          Units
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          inputMode="numeric"
          defaultValue={state.values?.amount ?? ""}
          placeholder="For example, 10"
          className={`${inputClass("amount")} tabular-nums`}
          aria-invalid={state.errors?.amount ? true : undefined}
          aria-describedby="amount-hint"
        />
        {state.errors?.amount ? (
          <FieldError id="amount-hint" errors={state.errors.amount} />
        ) : (
          <p id="amount-hint" className="mt-2 text-xs text-[#1B1635]/50">
            {REASON_HINTS[reason]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="note" className={labelClass}>
          Note{" "}
          <span className="font-normal text-[#1B1635]/45">(optional)</span>
        </label>
        <input
          type="text"
          id="note"
          name="note"
          defaultValue={state.values?.note ?? ""}
          placeholder="For example, supplier invoice #1042"
          className={inputClass("note")}
        />
        <FieldError id="note-error" errors={state.errors?.note} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-[#5B3FD9] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#5B3FD9]/25 transition-colors hover:bg-[#4A31BD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD9] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving..." : "Update stock"}
      </button>
    </form>
  );
}