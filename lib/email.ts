import { Resend } from "resend";

export type AlertProduct = {
  id: string;
  name: string;
  sku: string | null;
  quantity: number;
  threshold: number;
};

// Without a key the app still runs, it just skips emails
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.EMAIL_FROM || "Inventory App <onboarding@resend.dev>";
const APP_URL = (process.env.APP_URL || "http://localhost:3000").replace(/\/+$/, "");

// Product names are typed by users, so they must be escaped before going into HTML
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function send(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY is not set, skipping email.");
    return false;
  }

  try {
    // The Resend SDK returns { data, error } instead of throwing
    const { error } = await resend.emails.send({
      from: FROM,
      to: process.env.EMAIL_OVERRIDE_TO || options.to,   // changed
      subject: options.subject.replace(/[\r\n]+/g, " "),
      html: options.html,
      text: options.text,
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Failed to send:", err);
    return false;
  }
}

function layout(heading: string, intro: string, content: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#F6F5FA;font-family:Arial,Helvetica,sans-serif;color:#1B1635;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;padding:32px;">
          <tr><td>
            <p style="margin:0 0 4px;font-size:13px;font-weight:bold;color:#5B3FD9;">Inventory App</p>
            <h1 style="margin:0 0 12px;font-size:22px;">${heading}</h1>
            <p style="margin:0 0 20px;font-size:14px;line-height:1.5;">${intro}</p>
            ${content}
            <p style="margin:24px 0 0;font-size:12px;color:#8a879a;">You are receiving this because you have products in Inventory App.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function button(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background:#5B3FD9;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:bold;">${label}</a>`;
}

export async function sendLowStockAlert(params: {
  to: string;
  level: "low" | "out";
  product: AlertProduct;
}) {
  const { to, level, product } = params;
  const out = level === "out";
  const name = escapeHtml(product.name);
  const link = `${APP_URL}/inventory/${product.id}`;

  const subject = out
    ? `Out of stock: ${product.name}`
    : `Low stock: ${product.name} (${product.quantity} left)`;

  const intro = out
    ? `<strong>${name}</strong> has run out of stock.`
    : `<strong>${name}</strong> is down to <strong>${product.quantity}</strong> units, which is at or below its low stock level of ${product.threshold}.`;

  const html = layout(
    out ? "Out of stock" : "Low stock",
    intro,
    button(link, "View product")
  );

  const text = out
    ? `${product.name} has run out of stock.\n\nView it: ${link}`
    : `${product.name} is down to ${product.quantity} units (low stock level: ${product.threshold}).\n\nView it: ${link}`;

  return send({ to, subject, html, text });
}

export async function sendLowStockDigest(params: {
  to: string;
  items: AlertProduct[];
}) {
  const { to, items } = params;
  const MAX_ROWS = 50;
  const shown = items.slice(0, MAX_ROWS);
  const extra = items.length - shown.length;
  const outCount = items.filter((i) => i.quantity === 0).length;

  const rows = shown
    .map((p) => {
      const out = p.quantity === 0;
      const color = out ? "#B3342D" : "#B26B00";
      const label = out ? "Out of stock" : "Low stock";
      return `<tr>
        <td style="padding:10px 0;border-top:1px solid #eeeaf5;font-size:14px;">
          <a href="${APP_URL}/inventory/${p.id}" style="color:#1B1635;text-decoration:none;font-weight:bold;">${escapeHtml(p.name)}</a>
          ${p.sku ? `<br><span style="font-size:12px;color:#8a879a;">${escapeHtml(p.sku)}</span>` : ""}
        </td>
        <td style="padding:10px 0;border-top:1px solid #eeeaf5;font-size:14px;text-align:right;white-space:nowrap;">
          <strong style="color:${color};">${p.quantity}</strong>
          <span style="font-size:12px;color:#8a879a;"> / ${p.threshold}</span><br>
          <span style="font-size:12px;color:${color};">${label}</span>
        </td>
      </tr>`;
    })
    .join("");

  const table = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
    ${extra > 0 ? `<p style="font-size:13px;color:#8a879a;">and ${extra} more.</p>` : ""}
    <p style="margin:20px 0 0;">${button(`${APP_URL}/inventory`, "Open inventory")}</p>`;

  const intro = `${items.length} ${items.length === 1 ? "product needs" : "products need"} attention${
    outCount > 0 ? `, ${outCount} out of stock` : ""
  }. Numbers show units on hand / low stock level.`;

  const subject = `Daily stock digest: ${items.length} ${
    items.length === 1 ? "item" : "items"
  } low or out of stock`;

  const text =
    `${items.length} products need attention:\n\n` +
    shown.map((p) => `- ${p.name}: ${p.quantity} left (level ${p.threshold})`).join("\n") +
    (extra > 0 ? `\n...and ${extra} more` : "") +
    `\n\nOpen inventory: ${APP_URL}/inventory`;

  return send({ to, subject, html: layout("Daily stock digest", intro, table), text });
}