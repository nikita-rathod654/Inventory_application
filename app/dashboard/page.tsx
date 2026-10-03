import ProductsChart from "@/components/products-chart";
import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userId = user.id;

  const [totalProducts, lowStock, allProducts] = await Promise.all([
    prisma.product.count({ where: { userId } }),
    prisma.product.count({
      where: {
        userId,
        lowStockAt: { not: null },
        quantity: { lte: 5 },
      },
    }),
    prisma.product.findMany({
      where: { userId },
      select: { price: true, quantity: true, createdAt: true },
    }),
  ]);

  const totalValue = allProducts.reduce(
    (sum, product) => sum + Number(product.price) * Number(product.quantity),
    0
  );

  const inStockCount = allProducts.filter((p) => Number(p.quantity) > 5).length;
  const lowStockCount = allProducts.filter(
    (p) => Number(p.quantity) <= 5 && Number(p.quantity) >= 1
  ).length;
  const outOfStockCount = allProducts.filter(
    (p) => Number(p.quantity) === 0
  ).length;

  const inStockPercentage =
    totalProducts > 0 ? Math.round((inStockCount / totalProducts) * 100) : 0;
  const lowStockPercentage =
    totalProducts > 0 ? Math.round((lowStockCount / totalProducts) * 100) : 0;
  const outOfStockPercentage =
    totalProducts > 0 ? Math.round((outOfStockCount / totalProducts) * 100) : 0;

  const now = new Date();
  const weeklyProductsData = [];

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekStart.setHours(23, 59, 59, 999);

    const weekLabel = `${String(weekStart.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(weekStart.getDate() + 1).padStart(2, "0")}`;

    const weekProducts = allProducts.filter((product) => {
      const productDate = new Date(product.createdAt);
      return productDate >= weekStart && productDate <= weekEnd;
    });

    weeklyProductsData.push({
      week: weekLabel,
      products: weekProducts.length,
    });
  }

  const recent = await prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  console.log(totalValue);

  // ---- UI-only values ----
  const RING_RADIUS = 62;
  const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
  const inLen = (inStockPercentage / 100) * RING_LENGTH;
  const lowLen = (lowStockPercentage / 100) * RING_LENGTH;
  const outLen = (outOfStockPercentage / 100) * RING_LENGTH;

  const maxRecentQty = Math.max(...recent.map((p) => Number(p.quantity)), 1);

  const todayLabel = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const cardClass =
    "rounded-3xl border border-[#1B1635]/10 bg-white p-7 shadow-sm shadow-[#1B1635]/[0.04]";

  const stockStyles = [
    {
      label: "Out of stock",
      pill: "bg-[#D6453D]/10 text-[#B3342D]",
      bar: "bg-[#D6453D]",
      text: "text-[#B3342D]",
    },
    {
      label: "Low stock",
      pill: "bg-[#F5B83D]/20 text-[#8A5A00]",
      bar: "bg-[#F5B83D]",
      text: "text-[#B26B00]",
    },
    {
      label: "In stock",
      pill: "bg-[#5B3FD9]/10 text-[#4A31BD]",
      bar: "bg-[#5B3FD9]",
      text: "text-[#1B1635]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F5FA] text-[#1B1635] antialiased">
      <Sidebar currentPath="/dashboard" />
      <main className="ml-64 p-8 lg:p-12">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-1.5 text-sm text-[#1B1635]/60">
              Welcome back! Here is an overview of your inventory.
            </p>
          </div>
          <p className="rounded-full border border-[#1B1635]/10 bg-white px-4 py-2 text-sm text-[#1B1635]/65">
            {todayLabel}
          </p>
        </div>

        {/* Hero summary band */}
        <section className="relative mb-6 overflow-hidden rounded-3xl bg-[#1B1635] p-8 text-white lg:p-10">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#5B3FD9]/40 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[#F5B83D]/10 blur-3xl"
          />

          <div className="relative grid items-end gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-sm text-white/60">Total inventory value</p>
              <p className="mt-3 text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl">
                ${Number(totalValue).toFixed(0)}
              </p>
              <p className="mt-3 text-sm text-white/55">
                across {totalProducts}{" "}
                {totalProducts === 1 ? "product" : "products"}
              </p>
            </div>

            <dl className="grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.06] py-5 backdrop-blur-sm">
              <div className="px-5">
                <dd className="text-3xl font-semibold tabular-nums">
                  {totalProducts}
                </dd>
                <dt className="mt-1 text-xs text-white/55">Products</dt>
              </div>
              <div className="px-5">
                <dd
                  className={`text-3xl font-semibold tabular-nums ${
                    lowStock > 0 ? "text-[#F5B83D]" : ""
                  }`}
                >
                  {lowStock}
                </dd>
                <dt className="mt-1 text-xs text-white/55">Low stock</dt>
              </div>
              <div className="px-5">
                <dd
                  className={`text-3xl font-semibold tabular-nums ${
                    outOfStockCount > 0 ? "text-[#FF8A80]" : ""
                  }`}
                >
                  {outOfStockCount}
                </dd>
                <dt className="mt-1 text-xs text-white/55">Out of stock</dt>
              </div>
            </dl>
          </div>
        </section>

        {/* Chart + ring */}
        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.8fr_1fr]">
          <section className={cardClass}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  New products per week
                </h2>
                <p className="mt-0.5 text-sm text-[#1B1635]/50">
                  Last 12 weeks
                </p>
              </div>
            </div>
            <div className="mt-8 h-56">
              <ProductsChart data={weeklyProductsData} />
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="text-lg font-semibold tracking-tight">Efficiency</h2>
            <p className="mt-0.5 text-sm text-[#1B1635]/50">
              Products by stock status
            </p>

            <div className="mt-6 flex justify-center">
              <div className="relative h-44 w-44">
                <svg
                  viewBox="0 0 160 160"
                  className="h-full w-full -rotate-90"
                  aria-hidden="true"
                >
                  <circle
                    cx="80"
                    cy="80"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="#1B1635"
                    strokeOpacity="0.07"
                    strokeWidth="14"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="#5B3FD9"
                    strokeWidth="14"
                    strokeDasharray={`${inLen} ${RING_LENGTH - inLen}`}
                    strokeDashoffset={0}
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="#F5B83D"
                    strokeWidth="14"
                    strokeDasharray={`${lowLen} ${RING_LENGTH - lowLen}`}
                    strokeDashoffset={-inLen}
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="#D6453D"
                    strokeWidth="14"
                    strokeDasharray={`${outLen} ${RING_LENGTH - outLen}`}
                    strokeDashoffset={-(inLen + lowLen)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-semibold tabular-nums tracking-tight">
                      {inStockPercentage}%
                    </div>
                    <div className="text-xs text-[#1B1635]/55">In stock</div>
                  </div>
                </div>
              </div>
            </div>

            <ul className="mt-6 space-y-2.5 text-sm">
              <li className="flex items-center justify-between text-[#1B1635]/70">
                <span className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#5B3FD9]" />
                  In stock
                </span>
                <span className="font-medium tabular-nums text-[#1B1635]">
                  {inStockPercentage}%
                </span>
              </li>
              <li className="flex items-center justify-between text-[#1B1635]/70">
                <span className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#F5B83D]" />
                  Low stock
                </span>
                <span className="font-medium tabular-nums text-[#1B1635]">
                  {lowStockPercentage}%
                </span>
              </li>
              <li className="flex items-center justify-between text-[#1B1635]/70">
                <span className="flex items-center gap-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#D6453D]" />
                  Out of stock
                </span>
                <span className="font-medium tabular-nums text-[#1B1635]">
                  {outOfStockPercentage}%
                </span>
              </li>
            </ul>
          </section>
        </div>

        {/* Stock levels table */}
        <section className="overflow-hidden rounded-3xl border border-[#1B1635]/10 bg-white shadow-sm shadow-[#1B1635]/[0.04]">
          <div className="px-7 pb-5 pt-7">
            <h2 className="text-lg font-semibold tracking-tight">
              Stock levels
            </h2>
            <p className="mt-0.5 text-sm text-[#1B1635]/50">
              Your five most recent products
            </p>
          </div>

          {recent.length === 0 ? (
            <p className="mx-7 mb-7 rounded-2xl bg-[#F6F5FA] px-4 py-10 text-center text-sm text-[#1B1635]/55">
              No products yet. Add your first product to see its stock here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="border-y border-[#1B1635]/10 bg-[#F6F5FA]/70 text-xs text-[#1B1635]/50">
                    <th className="px-7 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="w-1/3 px-4 py-3 font-medium">Level</th>
                    <th className="px-7 py-3 text-right font-medium">Units</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1B1635]/[0.07]">
                  {recent.map((product, key) => {
                    const stockLevel =
                      product.quantity === 0
                        ? 0
                        : product.quantity <= (product.lowStockAt || 5)
                        ? 1
                        : 2;

                    const style = stockStyles[stockLevel];
                    const width = (Number(product.quantity) / maxRecentQty) * 100;

                    return (
                      <tr key={key}>
                        <td className="px-7 py-4 text-sm font-medium">
                          {product.name}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${style.pill}`}
                          >
                            {style.label}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1B1635]/[0.07]">
                            <div
                              className={`h-full rounded-full ${style.bar}`}
                              style={{ width: `${width}%` }}
                            />
                          </div>
                        </td>
                        <td
                          className={`px-7 py-4 text-right text-sm font-semibold tabular-nums ${style.text}`}
                        >
                          {product.quantity} units
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}