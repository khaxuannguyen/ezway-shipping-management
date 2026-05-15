import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DriverEditForm } from "./driver-edit-form";

export const dynamic = "force-dynamic";

export default async function EditDriverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const driver = await prisma.driver.findUnique({
    where: { id },
  });

  if (!driver) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Sửa thông tin tài xế</h1>
          <p className="mt-1 text-sm text-slate-600">{driver.name}</p>
        </div>
        <Link
          href={`/admin/drivers/${driver.id}`}
          className="rounded-3xl border border-line bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Quay lại
        </Link>
      </div>

      <div className="rounded-lg border border-line bg-white p-6">
        <DriverEditForm driver={driver} />
      </div>
    </div>
  );
}
