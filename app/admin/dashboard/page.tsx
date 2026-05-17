import { PaymentStatus, OrderStatus } from "@prisma/client";
import { OrderTable } from "@/components/order-table";
import { formatCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import ProcessFlow from "@/components/process-flow";

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
    { label: "Tổng đơn hàng", value: totalOrders },
    { label: "Đơn mới", value: newOrders },
    { label: "Đơn đang vận chuyển", value: inTransitOrders },
    { label: "Đơn đã giao", value: deliveredOrders },
    { label: "Đơn gặp vấn đề", value: problemOrders },
    {
      label: "Doanh thu đã thu",
      value: formatCurrency(revenueResult._sum.totalFee ?? 0),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bảng điều khiển"
        description="Dữ liệu đơn hàng và doanh thu đang được thu thập từ SQLite qua Prisma."
        actionLabel="Xem tất cả đơn"
        actionHref="/admin/orders"
      />

      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <h2 className="text-base font-semibold text-ink">
          Luồng vận hành EZWAY
        </h2>
        <div className="mt-4">
          <ProcessFlow
            nodes={[
              {
                id: "new",
                title: "Khách tạo đơn",
                subtitle: `${newOrders} đơn`,
                status: "active",
              },
              {
                id: "pickup",
                title: "Pickup hàng",
                subtitle: "Chờ/Đang",
                status: "pending",
              },
              {
                id: "warehouse",
                title: "Nhập kho",
                subtitle: "Đã về kho",
                status: "pending",
              },
              {
                id: "packing",
                title: "Đóng gói",
                subtitle: "Đang xử lý",
                status: "pending",
              },
              {
                id: "handover",
                title: "Bàn giao tuyến",
                subtitle: "Tuyến vận chuyển",
                status: "pending",
              },
              {
                id: "intl",
                title: "Vận chuyển quốc tế",
                subtitle: "Theo dõi",
                status: "pending",
              },
              {
                id: "delivery",
                title: "Giao hàng",
                subtitle: `${deliveredOrders} đã giao`,
                status: "pending",
              },
              {
                id: "payment",
                title: "Thanh toán",
                subtitle: "Chưa/Đã",
                status: "pending",
              },
            ]}
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <article
            className="rounded-lg border border-line bg-white p-5 shadow-soft"
            key={stat.label}
          >
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-3 text-2xl font-bold text-ink">{stat.value}</p>
          </article>
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Đơn hàng mới nhất</h2>
        </div>
        <OrderTable orders={latestOrders} />
      </section>
    </div>
  );
}
