"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDate } from "@/lib/format";

export type PackageTableRow = {
  id: string;
  packageCode: string;
  length: number;
  width: number;
  height: number;
  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;
  createdAt: string;
  order: {
    orderCode: string;
    trackingCode: string;
    destinationCountry: string;
    customer: {
      name: string;
    };
  };
};

export function PackagesClient({ packages }: { packages: PackageTableRow[] }) {
  const [keyword, setKeyword] = useState("");

  const filteredPackages = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();

    if (!normalized) {
      return packages;
    }

    return packages.filter((item) =>
      [
        item.packageCode,
        item.order.orderCode,
        item.order.trackingCode,
        item.order.customer.name,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [keyword, packages]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-line bg-white p-4 shadow-soft">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">Tim kiem kien hang</span>
          <input
            className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Ma kien, ma don, tracking, ten khach hang"
            value={keyword}
          />
        </label>
      </div>

      <div className="text-sm font-medium text-slate-600">
        Hien thi {filteredPackages.length} / {packages.length} kien hang
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
        {filteredPackages.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-semibold text-ink">Chua co kien hang phu hop.</p>
            <p className="mt-1 text-sm text-slate-500">Thu doi tu khoa tim kiem hoac tao kien hang moi.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Ma kien</th>
                  <th className="px-5 py-3">Ma don</th>
                  <th className="px-5 py-3">Tracking</th>
                  <th className="px-5 py-3">Khach hang</th>
                  <th className="px-5 py-3">Quoc gia nhan</th>
                  <th className="px-5 py-3">D x R x C</th>
                  <th className="px-5 py-3 text-right">Can nang</th>
                  <th className="px-5 py-3 text-right">Quy doi</th>
                  <th className="px-5 py-3 text-right">Tinh cuoc</th>
                  <th className="px-5 py-3">Ngay tao</th>
                  <th className="px-5 py-3 text-right">Hanh dong</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredPackages.map((item) => (
                  <tr className="hover:bg-slate-50" key={item.id}>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-ink">
                      {item.packageCode}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {item.order.orderCode}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {item.order.trackingCode}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-ink">
                      {item.order.customer.name}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {item.order.destinationCountry}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {item.length} x {item.width} x {item.height}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right text-slate-600">
                      {item.actualWeight} kg
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right text-slate-600">
                      {item.volumetricWeight} kg
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right font-medium text-ink">
                      {item.chargeableWeight} kg
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          className="rounded-md border border-line px-3 py-2 text-xs font-semibold text-brand hover:border-brand hover:bg-blue-50"
                          href={`/admin/packages/${item.id}`}
                        >
                          Xem
                        </Link>
                        <Link
                          className="rounded-md border border-line px-3 py-2 text-xs font-semibold text-ink hover:bg-slate-50"
                          href={`/admin/packages/${item.id}/edit`}
                        >
                          Sua
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
