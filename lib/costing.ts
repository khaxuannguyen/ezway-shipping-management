import type { CostRateType, ServiceCostRate } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type CostRateLike = Pick<ServiceCostRate, "rateType" | "amount">;

export function calculateVolumetricWeight(length: number, width: number, height: number) {
  return Number(((length * width * height) / 5000).toFixed(2));
}

export function calculateChargeableWeight(
  actualWeight: number,
  length: number,
  width: number,
  height: number,
) {
  const volumetricWeight = calculateVolumetricWeight(length, width, height);
  return Number(Math.max(actualWeight, volumetricWeight).toFixed(2));
}

export async function findServiceCostRate(
  shippingServiceId: string,
  chargeableWeight: number,
) {
  return prisma.serviceCostRate.findFirst({
    where: {
      shippingServiceId,
      isActive: true,
      minWeight: {
        lt: chargeableWeight,
      },
      OR: [
        {
          maxWeight: null,
        },
        {
          maxWeight: {
            gte: chargeableWeight,
          },
        },
      ],
    },
    orderBy: [{ sortOrder: "asc" }, { minWeight: "asc" }],
  });
}

export function calculateBaseCost(
  rate: CostRateLike | { rateType: CostRateType; amount: number } | null,
  chargeableWeight: number,
) {
  if (!rate) {
    return 0;
  }

  if (rate.rateType === "FIXED_TOTAL") {
    return Math.round(rate.amount);
  }

  return Math.round(chargeableWeight * rate.amount);
}

export function calculateOrderProfit(
  totalFee: number,
  baseCost: number,
  extraCostTotal: number,
) {
  return Math.round(totalFee - baseCost - extraCostTotal);
}
