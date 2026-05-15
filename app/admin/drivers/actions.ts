"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { VehicleType } from "@prisma/client";

export async function createDriver(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const vehicleType = formData.get("vehicleType") as string;
    const vehiclePlate = formData.get("vehiclePlate") as string;
    const identityNumber = formData.get("identityNumber") as string;
    const isActive = formData.get("isActive") === "true";

    // Validation
    if (!name || !phone || !vehicleType) {
      throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
    }

    // Generate driver code
    const date = new Date();
    const dateStr = date.toISOString().slice(2, 10).replace(/-/g, ""); // YYMMDD
    const lastDriver = await prisma.driver.findFirst({
      where: {
        driverCode: {
          startsWith: `DRV-${dateStr}`,
        },
      },
      orderBy: { driverCode: "desc" },
    });

    let sequence = 1;
    if (lastDriver) {
      const lastSequence = parseInt(lastDriver.driverCode.slice(-4));
      sequence = lastSequence + 1;
    }

    const driverCode = `DRV-${dateStr}-${String(sequence).padStart(4, "0")}`;

    // Create driver
    const driver = await prisma.driver.create({
      data: {
        driverCode,
        name,
        phone,
        email: email || null,
        vehicleType: vehicleType as VehicleType,
        vehiclePlate: vehiclePlate || null,
        identityNumber: identityNumber || null,
        isActive,
      },
    });

    revalidatePath("/admin/drivers");
    return { success: true, id: driver.id };
  } catch (error) {
    console.error("Create driver error:", error);
    throw new Error(error instanceof Error ? error.message : "Không thể tạo tài xế");
  }
}

export async function updateDriver(formData: FormData) {
  try {
    const driverId = formData.get("driverId") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const vehicleType = formData.get("vehicleType") as string;
    const vehiclePlate = formData.get("vehiclePlate") as string;
    const identityNumber = formData.get("identityNumber") as string;
    const isActive = formData.get("isActive") === "true";

    // Validation
    if (!name || !phone || !vehicleType) {
      throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
    }

    const driver = await prisma.driver.update({
      where: { id: driverId },
      data: {
        name,
        phone,
        email: email || null,
        vehicleType: vehicleType as VehicleType,
        vehiclePlate: vehiclePlate || null,
        identityNumber: identityNumber || null,
        isActive,
      },
    });

    revalidatePath("/admin/drivers");
    revalidatePath(`/admin/drivers/${driverId}`);
    return { success: true, id: driver.id };
  } catch (error) {
    console.error("Update driver error:", error);
    throw new Error(error instanceof Error ? error.message : "Không thể cập nhật tài xế");
  }
}
