import { prisma } from "@/lib/prisma";
import { ServicesClient } from "./services-client";
import { PageHeader } from "@/components/page-header";

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
      <PageHeader
        title="Dịch vụ / Tuyến vận chuyển"
        description="Chỉ admin được quản lý danh sách dịch vụ."
        actionLabel="Tạo dịch vụ"
        actionHref="/admin/services/new"
      />

      <ServicesClient services={rows} />
    </div>
  );
}
