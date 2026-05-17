import { prisma } from "@/lib/prisma";
import { PickupNewForm } from "./pickup-new-form";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function NewPickupPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    customerId?: string;
    orderId?: string;
  }>;
}) {
  const { error, customerId, orderId } = await searchParams;

  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      customerCode: true,
      name: true,
      phone: true,
      address: true,
    },
  });

  const drivers = await prisma.driver.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  // If orderId is provided, fetch the order to auto-fill sender information
  let order = null;
  if (orderId) {
    order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderCode: true,
        customerId: true,
        senderName: true,
        senderPhone: true,
        senderAddress: true,
      },
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tạo yêu cầu pickup"
        description="Tạo yêu cầu pickup hàng tại nhà khách"
      />

      <div className="rounded-lg border border-line bg-white p-6">
        <PickupNewForm
          customers={customers}
          drivers={drivers}
          error={error}
          preselectedCustomerId={customerId}
          prefilledOrder={order}
        />
      </div>
    </div>
  );
}
