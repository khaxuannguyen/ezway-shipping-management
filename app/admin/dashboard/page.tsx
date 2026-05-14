import { PaymentStatus, OrderStatus } from "@prisma/client";
import Link from "next/link";
import { OrderTable } from "@/components/order-table";
import { formatCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [
    totalOrders,
    newOrders,
    inTransitOrders,
    deliveredOrders,
    problemOrders,
    revenueResult,
    latestOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: OrderStatus.NEW } }),
    prisma.order.count({ where: { status: OrderStatus.IN_TRANSIT } }),
    prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
    prisma.order.count({ where: { status: OrderStatus.PROBLEM } }),
    prisma.order.aggregate({
      _sum: { totalFee: true },
      where: {
        paymentStatus: {
          in: [PaymentStatus.PAID, PaymentStatus.PARTIAL],
        },
      },
    }),
    prisma.order.findMany({
      include: {
        customer: {
          select: {
            name: true,
            phone: true,
          },
        },
        shippingService: {
          select: {
            code: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Tong don hang", value: totalOrders },
    { label: "Don NEW", value: newOrders },
    { label: "Don IN_TRANSIT", value: inTransitOrders },
    { label: "Don DELIVERED", value: deliveredOrders },
    { label: "Don PROBLEM", value: problemOrders },
    { label: "Doanh thu da thu", value: formatCurrency(revenueResult._sum.totalFee ?? 0) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Du lieu don hang va doanh thu dang doc truc tiep tu SQLite qua Prisma.
          </p>
        </div>
        <Link
          className="w-fit rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
          href="/admin/orders"
        >
          Xem tat ca don
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <article className="rounded-lg border border-line bg-white p-5 shadow-soft" key={stat.label}>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-3 text-2xl font-bold text-ink">{stat.value}</p>
          </article>
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Don hang moi nhat</h2>
        </div>
        <OrderTable orders={latestOrders} />
      </section>
    </div>
  );
}
