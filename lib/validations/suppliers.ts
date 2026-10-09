import { z } from "zod";

const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

export const SupplierSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Max 100 characters"),
  email: z.preprocess(
    emptyToUndefined,
    z.email("Enter a valid email").max(200, "Max 200 characters").optional()
  ),
  phone: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(30, "Max 30 characters").optional()
  ),
  notes: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(500, "Max 500 characters").optional()
  ),
});

export type SupplierField = "name" | "email" | "phone" | "notes";

export type SupplierFormState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<SupplierField, string[]>>;
  values?: Partial<Record<SupplierField, string>>;
};