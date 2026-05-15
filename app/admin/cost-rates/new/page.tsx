import { prisma } from "@/lib/prisma";
import { CostRateNewForm } from "./cost-rate-new-form";

export const dynamic = "force-dynamic";

export default async function NewCostRatePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; serviceId?: string }>;
}) {
  const { error, serviceId } = await searchParams;
  const services = await prisma.shippingService.findMany({
    where: { isActive: true },
    orderBy: { code: "asc" },
    select: { id: true, code: true, name: true },
  });

  return (
    <CostRateNewForm
      services={services}
      error={error}
      defaultServiceId={serviceId}
      successRedirectPath={
        serviceId ? `/admin/cost-rates/${serviceId}` : undefined
      }
      errorRedirectPath={
        serviceId
          ? `/admin/cost-rates/new?serviceId=${serviceId}`
          : "/admin/cost-rates/new"
      }
    />
  );
}
