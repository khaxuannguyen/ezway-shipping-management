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

const DEFAULT_COST_RATE_ROWS = [
  { label: "0.5", minWeight: 0, maxWeight: 0.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 1 },
  { label: "1.0", minWeight: 0.5, maxWeight: 1, rateType: CostRateType.FIXED_TOTAL, sortOrder: 2 },
  { label: "1.5", minWeight: 1, maxWeight: 1.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 3 },
  { label: "2.0", minWeight: 1.5, maxWeight: 2, rateType: CostRateType.FIXED_TOTAL, sortOrder: 4 },
  { label: "2.5", minWeight: 2, maxWeight: 2.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 5 },
  { label: "3.0", minWeight: 2.5, maxWeight: 3, rateType: CostRateType.FIXED_TOTAL, sortOrder: 6 },
  { label: "3.5", minWeight: 3, maxWeight: 3.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 7 },
  { label: "4.0", minWeight: 3.5, maxWeight: 4, rateType: CostRateType.FIXED_TOTAL, sortOrder: 8 },
  { label: "4.5", minWeight: 4, maxWeight: 4.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 9 },
  { label: "5.0", minWeight: 4.5, maxWeight: 5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 10 },
  { label: "5.5", minWeight: 5, maxWeight: 5.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 11 },
  { label: "6.0", minWeight: 5.5, maxWeight: 6, rateType: CostRateType.FIXED_TOTAL, sortOrder: 12 },
  { label: "6.5", minWeight: 6, maxWeight: 6.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 13 },
  { label: "7.0", minWeight: 6.5, maxWeight: 7, rateType: CostRateType.FIXED_TOTAL, sortOrder: 14 },
  { label: "7.5", minWeight: 7, maxWeight: 7.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 15 },
  { label: "8.0", minWeight: 7.5, maxWeight: 8, rateType: CostRateType.FIXED_TOTAL, sortOrder: 16 },
  { label: "8.5", minWeight: 8, maxWeight: 8.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 17 },
  { label: "9.0", minWeight: 8.5, maxWeight: 9, rateType: CostRateType.FIXED_TOTAL, sortOrder: 18 },
  { label: "9.5", minWeight: 9, maxWeight: 9.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 19 },
  { label: "10.0", minWeight: 9.5, maxWeight: 10, rateType: CostRateType.FIXED_TOTAL, sortOrder: 20 },
  { label: "10.5", minWeight: 10, maxWeight: 10.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 21 },
  { label: "11.0", minWeight: 10.5, maxWeight: 11, rateType: CostRateType.FIXED_TOTAL, sortOrder: 22 },
  { label: "11.5", minWeight: 11, maxWeight: 11.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 23 },
  { label: "12.0", minWeight: 11.5, maxWeight: 12, rateType: CostRateType.FIXED_TOTAL, sortOrder: 24 },
  { label: "12.5", minWeight: 12, maxWeight: 12.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 25 },
  { label: "13.0", minWeight: 12.5, maxWeight: 13, rateType: CostRateType.FIXED_TOTAL, sortOrder: 26 },
  { label: "13.5", minWeight: 13, maxWeight: 13.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 27 },
  { label: "14.0", minWeight: 13.5, maxWeight: 14, rateType: CostRateType.FIXED_TOTAL, sortOrder: 28 },
  { label: "14.5", minWeight: 14, maxWeight: 14.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 29 },
  { label: "15.0", minWeight: 14.5, maxWeight: 15, rateType: CostRateType.FIXED_TOTAL, sortOrder: 30 },
  { label: "15.5", minWeight: 15, maxWeight: 15.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 31 },
  { label: "16.0", minWeight: 15.5, maxWeight: 16, rateType: CostRateType.FIXED_TOTAL, sortOrder: 32 },
  { label: "16.5", minWeight: 16, maxWeight: 16.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 33 },
  { label: "17.0", minWeight: 16.5, maxWeight: 17, rateType: CostRateType.FIXED_TOTAL, sortOrder: 34 },
  { label: "17.5", minWeight: 17, maxWeight: 17.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 35 },
  { label: "18.0", minWeight: 17.5, maxWeight: 18, rateType: CostRateType.FIXED_TOTAL, sortOrder: 36 },
  { label: "18.5", minWeight: 18, maxWeight: 18.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 37 },
  { label: "19.0", minWeight: 18.5, maxWeight: 19, rateType: CostRateType.FIXED_TOTAL, sortOrder: 38 },
  { label: "19.5", minWeight: 19, maxWeight: 19.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 39 },
  { label: "20.0", minWeight: 19.5, maxWeight: 20, rateType: CostRateType.FIXED_TOTAL, sortOrder: 40 },
  { label: "20.5", minWeight: 20, maxWeight: 20.5, rateType: CostRateType.FIXED_TOTAL, sortOrder: 41 },
  { label: "21-44", minWeight: 20.5, maxWeight: 44, rateType: CostRateType.PER_KG, sortOrder: 42 },
  { label: "45-99", minWeight: 44, maxWeight: 99, rateType: CostRateType.PER_KG, sortOrder: 43 },
  { label: "100-299", minWeight: 99, maxWeight: 299, rateType: CostRateType.PER_KG, sortOrder: 44 },
  { label: "300+", minWeight: 299, maxWeight: 500, rateType: CostRateType.PER_KG, sortOrder: 45 },
  { label: "500+", minWeight: 500, maxWeight: null, rateType: CostRateType.PER_KG, sortOrder: 46 },
];

function parseAmountValue(raw: string) {
  const cleaned = raw.replace(/[^\d]/g, "").trim();
  if (!cleaned) {
    return null;
  }
  const amount = Number(cleaned);
  if (Number.isNaN(amount) || amount < 0) {
    return null;
  }
  return amount;
}

function parseBatchCostRates(formData: FormData) {
  return DEFAULT_COST_RATE_ROWS.flatMap((row, index) => {
    const rawValue = text(formData, `amount_${index}`);
    if (!rawValue) return [];

    const amount = parseAmountValue(rawValue);
    if (amount === null) {
      throw new Error(`Giá gốc tại ${row.label} không hợp lệ.`);
    }

    if (amount <= 0) {
      return [];
    }

    return [
      {
        ...row,
        amount,
        currency: "VND",
        isActive: true,
      },
    ];
  });
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
  const shippingServiceId = text(formData, "shippingServiceId");
  const redirectTo = text(formData, "redirectTo");
  const errorRedirectTo = text(formData, "errorRedirectTo");

  try {
    if (!shippingServiceId) {
      throw new Error("Shipping service is required.");
    }

    const shippingService = await prisma.shippingService.findFirst({
      where: { id: shippingServiceId, isActive: true },
      select: { id: true },
    });

    if (!shippingService) {
      throw new Error("Shipping service is invalid or inactive.");
    }

    const rates = parseBatchCostRates(formData);
    if (rates.length === 0) {
      throw new Error("Please enter at least one price for the selected shipping service.");
    }

    await prisma.$transaction([
      prisma.serviceCostRate.updateMany({
        where: { shippingServiceId, isActive: true },
        data: { isActive: false },
      }),
      prisma.serviceCostRate.createMany({
        data: rates.map((rate) => ({
          shippingServiceId,
          label: rate.label,
          minWeight: rate.minWeight,
          maxWeight: rate.maxWeight,
          rateType: rate.rateType,
          amount: rate.amount,
          currency: rate.currency,
          isActive: rate.isActive,
          sortOrder: rate.sortOrder,
        })),
      }),
    ]);

    revalidatePath("/admin/cost-rates");
    redirect(redirectTo || `/admin/cost-rates/${shippingServiceId}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create cost rate.";
    redirect(errorRedirectTo || `/admin/cost-rates/new?error=${encodeURIComponent(message)}`);
  }
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
