import React from "react";
import { ProcessFlow, FlowNode } from "./process-flow";

interface OrderData {
  id?: string;
  orderCode?: string;
  customer?: { name?: string } | null;
  receiverName?: string | null;
  destinationCountry?: string | null;
  pickup?: PickupData | null;
  packages?: PackageData[] | null;
  chargeableWeight?: number | null;
  shippingService?: {
    code?: string;
    name?: string;
    transportType?: string;
  } | null;
  trackingCode?: string | null;
  trackingEvents?: Array<{ message?: string }> | null;
  status?: string | null;
  paymentStatus?: string | null;
  totalFee?: number | null;
  baseCost?: number | null;
  profit?: number | null;
}

interface PickupData {
  id?: string;
  pickupCode?: string | null;
  status?: string | null;
  driver?: { name?: string } | null;
  pickupDate?: string | Date | null;
}

interface PackageData {
  id?: string;
  packageCode?: string;
}

export function OrderProcessFlow({ data }: { data: OrderData }) {
  // data is the order with relations: customer, packages, trackingEvents, payments, shippingService, pickup
  const nodes: FlowNode[] = [
    {
      id: "created",
      title: "Tạo đơn",
      subtitle: data.orderCode,
      status: "completed",
      items: [
        data.customer?.name ?? "Chưa có",
        `Người nhận: ${data.receiverName ?? "-"}`,
        `Quốc gia: ${data.destinationCountry ?? "-"}`,
      ],
    },
    {
      id: "pickup",
      title: "Pickup hàng",
      subtitle: data.pickup?.pickupCode ?? "Chưa có",
      status: data.pickup
        ? data.pickup.status === "PICKED_UP"
          ? "completed"
          : "active"
        : "pending",
      items: data.pickup
        ? [
            data.pickup.driver?.name ?? "Chưa phân",
            `Thời gian: ${data.pickup.pickupDate ? new Date(data.pickup.pickupDate).toLocaleString() : "-"}`,
          ]
        : ["Chưa có"],
    },
    {
      id: "warehouse",
      title: "Nhập kho",
      subtitle: `${data.packages?.length ?? 0} kiện`,
      status:
        data.status === "IN_WAREHOUSE" || data.status === "PROCESSING"
          ? "active"
          : "pending",
      items: [
        `Số kiện: ${data.packages?.length ?? 0}`,
        `Cân nặng: ${data.chargeableWeight ?? "-"} kg`,
      ],
    },
    {
      id: "packing",
      title: "Đóng gói / Kiện hàng",
      subtitle: `${data.packages?.length ?? 0} kiện`,
      status: data.status === "PROCESSING" ? "active" : "pending",
      items: [
        `Số kiện: ${data.packages?.length ?? 0}`,
        `Cân nặng tính cước: ${data.chargeableWeight ?? "-"} kg`,
      ],
    },
    {
      id: "route",
      title: "Tuyến vận chuyển",
      subtitle: data.shippingService?.code ?? "-",
      status: data.shippingService ? "active" : "pending",
      items: [
        data.shippingService?.name ?? "-",
        data.shippingService?.transportType ?? "-",
      ],
    },
    {
      id: "intl",
      title: "Vận chuyển quốc tế",
      subtitle: data.trackingCode ?? "-",
      status:
        data.trackingEvents && data.trackingEvents.length > 0
          ? "active"
          : "pending",
      items: [
        data.trackingEvents && data.trackingEvents.length > 0
          ? (data.trackingEvents[data.trackingEvents.length - 1].message ??
            "Chưa có timeline")
          : "Chưa có timeline",
      ],
    },
    {
      id: "delivery",
      title: "Giao hàng",
      subtitle: data.receiverName ?? "-",
      status: data.status === "DELIVERED" ? "completed" : "pending",
      items: [
        data.receiverName ?? "-",
        `Quốc gia: ${data.destinationCountry ?? "-"}`,
      ],
    },
    {
      id: "payment",
      title: "Thanh toán & lợi nhuận",
      subtitle: `Trạng thái: ${data.paymentStatus ?? "-"}`,
      status:
        data.paymentStatus === "PAID"
          ? "completed"
          : data.paymentStatus === "PARTIAL"
            ? "active"
            : "pending",
      items: [
        `Giá bán: ${data.totalFee ?? "-"}`,
        `Giá gốc: ${data.baseCost ?? "-"}`,
        `Lợi nhuận: ${data.profit ?? "-"}`,
      ],
    },
  ];

  return <ProcessFlow nodes={nodes} />;
}

export default OrderProcessFlow;
