import { createCostItem } from "../actions";

export default async function NewCostItemPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-ink">Tao chi phi phu</h1>
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div> : null}
      <form action={createCostItem} className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <div className="grid gap-4 md:grid-cols-2">
          <label><span className="mb-1 block text-sm font-semibold">Ten chi phi</span><input className="w-full rounded-md border border-line px-3 py-2 text-sm" name="name" required /></label>
          <label><span className="mb-1 block text-sm font-semibold">Gia mac dinh</span><input className="w-full rounded-md border border-line px-3 py-2 text-sm" min={0} name="defaultAmount" required step="1" type="number" /></label>
          <label className="md:col-span-2"><span className="mb-1 block text-sm font-semibold">Mo ta</span><textarea className="min-h-24 w-full rounded-md border border-line px-3 py-2 text-sm" name="description" /></label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input defaultChecked name="isActive" type="checkbox" /> Active</label>
        </div>
        <div className="mt-6 flex justify-end"><button className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white" type="submit">Luu</button></div>
      </form>
    </div>
  );
}
