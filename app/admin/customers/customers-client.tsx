"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/format";

export type CustomerTableRow = {
  id: string;
  customerCode: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  createdAt: string;
  orderCount: number;
  totalRevenue: number;
  outstandingDebt: number;
};

export function CustomersClient({ customers }: { customers: CustomerTableRow[] }) {
  const [keyword, setKeyword] = useState("");

  const filteredCustomers = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();

    if (!normalized) {
      return customers;
    }

    return customers.filter((customer) =>
      [
        customer.customerCode,
        customer.name,
        customer.phone,
        customer.email ?? "",
        customer.address ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [customers, keyword]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-line bg-white p-4 shadow-soft">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">Tim kiem khach hang</span>
          <input
            className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Ma khach, ten, so dien thoai, email"
            value={keyword}
          />
        </label>
      </div>

      <div className="text-sm font-medium text-slate-600">
        Hien thi {filteredCustomers.length} / {customers.length} khach hang
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
        {filteredCustomers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-semibold text-ink">Chua co khach hang phu hop.</p>
            <p className="mt-1 text-sm text-slate-500">Thu doi tu khoa tim kiem hoac tao khach hang moi.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Ma khach</th>
                  <th className="px-5 py-3">Ten khach hang</th>
                  <th className="px-5 py-3">So dien thoai</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Dia chi</th>
                  <th className="px-5 py-3 text-right">So don</th>
                  <th className="px-5 py-3 text-right">Doanh thu</th>
                  <th className="px-5 py-3 text-right">Cong no</th>
                  <th className="px-5 py-3">Ngay tao</th>
                  <th className="px-5 py-3 text-right">Hanh dong</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredCustomers.map((customer) => (
                  <tr className="hover:bg-slate-50" key={customer.id}>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-ink">
                      {customer.customerCode}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-ink">{customer.name}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">{customer.phone}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {customer.email ?? "-"}
                    </td>
                    <td className="min-w-48 px-5 py-4 text-slate-600">{customer.address ?? "-"}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-right font-medium text-ink">
                      {customer.orderCount}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right font-medium text-ink">
                      {formatCurrency(customer.totalRevenue)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right font-medium text-danger">
                      {formatCurrency(customer.outstandingDebt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          className="rounded-md border border-line px-3 py-2 text-xs font-semibold text-brand hover:border-brand hover:bg-blue-50"
                          href={`/admin/customers/${customer.id}`}
                        >
                          Xem
                        </Link>
                        <Link
                          className="rounded-md border border-line px-3 py-2 text-xs font-semibold text-ink hover:bg-slate-50"
                          href={`/admin/customers/${customer.id}/edit`}
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
