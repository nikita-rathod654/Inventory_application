import { z } from "zod";

const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

export const PurchaseOrderSchema = z
  .object({
    supplierId: z.string().min(1, "Choose a supplier"),
    expectedAt: z.preprocess(
      emptyToUndefined,
      z.coerce.date({ error: "Enter a valid date" }).optional()
    ),
    notes: z.preprocess(
      emptyToUndefined,
      z.string().trim().max(500, "Max 500 characters").optional()
    ),
    items: z
      .array(
        z.object({
          productId: z.string().min(1, "Choose a product for every row"),
          quantity: z.coerce
            .number({ error: "Enter a whole number" })
            .int("Quantity must be a whole number")
            .min(1, "Quantity must be at least 1")
            .max(1_000_000, "Quantity is too large"),
          unitCost: z.coerce
            .number({ error: "Enter a unit cost" })
            .min(0, "Cost can't be negative")
            .max(1_000_000_000, "Cost is too large"),
        })
      )
      .min(1, "Add at least one product")
      .max(50, "Maximum 50 products per order"),
  })
  .superRefine((data, ctx) => {
    const ids = data.items.map((i) => i.productId);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({
        code: "custom",
        path: ["items"],
        message: "Each product can only appear once per order",
      });
    }
  });

export type PurchaseOrderField = "supplierId" | "expectedAt" | "notes" | "items";

export type PurchaseOrderFormState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<PurchaseOrderField, string[]>>;
  values?: Partial<Record<"supplierId" | "expectedAt" | "notes", string>>;
};