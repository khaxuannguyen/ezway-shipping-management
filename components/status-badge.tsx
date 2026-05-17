import type { OrderStatus, PaymentStatus, PickupStatus } from "@prisma/client";

export const statusLabels: Record<OrderStatus, string> = {
  NEW: "Mới tạo",
  CONFIRMED: "Đã xác nhận",
  IN_WAREHOUSE: "Đã về kho",
  PROCESSING: "Đang xử lý",
  IN_TRANSIT: "Đang vận chuyển",
  CUSTOMS_CLEARANCE: "Thông quan",
  OUT_FOR_DELIVERY: "Đang giao",
  DELIVERED: "Đã giao",
  PROBLEM: "Có sự cố",
  CANCELLED: "Đã hủy",
};

export const paymentLabels: Record<PaymentStatus, string> = {
  UNPAID: "Chưa thanh toán",
  PARTIAL: "Thanh toán một phần",
  PAID: "Đã thanh toán",
  OVERDUE: "Quá hạn",
};

export const pickupStatusLabels: Record<PickupStatus, string> = {
  PENDING: "Chờ phân tài xế",
  ASSIGNED: "Đã phân tài xế",
  ACCEPTED: "Tài xế đã nhận",
  ON_THE_WAY: "Đang đi lấy",
  ARRIVED: "Đã tới điểm lấy",
  PICKED_UP: "Đã lấy hàng",
  FAILED: "Lấy thất bại",
  CANCELLED: "Đã hủy",
};

const orderClasses: Record<OrderStatus, string> = {
  NEW: "bg-blue-50 text-blue-700",
  CONFIRMED: "bg-sky-50 text-sky-700",
  IN_WAREHOUSE: "bg-indigo-50 text-indigo-700",
  PROCESSING: "bg-amber-50 text-amber-700",
  IN_TRANSIT: "bg-teal-50 text-teal-700",
  CUSTOMS_CLEARANCE: "bg-cyan-50 text-cyan-700",
  OUT_FOR_DELIVERY: "bg-violet-50 text-violet-700",
  DELIVERED: "bg-emerald-50 text-emerald-700",
  PROBLEM: "bg-red-50 text-red-700",
  CANCELLED: "bg-slate-50 text-slate-600",
};

const paymentClasses: Record<PaymentStatus, string> = {
  UNPAID: "bg-red-50 text-red-700",
  PARTIAL: "bg-amber-50 text-amber-700",
  PAID: "bg-emerald-50 text-emerald-700",
  OVERDUE: "bg-orange-50 text-orange-700",
};

const pickupClasses: Record<PickupStatus, string> = {
  PENDING: "bg-slate-50 text-slate-600",
  ASSIGNED: "bg-blue-50 text-blue-700",
  ACCEPTED: "bg-purple-50 text-purple-700",
  ON_THE_WAY: "bg-yellow-50 text-yellow-700",
  ARRIVED: "bg-orange-50 text-orange-700",
  PICKED_UP: "bg-green-50 text-green-700",
  FAILED: "bg-red-50 text-red-700",
  CANCELLED: "bg-slate-50 text-slate-600",
};

export function StatusBadge({
  status,
}: {
  status: OrderStatus | PickupStatus;
}) {
  if (status in statusLabels) {
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${orderClasses[status as OrderStatus]}`}
      >
        {statusLabels[status as OrderStatus]}
      </span>
    );
  }

  if (status in pickupStatusLabels) {
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${pickupClasses[status as PickupStatus]}`}
      >
        {pickupStatusLabels[status as PickupStatus]}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700">
      {status}
    </span>
  );
}

export const activeStatusLabels: Record<string, string> = {
  true: "Đang hoạt động",
  false: "Tạm tắt",
};

const activeClasses: Record<string, string> = {
  true: "bg-emerald-50 text-emerald-700",
  false: "bg-slate-50 text-slate-600",
};

export function ActiveBadge({ status }: { status: boolean }) {
  const key = String(status);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${activeClasses[key]}`}
    >
      {activeStatusLabels[key]}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${orderClasses[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${paymentClasses[status]}`}
    >
      {paymentLabels[status]}
    </span>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus | string }) {
  // Backwards-compatible wrapper — some code passes raw strings
  const s = status as PaymentStatus;
  if (s in paymentLabels) {
    return <PaymentStatusBadge status={s} />;
  }

  // Fallback mapping for unknown/loose string values
  const label =
    status === "UNPAID"
      ? "Chưa thanh toán"
      : status === "PARTIAL"
        ? "Thanh toán một phần"
        : status === "PAID"
          ? "Đã thanh toán"
          : status === "OVERDUE"
            ? "Quá hạn"
            : String(status);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${paymentClasses[s as PaymentStatus] ?? "bg-slate-50 text-slate-600"}`}
    >
      {label}
    </span>
  );
}

export function PickupStatusBadge({ status }: { status: PickupStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${pickupClasses[status]}`}
    >
      {pickupStatusLabels[status]}
    </span>
  );
}
