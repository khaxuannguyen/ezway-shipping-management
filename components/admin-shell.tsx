import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/orders", label: "Don hang" },
  { href: "/admin/customers", label: "Khach hang" },
  { href: "/admin/packages", label: "Kien hang" },
  { href: "/admin/services", label: "Dich vu" },
  { href: "/admin/cost-rates", label: "Gia goc" },
  { href: "/admin/cost-items", label: "Chi phi phu" },
  { href: "/tracking", label: "Tracking public" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-line bg-white px-4 py-5 lg:block">
        <Link href="/admin/dashboard" className="block px-2">
          <div className="text-lg font-bold text-ink">EZWAY Ops</div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            International Logistics
          </div>
        </Link>
        <nav className="mt-8 space-y-1">
          {navItems.map((item) => (
            <Link
              className="block rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-ink"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-line bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div>
              <div className="text-sm font-bold text-ink lg:hidden">EZWAY Ops</div>
              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                Quan ly don hang, khach hang, van chuyen quoc te va tracking
              </p>
            </div>
            <Link
              className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              href="/admin/orders/new"
            >
              Tao don
            </Link>
          </div>
          <nav className="flex gap-2 overflow-x-auto border-t border-line px-4 py-2 lg:hidden">
            {navItems.map((item) => (
              <Link
                className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
