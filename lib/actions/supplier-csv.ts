"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";
import {
  MAX_BYTES,
  MAX_ROWS,
  parseCsv,
  type SupplierImportState,
} from "../supplier-csv";
import { SupplierSchema } from "../validations/suppliers";

const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  notes: "Notes",
};

const MAX_ERRORS_SHOWN = 50;

export async function importSuppliers(
  _prevState: SupplierImportState,
  formData: FormData
): Promise<SupplierImportState> {
  const user = await getCurrentUser();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, fileError: "Choose a CSV file to import." };
  }
  if (!file.name.toLowerCase().endsWith(".csv")) {
    return { ok: false, fileError: "The file must be a .csv file." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, fileError: "The file is larger than 500 KB." };
  }

  let table: string[][];
  try {
    table = parseCsv(await file.text());
  } catch (error) {
    return {
      ok: false,
      fileError: error instanceof Error ? error.message : "Could not read the file.",
    };
  }

  if (table.length === 0) {
    return { ok: false, fileError: "The file is empty." };
  }

  // Header row: find each column by name, so column order doesn't matter
  const header = table[0].map((h) => h.trim().toLowerCase());
  const idx = {
    name: header.indexOf("name"),
    email: header.indexOf("email"),
    phone: header.indexOf("phone"),
    notes: header.indexOf("notes"),
  };
  if (idx.name === -1) {
    return {
      ok: false,
      fileError: 'The first row must contain a "name" column.',
    };
  }

  // Row numbers match what the user sees in a spreadsheet (header is row 1)
  const entries = table
    .slice(1)
    .map((cells, i) => ({ cells, row: i + 2 }))
    .filter((e) => e.cells.some((c) => c.trim() !== ""));

  if (entries.length === 0) {
    return { ok: false, fileError: "The file has no supplier rows." };
  }
  if (entries.length > MAX_ROWS) {
    return {
      ok: false,
      fileError: `The file has ${entries.length} rows. The limit is ${MAX_ROWS}.`,
    };
  }

  const existing = await prisma.supplier.findMany({
    where: { userId: user.id },
    select: { name: true },
  });
  const existingNames = new Set(existing.map((s) => s.name.trim().toLowerCase()));
  const seenInFile = new Map<string, number>();

  const valid: {
    userId: string;
    name: string;
    email?: string;
    phone?: string;
    notes?: string;
  }[] = [];
  const rowErrors: { row: number; messages: string[] }[] = [];

  for (const { cells, row } of entries) {
    const get = (i: number) => (i >= 0 ? (cells[i] ?? "") : "");
    const parsed = SupplierSchema.safeParse({
      name: get(idx.name),
      email: get(idx.email),
      phone: get(idx.phone),
      notes: get(idx.notes),
    });

    const messages: string[] = [];

    if (!parsed.success) {
      const fieldErrors = z.flattenError(parsed.error).fieldErrors as Record<
        string,
        string[] | undefined
      >;
      for (const [field, list] of Object.entries(fieldErrors)) {
        for (const m of list ?? []) {
          messages.push(`${FIELD_LABELS[field] ?? field}: ${m}`);
        }
      }
    } else {
      const key = parsed.data.name.toLowerCase();
      if (existingNames.has(key)) {
        messages.push("Name: a supplier with this name already exists");
      } else if (seenInFile.has(key)) {
        messages.push(`Name: same as row ${seenInFile.get(key)} in this file`);
      } else {
        seenInFile.set(key, row);
      }
    }

    if (messages.length > 0) {
      rowErrors.push({ row, messages });
    } else if (parsed.success) {
      valid.push({ userId: user.id, ...parsed.data });
    }
  }

  // All or nothing: one bad row means nothing is saved
  if (rowErrors.length > 0) {
    return {
      ok: false,
      message: "Nothing was imported. Fix these rows and upload the file again.",
      totalRows: entries.length,
      errorRowCount: rowErrors.length,
      rowErrors: rowErrors.slice(0, MAX_ERRORS_SHOWN),
    };
  }

  try {
    // createMany runs as one statement, so it is atomic too
    await prisma.supplier.createMany({ data: valid });
  } catch (error) {
    console.error("importSuppliers error:", error);
    return { ok: false, fileError: "Something went wrong. Please try again." };
  }

  revalidatePath("/suppliers");
  return {
    ok: true,
    message: `Imported ${valid.length} ${valid.length === 1 ? "supplier" : "suppliers"}.`,
    totalRows: entries.length,
  };
}