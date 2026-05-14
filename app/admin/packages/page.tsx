import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PackagesClient } from "./packages-client";

export const dynamic = "force-dynamic";

export default async function PackagesPage() {
  const packages = await prisma.package.findMany({
    include: {
      order: {
        select: {
          orderCode: true,
          trackingCode: true,
          destinationCountry: true,
          customer: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = packages.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Kien hang</h1>
          <p className="mt-1 text-sm text-slate-600">
            Quan ly package, kich thuoc va can nang tinh cuoc trong kho EZWAY.
          </p>
        </div>
        <Link
          className="w-fit rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          href="/admin/packages/new"
        >
          Tao kien hang
        </Link>
      </div>

      <PackagesClient packages={rows} />
    </div>
  );
}
