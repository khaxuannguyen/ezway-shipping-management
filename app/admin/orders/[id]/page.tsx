import { OrderStatus, PaymentStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InfoCard, InfoRow } from "@/components/info-card";
import { PaymentBadge, StatusBadge } from "@/components/status-badge";
import { TrackingTimeline } from "@/components/timeline";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import {
  addOrderExtraCost,
  addTrackingEvent,
  deleteOrderExtraCost,
  updateOrderStatus,
  updatePaymentStatus,
} from "../actions";

export const dynamic = "force-dynamic";

function toDateTimeLocalValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      shippingService: true,
      packages: {
        orderBy: { createdAt: "asc" },
      },
      trackingEvents: {
        orderBy: { eventTime: "asc" },
      },
      payments: {
        orderBy: { createdAt: "asc" },
      },
      extraCosts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
  const costItems = await prisma.costItem.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link className="text-sm font-semibold text-brand hover:text-blue-700" href="/admin/orders">
            {"<-"} Quay lai danh sach
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-ink">{order.orderCode}</h1>
          <p className="mt-1 text-sm text-slate-600">Tracking: {order.trackingCode}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={order.status} />
          <PaymentBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <div className="grid gap-5 md:grid-cols-2">
            <InfoCard title="Thong tin don hang">
              <InfoRow label="Khach hang" value={order.customer.name} />
              <InfoRow label="Ma khach" value={order.customer.customerCode} />
              <InfoRow label="SDT" value={order.customer.phone} />
              <InfoRow label="Email" value={order.customer.email ?? "-"} />
              <InfoRow label="Ngay tao" value={formatDateTime(order.createdAt)} />
              <InfoRow label="Ghi chu" value={order.internalNote ?? "-"} />
            </InfoCard>

            <InfoCard title="Thong tin van chuyen">
              <InfoRow label="Tuyen" value={`${order.originCountry} -> ${order.destinationCountry}`} />
              <InfoRow label="Dich vu cu" value={order.serviceType} />
              <InfoRow label="Ma dich vu" value={order.shippingService?.code ?? "-"} />
              <InfoRow label="Ten dich vu" value={order.shippingService?.name ?? "-"} />
              <InfoRow label="Loai van chuyen" value={order.shippingService?.transportType ?? "-"} />
              <InfoRow label="Khu vuc dich" value={order.shippingService?.destinationZone ?? "-"} />
              <InfoRow label="Loai hang" value={order.goodsType} />
              <InfoRow label="So kien" value={order.packageCount} />
              <InfoRow label="Can nang tinh phi" value={`${order.chargeableWeight} kg`} />
            </InfoCard>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <InfoCard title="Nguoi gui">
              <InfoRow label="Ten" value={order.senderName} />
              <InfoRow label="SDT" value={order.senderPhone} />
              <InfoRow label="Dia chi" value={order.senderAddress} />
            </InfoCard>

            <InfoCard title="Nguoi nhan">
              <InfoRow label="Ten" value={order.receiverName} />
              <InfoRow label="SDT" value={order.receiverPhone} />
              <InfoRow label="Dia chi" value={order.receiverAddress} />
            </InfoCard>
          </div>

          <InfoCard title="Phi va thanh toan">
            <InfoRow label="Gia ban" value={formatCurrency(order.totalFee)} />
            <InfoRow label="Gia goc dich vu" value={formatCurrency(order.baseCost)} />
            <InfoRow label="Chi phi phu" value={formatCurrency(order.extraCostTotal)} />
            <InfoRow label="Loi nhuan" value={formatCurrency(order.profit)} />
            <InfoRow label="Phi co ban cu" value={formatCurrency(order.baseFee)} />
            <InfoRow label="Phu phi" value={formatCurrency(order.surchargeFee)} />
            <InfoRow label="Giam gia" value={formatCurrency(order.discountFee)} />
            <InfoRow label="Tong phi" value={formatCurrency(order.totalFee)} />
            <InfoRow label="Trang thai" value={<PaymentBadge status={order.paymentStatus} />} />
          </InfoCard>

          <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="text-base font-semibold text-ink">Chi phi & loi nhuan</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div><p className="text-sm text-slate-500">Gia ban</p><p className="mt-1 font-bold">{formatCurrency(order.totalFee)}</p></div>
              <div><p className="text-sm text-slate-500">Gia goc</p><p className="mt-1 font-bold">{formatCurrency(order.baseCost)}</p></div>
              <div><p className="text-sm text-slate-500">Chi phi phu</p><p className="mt-1 font-bold">{formatCurrency(order.extraCostTotal)}</p></div>
              <div><p className="text-sm text-slate-500">Loi nhuan</p><p className="mt-1 font-bold text-ocean">{formatCurrency(order.profit)}</p></div>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full divide-y divide-line text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3">Note</th><th className="px-4 py-3">Created</th><th className="px-4 py-3 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {order.extraCosts.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 font-semibold">{item.name}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(item.amount)}</td>
                      <td className="px-4 py-3 text-slate-600">{item.note ?? "-"}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDateTime(item.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <form action={deleteOrderExtraCost}>
                          <input name="orderId" type="hidden" value={order.id} />
                          <input name="id" type="hidden" value={item.id} />
                          <button className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50" type="submit">Xoa</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <form action={addOrderExtraCost} className="mt-5 grid gap-3 md:grid-cols-5">
              <input name="orderId" type="hidden" value={order.id} />
              <select className="rounded-md border border-line bg-white px-3 py-2 text-sm" name="costItemId">
                <option value="">Chon chi phi mau</option>
                {costItems.map((item) => (
                  <option key={item.id} value={item.id}>{item.name} - {formatCurrency(item.defaultAmount)}</option>
                ))}
              </select>
              <input className="rounded-md border border-line px-3 py-2 text-sm" name="name" placeholder="Ten chi phi" />
              <input className="rounded-md border border-line px-3 py-2 text-sm" min={0} name="amount" placeholder="Amount" required step="1" type="number" />
              <input className="rounded-md border border-line px-3 py-2 text-sm" name="note" placeholder="Note" />
              <button className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white" type="submit">Them chi phi</button>
            </form>
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-semibold text-ink">Packages</h2>
              <Link
                className="w-fit rounded-md border border-brand px-3 py-2 text-xs font-semibold text-brand hover:bg-blue-50"
                href={`/admin/packages/new?orderId=${order.id}`}
              >
                Them kien hang cho don nay
              </Link>
            </div>
            <div className="mt-4 overflow-x-auto">
              {order.packages.length === 0 ? (
                <p className="text-sm text-slate-500">Don hang nay chua co kien hang.</p>
              ) : (
                <table className="min-w-full divide-y divide-line text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Ma kien</th>
                      <th className="px-4 py-3">Kich thuoc</th>
                      <th className="px-4 py-3">Can nang</th>
                      <th className="px-4 py-3">Can nang tinh phi</th>
                      <th className="px-4 py-3">Mo ta</th>
                      <th className="px-4 py-3 text-right">Hanh dong</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {order.packages.map((item) => (
                      <tr key={item.id}>
                        <td className="whitespace-nowrap px-4 py-3 font-semibold text-ink">
                          {item.packageCode}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                          {item.length} x {item.width} x {item.height} cm
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                          {item.actualWeight} kg
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                          {item.chargeableWeight} kg
                        </td>
                        <td className="px-4 py-3 text-slate-600">{item.description ?? "-"}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <Link
                            className="rounded-md border border-line px-3 py-2 text-xs font-semibold text-brand hover:border-brand hover:bg-blue-50"
                            href={`/admin/packages/${item.id}`}
                          >
                            Xem
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="text-base font-semibold text-ink">Payments</h2>
            <div className="mt-4 space-y-3">
              {order.payments.length > 0 ? (
                order.payments.map((payment) => (
                  <div
                    className="rounded-md border border-line bg-slate-50 p-4 text-sm"
                    key={payment.id}
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-semibold text-ink">{formatCurrency(payment.amount)}</p>
                      <p className="text-slate-500">
                        {payment.paidAt ? formatDateTime(payment.paidAt) : "Chua ghi nhan paidAt"}
                      </p>
                    </div>
                    <p className="mt-1 text-slate-600">
                      {payment.method ?? "Khong ro phuong thuc"} - {payment.note ?? "Khong co ghi chu"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Chua co giao dich thanh toan.</p>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="text-base font-semibold text-ink">Cap nhat trang thai</h2>
            <form action={updateOrderStatus} className="mt-4 space-y-3">
              <input name="orderId" type="hidden" value={order.id} />
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Trang thai moi</span>
                <select
                  className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                  defaultValue={order.status}
                  name="status"
                >
                  {Object.values(OrderStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="w-full rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                type="submit"
              >
                Cap nhat trang thai
              </button>
            </form>
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="text-base font-semibold text-ink">Them tracking event</h2>
            <form action={addTrackingEvent} className="mt-4 space-y-3">
              <input name="orderId" type="hidden" value={order.id} />
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Status</span>
                <select
                  className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                  defaultValue={order.status}
                  name="status"
                >
                  {Object.values(OrderStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Message</span>
                <textarea
                  className="min-h-20 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                  name="message"
                  placeholder="Nhap noi dung tracking"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Location</span>
                <input
                  className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                  name="location"
                  placeholder="EZWAY Operations"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Event time</span>
                <input
                  className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                  defaultValue={toDateTimeLocalValue(new Date())}
                  name="eventTime"
                  type="datetime-local"
                />
              </label>
              <button
                className="w-full rounded-md border border-brand bg-white px-4 py-2 text-sm font-semibold text-brand hover:bg-blue-50"
                type="submit"
              >
                Them tracking
              </button>
            </form>
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="text-base font-semibold text-ink">Thanh toan nhanh</h2>
            <form action={updatePaymentStatus} className="mt-4 space-y-3">
              <input name="orderId" type="hidden" value={order.id} />
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Payment status</span>
                <select
                  className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                  defaultValue={order.paymentStatus}
                  name="paymentStatus"
                >
                  {Object.values(PaymentStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Amount</span>
                <input
                  className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                  min={0}
                  name="amount"
                  placeholder="0"
                  step="1"
                  type="number"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Method</span>
                <input
                  className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                  name="method"
                  placeholder="Cash / Bank transfer"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Note</span>
                <input
                  className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
                  name="paymentNote"
                  placeholder="Payment note"
                />
              </label>
              <button
                className="w-full rounded-md bg-ocean px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                type="submit"
              >
                Cap nhat thanh toan
              </button>
            </form>
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="text-base font-semibold text-ink">Timeline tracking</h2>
            <div className="mt-5">
              <TrackingTimeline events={order.trackingEvents} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
