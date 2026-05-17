import { prisma } from "@/lib/prisma";
import { PackagesClient } from "./packages-client";
import { PageHeader } from "@/components/page-header";

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
      <PageHeader
        title="Kiện hàng"
        description="Quản lý package, kích thước và cân nặng tính cước trong kho EZWAY."
        actionLabel="Tạo kiện hàng"
        actionHref="/admin/packages/new"
      />

      <PackagesClient packages={rows} />
    </div>
  );
}
