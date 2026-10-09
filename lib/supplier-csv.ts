export const MAX_ROWS = 500;
export const MAX_BYTES = 500 * 1024;

export type SupplierImportState = {
  ok: boolean;
  message?: string;
  fileError?: string;
  totalRows?: number;
  errorRowCount?: number;
  rowErrors?: { row: number; messages: string[] }[];
};

// Small CSV parser: handles quotes, commas inside quotes, "" escapes,
// CRLF line endings, and a leading BOM (Excel adds one).
export function parseCsv(input: string): string[][] {
  const text = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }

  if (inQuotes) throw new Error("A quoted value is never closed. Check for a stray quote mark.");

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}