"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import type { ProductField, ProductFormState } from "@/lib/validations/product";

type Props = {
  action: (
    prevState: ProductFormState,
    formData: FormData
  ) => Promise<ProductFormState>;
  submitLabel: string;
  defaultValues?: Partial<Record<ProductField, string>>;
};

const labelClass = "mb-2 block text-sm font-medium text-[#1B1635]";
const hintClass = "mt-2 text-xs text-[#1B1635]/50";
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

const Required = () => (
  <span className="text-[#5B3FD9]" aria-hidden="true">
    {" "}
    *
  </span>
);

const Optional = () => (
  <span className="font-normal text-[#1B1635]/45"> (optional)</span>
);

export default function ProductForm({
  action,
  submitLabel,
  defaultValues,
}: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<
    ProductFormState,
    FormData
  >(action, { ok: false });

  useEffect(() => {
    if (state.ok) {
      toast.success(state.message ?? "Saved");
      router.push("/inventory");
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  // After a failed submit, show what the user typed instead of resetting
  const value = (field: ProductField) =>
    state.values?.[field] ?? defaultValues?.[field] ?? "";

  const inputClass = (field: ProductField) =>
    `${baseInput} ${state.errors?.[field] ? badInput : okInput}`;

  const a11y = (field: ProductField) => ({
    "aria-invalid": state.errors?.[field] ? true : undefined,
    "aria-describedby": state.errors?.[field] ? `${field}-error` : undefined,
  });

  return (
    <form className="space-y-8 sm:space-y-10" action={formAction} noValidate>
      {/* Basics */}
      <fieldset className="min-w-0 space-y-5 sm:space-y-6">
        <legend className="mb-1 text-base font-semibold tracking-tight">
          Product details
        </legend>

        <div>
          <label htmlFor="name" className={labelClass}>
            Product name
            <Required />
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={value("name")}
            className={inputClass("name")}
            placeholder="For example, Ceramic mug, 350 ml"
            {...a11y("name")}
          />
          <FieldError id="name-error" errors={state.errors?.name} />
        </div>

        <div>
          <label htmlFor="sku" className={labelClass}>
            SKU
            <Optional />
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            defaultValue={value("sku")}
            className={inputClass("sku")}
            placeholder="For example, CRM-350"
            {...a11y("sku")}
          />
          {state.errors?.sku ? (
            <FieldError id="sku-error" errors={state.errors.sku} />
          ) : (
            <p className={hintClass}>
              Your own code for this product, if you use one.
            </p>
          )}
        </div>
      </fieldset>

      <div className="border-t border-[#1B1635]/10" />

      {/* Stock and price */}
      <fieldset className="min-w-0 space-y-5 sm:space-y-6">
        <legend className="mb-1 text-base font-semibold tracking-tight">
          Stock and price
        </legend>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
          <div>
            <label htmlFor="quantity" className={labelClass}>
              Quantity
              <Required />
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="0"
              required
              inputMode="numeric"
              defaultValue={value("quantity")}
              className={`${inputClass("quantity")} tabular-nums`}
              placeholder="0"
              {...a11y("quantity")}
            />
            <FieldError id="quantity-error" errors={state.errors?.quantity} />
          </div>

          <div>
            <label htmlFor="price" className={labelClass}>
              Price
              <Required />
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#1B1635]/45">
                $
              </span>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0"
                required
                inputMode="decimal"
                defaultValue={value("price")}
                className={`${inputClass("price")} pl-8 tabular-nums`}
                placeholder="0.00"
                {...a11y("price")}
              />
            </div>
            <FieldError id="price-error" errors={state.errors?.price} />
          </div>
        </div>

        <div>
          <label htmlFor="lowStockAt" className={labelClass}>
            Low stock at
            <Optional />
          </label>
          <input
            type="number"
            id="lowStockAt"
            name="lowStockAt"
            min="0"
            inputMode="numeric"
            defaultValue={value("lowStockAt")}
            className={`${inputClass("lowStockAt")} tabular-nums`}
            placeholder="For example, 10"
            {...a11y("lowStockAt")}
          />
          {state.errors?.lowStockAt ? (
            <FieldError id="lowStockAt-error" errors={state.errors.lowStockAt} />
          ) : (
            <p className={hintClass}>
              The quantity at which this product is flagged as low.
            </p>
          )}
        </div>
      </fieldset>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-[#1B1635]/10 pt-6 sm:flex-row sm:items-center sm:pt-8">
        <Link
          href="/inventory"
          className="rounded-xl border border-[#1B1635]/15 bg-white px-7 py-3.5 text-center text-sm font-semibold text-[#1B1635] transition-colors hover:border-[#1B1635]/30 hover:bg-[#1B1635]/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD9] sm:order-2"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-[#5B3FD9] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#5B3FD9]/25 transition-colors hover:bg-[#4A31BD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD9] disabled:cursor-not-allowed disabled:opacity-60 sm:order-1"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}