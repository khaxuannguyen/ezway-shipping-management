import { prisma } from "@/lib/prisma";
import { CustomersClient } from "./customers-client";
import { PageHeader } from "@/components/page-header";

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
    const totalRevenue = customer.orders.reduce(
      (total, order) => total + order.totalFee,
      0,
    );
    const totalPaid = customer.orders.reduce(
      (total, order) =>
        total +
        order.payments.reduce((sum, payment) => sum + payment.amount, 0),
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
      <PageHeader
        title="Khách hàng"
        description="Quản lý hồ sơ khách hàng, doanh thu và công nợ theo đơn hàng."
        actionLabel="Tạo khách hàng"
        actionHref="/admin/customers/new"
      />

      <CustomersClient customers={rows} />
    </div>
  );
}
