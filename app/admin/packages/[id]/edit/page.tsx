import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePackage } from "../../actions";

export const dynamic = "force-dynamic";

function NumberInput({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
        defaultValue={defaultValue}
        min={0}
        name={name}
        required
        step="0.01"
        type="number"
      />
    </label>
  );
}

export default async function EditPackagePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const packageItem = await prisma.package.findUnique({
    where: { id },
    include: {
      order: {
        select: {
          orderCode: true,
        },
      },
    },
  });

  if (!packageItem) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link className="text-sm font-semibold text-brand hover:text-blue-700" href={`/admin/packages/${packageItem.id}`}>
          {"<-"} Quay lai chi tiet
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-ink">Sua kien hang</h1>
        <p className="mt-1 text-sm text-slate-600">
          {packageItem.packageCode} - {packageItem.order.orderCode}
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <form action={updatePackage} className="space-y-5">
        <input name="id" type="hidden" value={packageItem.id} />
        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="text-base font-semibold text-ink">Kich thuoc va can nang</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <NumberInput defaultValue={packageItem.length} label="Dai cm" name="length" />
            <NumberInput defaultValue={packageItem.width} label="Rong cm" name="width" />
            <NumberInput defaultValue={packageItem.height} label="Cao cm" name="height" />
            <NumberInput
              defaultValue={packageItem.actualWeight}
              label="Can nang thuc te kg"
              name="actualWeight"
            />
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="text-base font-semibold text-ink">Mo ta</h2>
          <textarea
            className="mt-4 min-h-28 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
            defaultValue={packageItem.description ?? ""}
            name="description"
          />
        </section>

        <div className="flex justify-end gap-3">
          <Link
            className="rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-slate-50"
            href={`/admin/packages/${packageItem.id}`}
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
