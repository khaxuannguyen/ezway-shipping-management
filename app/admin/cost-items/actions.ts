"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value ? value : null;
}

function dataFromForm(formData: FormData) {
  const name = text(formData, "name");
  const defaultAmount = Number(text(formData, "defaultAmount"));
  if (!name) throw new Error("Name is required.");
  if (Number.isNaN(defaultAmount) || defaultAmount < 0) {
    throw new Error("Default amount must be greater than or equal to 0.");
  }
  return {
    name,
    defaultAmount,
    description: optionalText(formData, "description"),
    isActive: text(formData, "isActive") === "on",
  };
}

export async function createCostItem(formData: FormData) {
  try {
    await prisma.costItem.create({ data: dataFromForm(formData) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create cost item.";
    redirect(`/admin/cost-items/new?error=${encodeURIComponent(message)}`);
  }
  revalidatePath("/admin/cost-items");
  redirect("/admin/cost-items");
}

export async function updateCostItem(formData: FormData) {
  const id = text(formData, "id");
  try {
    if (!id) throw new Error("Cost item id is required.");
    await prisma.costItem.update({ where: { id }, data: dataFromForm(formData) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update cost item.";
    redirect(`/admin/cost-items/${id}/edit?error=${encodeURIComponent(message)}`);
  }
  revalidatePath("/admin/cost-items");
  redirect("/admin/cost-items");
}
