"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";
import { formatPoNumber, statusesThatCanMoveTo } from "../purchase-order-status";
import {
  PurchaseOrderSchema,
  type PurchaseOrderFormState,
} from "../validations/purchase-orders";

class OrderStateError extends Error {}

function readId(formData: FormData) {
  return String(formData.get("id") ?? "");
}

function refresh(id: string) {
  revalidatePath("/purchase-orders");
  revalidatePath(`/purchase-orders/${id}`);
}

export async function createPurchaseOrder(
  _prevState: PurchaseOrderFormState,
  formData: FormData
): Promise<PurchaseOrderFormState> {
  const user = await getCurrentUser();

  const values = {
    supplierId: String(formData.get("supplierId") ?? ""),
    expectedAt: String(formData.get("expectedAt") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };

  let rawItems: unknown = [];
  try {
    rawItems = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    rawItems = [];
  }

  const parsed = PurchaseOrderSchema.safeParse({ ...values, items: rawItems });
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  const { supplierId, expectedAt, notes, items } = parsed.data;

  // Ownership checks: the IDs came from the browser, so never trust them.
  const supplier = await prisma.supplier.findFirst({
    where: { id: supplierId, userId: user.id },
    select: { id: true },
  });
  if (!supplier) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors: { supplierId: ["Supplier not found"] },
      values,
    };
  }

  const productIds = items.map((i) => i.productId);
  const owned = await prisma.product.count({
    where: { id: { in: productIds }, userId: user.id },
  });
  if (owned !== productIds.length) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors: { items: ["One or more products were not found"] },
      values,
    };
  }

  let orderId: string;
  try {
    // Nested create: the order and all its lines are saved atomically.
    const order = await prisma.purchaseOrder.create({
      data: {
        userId: user.id,
        supplierId,
        notes,
        expectedAt,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitCost: i.unitCost,
          })),
        },
      },
      select: { id: true },
    });
    orderId = order.id;
  } catch (error) {
    console.error("createPurchaseOrder error:", error);
    return { ok: false, message: "Something went wrong. Please try again.", values };
  }

  revalidatePath("/purchase-orders");
  redirect(`/purchase-orders/${orderId}`);
}

// The status check is inside the UPDATE's WHERE clause (compare-and-set),
// so an order in the wrong state simply matches zero rows.
export async function markOrdered(formData: FormData) {
  const user = await getCurrentUser();
  const id = readId(formData);

  await prisma.purchaseOrder.updateMany({
    where: { id, userId: user.id, status: { in: statusesThatCanMoveTo("ORDERED") } },
    data: { status: "ORDERED", orderedAt: new Date() },
  });
  refresh(id);
}

export async function cancelOrder(formData: FormData) {
  const user = await getCurrentUser();
  const id = readId(formData);

  await prisma.purchaseOrder.updateMany({
    where: { id, userId: user.id, status: { in: statusesThatCanMoveTo("CANCELLED") } },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });
  refresh(id);
}

export async function deleteDraftOrder(formData: FormData) {
  const user = await getCurrentUser();
  const id = readId(formData);

  // Only drafts can be deleted. Lines are removed by the cascade.
  await prisma.purchaseOrder.deleteMany({
    where: { id, userId: user.id, status: "DRAFT" },
  });
  revalidatePath("/purchase-orders");
  redirect("/purchase-orders");
}

export async function receiveOrder(formData: FormData) {
  const user = await getCurrentUser();
  const id = readId(formData);

  try {
    await prisma.$transaction(
      async (tx) => {
        // 1. Claim the order. Only one request can flip ORDERED -> RECEIVED,
        //    so a double click or two tabs can never restock twice.
        const claimed = await tx.purchaseOrder.updateMany({
          where: {
            id,
            userId: user.id,
            status: { in: statusesThatCanMoveTo("RECEIVED") },
          },
          data: { status: "RECEIVED", receivedAt: new Date() },
        });
        if (claimed.count === 0) throw new OrderStateError();

        const order = await tx.purchaseOrder.findUniqueOrThrow({
          where: { id },
          include: { items: true },
        });

        // 2. Restock every line and write its history entry.
        for (const item of order.items) {
          const updated = await tx.product.update({
            where: { id: item.productId, userId: user.id },
            data: { quantity: { increment: item.quantity } },
            select: { quantity: true },
          });

          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              userId: user.id,
              change: item.quantity,
              quantityAfter: updated.quantity,
              reason: "RESTOCK",
              note: `Received ${formatPoNumber(order.number)}`,
            },
          });
        }
      },
      { timeout: 20_000 } // many lines on a remote database can pass the 5s default
    );
  } catch (error) {
    if (!(error instanceof OrderStateError)) {
      console.error("receiveOrder error:", error);
    }
    // If anything fails, the whole transaction rolls back, status included.
  }

  refresh(id);
  revalidatePath("/inventory");
  revalidatePath("/dashboard");
}