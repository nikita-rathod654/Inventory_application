"use client";

import { createSupplier } from "@/lib/actions/suppliers";
import { card, inputCls, labelCls, primaryBtn, secondaryBtn } from "@/lib/ui";
import type { SupplierFormState } from "@/lib/validations/suppliers";
import Link from "next/link";
import { useActionState } from "react";

const initial: SupplierFormState = { ok: false };

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1.5 text-xs text-[#B3342D]">{messages[0]}</p>;
}

export default function SupplierForm() {
  const [state, formAction, pending] = useActionState(createSupplier, initial);
  const v = state.values ?? {};

  return (
    <form action={formAction} className={`${card} max-w-2xl space-y-5 p-5 sm:p-8`}>
      {state.message && !state.ok && (
        <p className="rounded-xl bg-[#D6453D]/10 px-4 py-3 text-sm text-[#B3342D]">
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor="name" className={labelCls}>Supplier name</label>
        <input id="name" name="name" defaultValue={v.name} className={inputCls} />
        <FieldError messages={state.errors?.name} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelCls}>Email (optional)</label>
          <input id="email" name="email" type="email" defaultValue={v.email} className={inputCls} />
          <FieldError messages={state.errors?.email} />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>Phone (optional)</label>
          <input id="phone" name="phone" defaultValue={v.phone} className={inputCls} />
          <FieldError messages={state.errors?.phone} />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className={labelCls}>Notes (optional)</label>
        <textarea id="notes" name="notes" rows={3} defaultValue={v.notes} className={inputCls} />
        <FieldError messages={state.errors?.notes} />
      </div>

      <div className="flex gap-3">
        <button disabled={pending} className={primaryBtn}>
          {pending ? "Saving..." : "Save supplier"}
        </button>
        <Link href="/suppliers" className={secondaryBtn}>Cancel</Link>
      </div>
    </form>
  );
}