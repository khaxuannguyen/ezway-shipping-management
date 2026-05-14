import { CostRateType } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCostRate } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditCostRatePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const [rate, services] = await Promise.all([
    prisma.serviceCostRate.findUnique({ where: { id } }),
    prisma.shippingService.findMany({ orderBy: { code: "asc" } }),
  ]);
  if (!rate) notFound();
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div><Link className="text-sm font-semibold text-brand" href="/admin/cost-rates">{"<-"} Quay lai</Link><h1 className="mt-2 text-2xl font-bold text-ink">Sua gia goc</h1></div>
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div> : null}
      <form action={updateCostRate} className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <input name="id" type="hidden" value={rate.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <label><span className="mb-1 block text-sm font-semibold">Dich vu</span><select className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm" defaultValue={rate.shippingServiceId} name="shippingServiceId" required>{services.map((s) => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}</select></label>
          <label><span className="mb-1 block text-sm font-semibold">Label</span><input className="w-full rounded-md border border-line px-3 py-2 text-sm" defaultValue={rate.label} name="label" required /></label>
          <label><span className="mb-1 block text-sm font-semibold">Min weight</span><input className="w-full rounded-md border border-line px-3 py-2 text-sm" defaultValue={rate.minWeight} min={0} name="minWeight" required step="0.01" type="number" /></label>
          <label><span className="mb-1 block text-sm font-semibold">Max weight</span><input className="w-full rounded-md border border-line px-3 py-2 text-sm" defaultValue={rate.maxWeight ?? ""} min={0} name="maxWeight" step="0.01" type="number" /></label>
          <label><span className="mb-1 block text-sm font-semibold">Kieu gia</span><select className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm" defaultValue={rate.rateType} name="rateType">{Object.values(CostRateType).map((t) => <option key={t} value={t}>{t}</option>)}</select></label>
          <label><span className="mb-1 block text-sm font-semibold">Amount</span><input className="w-full rounded-md border border-line px-3 py-2 text-sm" defaultValue={rate.amount} min={0} name="amount" required step="1" type="number" /></label>
          <label><span className="mb-1 block text-sm font-semibold">Currency</span><input className="w-full rounded-md border border-line px-3 py-2 text-sm" defaultValue={rate.currency} name="currency" /></label>
          <label><span className="mb-1 block text-sm font-semibold">Sort order</span><input className="w-full rounded-md border border-line px-3 py-2 text-sm" defaultValue={rate.sortOrder} name="sortOrder" type="number" /></label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input defaultChecked={rate.isActive} name="isActive" type="checkbox" /> Active</label>
        </div>
        <div className="mt-6 flex justify-end"><button className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white" type="submit">Luu</button></div>
      </form>
    </div>
  );
}
