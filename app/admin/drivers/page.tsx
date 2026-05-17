import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";

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
      <PageHeader
        title="Tài xế"
        description="Quản lý danh sách tài xế vận chuyển"
        actionLabel="Tạo tài xế"
        actionHref="/admin/drivers/new"
      />

      {/* Search and Filter */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <form className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tìm kiếm
            </label>
            <input
              type="text"
              name="search"
              defaultValue={search || ""}
              placeholder="Tìm theo mã, tên, số điện thoại..."
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Trạng thái
            </label>
            <select
              name="isActive"
              defaultValue={isActive || ""}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Tất cả</option>
              <option value="true">Đang hoạt động</option>
              <option value="false">Đã khóa tài khoản</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Tìm kiếm
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  Mã tài xế
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  Tên tài xế
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  Số điện thoại
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  Loại xe
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  Pickup đang thực hiện
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                    {driver.driverCode}
                  </td>
                  <td className="px-4 py-3 text-slate-900">{driver.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <a
                      href={`tel:${driver.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {driver.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {driver.vehicleType === "MOTORBIKE"
                        ? "Xe máy"
                        : driver.vehicleType === "CAR"
                          ? "Ô tô"
                          : driver.vehicleType === "VAN"
                            ? "Van"
                            : driver.vehicleType === "TRUCK"
                              ? "Xe tải"
                              : "Khác"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        driver.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-50 text-slate-600"
                      }`}
                    >
                      {driver.isActive ? "Hoạt động" : "Ngưng hoạt động"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {driver.pickupRequests.length}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/drivers/${driver.id}`}
                        className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Xem
                      </Link>
                      <Link
                        href={`/admin/drivers/${driver.id}/edit`}
                        className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Sửa
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {drivers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-slate-400">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-sm font-medium text-slate-900">
              Không có tài xế
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Chưa có tài xế nào được tạo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
