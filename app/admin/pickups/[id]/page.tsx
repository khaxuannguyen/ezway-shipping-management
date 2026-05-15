import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function PickupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const pickup = await prisma.pickupRequest.findUnique({
    where: { id },
    include: {
      customer: true,
      driver: true,
      photos: {
        orderBy: { createdAt: "desc" },
      },
      statusLogs: {
        orderBy: { createdAt: "desc" },
      },
      order: true,
    },
  });

  if (!pickup) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Chi tiết pickup</h1>
          <p className="mt-1 text-sm text-slate-600">Mã: {pickup.pickupCode}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/pickups/${pickup.id}/edit`}
            className="rounded-3xl border border-line bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Sửa
          </Link>
          <Link
            href="/admin/pickups"
            className="rounded-3xl border border-line bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Quay lại
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status and Basic Info */}
          <div className="rounded-lg border border-line bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-ink">
                Thông tin cơ bản
              </h2>
              <StatusBadge status={pickup.status} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Mã pickup
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {pickup.pickupCode}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Ngày tạo
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {formatDateTime(pickup.createdAt)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Ngày pickup
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {formatDateTime(pickup.pickupDate)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Khoảng thời gian
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {pickup.pickupTimeWindow || "Không có"}
                </p>
              </div>
            </div>
          </div>

          {/* Sender Information */}
          <div className="rounded-lg border border-line bg-white p-6">
            <h2 className="text-lg font-semibold text-ink mb-4">
              Thông tin người gửi
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Tên người gửi
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {pickup.senderName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Số điện thoại
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  <a
                    href={`tel:${pickup.senderPhone}`}
                    className="text-brand hover:underline"
                  >
                    {pickup.senderPhone}
                  </a>
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700">
                Địa chỉ pickup
              </label>
              <p className="mt-1 text-sm text-slate-900">
                {pickup.senderAddress}
              </p>
              {(pickup.senderWard ||
                pickup.senderDistrict ||
                pickup.senderCity) && (
                <p className="mt-1 text-sm text-slate-500">
                  {[pickup.senderWard, pickup.senderDistrict, pickup.senderCity]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  pickup.senderAddress,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-brand hover:underline"
              >
                Xem trên Google Maps
              </a>
            </div>
          </div>

          {/* Pickup Details */}
          <div className="rounded-lg border border-line bg-white p-6">
            <h2 className="text-lg font-semibold text-ink mb-4">
              Chi tiết pickup
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Loại xe
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {pickup.vehicleType}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Tài xế
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {pickup.driver ? (
                    <Link
                      href={`/admin/drivers/${pickup.driver.id}`}
                      className="text-brand hover:underline"
                    >
                      {pickup.driver.name}
                    </Link>
                  ) : (
                    "Chưa phân"
                  )}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Số kiện dự kiến
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {pickup.estimatedPackageCount}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Cân nặng dự kiến
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {pickup.estimatedWeight
                    ? `${pickup.estimatedWeight} kg`
                    : "Không có"}
                </p>
              </div>
              {pickup.actualPackageCount && (
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Số kiện thực tế
                  </label>
                  <p className="mt-1 text-sm text-slate-900">
                    {pickup.actualPackageCount}
                  </p>
                </div>
              )}
              {pickup.actualWeight && (
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Cân nặng thực tế
                  </label>
                  <p className="mt-1 text-sm text-slate-900">
                    {pickup.actualWeight} kg
                  </p>
                </div>
              )}
            </div>

            {pickup.goodsDescription && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700">
                  Mô tả hàng
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {pickup.goodsDescription}
                </p>
              </div>
            )}

            {pickup.pickupNote && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700">
                  Ghi chú pickup
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {pickup.pickupNote}
                </p>
              </div>
            )}

            {pickup.internalNote && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700">
                  Ghi chú nội bộ
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {pickup.internalNote}
                </p>
              </div>
            )}
          </div>

          {/* Order Link */}
          {pickup.order && (
            <div className="rounded-lg border border-line bg-white p-6">
              <h2 className="text-lg font-semibold text-ink mb-4">
                Đơn hàng liên kết
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-900">
                    <Link
                      href={`/admin/orders/${pickup.order.id}`}
                      className="text-brand hover:underline font-medium"
                    >
                      {pickup.order.orderCode}
                    </Link>
                  </p>
                  <p className="text-sm text-slate-500">
                    {pickup.order.receiverName} -{" "}
                    {pickup.order.destinationCountry}
                  </p>
                </div>
                <StatusBadge status={pickup.order.status} />
              </div>
            </div>
          )}

          {/* Photos */}
          {pickup.photos.length > 0 && (
            <div className="rounded-lg border border-line bg-white p-6">
              <h2 className="text-lg font-semibold text-ink mb-4">
                Ảnh pickup
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pickup.photos.map((photo) => (
                  <div key={photo.id} className="space-y-2">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.caption || photo.type}
                      width={200}
                      height={128}
                      className="w-full h-32 object-cover rounded-md border border-line"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {photo.type}
                      </p>
                      {photo.caption && (
                        <p className="text-sm text-slate-500">
                          {photo.caption}
                        </p>
                      )}
                      <p className="text-xs text-slate-400">
                        {formatDateTime(photo.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="rounded-lg border border-line bg-white p-6">
            <h2 className="text-lg font-semibold text-ink mb-4">Thao tác</h2>

            <div className="space-y-3">
              {pickup.status === "PENDING" && (
                <div className="text-sm text-slate-500">
                  Chưa có thao tác nào khả dụng
                </div>
              )}

              {pickup.status !== "PICKED_UP" &&
                pickup.status !== "CANCELLED" && (
                  <div className="text-sm text-slate-500">
                    Chưa có thao tác nào khả dụng
                  </div>
                )}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-lg border border-line bg-white p-6">
            <h2 className="text-lg font-semibold text-ink mb-4">Timeline</h2>

            <div className="space-y-4">
              {pickup.statusLogs.map((log, index) => (
                <div key={log.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-brand rounded-full"></div>
                    {index < pickup.statusLogs.length - 1 && (
                      <div className="w-px h-full bg-line mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={log.status} />
                      <span className="text-xs text-slate-500">
                        {formatDateTime(log.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-900">{log.message}</p>
                    {log.location && (
                      <p className="text-sm text-slate-500">{log.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
