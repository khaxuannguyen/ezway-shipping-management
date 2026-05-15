"use client";

import { useState } from "react";
import Link from "next/link";
import { createCostRate } from "../actions";
import { DEFAULT_COST_RATE_ROWS } from "../weight-rows";

const defaultWeightRows = DEFAULT_COST_RATE_ROWS;

function parsePriceLine(line: string) {
  const cleaned = line.replace(/[^\d]/g, "").trim();
  if (!cleaned) {
    return null;
  }
  return cleaned;
}

type AlertTone = "success" | "warning" | "error";

function formatAlert(count: number): { message: string; tone: AlertTone } {
  if (count === 46) {
    return {
      message: `Đã nhận đủ 46 giá.`,
      tone: "success",
    };
  }
  if (count < 46) {
    return {
      message: `Bạn đã dán ${count}/46 giá. Các dòng còn lại sẽ để trống.`,
      tone: "warning",
    };
  }
  return {
    message: `Bạn đã dán ${count} giá, hệ thống chỉ dùng 46 giá đầu tiên.`,
    tone: "error",
  };
}

export function CostRateNewForm({
  services,
  error,
  defaultServiceId,
  initialValues,
  pageTitle = "Tạo bảng giá gốc",
  pageSubtitle = "Chọn tuyến dịch vụ và nhập giá gốc cho từng mốc cân nặng.",
  submitLabel = "Lưu bảng giá",
  successRedirectPath,
  errorRedirectPath,
}: {
  services: Array<{ id: string; code: string; name: string }>;
  error?: string;
  defaultServiceId?: string;
  initialValues?: string[];
  pageTitle?: string;
  pageSubtitle?: string;
  submitLabel?: string;
  successRedirectPath?: string;
  errorRedirectPath?: string;
}) {
  const [excelText, setExcelText] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState(
    defaultServiceId ?? "",
  );
  const [values, setValues] = useState<string[]>(
    initialValues?.length === defaultWeightRows.length
      ? initialValues
      : Array(defaultWeightRows.length).fill(""),
  );
  const [alert, setAlert] = useState<{
    message: string;
    tone: "success" | "warning" | "error";
  } | null>(null);

  const applyExcelValues = () => {
    const lines = excelText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line !== "");

    const parsed = lines
      .map(parsePriceLine)
      .filter((price): price is string => price !== null);
    const capped = parsed.slice(0, defaultWeightRows.length);
    const newValues = Array(defaultWeightRows.length).fill("");
    capped.forEach((price, index) => {
      newValues[index] = price;
    });
    setValues(newValues);

    const totalCount = parsed.length;
    setAlert(formatAlert(totalCount));
  };

  const updateValue = (index: number, value: string) => {
    setValues((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 shadow-sm">
          {error}
        </div>
      ) : null}

      <section className="rounded-3xl border border-line bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              Nhập nhanh từ Excel
            </h2>
            <p className="text-sm text-slate-500">
              Dán một cột giá từ Excel và áp dụng vào bảng mốc cân nặng.
            </p>
          </div>
          <button
            type="button"
            onClick={applyExcelValues}
            className="inline-flex items-center justify-center rounded-3xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Áp dụng vào bảng
          </button>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold text-slate-700">
            Dán một cột giá từ Excel
          </label>
          <textarea
            className="mt-2 h-40 w-full rounded-3xl border border-line bg-slate-50 p-4 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100"
            placeholder={"Ví dụ:\n400,935\n512,110\n629,685\n..."}
            value={excelText}
            onChange={(event) => setExcelText(event.target.value)}
          />
        </div>

        {alert ? (
          <div
            className={`mt-4 rounded-3xl px-4 py-3 text-sm font-semibold ${
              alert.tone === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : alert.tone === "warning"
                  ? "bg-amber-50 text-amber-700 border border-amber-100"
                  : "bg-red-50 text-red-700 border border-red-100"
            }`}
          >
            {alert.message}
          </div>
        ) : null}
      </section>

      <form action={createCostRate} className="space-y-6">
        <input
          name="redirectTo"
          type="hidden"
          value={
            successRedirectPath ??
            (selectedServiceId
              ? `/admin/cost-rates/${selectedServiceId}`
              : "/admin/cost-rates")
          }
        />
        <input
          name="errorRedirectTo"
          type="hidden"
          value={
            errorRedirectPath ??
            (selectedServiceId
              ? `/admin/cost-rates/new?serviceId=${selectedServiceId}`
              : "/admin/cost-rates/new")
          }
        />

        <section className="rounded-3xl border border-line bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">{pageTitle}</h2>
              <p className="text-sm text-slate-500">{pageSubtitle}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/admin/cost-rates"
                className="inline-flex items-center justify-center rounded-3xl border border-line bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Hủy
              </Link>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-3xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                {submitLabel}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Tuyến dịch vụ
              </span>
              <select
                name="shippingServiceId"
                value={selectedServiceId}
                onChange={(event) => setSelectedServiceId(event.target.value)}
                required
                className="w-full rounded-3xl border border-line bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Chọn tuyến dịch vụ</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.code} - {service.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Số ký</th>
                  <th className="px-4 py-3">Khoảng cân nặng</th>
                  <th className="px-4 py-3">Kiểu giá</th>
                  <th className="px-4 py-3 text-right">Giá gốc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white">
                {defaultWeightRows.map((row, index) => (
                  <tr key={row.label} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-ink">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.range}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {row.typeLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <input
                        name={`amount_${index}`}
                        value={values[index]}
                        onChange={(event) =>
                          updateValue(index, event.target.value)
                        }
                        placeholder="Nhập giá, ví dụ 639,655"
                        type="text"
                        inputMode="numeric"
                        className="w-full max-w-[180px] rounded-3xl border border-line bg-slate-50 px-3 py-2 text-right text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </form>
    </div>
  );
}
