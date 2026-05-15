import Link from "next/link";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Gia goc dich vu</h1>
          <p className="mt-1 text-sm text-slate-600">
            Danh sách dịch vụ/tuyến có bảng giá, hiển thị gọn theo từng dịch vụ.
          </p>
        </div>
        <Link
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          href="/admin/cost-rates/new"
        >
          Tạo bảng giá
        </Link>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-line bg-white p-4 shadow-soft">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Mã dịch vụ</th>
              <th className="px-4 py-3">Tên dịch vụ</th>
              <th className="px-4 py-3">Ngày cập nhật</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
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
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-ink">
                    {service.code}
                  </td>
                  <td className="px-4 py-4 text-slate-600">{service.name}</td>
                  <td className="px-4 py-4 text-slate-600">
                    {hasRates ? formatDateTime(latestUpdatedAt) : "Chưa có"}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                        hasRates
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {hasRates ? "Đã có bảng giá" : "Chưa có bảng giá"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      {hasRates ? (
                        <>
                          <Link
                            className="rounded-3xl border border-line bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                            href={`/admin/cost-rates/${service.id}`}
                          >
                            Xem
                          </Link>
                          <Link
                            className="rounded-3xl border border-line bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                            href={`/admin/cost-rates/${service.id}/edit`}
                          >
                            Sửa
                          </Link>
                          <Link
                            className="rounded-3xl bg-brand px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                            href={`/admin/cost-rates/new?serviceId=${service.id}`}
                          >
                            Thay thế
                          </Link>
                        </>
                      ) : (
                        <Link
                          className="rounded-3xl bg-brand px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
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
  );
}
