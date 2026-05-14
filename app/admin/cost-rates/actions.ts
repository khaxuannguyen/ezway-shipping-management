"use server";

import { CostRateType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(formData: FormData, key: string, required = true) {
  const raw = text(formData, key);
  if (!raw && !required) return null;
  const value = Number(raw);
  if (raw === "" || Number.isNaN(value) || value < 0) {
    throw new Error(`${key} must be a number greater than or equal to 0.`);
  }
  return value;
}

function rateTypeValue(value: string) {
  if (Object.values(CostRateType).includes(value as CostRateType)) {
    return value as CostRateType;
  }
  throw new Error("Rate type is invalid.");
}

function formDataToRate(formData: FormData) {
  const shippingServiceId = text(formData, "shippingServiceId");
  const label = text(formData, "label");
  const minWeight = numberValue(formData, "minWeight") ?? 0;
  const maxWeight = numberValue(formData, "maxWeight", false);
  const amount = numberValue(formData, "amount") ?? 0;

  if (!shippingServiceId) throw new Error("Shipping service is required.");
  if (!label) throw new Error("Label is required.");
  if (maxWeight !== null && maxWeight <= minWeight) {
    throw new Error("Max weight must be greater than min weight.");
  }

  return {
    shippingServiceId,
    label,
    minWeight,
    maxWeight,
    rateType: rateTypeValue(text(formData, "rateType")),
    amount,
    currency: text(formData, "currency") || "VND",
    isActive: text(formData, "isActive") === "on",
    sortOrder: Number(text(formData, "sortOrder") || 0),
  };
}

export async function createCostRate(formData: FormData) {
  try {
    await prisma.serviceCostRate.create({ data: formDataToRate(formData) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create cost rate.";
    redirect(`/admin/cost-rates/new?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/cost-rates");
  redirect("/admin/cost-rates");
}

export async function updateCostRate(formData: FormData) {
  const id = text(formData, "id");
  try {
    if (!id) throw new Error("Cost rate id is required.");
    await prisma.serviceCostRate.update({
      where: { id },
      data: formDataToRate(formData),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update cost rate.";
    redirect(`/admin/cost-rates/${id}/edit?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/cost-rates");
  redirect("/admin/cost-rates");
}
