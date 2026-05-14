import { ShippingTransportType } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateShippingService } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const service = await prisma.shippingService.findUnique({
    where: { id },
  });

  if (!service) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link className="text-sm font-semibold text-brand hover:text-blue-700" href="/admin/services">
          {"<-"} Quay lai danh sach
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-ink">Sua dich vu</h1>
        <p className="mt-1 text-sm text-slate-600">
          Chi admin duoc quan ly danh sach dich vu.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <form action={updateShippingService} className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <input name="id" type="hidden" value={service.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Code</span>
            <input
              className="w-full rounded-md border border-line px-3 py-2 text-sm uppercase outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
              defaultValue={service.code}
              name="code"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Ten dich vu</span>
            <input
              className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
              defaultValue={service.name}
              name="name"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Loai van chuyen</span>
            <select
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
              defaultValue={service.transportType}
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
              defaultValue={service.destinationZone}
              name="destinationZone"
              required
            />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Mo ta</span>
            <textarea
              className="min-h-24 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
              defaultValue={service.description ?? ""}
              name="description"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              className="h-4 w-4 rounded border-line"
              defaultChecked={service.isActive}
              name="isActive"
              type="checkbox"
            />
            Active
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Link
            className="rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-slate-50"
            href="/admin/services"
          >
            Huy
          </Link>
          <button
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            type="submit"
          >
            Luu thay doi
          </button>
        </div>
      </form>
    </div>
  );
}
