"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";
import { SupplierSchema, type SupplierFormState } from "../validations/suppliers";

export async function createSupplier(
  _prevState: SupplierFormState,
  formData: FormData
): Promise<SupplierFormState> {
  const user = await getCurrentUser();

  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };

  const parsed = SupplierSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  try {
    await prisma.supplier.create({
      data: { userId: user.id, ...parsed.data },
    });
  } catch (error) {
    console.error("createSupplier error:", error);
    return { ok: false, message: "Something went wrong. Please try again.", values };
  }

  revalidatePath("/suppliers");
  redirect("/suppliers"); // redirect throws, so it stays outside try/catch
}

export async function deleteSupplier(formData: FormData) {
  const user = await getCurrentUser();
  const id = String(formData.get("id") ?? "");

  // Friendly guard. The database's Restrict rule is the real protection.
  const inUse = await prisma.purchaseOrder.count({
    where: { supplierId: id, userId: user.id },
  });
  if (inUse > 0) return;

  try {
    await prisma.supplier.deleteMany({ where: { id, userId: user.id } });
  } catch (error) {
    console.error("deleteSupplier error:", error);
  }
  revalidatePath("/suppliers");
}