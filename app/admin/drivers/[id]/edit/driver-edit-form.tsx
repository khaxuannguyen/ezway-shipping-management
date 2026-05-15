"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Driver } from "@prisma/client";
import { updateDriver } from "../../actions";

interface DriverEditFormProps {
  driver: Driver;
}

export function DriverEditForm({ driver }: DriverEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      formData.append("driverId", driver.id);
      await updateDriver(formData);
      router.push(`/admin/drivers/${driver.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Tên tài xế *
          </label>
          <input
            type="text"
            name="name"
            defaultValue={driver.name}
            className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Số điện thoại *
          </label>
          <input
            type="tel"
            name="phone"
            defaultValue={driver.phone}
            className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            defaultValue={driver.email || ""}
            className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Loại xe *
          </label>
          <select
            name="vehicleType"
            defaultValue={driver.vehicleType}
            className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
            required
          >
            <option value="MOTORBIKE">Xe máy</option>
            <option value="CAR">Ô tô</option>
            <option value="VAN">Van</option>
            <option value="TRUCK">Xe tải</option>
            <option value="OTHER">Khác</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Biển số xe
          </label>
          <input
            type="text"
            name="vehiclePlate"
            defaultValue={driver.vehiclePlate || ""}
            className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Số CMND/CCCD
          </label>
          <input
            type="text"
            name="identityNumber"
            defaultValue={driver.identityNumber || ""}
            className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            value="true"
            defaultChecked={driver.isActive}
            className="mr-2"
          />
          <span className="text-sm font-medium text-slate-700">
            Đang hoạt động
          </span>
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}
