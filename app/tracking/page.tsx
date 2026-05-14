import { StatusBadge } from "@/components/status-badge";
import { TrackingTimeline } from "@/components/timeline";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TrackingPage({
  searchParams,
}: {
  searchParams: Promise<{ trackingCode?: string }>;
}) {
  const { trackingCode } = await searchParams;
  const code = trackingCode?.trim() ?? "";
  const order = code
    ? await prisma.order.findUnique({
        where: { trackingCode: code },
        include: {
          trackingEvents: {
            orderBy: { eventTime: "asc" },
          },
        },
      })
    : null;

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <div className="text-lg font-bold text-ink">ShipOps Tracking</div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              International Shipment
            </p>
          </div>
          <a className="text-sm font-semibold text-brand hover:text-blue-700" href="/admin/dashboard">
            Admin
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h1 className="text-2xl font-bold text-ink">Tra cuu tracking</h1>
          <form className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]" method="get">
            <input
              className="w-full rounded-md border border-line px-3 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
              defaultValue={code}
              name="trackingCode"
              placeholder="Nhap ma tracking, vi du INTL860000"
            />
            <button
              className="rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              type="submit"
            >
              Tra cuu
            </button>
          </form>
        </section>

        {code && !order ? (
          <section className="mt-6 rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
            Khong tim thay ma tracking {code}.
          </section>
        ) : null}

        {order ? (
          <section className="mt-6 grid gap-5 lg:grid-cols-[360px_1fr]">
            <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">Ma tracking</p>
                  <h2 className="mt-1 text-xl font-bold text-ink">{order.trackingCode}</h2>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="font-medium text-slate-500">Ma don</dt>
                  <dd className="mt-1 font-semibold text-ink">{order.orderCode}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Tuyen van chuyen</dt>
                  <dd className="mt-1 font-semibold text-ink">
                    {order.originCountry} {"->"} {order.destinationCountry}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Dich vu</dt>
                  <dd className="mt-1 text-ink">{order.serviceType}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Nguoi nhan</dt>
                  <dd className="mt-1 text-ink">{order.receiverName}</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
              <h2 className="text-base font-semibold text-ink">Hanh trinh don hang</h2>
              <div className="mt-5">
                <TrackingTimeline events={order.trackingEvents} />
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
