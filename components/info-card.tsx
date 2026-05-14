import type { ReactNode } from "react";

export function InfoCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

export function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-1 text-sm sm:grid-cols-[140px_1fr]">
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
