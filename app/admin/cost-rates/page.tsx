import Link from "next/link";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function CostRatesPage() {
  const services = await prisma.shippingService.findMany({
    include: {
      costRates: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { code: "asc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Giá gốc"
        description="Quản lý bảng giá gốc cho các tuyến dịch vụ vận chuyển"
        actionLabel="Tạo bảng giá"
        actionHref="/admin/cost-rates/new"
      />

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  Mã dịch vụ
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  Tên dịch vụ
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  Ngày cập nhật
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {services.map((service) => {
                const hasRates = service.costRates.length > 0;
                const latestUpdatedAt = service.costRates.reduce(
                  (latest, rate) =>
                    rate.updatedAt > latest ? rate.updatedAt : latest,
                  service.costRates.length > 0
                    ? service.costRates[0].updatedAt
                    : new Date(0),
                );

                return (
                  <tr key={service.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                      {service.code}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{service.name}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {hasRates ? formatDateTime(latestUpdatedAt) : "Chưa có"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          hasRates
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {hasRates ? "Đã có bảng giá" : "Chưa có bảng giá"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        {hasRates ? (
                          <>
                            <Link
                              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              href={`/admin/cost-rates/${service.id}`}
                            >
                              Xem
                            </Link>
                            <Link
                              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              href={`/admin/cost-rates/${service.id}/edit`}
                            >
                              Sửa
                            </Link>
                            <Link
                              className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              href={`/admin/cost-rates/new?serviceId=${service.id}`}
                            >
                              Thay thế
                            </Link>
                          </>
                        ) : (
                          <Link
                            className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            href={`/admin/cost-rates/new?serviceId=${service.id}`}
                          >
                            Tạo bảng giá
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
