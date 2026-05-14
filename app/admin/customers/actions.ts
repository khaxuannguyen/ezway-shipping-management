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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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

async function generateCustomerCode() {
  const count = await prisma.customer.count({
    where: {
      createdAt: {
        gte: startOfToday(),
        lt: startOfTomorrow(),
      },
    },
  });

  return `CUS-${todayCodePart()}-${String(count + 1).padStart(4, "0")}`;
}

function redirectToCustomerFormError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function createCustomer(formData: FormData) {
  let customerId = "";

  try {
    const name = requireValue(getText(formData, "name"), "Name");
    const phone = requireValue(getText(formData, "phone"), "Phone");
    const email = getOptionalText(formData, "email");

    if (email && !isValidEmail(email)) {
      throw new Error("Email format is invalid.");
    }

    const customer = await prisma.customer.create({
      data: {
        customerCode: await generateCustomerCode(),
        name,
        phone,
        email,
        address: getOptionalText(formData, "address"),
      },
      select: { id: true },
    });

    customerId = customer.id;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create customer.";
    redirectToCustomerFormError("/admin/customers/new", message);
  }

  revalidatePath("/admin/customers");
  redirect(`/admin/customers/${customerId}`);
}

export async function updateCustomer(formData: FormData) {
  const id = requireValue(getText(formData, "id"), "Customer id");

  try {
    const name = requireValue(getText(formData, "name"), "Name");
    const phone = requireValue(getText(formData, "phone"), "Phone");
    const email = getOptionalText(formData, "email");

    if (email && !isValidEmail(email)) {
      throw new Error("Email format is invalid.");
    }

    await prisma.customer.update({
      where: { id },
      data: {
        name,
        phone,
        email,
        address: getOptionalText(formData, "address"),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update customer.";
    redirectToCustomerFormError(`/admin/customers/${id}/edit`, message);
  }

  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${id}`);
  redirect(`/admin/customers/${id}`);
}
