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

## Credits

Based on the [PedroTech Next.js inventory course](https://youtu.be/L5CsIkO5xv4).
