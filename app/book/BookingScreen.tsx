import Link from "next/link";
import type { UpcomingEvent } from "@/lib/types";
import { longDate, timeRange } from "@/lib/format";
import { BookingForm } from "./BookingForm";

const INCLUDED: Record<UpcomingEvent["eventType"], string[]> = {
  webinar: [
    "How the SCA is marked and the common reasons candidates fail",
    "Consultation structure, time management and ICE",
    "Safety-netting, shared decision making and examiner expectations",
    "The pitfalls that quietly cost marks",
  ],
  intensive: [
    "Three realistic SCA consultations per active candidate",
    "Examiner-style feedback and a score prediction after each one",
    "Strengths, improvements and exam-technique coaching",
    "An individual improvement plan to take away",
  ],
};

export function BookingScreen({ event }: { event: UpcomingEvent }) {
  const included = INCLUDED[event.eventType];
  const anchor =
    event.eventType === "webinar" ? "#webinar-dates" : "#intensive-dates";

  return (
    <main className="bg-cream min-h-screen">
      <div className="max-w-[920px] mx-auto px-6 py-10 md:py-16">
        <Link
          href={`/${anchor}`}
          className="text-[13px] font-semibold text-navy/55 no-underline hover:text-navy"
        >
          ← Back to all dates
        </Link>

        <div className="mt-6 grid grid-cols-2 gap-10 max-md:grid-cols-1">
          {/* Details */}
          <div>
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-navy/55">
              {event.eventType === "webinar" ? "Free training" : "SCA Intensive"}
            </span>
            <h1 className="font-display font-extrabold text-[32px] leading-[1.15] text-navy mt-2 mb-4">
              {event.title}
            </h1>

            <div className="rounded-xl bg-lilac px-4 py-3.5 mb-6">
              <p className="text-[11px] font-bold tracking-[0.06em] uppercase text-navy/55">
                When
              </p>
              <p className="text-[15px] font-semibold text-navy mt-1">
                {longDate(event.startTime)}
              </p>
              <p className="text-[13.5px] text-navy/60">
                {timeRange(event.startTime, event.endTime)}
              </p>
            </div>

            <p className="text-[12px] font-bold tracking-[0.06em] uppercase text-navy/55 mb-3">
              What&apos;s included
            </p>
            <ul className="flex flex-col gap-2.5">
              {included.map((item) => (
                <li key={item} className="flex gap-2.5 text-[13.5px] leading-[1.5] text-navy/75">
                  <span className="text-yellow font-bold mt-px">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="bg-white border border-navy/10 rounded-2xl p-6 md:p-7 h-fit shadow-[0_10px_28px_rgba(26,27,82,0.06)]">
            <h2 className="font-display font-bold text-[19px] text-navy mb-5">
              Reserve your place
            </h2>
            <BookingForm event={event} />
          </div>
        </div>
      </div>
    </main>
  );
}
