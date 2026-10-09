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
  weekEnd.setHours(23, 59, 59, 999);

  const weekLabel = `${String(weekStart.getMonth() + 1).padStart(2, "0")}/${String(
    weekStart.getDate()
  ).padStart(2, "0")}`;

  const weekProducts = allProducts.filter((product) => {
    const productDate = new Date(product.createdAt);
    return productDate >= weekStart && productDate <= weekEnd;
  });

  weeklyProductsData.push({ week: weekLabel, products: weekProducts.length });
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
    "min-w-0 rounded-2xl border border-[#1B1635]/10 bg-white p-5 shadow-sm shadow-[#1B1635]/[0.04] sm:rounded-3xl sm:p-7";

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
      <main className="px-4 pb-8 pt-20 sm:px-6 lg:ml-64 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1.5 text-sm text-[#1B1635]/60">
              Welcome back! Here is an overview of your inventory.
            </p>
          </div>
          <p className="w-fit rounded-full border border-[#1B1635]/10 bg-white px-4 py-2 text-xs text-[#1B1635]/65 sm:text-sm">
            {todayLabel}
          </p>
        </div>

        {/* Hero summary band */}
        <section className="relative mb-5 overflow-hidden rounded-2xl bg-[#1B1635] p-5 text-white sm:mb-6 sm:rounded-3xl sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#5B3FD9]/40 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[#F5B83D]/10 blur-3xl"
          />

          <div className="relative grid items-end gap-6 sm:gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div className="min-w-0">
              <p className="text-sm text-white/60">Total inventory value</p>
              <p className="mt-2 break-words text-4xl font-semibold tabular-nums tracking-tight sm:mt-3 sm:text-5xl lg:text-6xl">
                ${Number(totalValue).toFixed(0)}
              </p>
              <p className="mt-2 text-sm text-white/55 sm:mt-3">
                across {totalProducts}{" "}
                {totalProducts === 1 ? "product" : "products"}
              </p>
            </div>

            <dl className="grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.06] py-4 backdrop-blur-sm sm:py-5">
              <div className="px-3 sm:px-5">
                <dd className="text-2xl font-semibold tabular-nums sm:text-3xl">
                  {totalProducts}
                </dd>
                <dt className="mt-1 text-xs text-white/55">Products</dt>
              </div>
              <div className="px-3 sm:px-5">
                <dd
                  className={`text-2xl font-semibold tabular-nums sm:text-3xl ${
                    lowStock > 0 ? "text-[#F5B83D]" : ""
                  }`}
                >
                  {lowStock}
                </dd>
                <dt className="mt-1 text-xs text-white/55">Low stock</dt>
              </div>
              <div className="px-3 sm:px-5">
                <dd
                  className={`text-2xl font-semibold tabular-nums sm:text-3xl ${
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
        <div className="mb-5 grid grid-cols-1 gap-5 sm:mb-6 sm:gap-6 xl:grid-cols-[1.8fr_1fr]">
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
            <div className="mt-6 h-52 w-full min-w-0 sm:mt-8 sm:h-56">
              <ProductsChart data={weeklyProductsData} />
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="text-lg font-semibold tracking-tight">Efficiency</h2>
            <p className="mt-0.5 text-sm text-[#1B1635]/50">
              Products by stock status
            </p>

            <div className="mt-6 flex justify-center">
              <div className="relative h-36 w-36 sm:h-44 sm:w-44">
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
                    <div className="text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
                      {inStockPercentage}%
                    </div>
                    <div className="text-xs text-[#1B1635]/55">In stock</div>
                  </div>
                </div>
              </div>
            </div>

            <ul className="mx-auto mt-6 max-w-sm space-y-2.5 text-sm xl:max-w-none">
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
        <section className="min-w-0 overflow-hidden rounded-2xl border border-[#1B1635]/10 bg-white shadow-sm shadow-[#1B1635]/[0.04] sm:rounded-3xl">
          <div className="px-4 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-7">
            <h2 className="text-lg font-semibold tracking-tight">
              Stock levels
            </h2>
            <p className="mt-0.5 text-sm text-[#1B1635]/50">
              Your five most recent products
            </p>
          </div>

          {recent.length === 0 ? (
            <p className="mx-4 mb-5 rounded-2xl bg-[#F6F5FA] px-4 py-8 text-center text-sm text-[#1B1635]/55 sm:mx-7 sm:mb-7 sm:py-10">
              No products yet. Add your first product to see its stock here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-y border-[#1B1635]/10 bg-[#F6F5FA]/70 text-xs text-[#1B1635]/50">
                    <th className="px-4 py-3 font-medium sm:px-7">Product</th>
                    <th className="px-2 py-3 font-medium sm:px-4">Status</th>
                    <th className="hidden w-1/3 px-4 py-3 font-medium md:table-cell">
                      Level
                    </th>
                    <th className="px-4 py-3 text-right font-medium sm:px-7">
                      Units
                    </th>
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
                        <td className="max-w-[140px] truncate px-4 py-3.5 text-sm font-medium sm:max-w-none sm:px-7 sm:py-4">
                          {product.name}
                        </td>
                        <td className="px-2 py-3.5 sm:px-4 sm:py-4">
                          <span
                            className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium sm:px-3 ${style.pill}`}
                          >
                            {style.label}
                          </span>
                        </td>
                        <td className="hidden px-4 py-4 md:table-cell">
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1B1635]/[0.07]">
                            <div
                              className={`h-full rounded-full ${style.bar}`}
                              style={{ width: `${width}%` }}
                            />
                          </div>
                        </td>
                        <td
                          className={`whitespace-nowrap px-4 py-3.5 text-right text-sm font-semibold tabular-nums sm:px-7 sm:py-4 ${style.text}`}
                        >
                          {product.quantity}
                          <span className="hidden sm:inline"> units</span>
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