import React from "react";
import { ProcessFlow, FlowNode } from "./process-flow";
import type { PickupStatus } from "@prisma/client";

interface PickupData {
  id?: string;
  pickupCode?: string | null;
  status?: PickupStatus;
  driver?: { name?: string } | null;
  pickupDate?: string | Date | null;
}

export function PickupProcessFlow({ pickup }: { pickup?: PickupData | null }) {
  const mapStatus = (s?: PickupStatus) => {
    if (!s) return "pending" as const;
    if (s === "FAILED" || s === "CANCELLED") return "problem" as const;
    if (s === "PICKED_UP") return "completed" as const;
    return "active" as const;
  };

  const nodes: FlowNode[] = [
    {
      id: "created",
      title: "Tạo yêu cầu",
      status: pickup ? "completed" : "completed",
      items: [pickup?.pickupCode ?? "-"],
    },
    {
      id: "assigned",
      title: "Phân tài xế",
      status: pickup
        ? pickup.status === "ASSIGNED"
          ? "active"
          : mapStatus(pickup.status)
        : "pending",
      items: [pickup?.driver?.name ?? "Chưa phân"],
    },
    {
      id: "accepted",
      title: "Tài xế nhận",
      status: pickup
        ? pickup.status === "ACCEPTED"
          ? "active"
          : mapStatus(pickup.status)
        : "pending",
    },
    {
      id: "ontheway",
      title: "Đang đi lấy",
      status: pickup
        ? pickup.status === "ON_THE_WAY"
          ? "active"
          : mapStatus(pickup.status)
        : "pending",
    },
    {
      id: "arrived",
      title: "Đã tới điểm lấy",
      status: pickup
        ? pickup.status === "ARRIVED"
          ? "active"
          : mapStatus(pickup.status)
        : "pending",
    },
    {
      id: "picked",
      title: "Đã lấy hàng",
      status: pickup
        ? pickup.status === "PICKED_UP"
          ? "completed"
          : mapStatus(pickup.status)
        : "pending",
    },
  ];

  return <ProcessFlow nodes={nodes} />;
}

export default PickupProcessFlow;
