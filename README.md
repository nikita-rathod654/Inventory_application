# Inventory Management App

A full-stack inventory app built with Next.js 15, Prisma, PostgreSQL (Neon) and Stack Auth. Sign up, add products, and track stock, total value and low-stock items from a dashboard.

**Live demo:** https://inventory-application-xi.vercel.app

## Features

- Sign up and sign in with Stack Auth (Hexclave)
- Dashboard with total products, total value, low-stock count and charts
- Inventory table with search and pagination
- Add and delete products
- Each user sees only their own products

## Tech Stack

Next.js 15, React 19, TypeScript, Tailwind CSS, Prisma, PostgreSQL (Neon), Stack Auth, Recharts, Zod, Vercel

## Run Locally

```bash
git clone https://github.com/nikita-rathod654/Inventory_application.git
cd Inventory_application
npm install
```

Create a `.env` file:

```env
DATABASE_URL="your-neon-connection-string"
NEXT_PUBLIC_STACK_PROJECT_ID="your-project-id"
STACK_SECRET_SERVER_KEY="your-secret-server-key"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="your-publishable-client-key"
```

Set up the database and start the app:

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```

Open http://localhost:3000.

## Deploy

Push to GitHub, import the repo into Vercel, add the same environment variables, then add your Vercel domain as a trusted domain in the Stack Auth / Hexclave dashboard.

## Screenshots 

<img width="1344" height="664" alt="image" src="https://github.com/user-attachments/assets/7ca69125-235c-4212-9ffa-0442b23385bd" />

<img width="1340" height="691" alt="image" src="https://github.com/user-attachments/assets/ae888077-a0b8-4314-836e-855a90de49be" />

<img width="1333" height="675" alt="image" src="https://github.com/user-attachments/assets/fe7f5778-e76c-4b0b-ac4a-4e28717edf0b" />

<img width="1333" height="610" alt="image" src="https://github.com/user-attachments/assets/ba354cbc-061c-4958-8726-d4ffa3ac2a73" />
