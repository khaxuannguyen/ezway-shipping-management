import { CostRateType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createCostRate } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewCostRatePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const services = await prisma.shippingService.findMany({ orderBy: { code: "asc" } });
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div><h1 className="text-2xl font-bold text-ink">Tao gia goc</h1></div>
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div> : null}
      <form action={createCostRate} className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <div className="grid gap-4 md:grid-cols-2">
          <label><span className="mb-1 block text-sm font-semibold">Dich vu</span><select className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm" name="shippingServiceId" required><option value="">Chon dich vu</option>{services.map((s) => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}</select></label>
          <label><span className="mb-1 block text-sm font-semibold">Label</span><input className="w-full rounded-md border border-line px-3 py-2 text-sm" name="label" required /></label>
          <label><span className="mb-1 block text-sm font-semibold">Min weight</span><input className="w-full rounded-md border border-line px-3 py-2 text-sm" min={0} name="minWeight" required step="0.01" type="number" /></label>
          <label><span className="mb-1 block text-sm font-semibold">Max weight</span><input className="w-full rounded-md border border-line px-3 py-2 text-sm" min={0} name="maxWeight" step="0.01" type="number" /></label>
          <label><span className="mb-1 block text-sm font-semibold">Kieu gia</span><select className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm" name="rateType">{Object.values(CostRateType).map((t) => <option key={t} value={t}>{t}</option>)}</select></label>
          <label><span className="mb-1 block text-sm font-semibold">Amount</span><input className="w-full rounded-md border border-line px-3 py-2 text-sm" min={0} name="amount" required step="1" type="number" /></label>
          <label><span className="mb-1 block text-sm font-semibold">Currency</span><input className="w-full rounded-md border border-line px-3 py-2 text-sm" defaultValue="VND" name="currency" /></label>
          <label><span className="mb-1 block text-sm font-semibold">Sort order</span><input className="w-full rounded-md border border-line px-3 py-2 text-sm" defaultValue={0} name="sortOrder" type="number" /></label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input defaultChecked name="isActive" type="checkbox" /> Active</label>
        </div>
        <div className="mt-6 flex justify-end"><button className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white" type="submit">Luu</button></div>
      </form>
    </div>
  );
}
