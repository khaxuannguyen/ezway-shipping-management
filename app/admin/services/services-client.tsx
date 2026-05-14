"use client";

import type { ShippingTransportType } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDate } from "@/lib/format";
import { toggleShippingService } from "./actions";

export type ServiceTableRow = {
  id: string;
  code: string;
  name: string;
  transportType: ShippingTransportType;
  destinationZone: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
};

const transportOptions: Array<"ALL" | ShippingTransportType> = [
  "ALL",
  "AIR",
  "SEA",
  "EXPRESS",
  "ECONOMY",
  "OTHER",
];

export function ServicesClient({ services }: { services: ServiceTableRow[] }) {
  const [keyword, setKeyword] = useState("");
  const [transportType, setTransportType] = useState<"ALL" | ShippingTransportType>("ALL");
  const [activeFilter, setActiveFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const filteredServices = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();

    return services.filter((service) => {
      const matchesKeyword =
        !normalized ||
        [service.code, service.name, service.destinationZone]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      const matchesTransport =
        transportType === "ALL" || service.transportType === transportType;
      const matchesActive =
        activeFilter === "ALL" ||
        (activeFilter === "ACTIVE" ? service.isActive : !service.isActive);

      return matchesKeyword && matchesTransport && matchesActive;
    });
  }, [activeFilter, keyword, services, transportType]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-lg border border-line bg-white p-4 shadow-soft md:grid-cols-[1fr_220px_180px]">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">Tim kiem dich vu</span>
          <input
            className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Code, name, destination zone"
            value={keyword}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">Loai van chuyen</span>
          <select
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
            onChange={(event) =>
              setTransportType(event.target.value as "ALL" | ShippingTransportType)
            }
            value={transportType}
          >
            {transportOptions.map((option) => (
              <option key={option} value={option}>
                {option === "ALL" ? "Tat ca" : option}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-slate-700">Trang thai</span>
          <select
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
            onChange={(event) =>
              setActiveFilter(event.target.value as "ALL" | "ACTIVE" | "INACTIVE")
            }
            value={activeFilter}
          >
            <option value="ALL">Tat ca</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </label>
      </div>

      <div className="text-sm font-medium text-slate-600">
        Hien thi {filteredServices.length} / {services.length} dich vu
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
        {filteredServices.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-semibold text-ink">Chua co dich vu phu hop.</p>
            <p className="mt-1 text-sm text-slate-500">Thu doi bo loc hoac tao dich vu moi.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Ma dich vu</th>
                  <th className="px-5 py-3">Ten dich vu</th>
                  <th className="px-5 py-3">Loai</th>
                  <th className="px-5 py-3">Khu vuc dich</th>
                  <th className="px-5 py-3">Mo ta</th>
                  <th className="px-5 py-3">Trang thai</th>
                  <th className="px-5 py-3">Ngay tao</th>
                  <th className="px-5 py-3 text-right">Hanh dong</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredServices.map((service) => (
                  <tr className="hover:bg-slate-50" key={service.id}>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-ink">
                      {service.code}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-ink">{service.name}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {service.transportType}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {service.destinationZone}
                    </td>
                    <td className="min-w-56 px-5 py-4 text-slate-600">
                      {service.description ?? "-"}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                          service.isActive
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-slate-100 text-slate-600 ring-slate-200"
                        }`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {formatDate(service.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          className="rounded-md border border-line px-3 py-2 text-xs font-semibold text-ink hover:bg-slate-50"
                          href={`/admin/services/${service.id}/edit`}
                        >
                          Sua
                        </Link>
                        <form action={toggleShippingService}>
                          <input name="id" type="hidden" value={service.id} />
                          <input
                            name="nextActive"
                            type="hidden"
                            value={service.isActive ? "false" : "true"}
                          />
                          <button
                            className="rounded-md border border-line px-3 py-2 text-xs font-semibold text-brand hover:border-brand hover:bg-blue-50"
                            type="submit"
                          >
                            {service.isActive ? "Tat" : "Bat"}
                          </button>
                        </form>
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
