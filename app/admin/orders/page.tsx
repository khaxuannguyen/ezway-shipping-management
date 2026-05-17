import { prisma } from "@/lib/prisma";
import { OrdersClient } from "./orders-client";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
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
  });

  const serializedOrders = orders.map((order) => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Đơn hàng"
        description="Quản lý và theo dõi tất cả đơn hàng vận chuyển quốc tế"
        actionLabel="Tạo đơn hàng"
        actionHref="/admin/orders/new"
      />
      <OrdersClient orders={serializedOrders} />
    </div>
  );
}
