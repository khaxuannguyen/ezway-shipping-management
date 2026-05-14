import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CostRatesClient } from "./cost-rates-client";

export const dynamic = "force-dynamic";

export default async function CostRatesPage() {
  const [rates, services] = await Promise.all([
    prisma.serviceCostRate.findMany({
      include: { shippingService: { select: { code: true, name: true } } },
      orderBy: [{ shippingService: { code: "asc" } }, { sortOrder: "asc" }],
    }),
    prisma.shippingService.findMany({ select: { id: true, code: true }, orderBy: { code: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Gia goc dich vu</h1>
          <p className="mt-1 text-sm text-slate-600">
            0.5kg-20.5kg la gia le theo moc. Tren 20.5kg la gia si theo kg.
          </p>
        </div>
        <Link className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white" href="/admin/cost-rates/new">
          Tao gia goc
        </Link>
      </div>
      <CostRatesClient rates={rates} services={services} />
    </div>
  );
}
