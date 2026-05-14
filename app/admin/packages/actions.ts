"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalText(formData: FormData, key: string) {
  const value = getText(formData, key);
  return value.length > 0 ? value : null;
}

function requireValue(value: string, fieldName: string) {
  if (!value) {
    throw new Error(`${fieldName} is required.`);
  }

  return value;
}

function getNumber(formData: FormData, key: string) {
  const rawValue = getText(formData, key);
  const value = Number(rawValue);

  if (rawValue.length === 0 || Number.isNaN(value) || value < 0) {
    throw new Error(`${key} must be a number greater than or equal to 0.`);
  }

  return value;
}

function todayCodePart() {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfTomorrow() {
  const date = startOfToday();
  date.setDate(date.getDate() + 1);
  return date;
}

async function generatePackageCode() {
  const count = await prisma.package.count({
    where: {
      createdAt: {
        gte: startOfToday(),
        lt: startOfTomorrow(),
      },
    },
  });

  return `PKG-${todayCodePart()}-${String(count + 1).padStart(4, "0")}`;
}

function calculateWeights(length: number, width: number, height: number, actualWeight: number) {
  const volumetricWeight = Number(((length * width * height) / 5000).toFixed(2));
  const chargeableWeight = Number(Math.max(actualWeight, volumetricWeight).toFixed(2));

  return { volumetricWeight, chargeableWeight };
}

function redirectToPackageFormError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function createPackage(formData: FormData) {
  let packageId = "";

  try {
    const orderId = requireValue(getText(formData, "orderId"), "Order");
    const length = getNumber(formData, "length");
    const width = getNumber(formData, "width");
    const height = getNumber(formData, "height");
    const actualWeight = getNumber(formData, "actualWeight");
    const { volumetricWeight, chargeableWeight } = calculateWeights(
      length,
      width,
      height,
      actualWeight,
    );

    const createdPackage = await prisma.package.create({
      data: {
        packageCode: await generatePackageCode(),
        orderId,
        length,
        width,
        height,
        actualWeight,
        volumetricWeight,
        chargeableWeight,
        description: getOptionalText(formData, "description"),
      },
      select: {
        id: true,
        orderId: true,
      },
    });

    packageId = createdPackage.id;
    revalidatePath(`/admin/orders/${createdPackage.orderId}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create package.";
    const orderId = getText(formData, "orderId");
    const path = orderId ? `/admin/packages/new?orderId=${encodeURIComponent(orderId)}` : "/admin/packages/new";
    const separator = path.includes("?") ? "&" : "?";
    redirect(`${path}${separator}error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/packages");
  redirect(`/admin/packages/${packageId}`);
}

export async function updatePackage(formData: FormData) {
  const id = requireValue(getText(formData, "id"), "Package id");

  try {
    const length = getNumber(formData, "length");
    const width = getNumber(formData, "width");
    const height = getNumber(formData, "height");
    const actualWeight = getNumber(formData, "actualWeight");
    const { volumetricWeight, chargeableWeight } = calculateWeights(
      length,
      width,
      height,
      actualWeight,
    );

    const updatedPackage = await prisma.package.update({
      where: { id },
      data: {
        length,
        width,
        height,
        actualWeight,
        volumetricWeight,
        chargeableWeight,
        description: getOptionalText(formData, "description"),
      },
      select: {
        orderId: true,
      },
    });

    revalidatePath(`/admin/orders/${updatedPackage.orderId}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update package.";
    redirectToPackageFormError(`/admin/packages/${id}/edit`, message);
  }

  revalidatePath("/admin/packages");
  revalidatePath(`/admin/packages/${id}`);
  redirect(`/admin/packages/${id}`);
}
