import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CostRateNewForm } from "../../new/cost-rate-new-form";
import { DEFAULT_COST_RATE_ROWS } from "../../weight-rows";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function EditServiceCostRatePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const service = await prisma.shippingService.findUnique({
    where: { id },
    include: {
      costRates: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!service) {
    notFound();
  }

  const initialValues = DEFAULT_COST_RATE_ROWS.map((row) => {
    const rate = service.costRates.find((item) => item.label === row.label);
    return rate ? String(rate.amount) : "";
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sửa bảng giá gốc"
        description={`Cập nhật bảng giá cho dịch vụ ${service.code}.`}
        actionLabel="Quay lại chi tiết"
        actionHref={`/admin/cost-rates/${service.id}`}
      />

      <CostRateNewForm
        services={[{ id: service.id, code: service.code, name: service.name }]}
        error={error}
        defaultServiceId={service.id}
        initialValues={initialValues}
        pageTitle="Sửa bảng giá gốc"
        pageSubtitle="Cập nhật và thay thế toàn bộ bảng giá của dịch vụ này."
        submitLabel="Lưu bảng giá"
        successRedirectPath={`/admin/cost-rates/${service.id}`}
        errorRedirectPath={`/admin/cost-rates/${service.id}/edit`}
      />
    </div>
  );
}
