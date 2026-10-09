export const DEFAULT_LOW_STOCK = 5;

// Same rule the inventory page uses: no level set means 5
export function getLowStockThreshold(lowStockAt: number | null | undefined) {
  return lowStockAt || DEFAULT_LOW_STOCK;
}

export type AlertLevel = "low" | "out";

export function detectStockAlert(
  previous: number,
  current: number,
  threshold: number
): AlertLevel | null {
  // Went from some stock to none
  if (current === 0 && previous > 0) return "out";

  // Was above the level, is now at or below it
  if (current > 0 && current <= threshold && previous > threshold) return "low";

  return null;
}