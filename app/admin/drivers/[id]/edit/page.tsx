import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DriverEditForm } from "./driver-edit-form";
import { PageHeader } from "@/components/page-header";

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
      <PageHeader
        title="Sửa thông tin tài xế"
        description={driver.name}
        actionLabel="Quay lại"
        actionHref={`/admin/drivers/${driver.id}`}
      />

      <div className="rounded-lg border border-line bg-white p-6">
        <DriverEditForm driver={driver} />
      </div>
    </div>
  );
}
