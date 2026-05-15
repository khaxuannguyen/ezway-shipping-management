import Link from "next/link";
import { DriverNewForm } from "./driver-new-form";

export const dynamic = "force-dynamic";

export default async function NewDriverPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Tạo tài xế mới</h1>
          <p className="mt-1 text-sm text-slate-600">
            Thêm tài xế vận chuyển mới vào hệ thống
          </p>
        </div>
        <Link
          href="/admin/drivers"
          className="rounded-3xl border border-line bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Quay lại
        </Link>
      </div>

      <div className="rounded-lg border border-line bg-white p-6">
        <DriverNewForm />
      </div>
    </div>
  );
}
