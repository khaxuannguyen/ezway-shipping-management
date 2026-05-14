import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ServicesClient } from "./services-client";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.shippingService.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rows = services.map((service) => ({
    ...service,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Dich vu / Tuyen van chuyen</h1>
          <p className="mt-1 text-sm text-slate-600">
            Chi admin duoc quan ly danh sach dich vu.
          </p>
        </div>
        <Link
          className="w-fit rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          href="/admin/services/new"
        >
          Tao dich vu
        </Link>
      </div>

      <ServicesClient services={rows} />
    </div>
  );
}
