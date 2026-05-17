import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function DriverDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const driver = await prisma.driver.findUnique({
    where: { id },
    include: {
      pickupRequests: {
        include: {
          customer: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!driver) {
    notFound();
  }

  const activePickups = driver.pickupRequests.filter((p) =>
    ["PENDING", "ASSIGNED", "ACCEPTED", "ON_THE_WAY", "ARRIVED"].includes(
      p.status,
    ),
  );

  const completedPickups = driver.pickupRequests.filter(
    (p) => p.status === "PICKED_UP",
  );
  const failedPickups = driver.pickupRequests.filter(
    (p) => p.status === "FAILED",
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chi tiết tài xế"
        description={driver.name}
        actionLabel="Sửa"
        actionHref={`/admin/drivers/${driver.id}/edit`}
      />

      <div className="flex justify-end">
        <Link
          href="/admin/drivers"
          className="rounded-3xl border border-line bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Quay lại
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="rounded-lg border border-line bg-white p-6">
            <h2 className="text-lg font-semibold text-ink mb-4">
              Thông tin cơ bản
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Mã tài xế
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {driver.driverCode}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Tên tài xế
                </label>
                <p className="mt-1 text-sm text-slate-900">{driver.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Số điện thoại
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  <a
                    href={`tel:${driver.phone}`}
                    className="text-brand hover:underline"
                  >
                    {driver.phone}
                  </a>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {driver.email || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="rounded-lg border border-line bg-white p-6">
            <h2 className="text-lg font-semibold text-ink mb-4">
              Thông tin xe
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Loại xe
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {driver.vehicleType}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Biển số xe
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {driver.vehiclePlate || "-"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Số CMND/CCCD
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {driver.identityNumber || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-line bg-white p-6">
              <p className="text-sm text-slate-600">Pickup đang xử lý</p>
              <p className="mt-2 text-3xl font-bold text-brand">
                {activePickups.length}
              </p>
            </div>
            <div className="rounded-lg border border-line bg-white p-6">
              <p className="text-sm text-slate-600">Đã hoàn thành</p>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {completedPickups.length}
              </p>
            </div>
            <div className="rounded-lg border border-line bg-white p-6">
              <p className="text-sm text-slate-600">Thất bại</p>
              <p className="mt-2 text-3xl font-bold text-red-600">
                {failedPickups.length}
              </p>
            </div>
          </div>

          {/* Pickup Requests */}
          {driver.pickupRequests.length > 0 && (
            <div className="rounded-lg border border-line bg-white">
              <div className="border-b border-line px-6 py-4">
                <h2 className="text-lg font-semibold text-ink">
                  Pickup đã giao ({driver.pickupRequests.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-line">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        Mã pickup
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        Người gửi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        Số điện thoại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        Địa chỉ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-white">
                    {driver.pickupRequests.map((pickup) => (
                      <tr key={pickup.id} className="hover:bg-slate-50">
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-ink">
                          {pickup.pickupCode}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">
                          {pickup.senderName}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                          <a
                            href={`tel:${pickup.senderPhone}`}
                            className="text-brand hover:underline"
                          >
                            {pickup.senderPhone}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                          {pickup.senderAddress}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              pickup.status === "PICKED_UP"
                                ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                                : pickup.status === "FAILED"
                                  ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                                  : "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200"
                            }`}
                          >
                            {pickup.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <Link
                            href={`/admin/pickups/${pickup.id}`}
                            className="text-brand hover:underline"
                          >
                            Xem
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status and Meta */}
          <div className="rounded-lg border border-line bg-white p-6">
            <h2 className="text-lg font-semibold text-ink mb-4">
              Thông tin khác
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Trạng thái
                </label>
                <p className="mt-1">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      driver.isActive
                        ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                        : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                    }`}
                  >
                    {driver.isActive ? "Hoạt động" : "Ngưng hoạt động"}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Ngày tạo
                </label>
                <p className="mt-1 text-sm text-slate-500">
                  {formatDateTime(driver.createdAt)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Cập nhật gần nhất
                </label>
                <p className="mt-1 text-sm text-slate-500">
                  {formatDateTime(driver.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
