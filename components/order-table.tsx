import type { OrderStatus, PaymentStatus, ServiceType } from "@prisma/client";
import Link from "next/link";
import { formatCurrencyVND } from "@/lib/format";
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
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
        <div className="text-slate-400">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-sm font-medium text-slate-900">
          Không có đơn hàng
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Chưa có đơn hàng nào được tạo.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Mã đơn
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Tracking
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Khách hàng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Người nhận
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Tuyến dịch vụ
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Thanh toán
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                Tổng tiền
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                Lợi nhuận
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {orders.map((order) => (
              <tr className="hover:bg-slate-50" key={order.id}>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                  {order.orderCode}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 font-mono">
                  {order.trackingCode}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">
                    {order.customer.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    {order.customer.phone}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">
                    {order.receiverName}
                  </div>
                  <div className="text-sm text-slate-500">
                    {order.destinationCountry}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                    {order.shippingService?.code ?? order.serviceType}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3">
                  <PaymentBadge status={order.paymentStatus} />
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-900">
                  {formatCurrencyVND(order.totalFee)}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-green-600">
                  {formatCurrencyVND(order.profit)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    href={`/admin/orders/${order.id}`}
                  >
                    Xem
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
