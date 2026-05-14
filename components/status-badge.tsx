import type { OrderStatus, PaymentStatus } from "@prisma/client";

export const statusLabels: Record<OrderStatus, string> = {
  NEW: "Don moi",
  CONFIRMED: "Da xac nhan",
  IN_WAREHOUSE: "Trong kho",
  PROCESSING: "Dang xu ly",
  IN_TRANSIT: "Dang van chuyen",
  CUSTOMS_CLEARANCE: "Thong quan",
  OUT_FOR_DELIVERY: "Dang giao",
  DELIVERED: "Da giao",
  PROBLEM: "Co su co",
  CANCELLED: "Da huy",
};

export const paymentLabels: Record<PaymentStatus, string> = {
  UNPAID: "Chua thanh toan",
  PARTIAL: "Thanh toan mot phan",
  PAID: "Da thanh toan",
  OVERDUE: "Qua han",
};

const orderClasses: Record<OrderStatus, string> = {
  NEW: "bg-blue-50 text-blue-700 ring-blue-200",
  CONFIRMED: "bg-sky-50 text-sky-700 ring-sky-200",
  IN_WAREHOUSE: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  PROCESSING: "bg-amber-50 text-amber-700 ring-amber-200",
  IN_TRANSIT: "bg-teal-50 text-teal-700 ring-teal-200",
  CUSTOMS_CLEARANCE: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  OUT_FOR_DELIVERY: "bg-violet-50 text-violet-700 ring-violet-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  PROBLEM: "bg-red-50 text-red-700 ring-red-200",
  CANCELLED: "bg-slate-100 text-slate-600 ring-slate-200",
};

const paymentClasses: Record<PaymentStatus, string> = {
  UNPAID: "bg-red-50 text-red-700 ring-red-200",
  PARTIAL: "bg-amber-50 text-amber-700 ring-amber-200",
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  OVERDUE: "bg-orange-50 text-orange-700 ring-orange-200",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${orderClasses[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${paymentClasses[status]}`}
    >
      {paymentLabels[status]}
    </span>
  );
}
