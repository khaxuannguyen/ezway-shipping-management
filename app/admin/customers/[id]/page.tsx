import Link from "next/link";
import { notFound } from "next/navigation";
import { InfoCard, InfoRow } from "@/components/info-card";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      orders: {
        include: {
          payments: {
            select: {
              amount: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  const totalRevenue = customer.orders.reduce((total, order) => total + order.totalFee, 0);
  const totalPaid = customer.orders.reduce(
    (total, order) => total + order.payments.reduce((sum, payment) => sum + payment.amount, 0),
    0,
  );
  const outstandingDebt = Math.max(totalRevenue - totalPaid, 0);

  const stats = [
    { label: "Tong don hang", value: customer.orders.length },
    { label: "Tong doanh thu", value: formatCurrency(totalRevenue) },
    { label: "Tong da thanh toan", value: formatCurrency(totalPaid) },
    { label: "Tong con no", value: formatCurrency(outstandingDebt) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link className="text-sm font-semibold text-brand hover:text-blue-700" href="/admin/customers">
            {"<-"} Quay lai danh sach
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-ink">{customer.name}</h1>
          <p className="mt-1 text-sm text-slate-600">{customer.customerCode}</p>
        </div>
        <Link
          className="w-fit rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
          href={`/admin/customers/${customer.id}/edit`}
        >
          Sua thong tin
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article className="rounded-lg border border-line bg-white p-5 shadow-soft" key={stat.label}>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-3 text-2xl font-bold text-ink">{stat.value}</p>
          </article>
        ))}
      </section>

      <InfoCard title="Thong tin khach hang">
        <InfoRow label="Ma khach" value={customer.customerCode} />
        <InfoRow label="Ten" value={customer.name} />
        <InfoRow label="So dien thoai" value={customer.phone} />
        <InfoRow label="Email" value={customer.email ?? "-"} />
        <InfoRow label="Dia chi" value={customer.address ?? "-"} />
        <InfoRow label="Ngay tao" value={formatDate(customer.createdAt)} />
      </InfoCard>

      <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <h2 className="text-base font-semibold text-ink">Don hang cua khach</h2>
        <div className="mt-4 overflow-x-auto">
          {customer.orders.length === 0 ? (
            <p className="text-sm text-slate-500">Khach hang nay chua co don hang.</p>
          ) : (
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Ma don</th>
                  <th className="px-4 py-3">Tracking</th>
                  <th className="px-4 py-3">Nguoi nhan</th>
                  <th className="px-4 py-3">Quoc gia nhan</th>
                  <th className="px-4 py-3">Trang thai</th>
                  <th className="px-4 py-3 text-right">Tong phi</th>
                  <th className="px-4 py-3">Ngay tao</th>
                  <th className="px-4 py-3 text-right">Hanh dong</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {customer.orders.map((order) => (
                  <tr className="hover:bg-slate-50" key={order.id}>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-ink">
                      {order.orderCode}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {order.trackingCode}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {order.receiverName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {order.destinationCountry}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-ink">
                      {formatCurrency(order.totalFee)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <Link
                        className="rounded-md border border-line px-3 py-2 text-xs font-semibold text-brand hover:border-brand hover:bg-blue-50"
                        href={`/admin/orders/${order.id}`}
                      >
                        Xem chi tiet
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
