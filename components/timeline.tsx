import type { OrderStatus } from "@prisma/client";
import { formatDateTime } from "@/lib/format";
import { statusLabels } from "./status-badge";

export type TimelineEvent = {
  id: string;
  status: OrderStatus;
  message: string;
  location: string | null;
  eventTime: Date | string;
};

const markerClasses: Record<OrderStatus, string> = {
  NEW: "border-blue-500 bg-white",
  CONFIRMED: "border-sky-500 bg-white",
  IN_WAREHOUSE: "border-indigo-500 bg-white",
  PROCESSING: "border-amber-500 bg-white",
  IN_TRANSIT: "border-teal-500 bg-white",
  CUSTOMS_CLEARANCE: "border-cyan-500 bg-white",
  OUT_FOR_DELIVERY: "border-violet-500 bg-white",
  DELIVERED: "border-emerald-500 bg-emerald-500",
  PROBLEM: "border-danger bg-danger",
  CANCELLED: "border-slate-400 bg-slate-400",
};

export function TrackingTimeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-slate-500">Chua co su kien tracking.</p>;
  }

  return (
    <ol className="space-y-5">
      {events.map((event, index) => (
        <li className="relative pl-8" key={event.id}>
          {index < events.length - 1 ? (
            <span className="absolute left-[7px] top-5 h-[calc(100%+0.25rem)] w-px bg-line" />
          ) : null}
          <span
            className={`absolute left-0 top-1 h-4 w-4 rounded-full border-2 ${markerClasses[event.status]}`}
          />
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="text-sm font-semibold text-ink">{statusLabels[event.status]}</h3>
            <time className="text-xs font-medium text-slate-500">
              {formatDateTime(event.eventTime)}
            </time>
          </div>
          <p className="mt-1 text-sm text-slate-600">{event.message}</p>
          {event.location ? (
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {event.location}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
