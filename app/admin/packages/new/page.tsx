import { createPackage } from "../actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function NumberInput({
  label,
  name,
  required = true,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
        min={0}
        name={name}
        required={required}
        step="0.01"
        type="number"
      />
    </label>
  );
}

export default async function NewPackagePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; orderId?: string }>;
}) {
  const { error, orderId } = await searchParams;
  const orders = await prisma.order.findMany({
    include: {
      customer: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Tao kien hang</h1>
        <p className="mt-1 text-sm text-slate-600">
          Package code va can nang quy doi se duoc tinh tu dong.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <form action={createPackage} className="space-y-5">
        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="text-base font-semibold text-ink">Don hang</h2>
          <label className="mt-4 block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Chon don hang</span>
            <select
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
              defaultValue={orderId ?? ""}
              name="orderId"
              required
            >
              <option value="">Chon order</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.orderCode} - {order.trackingCode} - {order.customer.name}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="text-base font-semibold text-ink">Kich thuoc va can nang</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <NumberInput label="Dai cm" name="length" />
            <NumberInput label="Rong cm" name="width" />
            <NumberInput label="Cao cm" name="height" />
            <NumberInput label="Can nang thuc te kg" name="actualWeight" />
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="text-base font-semibold text-ink">Mo ta</h2>
          <textarea
            className="mt-4 min-h-28 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
            name="description"
            placeholder="Mo ta kien hang, loai hang, ghi chu kho..."
          />
        </section>

        <div className="flex justify-end gap-3">
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
            Tao kien hang
          </button>
        </div>
      </form>
    </div>
  );
}
