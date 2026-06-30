import Link from "next/link";
import type { UpcomingEvent } from "@/lib/types";
import { dateChip, timeRange } from "@/lib/format";

const ROUTE_SLUG: Record<UpcomingEvent["eventType"], string> = {
  webinar: "clear-pass-webinar",
  intensive: "sca-intensive",
};

/** Builds the availability sub-line for a row, per product. */
function availabilityLine(event: UpcomingEvent): {
  text: string;
  soldOut: boolean;
} {
  const time = timeRange(event.startTime, event.endTime);

  if (event.eventType === "webinar") {
    const t = event.tickets[0];
    const soldOut = !!t && t.remaining <= 0;
    return {
      text: soldOut ? `${time} · Fully booked` : `Free · ${time}`,
      soldOut,
    };
  }

  // Intensive: Active Candidate + Observer
  const active = event.tickets.find((t) =>
    t.name.toLowerCase().includes("active")
  );
  const observer = event.tickets.find((t) =>
    t.name.toLowerCase().includes("observer")
  );
  const activeLeft = active?.remaining ?? 0;
  const observerLeft = observer?.remaining ?? 0;

  const activePart =
    activeLeft > 0
      ? `${activeLeft} active ${activeLeft === 1 ? "slot" : "slots"} available`
      : "Active full";
  const observerPart = observerLeft > 0 ? "Observer slots available" : "Observer full";

  const soldOut = activeLeft <= 0 && observerLeft <= 0;
  return {
    text: soldOut ? `${time} · Fully booked` : `${time} · ${activePart} · ${observerPart}`,
    soldOut,
  };
}

export function DateList({
  events,
  rowTitle,
}: {
  events: UpcomingEvent[];
  rowTitle: string;
}) {
  if (events.length === 0) {
    return (
      <p className="text-[13.5px] text-navy/55">
        No upcoming dates yet — check back soon.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {events.map((event) => {
        const chip = dateChip(event.startTime);
        const { text, soldOut } = availabilityLine(event);
        const href = `/book/${ROUTE_SLUG[event.eventType]}/${event.isoDate}`;
        return (
          <div
            key={event.id}
            className="flex items-center gap-4 bg-white border border-navy/10 rounded-xl px-[18px] py-3.5"
          >
            <div className="shrink-0 w-14 bg-yellow rounded-lg text-center py-[7px]">
              <div className="text-[10px] font-bold text-navy uppercase">{chip.day}</div>
              <div className="text-[19px] font-extrabold text-navy leading-[1.1]">
                {chip.date}
              </div>
              <div className="text-[10px] font-bold text-navy uppercase">{chip.month}</div>
            </div>
            <div className="grow min-w-0">
              <p className="text-[14.5px] font-bold text-navy mb-0.5">{rowTitle}</p>
              <p className="text-[12.5px] text-navy/60">{text}</p>
            </div>
            {soldOut ? (
              <span className="shrink-0 px-[18px] py-[9px] text-[13px] font-semibold text-navy/40">
                Sold out
              </span>
            ) : (
              <Link
                href={href}
                className="shrink-0 inline-flex items-center rounded-lg bg-navy text-white px-[18px] py-[9px] text-[13px] font-semibold no-underline transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(26,27,82,0.25)]"
              >
                Book
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
