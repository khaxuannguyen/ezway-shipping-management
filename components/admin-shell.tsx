"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Tổng quan" },
  { href: "/admin/orders", label: "Đơn hàng" },
  { href: "/admin/customers", label: "Khách hàng" },
  { href: "/admin/packages", label: "Kiện hàng" },
  { href: "/admin/services", label: "Tuyến dịch vụ" },
  { href: "/admin/cost-rates", label: "Giá gốc" },
  { href: "/admin/cost-items", label: "Chi phí phụ" },
  { href: "/admin/pickups", label: "Pickup hàng" },
  { href: "/admin/drivers", label: "Tài xế" },
  { href: "/tracking", label: "Tracking public" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <Link href="/admin/dashboard" className="block">
            <div className="text-xl font-bold text-slate-900">EZWAY Ops</div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              International Logistics
            </div>
          </Link>
        </div>
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-4 px-6">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                Quản lý vận chuyển quốc tế
              </h1>
              <p className="text-sm text-slate-600">
                Hệ thống quản lý đơn hàng, khách hàng và logistics
              </p>
            </div>
            <Link
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              href="/admin/orders/new"
            >
              Tạo đơn hàng
            </Link>
          </div>
        </header>
        <main className="w-full px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
