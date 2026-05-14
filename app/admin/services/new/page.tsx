import { ShippingTransportType } from "@prisma/client";
import { createShippingService } from "../actions";

export default async function NewServicePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Tao dich vu</h1>
        <p className="mt-1 text-sm text-slate-600">
          Chi admin duoc quan ly danh sach dich vu.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <form action={createShippingService} className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Code</span>
            <input
              className="w-full rounded-md border border-line px-3 py-2 text-sm uppercase outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
              name="code"
              placeholder="EZW-AIR-US-PRI"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Ten dich vu</span>
            <input
              className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
              name="name"
              placeholder="EZWAY Air US Priority"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Loai van chuyen</span>
            <select
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
              name="transportType"
              required
            >
              {Object.values(ShippingTransportType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Khu vuc/quoc gia dich</span>
            <input
              className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
              name="destinationZone"
              placeholder="United States"
              required
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Mo ta</span>
            <textarea
              className="min-h-24 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
              name="description"
              placeholder="Mo ta tuyen dich vu..."
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input className="h-4 w-4 rounded border-line" defaultChecked name="isActive" type="checkbox" />
            Active
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-slate-50"
            type="reset"
          >
            Xoa form
          </button>
          <button
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            type="submit"
          >
            Tao dich vu
          </button>
        </div>
      </form>
    </div>
  );
}
