import type { OrderStatus, PaymentStatus, ServiceType } from "@prisma/client";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/format";
import { PaymentBadge, StatusBadge } from "./status-badge";

export type OrderTableRow = {
  id: string;
  orderCode: string;
  trackingCode: string;
  receiverName: string;
  originCountry: string;
  destinationCountry: string;
  serviceType: ServiceType;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalFee: number;
  baseCost: number;
  extraCostTotal: number;
  profit: number;
  createdAt: Date | string;
  customer: {
    name: string;
    phone: string;
  };
  shippingService?: {
    code: string;
  } | null;
};

export function OrderTable({ orders }: { orders: OrderTableRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3">Ma don</th>
              <th className="px-5 py-3">Tracking</th>
              <th className="px-5 py-3">Khach hang</th>
              <th className="px-5 py-3">Nguoi nhan</th>
              <th className="px-5 py-3">Dich vu</th>
              <th className="px-5 py-3">Trang thai</th>
              <th className="px-5 py-3">Thanh toan</th>
              <th className="px-5 py-3 text-right">Tong phi</th>
              <th className="px-5 py-3 text-right">Gia goc</th>
              <th className="px-5 py-3 text-right">Loi nhuan</th>
              <th className="px-5 py-3">Ngay tao</th>
              <th className="px-5 py-3 text-right">Thao tac</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {orders.map((order) => (
              <tr className="hover:bg-slate-50" key={order.id}>
                <td className="whitespace-nowrap px-5 py-4 font-semibold text-ink">
                  {order.orderCode}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                  {order.trackingCode}
                </td>
                <td className="px-5 py-4">
                  <div className="font-medium text-ink">{order.customer.name}</div>
                  <div className="text-xs text-slate-500">{order.customer.phone}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="font-medium text-ink">{order.receiverName}</div>
                  <div className="text-xs text-slate-500">{order.destinationCountry}</div>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                  {order.shippingService?.code ?? order.serviceType}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <PaymentBadge status={order.paymentStatus} />
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-right font-medium text-ink">
                  {formatCurrency(order.totalFee)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-right font-medium text-slate-600">
                  {formatCurrency(order.baseCost)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-ocean">
                  {formatCurrency(order.profit)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                  {formatDate(order.createdAt)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-right">
                  <Link
                    className="rounded-md border border-line px-3 py-2 text-xs font-semibold text-brand hover:border-brand hover:bg-blue-50"
                    href={`/admin/orders/${order.id}`}
                  >
                    Xem chi tiet
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
