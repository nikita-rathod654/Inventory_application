"use server";

import { Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import Papa from "papaparse";
import { z } from "zod";
import { getCurrentUser } from "../auth";
import { unguardCell, type ImportRowError, type ImportState } from "../csv";
import { prisma } from "../prisma";
import { ProductSchema } from "../validations/product";

const MAX_BYTES = 500 * 1024;
const MAX_ROWS = 500;
const MAX_SHOWN_ERRORS = 50;

// Accept a few common spellings for each column header
const HEADER_ALIASES: Record<string, string> = {
  name: "name",
  productname: "name",
  product: "name",
  sku: "sku",
  price: "price",
  quantity: "quantity",
  qty: "quantity",
  lowstockat: "lowStockAt",
  lowstock: "lowStockAt",
  reorderlevel: "lowStockAt",
};

function normalizeHeader(header: string) {
  const key = header.replace(/^\uFEFF/, "").toLowerCase().replace(/[^a-z]/g, "");
  return HEADER_ALIASES[key] ?? header.trim();
}

export async function importProducts(
  _prevState: ImportState,
  formData: FormData
): Promise<ImportState> {
  const user = await getCurrentUser();

  // 1. File-level checks
  const file = formData.get("file");
  if (!file || typeof file === "string" || file.size === 0) {
    return { ok: false, fileError: "Choose a CSV file to upload." };
  }
  if (!/\.csv$/i.test(file.name)) {
    return { ok: false, fileError: "Only .csv files are supported." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, fileError: "The file is too large. The limit is 500 KB." };
  }

  // 2. Parse
  const text = (await file.text()).replace(/^\uFEFF/, "");
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: normalizeHeader,
  });

  if (parsed.errors.some((e) => e.type === "Quotes")) {
    return {
      ok: false,
      fileError: "The file has a quote (\") that is never closed. Check the cells with commas or quotes.",
    };
  }

  const fields = parsed.meta.fields ?? [];
  const missing = ["name", "price", "quantity"].filter((f) => !fields.includes(f));
  if (missing.length > 0) {
    return {
      ok: false,
      fileError: `Missing required column(s): ${missing.join(", ")}. The first row must be a header: name, sku, price, quantity, lowStockAt.`,
    };
  }

  const rows = parsed.data;
  if (rows.length === 0) {
    return { ok: false, fileError: "The file has a header but no product rows." };
  }
  if (rows.length > MAX_ROWS) {
    return {
      ok: false,
      fileError: `The file has ${rows.length} rows. The limit is ${MAX_ROWS} per import.`,
    };
  }

  // 3. Validate every row with the same Zod schema as the Add Product form
  const rowErrors: ImportRowError[] = [];
  const valid: { row: number; data: z.infer<typeof ProductSchema> }[] = [];
  const seenSkus = new Map<string, number>();

  rows.forEach((raw, index) => {
    const row = index + 2; // row 1 is the header
    const result = ProductSchema.safeParse({
      name: unguardCell(raw.name ?? ""),
      sku: unguardCell(raw.sku ?? ""),
      price: raw.price ?? "",
      quantity: raw.quantity ?? "",
      lowStockAt: raw.lowStockAt ?? "",
    });

    const messages: string[] = [];

    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors as Record<
        string,
        string[] | undefined
      >;
      for (const [field, errs] of Object.entries(fieldErrors)) {
        if (errs?.length) messages.push(`${field}: ${errs[0]}`);
      }
    } else if (result.data.sku) {
      const firstRow = seenSkus.get(result.data.sku);
      if (firstRow) {
        messages.push(`sku: "${result.data.sku}" is already used on row ${firstRow}`);
      } else {
        seenSkus.set(result.data.sku, row);
      }
    }

    if (messages.length > 0) {
      rowErrors.push({ row, messages });
    } else if (result.success) {
      valid.push({ row, data: result.data });
    }
  });

  // 4. SKUs that already exist in the database
  const skus = valid.map((v) => v.data.sku).filter((s): s is string => !!s);
  if (skus.length > 0) {
    const existing = await prisma.product.findMany({
      where: { sku: { in: skus } },
      select: { sku: true },
    });
    const taken = new Set(existing.map((e) => e.sku));
    for (const v of valid) {
      if (v.data.sku && taken.has(v.data.sku)) {
        rowErrors.push({
          row: v.row,
          messages: [`sku: "${v.data.sku}" is already used by another product`],
        });
      }
    }
  }

  if (rowErrors.length > 0) {
    rowErrors.sort((a, b) => a.row - b.row);
    return {
      ok: false,
      message: "Nothing was imported. Fix the rows below and upload the file again.",
      totalRows: rows.length,
      errorRowCount: rowErrors.length,
      rowErrors: rowErrors.slice(0, MAX_SHOWN_ERRORS),
    };
  }

  // 5. Save everything in one transaction
  const products = valid.map(({ data }) => ({
    id: randomUUID(),
    userId: user.id,
    ...data,
  }));

  const movements = products
    .filter((p) => p.quantity > 0)
    .map((p) => ({
      productId: p.id,
      userId: user.id,
      change: p.quantity,
      quantityAfter: p.quantity,
      reason: "INITIAL" as const,
    }));

  try {
    await prisma.$transaction([
      prisma.product.createMany({ data: products }),
      prisma.stockMovement.createMany({ data: movements }),
    ]);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        ok: false,
        fileError: "A SKU in this file was just taken by another product. Please try again.",
      };
    }
    console.error("importProducts error:", error);
    return { ok: false, fileError: "Something went wrong. Nothing was imported." };
  }

  revalidatePath("/inventory");
  revalidatePath("/dashboard");

  return {
    ok: true,
    imported: products.length,
    message: `Imported ${products.length} ${products.length === 1 ? "product" : "products"}`,
  };
}