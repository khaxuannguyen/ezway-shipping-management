import { createOrder } from "@/app/admin/orders/actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function TextInput({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
        defaultValue={defaultValue}
        min={type === "number" ? 0 : undefined}
        name={name}
        placeholder={placeholder}
        required={required}
        step={type === "number" ? "0.01" : undefined}
        type={type}
      />
    </label>
  );
}

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      customerCode: true,
      name: true,
      phone: true,
    },
  });
  const shippingServices = await prisma.shippingService.findMany({
    where: { isActive: true },
    orderBy: [{ destinationZone: "asc" }, { code: "asc" }],
    select: {
      id: true,
      code: true,
      name: true,
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Tao don hang EZWAY</h1>
        <p className="mt-1 text-sm text-slate-600">
          Tao order, package dau tien va tracking event NEW truc tiep vao database.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <form action={createOrder} className="space-y-5">
        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="text-base font-semibold text-ink">Khach hang</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-1 block text-sm font-semibold text-slate-700">
                Chon khach hang co san
              </span>
              <select
                className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                name="customerId"
              >
                <option value="">Tao nhanh khach hang moi bang thong tin ben duoi</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.customerCode} - {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
            </label>
            <TextInput label="Ten khach moi" name="customerName" placeholder="EZWAY Customer" />
            <TextInput label="SDT khach moi" name="customerPhone" placeholder="0900 000 000" />
            <TextInput label="Email khach moi" name="customerEmail" placeholder="customer@example.com" />
            <TextInput label="Dia chi khach moi" name="customerAddress" placeholder="Ho Chi Minh City" />
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="text-base font-semibold text-ink">Nguoi gui</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <TextInput label="Ten nguoi gui" name="senderName" required />
            <TextInput label="SDT nguoi gui" name="senderPhone" required />
            <TextInput label="Dia chi nguoi gui" name="senderAddress" required />
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="text-base font-semibold text-ink">Nguoi nhan</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <TextInput label="Ten nguoi nhan" name="receiverName" required />
            <TextInput label="SDT nguoi nhan" name="receiverPhone" required />
            <TextInput label="Dia chi nguoi nhan" name="receiverAddress" required />
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="text-base font-semibold text-ink">Thong tin van chuyen</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <TextInput label="Quoc gia gui" name="originCountry" defaultValue="Vietnam" required />
            <TextInput label="Quoc gia nhan" name="destinationCountry" placeholder="United States" required />
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">Dich vu EZWAY</span>
              <select
                className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                name="shippingServiceId"
                required
              >
                <option value="">Chon dich vu</option>
                {shippingServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.code} - {service.name}
                  </option>
                ))}
              </select>
            </label>
            <TextInput label="Loai hang hoa" name="goodsType" placeholder="Documents" required />
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="text-base font-semibold text-ink">Can nang va kich thuoc</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-5">
            <TextInput label="So kien" name="packageCount" type="number" defaultValue={1} required />
            <TextInput label="Can nang thuc te kg" name="actualWeight" type="number" required />
            <TextInput label="Dai cm" name="length" type="number" required />
            <TextInput label="Rong cm" name="width" type="number" required />
            <TextInput label="Cao cm" name="height" type="number" required />
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="text-base font-semibold text-ink">Chi phi</h2>
          <p className="mt-1 text-sm text-slate-600">
            He thong se tinh can nang quy doi, can nang tinh cuoc, gia goc va loi nhuan khi submit.
            Neu chua co gia goc phu hop, baseCost se bang 0 va can bo admin can bo sung bang gia.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <TextInput label="Gia ban cho khach" name="totalFee" type="number" defaultValue={0} required />
            <TextInput label="Phu phi ban ra" name="surchargeFee" type="number" defaultValue={0} />
            <TextInput label="Giam gia" name="discountFee" type="number" defaultValue={0} />
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="text-base font-semibold text-ink">Ghi chu</h2>
          <textarea
            className="mt-4 min-h-28 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
            name="internalNote"
            placeholder="Ghi chu noi bo cho van hanh..."
          />
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-slate-50"
            type="reset"
          >
            Xoa form
          </button>
          <button
            className="rounded-md bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            type="submit"
          >
            Tao don hang
          </button>
        </div>
      </form>
    </div>
  );
}
