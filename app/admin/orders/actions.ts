"use server";

import {
  OrderStatus,
  PaymentStatus,
  Prisma,
  ServiceType,
  ShippingTransportType,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  calculateBaseCost,
  calculateChargeableWeight,
  calculateOrderProfit,
  calculateVolumetricWeight,
} from "@/lib/costing";
import { prisma } from "@/lib/prisma";

const statusMessages: Record<OrderStatus, string> = {
  NEW: "Don hang da duoc tao tren he thong EZWAY",
  CONFIRMED: "Don hang da duoc xac nhan",
  IN_WAREHOUSE: "Hang da ve kho",
  PROCESSING: "Hang dang duoc xu ly tai kho",
  IN_TRANSIT: "Hang dang van chuyen quoc te",
  CUSTOMS_CLEARANCE: "Hang dang lam thu tuc thong quan",
  OUT_FOR_DELIVERY: "Hang dang duoc phat toi nguoi nhan",
  DELIVERED: "Don hang da giao thanh cong",
  PROBLEM: "Don hang dang co su co can xu ly",
  CANCELLED: "Don hang da bi huy",
};

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalText(formData: FormData, key: string) {
  const value = getText(formData, key);
  return value.length > 0 ? value : null;
}

function getNumber(formData: FormData, key: string) {
  const rawValue = getText(formData, key);
  const value = Number(rawValue);

  if (rawValue.length === 0 || Number.isNaN(value) || value < 0) {
    throw new Error(`${key} must be a number greater than or equal to 0.`);
  }

  return value;
}

function getInt(formData: FormData, key: string) {
  const value = getNumber(formData, key);

  if (!Number.isInteger(value)) {
    throw new Error(`${key} must be an integer.`);
  }

  return value;
}

function getOptionalNumber(formData: FormData, key: string, fallback = 0) {
  const rawValue = getText(formData, key);
  if (!rawValue) return fallback;
  const value = Number(rawValue);
  if (Number.isNaN(value) || value < 0) {
    throw new Error(`${key} must be a number greater than or equal to 0.`);
  }
  return value;
}

function getEnumValue<T extends string>(value: string, values: readonly T[], fieldName: string): T {
  if (values.includes(value as T)) {
    return value as T;
  }

  throw new Error(`${fieldName} is invalid.`);
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

async function generateOrderCode(tx: Prisma.TransactionClient) {
  const count = await tx.order.count({
    where: {
      createdAt: {
        gte: startOfToday(),
        lt: startOfTomorrow(),
      },
    },
  });

  return `EZW-${todayCodePart()}-${String(count + 1).padStart(4, "0")}`;
}

async function generatePackageCode(tx: Prisma.TransactionClient) {
  const count = await tx.package.count({
    where: {
      createdAt: {
        gte: startOfToday(),
        lt: startOfTomorrow(),
      },
    },
  });

  return `PKG-${todayCodePart()}-${String(count + 1).padStart(4, "0")}`;
}

function generateTrackingCode() {
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `EZW${Date.now().toString(36).toUpperCase()}${randomPart}`;
}

async function generateCustomerCode(tx: Prisma.TransactionClient) {
  const count = await tx.customer.count();
  return `CUS-${String(count + 1).padStart(4, "0")}`;
}

function requireValue(value: string, fieldName: string) {
  if (!value) {
    throw new Error(`${fieldName} is required.`);
  }

  return value;
}

function redirectToNewOrderError(message: string): never {
  redirect(`/admin/orders/new?error=${encodeURIComponent(message)}`);
}

function mapTransportToServiceType(transportType: ShippingTransportType) {
  if (transportType === ShippingTransportType.AIR) {
    return ServiceType.AIR;
  }

  if (transportType === ShippingTransportType.SEA) {
    return ServiceType.SEA;
  }

  if (transportType === ShippingTransportType.EXPRESS) {
    return ServiceType.EXPRESS;
  }

  return ServiceType.ECONOMY;
}

export async function createOrder(formData: FormData) {
  let orderId = "";

  try {
    const selectedCustomerId = getText(formData, "customerId");
    const customerName = getText(formData, "customerName");
    const customerPhone = getText(formData, "customerPhone");
    const senderName = requireValue(getText(formData, "senderName"), "Sender name");
    const senderPhone = requireValue(getText(formData, "senderPhone"), "Sender phone");
    const senderAddress = requireValue(getText(formData, "senderAddress"), "Sender address");
    const receiverName = requireValue(getText(formData, "receiverName"), "Receiver name");
    const receiverPhone = requireValue(getText(formData, "receiverPhone"), "Receiver phone");
    const receiverAddress = requireValue(getText(formData, "receiverAddress"), "Receiver address");
    const originCountry = requireValue(getText(formData, "originCountry"), "Origin country");
    const destinationCountry = requireValue(
      getText(formData, "destinationCountry"),
      "Destination country",
    );
    const shippingServiceId = requireValue(getText(formData, "shippingServiceId"), "Shipping service");
    const goodsType = requireValue(getText(formData, "goodsType"), "Goods type");
    const packageCount = getInt(formData, "packageCount");

    if (packageCount < 1) {
      throw new Error("Package count must be at least 1.");
    }

    const actualWeight = getNumber(formData, "actualWeight");
    const length = getNumber(formData, "length");
    const width = getNumber(formData, "width");
    const height = getNumber(formData, "height");
    const totalFee = Math.round(getNumber(formData, "totalFee"));
    const baseFee = totalFee;
    const surchargeFee = Math.round(getOptionalNumber(formData, "surchargeFee", 0));
    const discountFee = Math.round(getOptionalNumber(formData, "discountFee", 0));
    const volumetricWeight = calculateVolumetricWeight(length, width, height);
    const chargeableWeight = calculateChargeableWeight(actualWeight, length, width, height);

    if (totalFee < 0) {
      throw new Error("Total fee cannot be negative.");
    }

    const order = await prisma.$transaction(async (tx) => {
      const shippingService = await tx.shippingService.findFirst({
        where: {
          id: shippingServiceId,
          isActive: true,
        },
        select: {
          id: true,
          transportType: true,
        },
      });

      if (!shippingService) {
        throw new Error("Shipping service is invalid or inactive.");
      }
      const costRate = await tx.serviceCostRate.findFirst({
        where: {
          shippingServiceId,
          isActive: true,
          minWeight: { lt: chargeableWeight },
          OR: [{ maxWeight: null }, { maxWeight: { gte: chargeableWeight } }],
        },
        orderBy: [{ sortOrder: "asc" }, { minWeight: "asc" }],
      });
      const baseCost = calculateBaseCost(costRate, chargeableWeight);
      const extraCostTotal = 0;
      const profit = calculateOrderProfit(totalFee, baseCost, extraCostTotal);

      const customerId =
        selectedCustomerId ||
        (
          await tx.customer.create({
            data: {
              customerCode: await generateCustomerCode(tx),
              name: requireValue(customerName, "Customer name"),
              phone: requireValue(customerPhone, "Customer phone"),
              email: getOptionalText(formData, "customerEmail"),
              address: getOptionalText(formData, "customerAddress"),
            },
          })
        ).id;

      return tx.order.create({
        data: {
          orderCode: await generateOrderCode(tx),
          trackingCode: generateTrackingCode(),
          customerId,
          shippingServiceId: shippingService.id,
          senderName,
          senderPhone,
          senderAddress,
          receiverName,
          receiverPhone,
          receiverAddress,
          originCountry,
          destinationCountry,
          serviceType: mapTransportToServiceType(shippingService.transportType),
          goodsType,
          packageCount,
          actualWeight,
          volumetricWeight,
          chargeableWeight,
          baseFee,
          surchargeFee,
          discountFee,
          totalFee,
          baseCost,
          extraCostTotal,
          profit,
          paymentStatus: PaymentStatus.UNPAID,
          status: OrderStatus.NEW,
          internalNote: getOptionalText(formData, "internalNote"),
          packages: {
            create: {
              packageCode: await generatePackageCode(tx),
              length,
              width,
              height,
              actualWeight,
              volumetricWeight,
              chargeableWeight,
              description: "First package",
            },
          },
          trackingEvents: {
            create: {
              status: OrderStatus.NEW,
              message: statusMessages.NEW,
              location: "EZWAY Operations",
              eventTime: new Date(),
            },
          },
        },
        select: { id: true },
      });
    });

    orderId = order.id;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create order.";
    redirectToNewOrderError(message);
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/orders");
  redirect(`/admin/orders/${orderId}`);
}

async function recalculateOrderCosts(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      totalFee: true,
      baseCost: true,
      extraCosts: { select: { amount: true } },
    },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  const extraCostTotal = order.extraCosts.reduce((total, item) => total + item.amount, 0);
  await prisma.order.update({
    where: { id: orderId },
    data: {
      extraCostTotal,
      profit: calculateOrderProfit(order.totalFee, order.baseCost, extraCostTotal),
    },
  });
}

export async function addOrderExtraCost(formData: FormData) {
  const orderId = requireValue(getText(formData, "orderId"), "Order id");
  const costItemId = getOptionalText(formData, "costItemId");
  const amount = getNumber(formData, "amount");
  const fallbackName = getText(formData, "name");

  let costItem: { id: string; name: string } | null = null;
  if (costItemId) {
    costItem = await prisma.costItem.findUnique({
      where: { id: costItemId },
      select: { id: true, name: true },
    });
  }

  await prisma.orderExtraCost.create({
    data: {
      orderId,
      costItemId: costItem?.id ?? null,
      name: fallbackName || costItem?.name || "Extra cost",
      amount,
      note: getOptionalText(formData, "note"),
    },
  });
  await recalculateOrderCosts(orderId);

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  redirect(`/admin/orders/${orderId}`);
}

export async function deleteOrderExtraCost(formData: FormData) {
  const orderId = requireValue(getText(formData, "orderId"), "Order id");
  const id = requireValue(getText(formData, "id"), "Extra cost id");

  await prisma.orderExtraCost.delete({ where: { id } });
  await recalculateOrderCosts(orderId);

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  redirect(`/admin/orders/${orderId}`);
}

export async function updateOrderStatus(formData: FormData) {
  const orderId = requireValue(getText(formData, "orderId"), "Order id");
  const status = getEnumValue(getText(formData, "status"), Object.values(OrderStatus), "Status");

  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { status },
    }),
    prisma.trackingEvent.create({
      data: {
        orderId,
        status,
        message: statusMessages[status],
        location: "EZWAY Operations",
        eventTime: new Date(),
      },
    }),
  ]);

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  redirect(`/admin/orders/${orderId}`);
}

export async function addTrackingEvent(formData: FormData) {
  const orderId = requireValue(getText(formData, "orderId"), "Order id");
  const status = getEnumValue(getText(formData, "status"), Object.values(OrderStatus), "Status");
  const message = requireValue(getText(formData, "message"), "Message");
  const location = getOptionalText(formData, "location");
  const eventTimeRaw = getText(formData, "eventTime");
  const eventTime = eventTimeRaw ? new Date(eventTimeRaw) : new Date();

  if (Number.isNaN(eventTime.getTime())) {
    throw new Error("Event time is invalid.");
  }

  await prisma.trackingEvent.create({
    data: {
      orderId,
      status,
      message,
      location,
      eventTime,
    },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  redirect(`/admin/orders/${orderId}`);
}

export async function updatePaymentStatus(formData: FormData) {
  const orderId = requireValue(getText(formData, "orderId"), "Order id");
  const paymentStatus = getEnumValue(
    getText(formData, "paymentStatus"),
    Object.values(PaymentStatus),
    "Payment status",
  );
  const amountRaw = getText(formData, "amount");
  const amount = amountRaw ? Number(amountRaw) : 0;

  if (Number.isNaN(amount) || amount < 0) {
    throw new Error("Payment amount must be a number greater than or equal to 0.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { paymentStatus },
    });

    if (amount > 0) {
      await tx.payment.create({
        data: {
          orderId,
          amount: Math.round(amount),
          method: getOptionalText(formData, "method"),
          note: getOptionalText(formData, "paymentNote"),
          paidAt: new Date(),
        },
      });
    }
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  redirect(`/admin/orders/${orderId}`);
}
