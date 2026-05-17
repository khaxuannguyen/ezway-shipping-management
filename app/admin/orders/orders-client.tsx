"use client";

import type { OrderStatus } from "@prisma/client";
import { useMemo, useState } from "react";
import { OrderTable, type OrderTableRow } from "@/components/order-table";
import { statusLabels } from "@/components/status-badge";

const filterOptions: Array<{ value: "all" | OrderStatus; label: string }> = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "NEW", label: statusLabels.NEW },
  { value: "CONFIRMED", label: statusLabels.CONFIRMED },
  { value: "IN_WAREHOUSE", label: statusLabels.IN_WAREHOUSE },
  { value: "PROCESSING", label: statusLabels.PROCESSING },
  { value: "IN_TRANSIT", label: statusLabels.IN_TRANSIT },
  { value: "CUSTOMS_CLEARANCE", label: statusLabels.CUSTOMS_CLEARANCE },
  { value: "OUT_FOR_DELIVERY", label: statusLabels.OUT_FOR_DELIVERY },
  { value: "DELIVERED", label: statusLabels.DELIVERED },
  { value: "PROBLEM", label: statusLabels.PROBLEM },
  { value: "CANCELLED", label: statusLabels.CANCELLED },
];

export function OrdersClient({ orders }: { orders: OrderTableRow[] }) {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");

  const filteredOrders = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = status === "all" || order.status === status;
      const matchesKeyword =
        normalized.length === 0 ||
        [
          order.orderCode,
          order.trackingCode,
          order.customer.name,
          order.customer.phone,
          order.receiverName,
          order.destinationCountry,
          order.serviceType,
          order.shippingService?.code ?? "",
          order.paymentStatus,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);

      return matchesStatus && matchesKeyword;
    });
  }, [keyword, orders, status]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_240px]">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Tìm kiếm
          </span>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Mã đơn, tracking, khách hàng, người nhận"
            value={keyword}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Trạng thái
          </span>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            onChange={(event) =>
              setStatus(event.target.value as "all" | OrderStatus)
            }
            value={status}
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="text-sm font-medium text-slate-600">
        Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
      </div>
      <OrderTable orders={filteredOrders} />
    </div>
  );
}
