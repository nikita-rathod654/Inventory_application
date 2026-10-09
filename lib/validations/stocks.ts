import { z } from "zod";

export const ADJUST_REASONS = [
  "RESTOCK",
  "RETURN",
  "SALE",
  "DAMAGED",
  "CORRECTION",
] as const;

export type AdjustReason = (typeof ADJUST_REASONS)[number];

export const REASON_LABELS: Record<AdjustReason | "INITIAL", string> = {
  INITIAL: "Initial stock",
  RESTOCK: "Restock",
  RETURN: "Customer return",
  SALE: "Sale",
  DAMAGED: "Damaged or lost",
  CORRECTION: "Correction",
};

// +1 adds stock, -1 removes stock, 0 means the user types the sign themselves
export const REASON_DIRECTION: Record<AdjustReason, 1 | -1 | 0> = {
  RESTOCK: 1,
  RETURN: 1,
  SALE: -1,
  DAMAGED: -1,
  CORRECTION: 0,
};

export const REASON_HINTS: Record<AdjustReason, string> = {
  RESTOCK: "Adds this many units to stock.",
  RETURN: "Adds this many returned units back to stock.",
  SALE: "Removes this many units from stock.",
  DAMAGED: "Removes this many units from stock.",
  CORRECTION: "Use a positive number to add or a negative one (like -3) to remove.",
};

export function signedChange(reason: AdjustReason, amount: number) {
  const direction = REASON_DIRECTION[reason];
  return direction === 0 ? amount : direction * amount;
}

const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

export const StockAdjustSchema = z
  .object({
    productId: z.string().min(1, "Missing product"),
    reason: z.enum(ADJUST_REASONS, { error: "Choose a reason" }),
    amount: z.preprocess(
      emptyToUndefined,
      z.coerce
        .number({ error: "Enter a whole number" })
        .int("Must be a whole number")
        .min(-1_000_000_000, "Number is too large")
        .max(1_000_000_000, "Number is too large")
    ),
    note: z.preprocess(
      emptyToUndefined,
      z.string().trim().max(200, "Note must be 200 characters or fewer").optional()
    ),
  })
  .superRefine((data, ctx) => {
    if (data.amount === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["amount"],
        message: "Amount can't be 0",
      });
    } else if (data.reason !== "CORRECTION" && data.amount < 0) {
      ctx.addIssue({
        code: "custom",
        path: ["amount"],
        message: "Enter a positive number. The reason decides if stock goes up or down.",
      });
    }
  });

export type StockField = "reason" | "amount" | "note";

export type StockFormState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<StockField, string[]>>;
  values?: Partial<Record<StockField, string>>;
};