// Cells that start with these characters can run as formulas when the file
// is opened in Excel or Google Sheets ("CSV injection"). We prefix them with '.
const FORMULA_START = /^[=+\-@\t\r]/;

function escapeCell(value: string | number | null | undefined) {
  let text = value == null ? "" : String(value);

  if (typeof value === "string" && FORMULA_START.test(text)) {
    text = `'${text}`;
  }
  if (/[",\r\n]/.test(text)) {
    text = `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function toCsv(
  headers: string[],
  rows: Array<Array<string | number | null | undefined>>
) {
  const lines = [headers, ...rows].map((row) => row.map(escapeCell).join(","));
  // BOM so Excel reads the file as UTF-8 (names with accents or symbols)
  return "\uFEFF" + lines.join("\r\n") + "\r\n";
}

// Undo the ' guard when importing a file we exported ourselves
export function unguardCell(value: string) {
  return value.replace(/^'(?=[=+\-@\t\r])/, "");
}

export type ImportRowError = { row: number; messages: string[] };

export type ImportState = {
  ok: boolean;
  message?: string;
  imported?: number;
  fileError?: string;
  totalRows?: number;
  errorRowCount?: number;
  rowErrors?: ImportRowError[];
};