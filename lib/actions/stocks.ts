"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "../auth";
import { sendLowStockAlert } from "../email";
import { prisma } from "../prisma";
import { detectStockAlert, getLowStockThreshold } from "../stock-alerts";
import {
  StockAdjustSchema,
  signedChange,
  type StockFormState,
} from "../validations/stocks";

export async function adjustStock(
  _prevState: StockFormState,
  formData: FormData
): Promise<StockFormState> {
  const user = await getCurrentUser();

  const values = {
    reason: String(formData.get("reason") ?? ""),
    amount: String(formData.get("amount") ?? ""),
    note: String(formData.get("note") ?? ""),
  };
  const productId = String(formData.get("productId") ?? "");

  const parsed = StockAdjustSchema.safeParse({ ...values, productId });
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  const { reason, amount, note } = parsed.data;
  const delta = signedChange(reason, amount);

  let product: {
    id: string;
    name: string;
    sku: string | null;
    quantity: number;
    lowStockAt: number | null;
  };

  try {
    product = await prisma.$transaction(async (tx) => {
      // One atomic UPDATE. For removals, the WHERE clause only matches if
      // enough stock exists, so quantity can never go below zero.
      const updated = await tx.product.update({
        where: {
          id: productId,
          userId: user.id, // ownership check
          ...(delta < 0 ? { quantity: { gte: -delta } } : {}),
        },
        data: { quantity: { increment: delta } },
        select: {
          id: true,
          name: true,
          sku: true,
          quantity: true,
          lowStockAt: true,
        },
      });

      await tx.stockMovement.create({
        data: {
          productId,
          userId: user.id,
          change: delta,
          quantityAfter: updated.quantity,
          reason,
          note,
        },
      });

      return updated;
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        ok: false,
        message: "Not enough stock for that change.",
        errors: { amount: ["There isn't enough stock to remove that many units"] },
        values,
      };
    }
    console.error("adjustStock error:", error);
    return {
      ok: false,
      message: "Something went wrong. Please try again.",
      values,
    };
  }

  // The stock change is saved. Now check whether it crossed the low stock line.
  const threshold = getLowStockThreshold(product.lowStockAt);
  const previousQuantity = product.quantity - delta;
  const level = detectStockAlert(previousQuantity, product.quantity, threshold);
  const to = user.primaryEmail;

  if (level && to) {
    // after() runs once the response is sent, so the user isn't kept waiting
    after(() =>
      sendLowStockAlert({
        to,
        level,
        product: {
          id: product.id,
          name: product.name,
          sku: product.sku,
          quantity: product.quantity,
          threshold,
        },
      })
    );
  }

  revalidatePath(`/inventory/${productId}`);
  revalidatePath("/inventory");
  revalidatePath("/dashboard");

  return { ok: true, message: "Stock updated" };
}