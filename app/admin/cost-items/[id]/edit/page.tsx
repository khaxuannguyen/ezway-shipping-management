import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCostItem } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditCostItemPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const { error } = await searchParams;
  const item = await prisma.costItem.findUnique({ where: { id } });
  if (!item) notFound();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div><Link className="text-sm font-semibold text-brand" href="/admin/cost-items">{"<-"} Quay lai</Link><h1 className="mt-2 text-2xl font-bold text-ink">Sua chi phi phu</h1></div>
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div> : null}
      <form action={updateCostItem} className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <input name="id" type="hidden" value={item.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <label><span className="mb-1 block text-sm font-semibold">Ten chi phi</span><input className="w-full rounded-md border border-line px-3 py-2 text-sm" defaultValue={item.name} name="name" required /></label>
          <label><span className="mb-1 block text-sm font-semibold">Gia mac dinh</span><input className="w-full rounded-md border border-line px-3 py-2 text-sm" defaultValue={item.defaultAmount} min={0} name="defaultAmount" required step="1" type="number" /></label>
          <label className="md:col-span-2"><span className="mb-1 block text-sm font-semibold">Mo ta</span><textarea className="min-h-24 w-full rounded-md border border-line px-3 py-2 text-sm" defaultValue={item.description ?? ""} name="description" /></label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input defaultChecked={item.isActive} name="isActive" type="checkbox" /> Active</label>
        </div>
        <div className="mt-6 flex justify-end"><button className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white" type="submit">Luu</button></div>
      </form>
    </div>
  );
}
