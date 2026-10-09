# Inventory App

A full-stack inventory management app for tracking products, adjusting stock, ordering from suppliers, and getting email alerts before items run out.

<img width="1345" height="687" alt="image" src="https://github.com/user-attachments/assets/2deff5df-2639-4c53-9a71-3d6b01b00dae" />
<img width="1345" height="615" alt="image" src="https://github.com/user-attachments/assets/b1b48d5e-6d26-4986-afec-051f61184f10" />
<img width="1344" height="599" alt="image" src="https://github.com/user-attachments/assets/d2daf157-673e-4021-9106-b21d58c334ab" />
<img width="1361" height="616" alt="image" src="https://github.com/user-attachments/assets/f591e9f4-842c-4109-b874-9478c72514fc" />
<img width="1346" height="589" alt="image" src="https://github.com/user-attachments/assets/059d65d4-6fe8-425c-85c4-c8a6a79a1416" />
<img width="1344" height="567" alt="image" src="https://github.com/user-attachments/assets/f7d3cb1f-929b-4059-88d7-1fd96372b8fd" />


**Live demo:** https://inventory-application-xi.vercel.app

<!-- Add screenshots here once you have them, for example:
![Dashboard](docs/screenshots/dashboard.png)
![Inventory](docs/screenshots/inventory.png)
![Purchase order](docs/screenshots/purchase-order.png)
-->

---

## Features

### Inventory
- Add, search, paginate, and delete products (name, SKU, price, quantity, low stock level)
- **CSV import** with row-by-row validation and clear error messages, and **CSV export**
- Colour-coded status: in stock, low stock, out of stock
- Dashboard with stock overview and charts

### Stock control
- Adjust stock with a reason: restock, return, sale, damaged, or correction
- Full **stock history** for every product, with the balance after each change
- Stock can never go below zero, even with simultaneous requests

### Low stock email alerts
- Instant email when a product **crosses** its low stock level, and another when it hits zero
- No spam: selling more of an item that is already low sends nothing
- **Daily digest** email of all low and out-of-stock products (Vercel Cron)
- Emails are sent after the database commit, so a mail failure never undoes a stock change

### Suppliers and purchase orders
- Supplier management with **CSV bulk import**
- Purchase orders with line items, quantities, and unit costs
- Workflow: **Draft → Ordered → Received** (or Cancelled)
- Receiving an order restocks every product and writes history entries in one transaction

### Experience
- Secure sign-in with Stack Auth
- Fully responsive: sidebar on desktop, drawer on mobile, card layouts for tables
- Page-specific loading skeletons and toast notifications

---

## Tech stack

| Area | Tools |
|---|---|
| Framework | Next.js 15 (App Router, Server Actions, Turbopack) |
| Language | TypeScript, React |
| Styling | Tailwind CSS, Lucide icons |
| Database | PostgreSQL (Neon) with Prisma ORM |
| Auth | Stack Auth |
| Validation | Zod |
| Email | Resend |
| Notifications | Sonner |
| Hosting | Vercel (including Cron Jobs) |

---

## How it works

A few design decisions worth calling out:

- **Atomic stock changes.** Updating a product and writing its history entry happen inside one `prisma.$transaction`, so inventory and history can never drift apart.
- **Race-safe negative stock check.** The "enough stock?" rule is part of the UPDATE's `WHERE` clause, not a separate read, so two people selling the last units at the same time can't push stock below zero.
- **Purchase order state machine.** Valid moves live in one transition map. Every status change is a compare-and-set update, so a double click can never receive an order twice.
- **Alerts fire on crossing, not on every change.** A small pure function decides whether a change crossed the threshold, which makes it easy to unit test.
- **Email never breaks the app.** `send()` never throws, and emails are scheduled with Next's `after()` once the response is sent. Without a Resend key, the app keeps working and skips the email.
- **Security basics.** Every query is scoped to the signed-in user, IDs sent from the browser are re-checked for ownership, user-typed text is HTML-escaped in emails, and the cron endpoint requires a bearer secret in production.
- **History is protected.** Foreign keys use `Restrict`, so a supplier or product used by an order can't be deleted out from under it.

---

## Getting started

### Prerequisites
- Node.js 20 or newer
- A PostgreSQL database (a free [Neon](https://neon.tech) project works well)
- A [Stack Auth](https://stack-auth.com) project
- A [Resend](https://resend.com) account (optional, for emails)

### 1. Clone and install

```bash
git clone https://github.com/nikita-rathod654/Inventory_application.git
cd Inventory_application
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"

# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
STACK_SECRET_SERVER_KEY=your_secret_key

# Email (optional)
RESEND_API_KEY=re_your_key
EMAIL_FROM="Inventory App <onboarding@resend.dev>"
APP_URL=http://localhost:3000
CRON_SECRET=a-long-random-string
EMAIL_OVERRIDE_TO=you@example.com
```

| Variable | Purpose |
|---|---|
| `DATABASE_URL` / `DIRECT_URL` | Pooled and direct PostgreSQL connections |
| `NEXT_PUBLIC_STACK_*`, `STACK_SECRET_SERVER_KEY` | Stack Auth credentials |
| `RESEND_API_KEY` | Sends emails. If missing, emails are skipped |
| `EMAIL_FROM` | Sender address (use a verified domain in production) |
| `APP_URL` | Base URL for links in emails |
| `CRON_SECRET` | Protects the daily digest endpoint |
| `EMAIL_OVERRIDE_TO` | Optional. Sends every email to this address (handy for testing) |

> Never commit `.env`. It is listed in `.gitignore`.

> Resend's free test sender (`onboarding@resend.dev`) only delivers to your own Resend account email. To email other people, verify a domain in Resend.

### 3. Set up the database

```bash
npx prisma migrate dev
```

### 4. Run it

```bash
npm run dev
```

Open http://localhost:3000.

---

## Testing the alerts locally

1. Add a product with quantity `20` and low stock level `10`.
2. Record a **Sale** of `6` (stock 15 → 9). A "Low stock" email should arrive.
3. Record another sale. No new email, because it was already low.
4. Reduce stock to `0`. An "Out of stock" email arrives.
5. Open `http://localhost:3000/api/cron/low-stock-digest` to trigger the digest.

---

## Project structure

```
app/
  dashboard/            Dashboard and charts
  inventory/            Product list, history, CSV import
  add-product/          New product form
  suppliers/            Supplier list, add, CSV import
  purchase-orders/      Order list, create, detail and workflow
  api/
    inventory/export/   Product CSV export
    cron/low-stock-digest/   Daily digest (Vercel Cron)
components/             Sidebar, forms, pagination, page shell
lib/
  actions/              Server actions (stock, products, suppliers, orders)
  validations/          Zod schemas
  email.ts              Resend client and email templates
  stock-alerts.ts       Threshold-crossing logic
  purchase-order-status.ts   Order state machine
prisma/
  schema.prisma         Data model and migrations
vercel.json             Cron schedule
```

---

## Deploying to Vercel

1. Push the repo to GitHub and import it in Vercel.
2. Add every variable from the table above under **Settings → Environment Variables**. Set `APP_URL` to your live URL and use a new random `CRON_SECRET`.
3. In the Stack Auth dashboard, add your Vercel domain under **Domain & Handlers**.
4. Apply the database migrations to your production database:
   ```bash
   npx prisma migrate deploy
   ```
5. Redeploy. The daily digest runs at 03:30 UTC (`vercel.json`). Vercel's free Hobby plan allows one cron run per day.

---


## Author

Built by **Nikita** ([@nikita-rathod654](https://github.com/nikita-rathod654)).
