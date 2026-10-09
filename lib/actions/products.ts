"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";
import {
  ProductSchema,
  type ProductField,
  type ProductFormState,
} from "../validations/product";

const FIELDS: ProductField[] = [
  "name",
  "sku",
  "price",
  "quantity",
  "lowStockAt",
];

function readForm(formData: FormData) {
  const values: Partial<Record<ProductField, string>> = {};
  for (const field of FIELDS) {
    values[field] = String(formData.get(field) ?? "");
  }
  return values;
}

export async function deleteProduct(formData: FormData) {
  const user = await getCurrentUser();
  const id = String(formData.get("id") || "");

  await prisma.product.deleteMany({
    where: { id: id, userId: user.id },
  });

  revalidatePath("/inventory");
  revalidatePath("/dashboard");
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const user = await getCurrentUser();
  const values = readForm(formData);

  const parsed = ProductSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  try {
        await prisma.product.create({
      data: {
        ...parsed.data,
        userId: user.id,
        ...(parsed.data.quantity > 0 && {
          movements: {
            create: {
              userId: user.id,
              change: parsed.data.quantity,
              quantityAfter: parsed.data.quantity,
              reason: "INITIAL",
            },
          },
        }),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        ok: false,
        message: "That SKU is already in use.",
        errors: { sku: ["This SKU is already used by another product"] },
        values,
      };
    }
    console.error("createProduct error:", error);
    return {
      ok: false,
      message: "Something went wrong. Please try again.",
      values,
    };
  }

  revalidatePath("/inventory");
  revalidatePath("/dashboard");

  return { ok: true, message: "Product added" };
}