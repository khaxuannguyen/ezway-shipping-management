"use client";

import type { CostRateType } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatCurrency } from "@/lib/format";

export type CostRateRow = {
  id: string;
  label: string;
  minWeight: number;
  maxWeight: number | null;
  rateType: CostRateType;
  amount: number;
  currency: string;
  isActive: boolean;
  shippingServiceId: string;
  shippingService: { code: string; name: string };
};

const rateTypeLabels: Record<CostRateType, string> = {
  FIXED_TOTAL: "Gia le theo moc",
  PER_KG: "Gia si theo kg",
};

export function CostRatesClient({
  rates,
  services,
}: {
  rates: CostRateRow[];
  services: Array<{ id: string; code: string }>;
}) {
  const [keyword, setKeyword] = useState("");
  const [serviceId, setServiceId] = useState("ALL");
  const [rateType, setRateType] = useState<"ALL" | CostRateType>("ALL");
  const [active, setActive] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const filtered = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    return rates.filter((rate) => {
      const matchesKeyword =
        !normalized ||
        [rate.shippingService.code, rate.shippingService.name, rate.label]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      const matchesService = serviceId === "ALL" || rate.shippingServiceId === serviceId;
      const matchesType = rateType === "ALL" || rate.rateType === rateType;
      const matchesActive =
        active === "ALL" || (active === "ACTIVE" ? rate.isActive : !rate.isActive);
      return matchesKeyword && matchesService && matchesType && matchesActive;
    });
  }, [active, keyword, rateType, rates, serviceId]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-lg border border-line bg-white p-4 shadow-soft lg:grid-cols-[1fr_220px_180px_180px]">
        <input
          className="rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Search service code, name, label"
          value={keyword}
        />
        <select className="rounded-md border border-line bg-white px-3 py-2 text-sm" onChange={(event) => setServiceId(event.target.value)} value={serviceId}>
          <option value="ALL">Tat ca dich vu</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>{service.code}</option>
          ))}
        </select>
        <select className="rounded-md border border-line bg-white px-3 py-2 text-sm" onChange={(event) => setRateType(event.target.value as "ALL" | CostRateType)} value={rateType}>
          <option value="ALL">Tat ca kieu gia</option>
          <option value="FIXED_TOTAL">Gia le theo moc</option>
          <option value="PER_KG">Gia si theo kg</option>
        </select>
        <select className="rounded-md border border-line bg-white px-3 py-2 text-sm" onChange={(event) => setActive(event.target.value as "ALL" | "ACTIVE" | "INACTIVE")} value={active}>
          <option value="ALL">Tat ca</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>
      <div className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-line text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Ma dich vu</th>
                <th className="px-5 py-3">Ten dich vu</th>
                <th className="px-5 py-3">Label</th>
                <th className="px-5 py-3">Min</th>
                <th className="px-5 py-3">Max</th>
                <th className="px-5 py-3">Kieu gia</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3">Currency</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Sua</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((rate) => (
                <tr key={rate.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-5 py-4 font-semibold">{rate.shippingService.code}</td>
                  <td className="whitespace-nowrap px-5 py-4">{rate.shippingService.name}</td>
                  <td className="whitespace-nowrap px-5 py-4">{rate.label}</td>
                  <td className="whitespace-nowrap px-5 py-4">{rate.minWeight}</td>
                  <td className="whitespace-nowrap px-5 py-4">{rate.maxWeight ?? "No limit"}</td>
                  <td className="whitespace-nowrap px-5 py-4">{rateTypeLabels[rate.rateType]}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-right">{formatCurrency(rate.amount)}</td>
                  <td className="whitespace-nowrap px-5 py-4">{rate.currency}</td>
                  <td className="whitespace-nowrap px-5 py-4">{rate.isActive ? "Active" : "Inactive"}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <Link className="rounded-md border border-line px-3 py-2 text-xs font-semibold text-brand hover:bg-blue-50" href={`/admin/cost-rates/${rate.id}/edit`}>
                      Sua
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
