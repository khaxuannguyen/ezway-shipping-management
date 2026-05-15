import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DriversPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; isActive?: string }>;
}) {
  const { search, isActive } = await searchParams;

  const drivers = await prisma.driver.findMany({
    where: {
      ...(search && {
        OR: [
          { driverCode: { contains: search } },
          { name: { contains: search } },
          { phone: { contains: search } },
        ],
      }),
      ...(isActive !== undefined && {
        isActive: isActive === "true",
      }),
    },
    include: {
      pickupRequests: {
        where: {
          status: {
            in: ["PENDING", "ASSIGNED", "ACCEPTED", "ON_THE_WAY", "ARRIVED"],
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Tài xế</h1>
          <p className="mt-1 text-sm text-slate-600">
            Quản lý danh sách tài xế vận chuyển
          </p>
        </div>
        <Link
          className="rounded-3xl border border-line bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          href="/admin/drivers/new"
        >
          Tạo tài xế
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="rounded-lg border border-line bg-white p-4">
        <form className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-xs">
            <input
              type="text"
              name="search"
              defaultValue={search || ""}
              placeholder="Tìm theo mã, tên, số điện thoại..."
              className="block w-full rounded-md border border-line px-3 py-2 text-sm"
            />
          </div>
          <div>
            <select
              name="isActive"
              defaultValue={isActive || ""}
              className="block w-full rounded-md border border-line px-3 py-2 text-sm"
            >
              <option value="">Tất cả</option>
              <option value="true">Đang hoạt động</option>
              <option value="false">Đã hóa tài khoản</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Tìm kiếm
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
                  Mã tài xế
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Tên tài xế
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Loại xe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Biển số
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Pickup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white">
              {drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-ink">
                    {driver.driverCode}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    {driver.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                    <a
                      href={`tel:${driver.phone}`}
                      className="text-brand hover:underline"
                    >
                      {driver.phone}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {driver.email || "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                    {driver.vehicleType}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                    {driver.vehiclePlate || "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        driver.isActive
                          ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                          : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                      }`}
                    >
                      {driver.isActive ? "Hoạt động" : "Ngưng hoạt động"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                    {driver.pickupRequests.length}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm space-x-2">
                    <Link
                      href={`/admin/drivers/${driver.id}`}
                      className="text-brand hover:underline"
                    >
                      Xem
                    </Link>
                    <Link
                      href={`/admin/drivers/${driver.id}/edit`}
                      className="text-brand hover:underline"
                    >
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {drivers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-500">Chưa có tài xế nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
