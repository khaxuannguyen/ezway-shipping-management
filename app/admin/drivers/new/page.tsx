import { DriverNewForm } from "./driver-new-form";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function NewDriverPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tạo tài xế mới"
        description="Thêm tài xế vận chuyển mới vào hệ thống"
        actionLabel="Quay lại"
        actionHref="/admin/drivers"
      />

      <div className="rounded-lg border border-line bg-white p-6">
        <DriverNewForm />
      </div>
    </div>
  );
}
