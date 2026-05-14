import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CostItemsPage() {
  const items = await prisma.costItem.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Chi phi phu</h1>
          <p className="mt-1 text-sm text-slate-600">Danh muc chi phi phu ap vao don hang.</p>
        </div>
        <Link className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white" href="/admin/cost-items/new">Tao chi phi</Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-line text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr><th className="px-5 py-3">Ten chi phi</th><th className="px-5 py-3 text-right">Gia mac dinh</th><th className="px-5 py-3">Mo ta</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Sua</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold">{item.name}</td>
                  <td className="px-5 py-4 text-right">{formatCurrency(item.defaultAmount)}</td>
                  <td className="px-5 py-4 text-slate-600">{item.description ?? "-"}</td>
                  <td className="px-5 py-4">{item.isActive ? "Active" : "Inactive"}</td>
                  <td className="px-5 py-4 text-right"><Link className="rounded-md border border-line px-3 py-2 text-xs font-semibold text-brand" href={`/admin/cost-items/${item.id}/edit`}>Sua</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
