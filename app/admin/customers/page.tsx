import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CustomersClient } from "./customers-client";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    include: {
      orders: {
        include: {
          payments: {
            select: {
              amount: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = customers.map((customer) => {
    const totalRevenue = customer.orders.reduce((total, order) => total + order.totalFee, 0);
    const totalPaid = customer.orders.reduce(
      (total, order) => total + order.payments.reduce((sum, payment) => sum + payment.amount, 0),
      0,
    );

    return {
      id: customer.id,
      customerCode: customer.customerCode,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      createdAt: customer.createdAt.toISOString(),
      orderCount: customer.orders.length,
      totalRevenue,
      outstandingDebt: Math.max(totalRevenue - totalPaid, 0),
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Khach hang</h1>
          <p className="mt-1 text-sm text-slate-600">
            Quan ly ho so khach hang, doanh thu va cong no theo don hang.
          </p>
        </div>
        <Link
          className="w-fit rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          href="/admin/customers/new"
        >
          Tao khach hang
        </Link>
      </div>

      <CustomersClient customers={rows} />
    </div>
  );
}
