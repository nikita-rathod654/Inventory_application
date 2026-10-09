"use client";

import { createPurchaseOrder } from "@/lib/actions/purchase-orders";
import { card, inputCls, labelCls, primaryBtn, secondaryBtn } from "@/lib/ui";
import type { PurchaseOrderFormState } from "@/lib/validations/purchase-orders";
import Link from "next/link";
import { useActionState, useState } from "react";

type SupplierOption = { id: string; name: string };
type ProductOption = { id: string; name: string; sku: string | null };
type Row = { key: number; productId: string; quantity: string; unitCost: string };

const initial: PurchaseOrderFormState = { ok: false };

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1.5 text-xs text-[#B3342D]">{messages[0]}</p>;
}

export default function PurchaseOrderForm({
  suppliers,
  products,
}: {
  suppliers: SupplierOption[];
  products: ProductOption[];
}) {
  const [state, formAction, pending] = useActionState(createPurchaseOrder, initial);
  const [rows, setRows] = useState<Row[]>([
    { key: 1, productId: "", quantity: "1", unitCost: "" },
  ]);
  const [nextKey, setNextKey] = useState(2);
  const v = state.values ?? {};

  const update = (key: number, patch: Partial<Row>) =>
    setRows((r) => r.map((x) => (x.key === key ? { ...x, ...patch } : x)));

  const addRow = () => {
    setRows((r) => [...r, { key: nextKey, productId: "", quantity: "1", unitCost: "" }]);
    setNextKey((k) => k + 1);
  };

  const removeRow = (key: number) =>
    setRows((r) => (r.length > 1 ? r.filter((x) => x.key !== key) : r));

  const total = rows.reduce(
    (sum, r) => sum + (Number(r.quantity) || 0) * (Number(r.unitCost) || 0),
    0
  );

  const itemsJson = JSON.stringify(
    rows.map(({ productId, quantity, unitCost }) => ({ productId, quantity, unitCost }))
  );

  return (
    <form action={formAction} className={`${card} max-w-3xl space-y-6 p-5 sm:p-8`}>
      {state.message && !state.ok && (
        <p className="rounded-xl bg-[#D6453D]/10 px-4 py-3 text-sm text-[#B3342D]">
          {state.message}
        </p>
      )}

      <input type="hidden" name="items" value={itemsJson} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="supplierId" className={labelCls}>Supplier</label>
          <select
            id="supplierId"
            name="supplierId"
            defaultValue={v.supplierId ?? ""}
            className={inputCls}
          >
            <option value="">Choose a supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <FieldError messages={state.errors?.supplierId} />
        </div>
        <div>
          <label htmlFor="expectedAt" className={labelCls}>Expected delivery (optional)</label>
          <input
            id="expectedAt"
            name="expectedAt"
            type="date"
            defaultValue={v.expectedAt}
            className={inputCls}
          />
          <FieldError messages={state.errors?.expectedAt} />
        </div>
      </div>

      <div>
        <p className={labelCls}>Products</p>
        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.key}
              className="grid gap-2 sm:grid-cols-[1fr_96px_120px_auto] sm:items-center"
            >
              <select
                aria-label="Product"
                value={row.productId}
                onChange={(e) => update(row.key, { productId: e.target.value })}
                className={inputCls}
              >
                <option value="">Choose a product</option>
                {products.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                    disabled={rows.some((r) => r.key !== row.key && r.productId === p.id)}
                  >
                    {p.name}
                    {p.sku ? ` (${p.sku})` : ""}
                  </option>
                ))}
              </select>
              <input
                aria-label="Quantity"
                type="number"
                min={1}
                step={1}
                placeholder="Qty"
                value={row.quantity}
                onChange={(e) => update(row.key, { quantity: e.target.value })}
                className={inputCls}
              />
              <input
                aria-label="Unit cost"
                type="number"
                min={0}
                step="0.01"
                placeholder="Unit cost"
                value={row.unitCost}
                onChange={(e) => update(row.key, { unitCost: e.target.value })}
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => removeRow(row.key)}
                disabled={rows.length === 1}
                className="rounded-lg px-3 py-2 text-sm text-[#B3342D] hover:bg-[#D6453D]/10 disabled:opacity-40"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <FieldError messages={state.errors?.items} />
        <div className="mt-3 flex items-center justify-between">
          <button type="button" onClick={addRow} className={secondaryBtn}>
            Add product
          </button>
          <p className="text-sm text-[#1B1635]/60">
            Total: <span className="font-semibold text-[#1B1635]">${total.toFixed(2)}</span>
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className={labelCls}>Notes (optional)</label>
        <textarea id="notes" name="notes" rows={3} defaultValue={v.notes} className={inputCls} />
        <FieldError messages={state.errors?.notes} />
      </div>

      <div className="flex gap-3">
        <button disabled={pending} className={primaryBtn}>
          {pending ? "Saving..." : "Save as draft"}
        </button>
        <Link href="/purchase-orders" className={secondaryBtn}>Cancel</Link>
      </div>
    </form>
  );
}