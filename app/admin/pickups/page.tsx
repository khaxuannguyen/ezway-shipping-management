import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { PageHeader } from "@/components/page-header";
import type { PickupStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function PickupsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; driverId?: string; date?: string }>;
}) {
  const { status, driverId, date } = await searchParams;

  const pickups = await prisma.pickupRequest.findMany({
    where: {
      ...(status && { status: status as PickupStatus }),
      ...(driverId && { driverId }),
      ...(date && {
        pickupDate: {
          gte: new Date(date),
          lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
        },
      }),
    },
    include: {
      customer: true,
      driver: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const drivers = await prisma.driver.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pickup hàng"
        description="Quản lý yêu cầu pickup hàng tại nhà khách"
        actionLabel="Tạo pickup"
        actionHref="/admin/pickups/new"
      />

      {/* Filters */}
      <div className="rounded-lg border border-line bg-white p-4">
        <form className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Trạng thái
            </label>
            <select
              name="status"
              defaultValue={status || ""}
              className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
            >
              <option value="">Tất cả</option>
              <option value="PENDING">Chờ phân tài xế</option>
              <option value="ASSIGNED">Đã phân tài xế</option>
              <option value="ACCEPTED">Tài xế đã nhận</option>
              <option value="ON_THE_WAY">Đang đi lấy</option>
              <option value="ARRIVED">Đã tới điểm lấy</option>
              <option value="PICKED_UP">Đã lấy hàng</option>
              <option value="FAILED">Lấy thất bại</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Tài xế
            </label>
            <select
              name="driverId"
              defaultValue={driverId || ""}
              className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
            >
              <option value="">Tất cả</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Ngày pickup
            </label>
            <input
              type="date"
              name="date"
              defaultValue={date || ""}
              className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Lọc
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-line bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-line">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Mã pickup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Địa chỉ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Ngày giờ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Số kiện
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Tài xế
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Loại xe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white">
              {pickups.map((pickup) => (
                <tr key={pickup.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-ink">
                    {pickup.pickupCode}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {pickup.customer?.name || pickup.senderName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                    {pickup.senderPhone}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                    {pickup.senderAddress}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                    {formatDateTime(pickup.pickupDate)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                    {pickup.estimatedPackageCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {pickup.driver?.name || "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                    {pickup.vehicleType}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <StatusBadge status={pickup.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                    {formatDateTime(pickup.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <Link
                      href={`/admin/pickups/${pickup.id}`}
                      className="text-brand hover:text-blue-700"
                    >
                      Xem
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pickups.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-500">Chưa có yêu cầu pickup nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
