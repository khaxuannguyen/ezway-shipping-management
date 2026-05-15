import { prisma } from "@/lib/prisma";
import { PickupNewForm } from "./pickup-new-form";

export const dynamic = "force-dynamic";

export default async function NewPickupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; customerId?: string }>;
}) {
  const { error, customerId } = await searchParams;

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Tạo yêu cầu pickup</h1>
          <p className="mt-1 text-sm text-slate-600">
            Tạo yêu cầu pickup hàng tại nhà khách
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-white p-6">
        <PickupNewForm
          customers={customers}
          drivers={drivers}
          error={error}
          preselectedCustomerId={customerId}
        />
      </div>
    </div>
  );
}
