"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Driver } from "@prisma/client";

interface PickupNewFormProps {
  customers: {
    id: string;
    customerCode: string;
    name: string;
    phone: string;
    address: string | null;
  }[];
  drivers: Driver[];
  error?: string;
  preselectedCustomerId?: string;
}

export function PickupNewForm({
  customers,
  drivers,
  error,
  preselectedCustomerId,
}: PickupNewFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useExistingCustomer, setUseExistingCustomer] = useState(
    !!preselectedCustomerId,
  );

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/admin/pickups/actions", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/admin/pickups/${result.id}`);
      } else {
        const error = await response.json();
        router.push(
          `/admin/pickups/new?error=${encodeURIComponent(error.message)}`,
        );
      }
    } catch (error) {
      console.error("Submit error:", error);
      router.push("/admin/pickups/new?error=Đã có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCustomer = preselectedCustomerId
    ? customers.find((c) => c.id === preselectedCustomerId)
    : null;

  return (
    <form action={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Customer Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ink">Khách hàng</h3>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="customerType"
              value="existing"
              checked={useExistingCustomer}
              onChange={() => setUseExistingCustomer(true)}
              className="mr-2"
            />
            Chọn khách hàng hiện có
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="customerType"
              value="new"
              checked={!useExistingCustomer}
              onChange={() => setUseExistingCustomer(false)}
              className="mr-2"
            />
            Nhập thông tin mới
          </label>
        </div>

        {useExistingCustomer ? (
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Khách hàng
            </label>
            <select
              name="customerId"
              defaultValue={preselectedCustomerId || ""}
              className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
              required
            >
              <option value="">Chọn khách hàng</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.customerCode} - {customer.name} ({customer.phone})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Tên khách hàng
              </label>
              <input
                type="text"
                name="customerName"
                className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="customerPhone"
                className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
                required
              />
            </div>
          </div>
        )}
      </div>

      {/* Sender Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ink">Thông tin người gửi</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Tên người gửi *
            </label>
            <input
              type="text"
              name="senderName"
              defaultValue={selectedCustomer?.name || ""}
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
              name="senderPhone"
              defaultValue={selectedCustomer?.phone || ""}
              className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Địa chỉ pickup *
          </label>
          <textarea
            name="senderAddress"
            defaultValue={selectedCustomer?.address || ""}
            rows={3}
            className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
            placeholder="Địa chỉ đầy đủ để tài xế dễ tìm"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Phường/Xã
            </label>
            <input
              type="text"
              name="senderWard"
              className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Quận/Huyện
            </label>
            <input
              type="text"
              name="senderDistrict"
              className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Thành phố
            </label>
            <input
              type="text"
              name="senderCity"
              defaultValue="Ho Chi Minh City"
              className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Pickup Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ink">Thông tin pickup</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Ngày pickup *
            </label>
            <input
              type="datetime-local"
              name="pickupDate"
              className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Khoảng thời gian
            </label>
            <input
              type="text"
              name="pickupTimeWindow"
              placeholder="Ví dụ: 09:00 - 12:00"
              className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Loại xe *
            </label>
            <select
              name="vehicleType"
              className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
              required
            >
              <option value="">Chọn loại xe</option>
              <option value="MOTORBIKE">Xe máy</option>
              <option value="CAR">Ô tô</option>
              <option value="VAN">Van</option>
              <option value="TRUCK">Xe tải</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Số kiện dự kiến *
            </label>
            <input
              type="number"
              name="estimatedPackageCount"
              min="1"
              className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Cân nặng dự kiến (kg)
            </label>
            <input
              type="number"
              name="estimatedWeight"
              step="0.1"
              min="0"
              className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Mô tả hàng hóa
          </label>
          <textarea
            name="goodsDescription"
            rows={2}
            className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
            placeholder="Ví dụ: Điện tử, mỹ phẩm, quần áo..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Ghi chú pickup
          </label>
          <textarea
            name="pickupNote"
            rows={2}
            className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
            placeholder="Hướng dẫn đặc biệt cho tài xế"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Ghi chú nội bộ
          </label>
          <textarea
            name="internalNote"
            rows={2}
            className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
            placeholder="Ghi chú nội bộ cho admin"
          />
        </div>
      </div>

      {/* Driver Assignment */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-ink">Phân tài xế</h3>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Tài xế (tùy chọn)
          </label>
          <select
            name="driverId"
            className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm"
          >
            <option value="">Chưa phân tài xế</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name} - {driver.vehicleType} ({driver.phone})
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            Có thể phân tài xế sau khi tạo pickup
          </p>
        </div>
      </div>

      {/* Submit */}
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
          {isSubmitting ? "Đang tạo..." : "Tạo pickup"}
        </button>
      </div>
    </form>
  );
}
