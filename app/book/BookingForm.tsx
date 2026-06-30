"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBooking, type BookingState } from "./actions";
import { formatPrice } from "@/lib/format";
import type { UpcomingEvent } from "@/lib/types";

const TIMEOUT_SECONDS = 10 * 60;

const initial: BookingState = {};

export function BookingForm({ event }: { event: UpcomingEvent }) {
  const bookable = event.tickets.filter((t) => t.remaining > 0);
  const [ticketTypeId, setTicketTypeId] = useState(
    bookable[0]?.ticketTypeId ?? ""
  );
  const [state, formAction, pending] = useActionState(createBooking, initial);
  const [secondsLeft, setSecondsLeft] = useState(TIMEOUT_SECONDS);
  const router = useRouter();

  const selected = event.tickets.find((t) => t.ticketTypeId === ticketTypeId);
  const isPaid = (selected?.price ?? 0) > 0;
  const showSelector = event.tickets.length > 1;

  // 10-minute countdown for paid bookings — redirects to home when expired.
  useEffect(() => {
    if (!isPaid) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          router.push("/");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaid, router]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeDisplay = `${mins}:${secs.toString().padStart(2, "0")}`;
  const isUrgent = secondsLeft <= 120;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="eventId" value={event.id} />
      <input type="hidden" name="ticketTypeId" value={ticketTypeId} />

      {showSelector && (
        <fieldset className="flex flex-col gap-2.5">
          <legend className="text-[11px] font-bold tracking-[0.06em] uppercase text-navy/55 mb-1">
            Choose your place
          </legend>
          {event.tickets.map((t) => {
            const soldOut = t.remaining <= 0;
            const active = t.ticketTypeId === ticketTypeId;
            return (
              <label
                key={t.ticketTypeId}
                className={[
                  "flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 cursor-pointer transition",
                  soldOut
                    ? "border-navy/10 bg-navy/[0.03] opacity-55 cursor-not-allowed"
                    : active
                      ? "border-navy bg-navy/[0.04]"
                      : "border-navy/15 hover:border-navy/40",
                ].join(" ")}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="ticketChoice"
                    className="accent-navy"
                    checked={active}
                    disabled={soldOut}
                    onChange={() => setTicketTypeId(t.ticketTypeId)}
                  />
                  <span>
                    <span className="block text-sm font-bold text-navy">
                      {t.name}
                    </span>
                    <span className="block text-[12px] text-navy/55">
                      {soldOut
                        ? "Fully booked"
                        : `${t.remaining} ${t.remaining === 1 ? "place" : "places"} left`}
                    </span>
                  </span>
                </span>
                <span className="text-sm font-bold text-navy">
                  {formatPrice(t.price)}
                </span>
              </label>
            );
          })}
        </fieldset>
      )}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="text-[11px] font-bold tracking-[0.06em] uppercase text-navy/55"
        >
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="rounded-lg border border-navy/15 bg-white px-3.5 py-3 text-sm text-navy outline-none focus:border-navy"
          placeholder="Dr Jane Smith"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-[11px] font-bold tracking-[0.06em] uppercase text-navy/55"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-lg border border-navy/15 bg-white px-3.5 py-3 text-sm text-navy outline-none focus:border-navy"
          placeholder="you@example.com"
        />
        <p className="text-[11.5px] text-navy/45">
          We&apos;ll send your confirmation and joining link here.
        </p>
      </div>

      {isPaid && (
        <p className={[
          "text-[12px] font-semibold text-center rounded-lg px-3.5 py-2",
          isUrgent
            ? "bg-red-50 text-red-600 border border-red-200"
            : "bg-navy/[0.04] text-navy/55",
        ].join(" ")}>
          ⏱ Complete your booking within {timeDisplay}
        </p>
      )}

      {state?.error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-[13px] text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !ticketTypeId}
        className="inline-flex items-center justify-center rounded-lg bg-yellow text-navy font-bold px-7 py-3.5 text-sm transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(246,212,75,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {pending
          ? "Just a moment…"
          : isPaid
            ? `Continue to payment — ${formatPrice(selected?.price ?? 0)}`
            : "Confirm my free place"}
      </button>

      <p className="text-[11.5px] text-navy/45 text-center">
        {isPaid
          ? "You'll be taken to our secure Stripe checkout."
          : "No payment needed — your place is confirmed instantly."}
      </p>
    </form>
  );
}
