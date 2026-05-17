import Link from "next/link";
import { formatCurrencyVND } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { ActiveBadge } from "@/components/status-badge";

export const dynamic = "force-dynamic";

export default async function CostItemsPage() {
  const items = await prisma.costItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chi phí phụ"
        description="Quản lý các khoản chi phí phụ áp dụng vào đơn hàng"
        actionLabel="Tạo chi phí"
        actionHref="/admin/cost-items/new"
      />

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  Tên chi phí
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                  Giá mặc định
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  Mô tả
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">
                    {formatCurrencyVND(item.defaultAmount)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {item.description ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    <ActiveBadge status={item.isActive} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      href={`/admin/cost-items/${item.id}/edit`}
                    >
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
