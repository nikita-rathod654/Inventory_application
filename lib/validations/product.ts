import { z } from "zod";

const requiredNumber = (label: string) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.coerce.number({ error: `Enter a valid ${label}` })
  );

export const ProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name must be 120 characters or fewer"),

  sku: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().max(50, "SKU must be 50 characters or fewer").optional()
  ),

  price: requiredNumber("price").pipe(
    z
      .number()
      .min(0, "Price can't be negative")
      .max(9_999_999_999.99, "Price is too large")
  ),

  quantity: requiredNumber("quantity").pipe(
    z
      .number()
      .int("Quantity must be a whole number")
      .min(0, "Quantity can't be negative")
      .max(1_000_000_000, "Quantity is too large")
  ),

  lowStockAt: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.coerce
      .number({ error: "Enter a valid number" })
      .int("Must be a whole number")
      .min(0, "Can't be negative")
      .max(1_000_000_000, "Value is too large")
      .optional()
  ),
});

export type ProductField = keyof z.infer<typeof ProductSchema>;

export type ProductFormState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<ProductField, string[]>>;
  values?: Partial<Record<ProductField, string>>;
};