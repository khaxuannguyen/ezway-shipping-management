"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { PickupStatus, VehicleType } from "@prisma/client";

export async function createPickupRequest(formData: FormData) {
  try {
    const customerType = formData.get("customerType") as string;
    const customerId = formData.get("customerId") as string;
    // const customerName = formData.get("customerName") as string;
    // const customerPhone = formData.get("customerPhone") as string;

    const senderName = formData.get("senderName") as string;
    const senderPhone = formData.get("senderPhone") as string;
    const senderAddress = formData.get("senderAddress") as string;
    const senderWard = formData.get("senderWard") as string;
    const senderDistrict = formData.get("senderDistrict") as string;
    const senderCity = formData.get("senderCity") as string;

    const pickupDate = formData.get("pickupDate") as string;
    const pickupTimeWindow = formData.get("pickupTimeWindow") as string;
    const vehicleType = formData.get("vehicleType") as string;
    const estimatedPackageCount = parseInt(formData.get("estimatedPackageCount") as string);
    const estimatedWeight = formData.get("estimatedWeight") as string;
    const goodsDescription = formData.get("goodsDescription") as string;
    const pickupNote = formData.get("pickupNote") as string;
    const internalNote = formData.get("internalNote") as string;
    const driverId = formData.get("driverId") as string;

    // Validation
    if (!senderName || !senderPhone || !senderAddress || !pickupDate || !vehicleType || !estimatedPackageCount) {
      throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
    }

    if (estimatedPackageCount < 1) {
      throw new Error("Số kiện phải lớn hơn 0");
    }

    // Generate pickup code
    const date = new Date();
    const dateStr = date.toISOString().slice(2, 10).replace(/-/g, ""); // YYMMDD
    const lastPickup = await prisma.pickupRequest.findFirst({
      where: {
        pickupCode: {
          startsWith: `PKP-${dateStr}`,
        },
      },
      orderBy: { pickupCode: "desc" },
    });

    let sequence = 1;
    if (lastPickup) {
      const lastSequence = parseInt(lastPickup.pickupCode.slice(-4));
      sequence = lastSequence + 1;
    }

    const pickupCode = `PKP-${dateStr}-${String(sequence).padStart(4, "0")}`;

    // Determine status
    const status = driverId ? "ASSIGNED" : "PENDING";
    const assignedAt = driverId ? new Date() : null;

    // Create pickup request
    const pickup = await prisma.pickupRequest.create({
      data: {
        pickupCode,
        customerId: customerType === "existing" && customerId ? customerId : null,
        driverId: driverId || null,
        senderName,
        senderPhone,
        senderAddress,
        senderWard: senderWard || null,
        senderDistrict: senderDistrict || null,
        senderCity,
        pickupDate: new Date(pickupDate),
        pickupTimeWindow: pickupTimeWindow || null,
        vehicleType: vehicleType as VehicleType,
        estimatedPackageCount,
        estimatedWeight: estimatedWeight ? parseFloat(estimatedWeight) : null,
        goodsDescription: goodsDescription || null,
        pickupNote: pickupNote || null,
        internalNote: internalNote || null,
        status: status as PickupStatus,
        assignedAt,
      },
      include: {
        driver: true,
      },
    });

    // Create status log
    const logMessage = status === "ASSIGNED"
      ? `Admin đã phân tài xế ${pickup.driver?.name || 'Unknown'}`
      : "Yêu cầu pickup đã được tạo";

    await prisma.pickupStatusLog.create({
      data: {
        pickupRequestId: pickup.id,
        status: status as PickupStatus,
        message: logMessage,
      },
    });

    revalidatePath("/admin/pickups");
    return { success: true, id: pickup.id };
  } catch (error) {
    console.error("Create pickup error:", error);
    throw new Error(error instanceof Error ? error.message : "Không thể tạo pickup");
  }
}

export async function assignDriverToPickup(pickupId: string, driverId: string) {
  try {
    const pickup = await prisma.pickupRequest.findUnique({
      where: { id: pickupId },
      include: { driver: true },
    });

    if (!pickup) {
      throw new Error("Pickup không tồn tại");
    }

    if (pickup.status !== "PENDING") {
      throw new Error("Không thể phân tài xế cho pickup này");
    }

    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      throw new Error("Tài xế không tồn tại");
    }

    await prisma.pickupRequest.update({
      where: { id: pickupId },
      data: {
        driverId,
        status: "ASSIGNED",
        assignedAt: new Date(),
      },
    });

    await prisma.pickupStatusLog.create({
      data: {
        pickupRequestId: pickupId,
        status: "ASSIGNED",
        message: `Admin đã phân tài xế ${driver.name}`,
      },
    });

    revalidatePath(`/admin/pickups/${pickupId}`);
    return { success: true };
  } catch (error) {
    console.error("Assign driver error:", error);
    throw new Error(error instanceof Error ? error.message : "Không thể phân tài xế");
  }
}

export async function cancelPickup(pickupId: string, reason: string) {
  try {
    const pickup = await prisma.pickupRequest.findUnique({
      where: { id: pickupId },
    });

    if (!pickup) {
      throw new Error("Pickup không tồn tại");
    }

    if (pickup.status === "PICKED_UP" || pickup.status === "CANCELLED") {
      throw new Error("Không thể hủy pickup này");
    }

    await prisma.pickupRequest.update({
      where: { id: pickupId },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    });

    await prisma.pickupStatusLog.create({
      data: {
        pickupRequestId: pickupId,
        status: "CANCELLED",
        message: `Pickup đã bị hủy: ${reason}`,
      },
    });

    revalidatePath(`/admin/pickups/${pickupId}`);
    return { success: true };
  } catch (error) {
    console.error("Cancel pickup error:", error);
    throw new Error(error instanceof Error ? error.message : "Không thể hủy pickup");
  }
}