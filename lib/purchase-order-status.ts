import type { PurchaseOrderStatus } from "@prisma/client";

export const PO_STATUSES: PurchaseOrderStatus[] = [
  "DRAFT",
  "ORDERED",
  "RECEIVED",
  "CANCELLED",
];

// The only legal moves. Everything else is rejected.
export const TRANSITIONS: Record<PurchaseOrderStatus, PurchaseOrderStatus[]> = {
  DRAFT: ["ORDERED", "CANCELLED"],
  ORDERED: ["RECEIVED", "CANCELLED"],
  RECEIVED: [],
  CANCELLED: [],
};

// "Which statuses may move to X?" Used in WHERE clauses so the database
// itself refuses an illegal move.
export function statusesThatCanMoveTo(to: PurchaseOrderStatus) {
  return PO_STATUSES.filter((from) => TRANSITIONS[from].includes(to));
}

export const STATUS_LABELS: Record<PurchaseOrderStatus, string> = {
  DRAFT: "Draft",
  ORDERED: "Ordered",
  RECEIVED: "Received",
  CANCELLED: "Cancelled",
};

export const STATUS_STYLES: Record<PurchaseOrderStatus, string> = {
  DRAFT: "bg-[#1B1635]/[0.06] text-[#1B1635]/70",
  ORDERED: "bg-[#5B3FD9]/10 text-[#4A31BD]",
  RECEIVED: "bg-[#2E9E6B]/10 text-[#1F7A50]",
  CANCELLED: "bg-[#D6453D]/10 text-[#B3342D]",
};

export function formatPoNumber(n: number) {
  return `PO-${String(n).padStart(4, "0")}`;
}