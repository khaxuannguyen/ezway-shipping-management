import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { OrdersClient } from "./orders-client";

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Don hang</h1>
          <p className="mt-1 text-sm text-slate-600">
            Danh sach order dang doc tu database, include customer.
          </p>
        </div>
        <Link
          className="w-fit rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          href="/admin/orders/new"
        >
          Tao don hang
        </Link>
      </div>
      <OrdersClient orders={serializedOrders} />
    </div>
  );
}
