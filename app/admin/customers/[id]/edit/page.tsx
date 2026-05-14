import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCustomer } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditCustomerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link className="text-sm font-semibold text-brand hover:text-blue-700" href={`/admin/customers/${customer.id}`}>
          {"<-"} Quay lai chi tiet
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-ink">Sua khach hang</h1>
        <p className="mt-1 text-sm text-slate-600">{customer.customerCode}</p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <form action={updateCustomer} className="rounded-lg border border-line bg-white p-5 shadow-soft">
        <input name="id" type="hidden" value={customer.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Ten khach hang</span>
            <input
              className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
              defaultValue={customer.name}
              name="name"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">So dien thoai</span>
            <input
              className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
              defaultValue={customer.phone}
              name="phone"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Email</span>
            <input
              className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
              defaultValue={customer.email ?? ""}
              name="email"
              type="email"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Dia chi</span>
            <input
              className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
              defaultValue={customer.address ?? ""}
              name="address"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Link
            className="rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-slate-50"
            href={`/admin/customers/${customer.id}`}
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
