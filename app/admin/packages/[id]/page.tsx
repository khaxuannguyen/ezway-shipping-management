import Link from "next/link";
import { notFound } from "next/navigation";
import { InfoCard, InfoRow } from "@/components/info-card";
import { formatDateTime } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const packageItem = await prisma.package.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          customer: true,
        },
      },
    },
  });

  if (!packageItem) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link className="text-sm font-semibold text-brand hover:text-blue-700" href="/admin/packages">
            {"<-"} Quay lai danh sach
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-ink">{packageItem.packageCode}</h1>
          <p className="mt-1 text-sm text-slate-600">
            Thuoc don {packageItem.order.orderCode} - {packageItem.order.trackingCode}
          </p>
        </div>
        <Link
          className="w-fit rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
          href={`/admin/packages/${packageItem.id}/edit`}
        >
          Sua kien hang
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <InfoCard title="Thong tin kien hang">
          <InfoRow label="Ma kien" value={packageItem.packageCode} />
          <InfoRow
            label="Kich thuoc"
            value={`${packageItem.length} x ${packageItem.width} x ${packageItem.height} cm`}
          />
          <InfoRow label="Can nang thuc te" value={`${packageItem.actualWeight} kg`} />
          <InfoRow label="Can nang quy doi" value={`${packageItem.volumetricWeight} kg`} />
          <InfoRow label="Can nang tinh cuoc" value={`${packageItem.chargeableWeight} kg`} />
          <InfoRow label="Mo ta" value={packageItem.description ?? "-"} />
          <InfoRow label="Ngay tao" value={formatDateTime(packageItem.createdAt)} />
        </InfoCard>

        <InfoCard title="Thong tin don hang">
          <InfoRow
            label="Don hang"
            value={
              <Link
                className="font-semibold text-brand hover:text-blue-700"
                href={`/admin/orders/${packageItem.order.id}`}
              >
                {packageItem.order.orderCode}
              </Link>
            }
          />
          <InfoRow label="Tracking" value={packageItem.order.trackingCode} />
          <InfoRow label="Khach hang" value={packageItem.order.customer.name} />
          <InfoRow label="Nguoi nhan" value={packageItem.order.receiverName} />
          <InfoRow label="Quoc gia nhan" value={packageItem.order.destinationCountry} />
          <InfoRow
            label="Link don"
            value={
              <Link
                className="rounded-md border border-line px-3 py-2 text-xs font-semibold text-brand hover:border-brand hover:bg-blue-50"
                href={`/admin/orders/${packageItem.order.id}`}
              >
                Xem chi tiet don hang
              </Link>
            }
          />
        </InfoCard>
      </div>
    </div>
  );
}
