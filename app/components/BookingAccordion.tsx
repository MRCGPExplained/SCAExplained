"use client";

import { useState } from "react";
import { DateList } from "./DateList";
import type { UpcomingEvent } from "@/lib/types";

const FEATURES = [
  {
    emoji: "🎯",
    title: "How To Get A Clear Pass",
    desc: "Our free training on exactly what examiners are scoring — structure, ICE, safety-netting, and the pitfalls that cost marks.",
  },
  {
    emoji: "🩺",
    title: "SCA Intensive",
    desc: "A small-group live workshop. Six stations across the session — maximum two active candidates, each completing at least three consultations. Observer places available.",
  },
  {
    emoji: "📊",
    title: "Score Prediction",
    desc: "After each consultation, get a realistic sense of where you'd score against the examiner's criteria — not just generic feedback.",
  },
  {
    emoji: "📈",
    title: "An Individual Improvement Plan",
    desc: "Leave the Intensive with a clear, personalised plan for what to work on before exam day.",
  },
];

interface Props {
  webinarEvents: UpcomingEvent[];
  intensiveEvents: UpcomingEvent[];
}

export function BookingAccordion({ webinarEvents, intensiveEvents }: Props) {
  const [open, setOpen] = useState<"webinar" | "intensive">("webinar");

  return (
    <div className="max-w-[1000px] mx-auto">
      {/* Tab buttons */}
      <div className="flex gap-3 max-sm:flex-col">
        {/* Webinar tab */}
        <button
          onClick={() => setOpen("webinar")}
          className={[
            "flex-1 flex items-center justify-between gap-4 px-6 py-4 rounded-2xl font-display font-bold text-[15px] transition-all duration-200 text-left",
            open === "webinar"
              ? "bg-navy text-white shadow-[0_4px_20px_rgba(26,27,82,0.18)]"
              : "bg-navy/[0.06] text-navy hover:bg-navy/[0.10]",
          ].join(" ")}
        >
          <span>How To Get A Clear Pass <span className={open === "webinar" ? "text-yellow" : "text-navy/50"}>(Free)</span></span>
          <span className={["text-[18px] inline-block transition-transform duration-200", open === "webinar" ? "rotate-90" : "rotate-0"].join(" ")}>
            ›
          </span>
        </button>

        {/* Intensive tab */}
        <button
          onClick={() => setOpen("intensive")}
          className={[
            "flex-1 flex items-center justify-between gap-4 px-6 py-4 rounded-2xl font-display font-bold text-[15px] transition-all duration-200 text-left",
            open === "intensive"
              ? "bg-navy text-white shadow-[0_4px_20px_rgba(26,27,82,0.18)]"
              : "bg-navy/[0.06] text-navy hover:bg-navy/[0.10]",
          ].join(" ")}
        >
          <span>Book the SCA Intensive</span>
          <span className={["text-[18px] inline-block transition-transform duration-200", open === "intensive" ? "rotate-90" : "rotate-0"].join(" ")}>
            ›
          </span>
        </button>
      </div>

      {/* Webinar panel */}
      {open === "webinar" && (
        <div className="mt-5 bg-white rounded-2xl border border-navy/10 px-7 py-7">
          <p className="text-[14.5px] leading-[1.7] text-navy/65 mb-6 max-w-[640px]">
            This webinar focuses on what RCGP examiners are actually scoring when
            they watch a consultation, and why candidates who know their medicine
            still fall short. We go through the consultation skills that separate a
            Clear Pass from a near-miss, so you leave knowing exactly what examiners
            are looking for and how to show it.
          </p>
          <p className="text-[12px] font-bold tracking-[0.06em] uppercase text-navy/40 mb-3">
            Upcoming dates
          </p>
          <DateList events={webinarEvents} rowTitle="How To Get A Clear Pass" />
        </div>
      )}

      {/* Intensive panel */}
      {open === "intensive" && (
        <div className="mt-5 bg-white rounded-2xl border border-navy/10 px-7 py-7">
          <p className="text-[14.5px] leading-[1.7] text-navy/65 mb-6 max-w-[640px]">
            Coached practice built around how examiners actually score. Each active
            participant works through at least 3 realistic SCA stations, with a maximum
            of two active participants per session. After every station we reinforce
            what you&apos;re doing well, call out the habits and pitfalls that cost marks,
            and give you an honest score prediction against the examiner&apos;s criteria.
            We finish with an individual action plan: specific, prioritised, and ready
            to work on before exam day. Observers are welcome to join and learn from
            every station.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-4 gap-3 mb-7 max-lg:grid-cols-2 max-[480px]:grid-cols-1">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl p-4 border border-navy/10 bg-[#f7f6f3]"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[18px] mb-3 bg-yellow">
                  {f.emoji}
                </div>
                <p className="text-[12.5px] font-bold text-navy mb-1.5 leading-[1.3]">{f.title}</p>
                <p className="text-[11.5px] leading-[1.6] text-navy/60">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mb-5 flex-wrap">
            <span className="bg-navy/[0.07] text-navy text-[11px] font-bold tracking-[0.06em] uppercase px-3 py-1.5 rounded-lg">Active £200</span>
            <span className="bg-navy/[0.07] text-navy text-[11px] font-bold tracking-[0.06em] uppercase px-3 py-1.5 rounded-lg">Observer £50</span>
          </div>

          <p className="text-[12px] font-bold tracking-[0.06em] uppercase text-navy/40 mb-3">
            Upcoming dates
          </p>
          <DateList events={intensiveEvents} rowTitle="SCA Intensive" />
        </div>
      )}
    </div>
  );
}
