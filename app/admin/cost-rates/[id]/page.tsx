import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { DEFAULT_COST_RATE_ROWS } from "../weight-rows";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function CostRateServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await prisma.shippingService.findUnique({
    where: { id },
    include: {
      costRates: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!service) {
    notFound();
  }

  const hasRates = service.costRates.length > 0;
  const latestUpdatedAt = hasRates
    ? service.costRates.reduce(
        (latest, rate) => (rate.updatedAt > latest ? rate.updatedAt : latest),
        service.costRates[0].updatedAt,
      )
    : null;

  const rateRows = service.costRates.map((rate) => {
    const row = DEFAULT_COST_RATE_ROWS.find(
      (item) => item.label === rate.label,
    );
    return {
      ...rate,
      range: row?.range ?? "-",
      typeLabel:
        row?.typeLabel ??
        (rate.rateType === "FIXED_TOTAL"
          ? "Giá lẻ theo mốc"
          : "Giá sỉ theo kg"),
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Bảng giá: ${service.code}`}
        description="Chi tiết bảng giá của dịch vụ."
        actionLabel="Sửa bảng giá"
        actionHref={`/admin/cost-rates/${service.id}/edit`}
      />

      <div className="flex justify-end">
        <Link
          className="rounded-3xl border border-line bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          href="/admin/cost-rates"
        >
          Quay lại danh sách
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
          <h2 className="text-base font-semibold text-ink">
            Thông tin dịch vụ
          </h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div>
              <p className="font-semibold text-slate-900">Mã dịch vụ</p>
              <p>{service.code}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Tên dịch vụ</p>
              <p>{service.name}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Loại vận chuyển</p>
              <p>{service.transportType}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Khu vực đích</p>
              <p>{service.destinationZone}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                Trạng thái bảng giá
              </p>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  hasRates
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {hasRates ? "Đã có bảng giá" : "Chưa có bảng giá"}
              </span>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Cập nhật lần cuối</p>
              <p>
                {latestUpdatedAt ? formatDateTime(latestUpdatedAt) : "Chưa có"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              Danh sách giá hiện tại
            </h2>
            <p className="text-sm text-slate-500">
              Các mức giá gốc đang active cho dịch vụ này.
            </p>
          </div>
          <Link
            className="rounded-3xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            href={`/admin/cost-rates/${service.id}/edit`}
          >
            Sửa bảng giá
          </Link>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-line text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Số ký</th>
                <th className="px-4 py-3">Khoảng cân nặng</th>
                <th className="px-4 py-3">Kiểu giá</th>
                <th className="px-4 py-3">Giá gốc</th>
                <th className="px-4 py-3">Currency</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white">
              {rateRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-5 text-center text-slate-500"
                  >
                    Chưa có bảng giá cho dịch vụ này.
                  </td>
                </tr>
              ) : (
                rateRows.map((rate) => (
                  <tr key={rate.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-ink">
                      {rate.label}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{rate.range}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {rate.typeLabel}
                    </td>
                    <td className="px-4 py-3 text-slate-900">{rate.amount}</td>
                    <td className="px-4 py-3 text-slate-900">
                      {rate.currency}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        className="rounded-3xl border border-line bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        href={`/admin/cost-rates/${service.id}/edit`}
                      >
                        Sửa
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
