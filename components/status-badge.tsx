import type { OrderStatus, PaymentStatus, PickupStatus } from "@prisma/client";

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

export const pickupStatusLabels: Record<PickupStatus, string> = {
  PENDING: "Cho phan tai xe",
  ASSIGNED: "Da phan tai xe",
  ACCEPTED: "Tai xe da nhan",
  ON_THE_WAY: "Dang di lay",
  ARRIVED: "Da toi diem lay",
  PICKED_UP: "Da lay hang",
  FAILED: "Lay that bai",
  CANCELLED: "Da huy",
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

const pickupClasses: Record<PickupStatus, string> = {
  PENDING: "bg-slate-100 text-slate-600 ring-slate-200",
  ASSIGNED: "bg-blue-50 text-blue-700 ring-blue-200",
  ACCEPTED: "bg-purple-50 text-purple-700 ring-purple-200",
  ON_THE_WAY: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  ARRIVED: "bg-orange-50 text-orange-700 ring-orange-200",
  PICKED_UP: "bg-green-50 text-green-700 ring-green-200",
  FAILED: "bg-red-50 text-red-700 ring-red-200",
  CANCELLED: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function StatusBadge({
  status,
}: {
  status: OrderStatus | PickupStatus;
}) {
  if (status in statusLabels) {
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${orderClasses[status as OrderStatus]}`}
      >
        {statusLabels[status as OrderStatus]}
      </span>
    );
  }

  if (status in pickupStatusLabels) {
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${pickupClasses[status as PickupStatus]}`}
      >
        {pickupStatusLabels[status as PickupStatus]}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-200">
      {status}
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
