"use server";

import { ShippingTransportType } from "@prisma/client";
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

function getTransportType(value: string) {
  if (Object.values(ShippingTransportType).includes(value as ShippingTransportType)) {
    return value as ShippingTransportType;
  }

  throw new Error("Transport type is invalid.");
}

function getIsActive(formData: FormData) {
  return getText(formData, "isActive") === "on";
}

function redirectWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function createShippingService(formData: FormData) {
  try {
    const code = requireValue(getText(formData, "code"), "Code").toUpperCase();
    const name = requireValue(getText(formData, "name"), "Name");
    const transportType = getTransportType(getText(formData, "transportType"));
    const destinationZone = requireValue(getText(formData, "destinationZone"), "Destination zone");

    await prisma.shippingService.create({
      data: {
        code,
        name,
        transportType,
        destinationZone,
        description: getOptionalText(formData, "description"),
        isActive: getIsActive(formData),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create service.";
    redirectWithError("/admin/services/new", message);
  }

  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function updateShippingService(formData: FormData) {
  const id = requireValue(getText(formData, "id"), "Service id");

  try {
    const code = requireValue(getText(formData, "code"), "Code").toUpperCase();
    const name = requireValue(getText(formData, "name"), "Name");
    const transportType = getTransportType(getText(formData, "transportType"));
    const destinationZone = requireValue(getText(formData, "destinationZone"), "Destination zone");

    await prisma.shippingService.update({
      where: { id },
      data: {
        code,
        name,
        transportType,
        destinationZone,
        description: getOptionalText(formData, "description"),
        isActive: getIsActive(formData),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update service.";
    redirectWithError(`/admin/services/${id}/edit`, message);
  }

  revalidatePath("/admin/services");
  revalidatePath("/admin/orders");
  redirect("/admin/services");
}

export async function toggleShippingService(formData: FormData) {
  const id = requireValue(getText(formData, "id"), "Service id");
  const nextActive = getText(formData, "nextActive") === "true";

  await prisma.shippingService.update({
    where: { id },
    data: { isActive: nextActive },
  });

  revalidatePath("/admin/services");
  redirect("/admin/services");
}
