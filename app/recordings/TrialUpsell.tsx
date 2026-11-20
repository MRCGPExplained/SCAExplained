"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PLANS, PLAN_ORDER, planPrice } from "@/lib/plans";
import type { RecordingRole } from "@/lib/recording-roles";

const DARK = "#333333";

/**
 * Seconds before the modal appears if they have not scrolled past their
 * feedback first.
 *
 * NOT TEN, WHICH WAS THE FIRST NUMBER. This page carries a predicted score,
 * an overall summary of about 130 words and three domain comments of about
 * 80 each. At normal reading speed the summary alone is 40 seconds, so a
 * modal at ten lands mid-sentence on the first thing that proves the product
 * works — stepping on the pitch to deliver the pitch. 45 is long enough to
 * have read something worth paying for.
 */
const FALLBACK_MS = 45_000;

/**
 * Where the upsell is allowed to interrupt: once the domain cards have gone
 * past, the reader has seen the specific feedback and is warm. Whichever
 * comes first, this or the timer.
 */
const ANCHOR_ID = "trial-feedback-end";

/* Observers are a real seat here - a room holds four - and they get the same
   close as the patient. Anyone who was not the doctor watched somebody else
   get the thing they would be buying. */
type Role = RecordingRole | null;

function PlanRow({ source }: { source: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {PLAN_ORDER.map((key) => {
        const plan = PLANS[key];
        return (
          <Link
            key={key}
            /*
              Register, not checkout. /api/plan/checkout returns 401 for
              anyone logged out or on a guest session, and the whole point of
              a trial is that they are one — so sending them at Stripe
              dead-ends. The plan and the source ride through the query string
              so neither the choice nor the attribution is lost on the way.
            */
            href={`/register?plan=${key}&source=${source}`}
            className="block rounded-xl px-4 py-4 no-underline transition-transform hover:-translate-y-0.5"
            style={{ background: "white", border: `1.5px solid rgba(51,51,51,0.14)` }}
          >
            <div className="font-display font-extrabold text-[15px] mb-0.5" style={{ color: DARK }}>
              {plan.name}
            </div>
            <div className="font-display font-extrabold text-[26px] mb-1.5" style={{ color: DARK }}>
              {planPrice(plan)}
            </div>
            <div className="text-[12px] leading-[1.5]" style={{ color: "rgba(51,51,51,0.6)" }}>
              {plan.gpReviews > 0
                ? `Everything, plus ${plan.gpReviews} consultations reviewed by a GP`
                : key === "premium"
                  ? "The whole case bank, unlimited AI reviews"
                  : `${plan.aiGradings} AI reviews, the whole case bank`}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/**
 * The trial's close: a modal once, then a block that stays.
 *
 * The modal is dismissible instantly — no forced wait. A close button that
 * does not work is interstitial-ad behaviour and it annoys exactly the wrong
 * people: the ones who already decided to buy and want to get on, and the
 * ones who never will and now feel trapped. It also traps anybody using a
 * keyboard or a screen reader. None of that is needed here, because the
 * block below the report catches everyone who dismisses it — a second
 * impression that arrives when they have just finished reading their own
 * feedback, which is a better moment than any overlay.
 */
export function TrialUpsell({ viewerRole }: { viewerRole: Role }) {
  const [open, setOpen] = useState(false);
  const dismissed = useRef(false);

  const wasDoctor = viewerRole === "doctor";
  const source = wasDoctor ? "trial-doctor" : "trial-guest";

  useEffect(() => {
    if (dismissed.current) return;

    const show = () => {
      if (dismissed.current) return;
      dismissed.current = true; // once per visit, whichever trigger wins
      setOpen(true);
    };

    const timer = window.setTimeout(show, FALLBACK_MS);

    // Fires when the end of the feedback has scrolled ABOVE the viewport,
    // not merely when it becomes visible — seeing the domain cards appear is
    // not the same as having read them.
    const anchor = document.getElementById(ANCHOR_ID);
    let observer: IntersectionObserver | undefined;
    if (anchor) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) show();
        },
        { threshold: 0 }
      );
      observer.observe(anchor);
    }

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, []);

  // Escape always closes. See the note above on not trapping anyone.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const heading = wasDoctor
    ? "That was one of 246 cases"
    : "You have seen how it works. Want the doctor's seat?";

  const body = wasDoctor
    ? "You got a predicted score, written feedback on all three domains and a transcript, on a case you did ten minutes ago. There are 245 more, and real GPs who will mark them."
    : "You watched a consultation get marked against the same domains the RCGP examiners use. The doctor's chair is where the practice actually happens, and the whole bank is open from £80.";

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-5 py-10 overflow-y-auto"
          style={{ background: "rgba(51,51,51,0.45)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="trial-upsell-heading"
          onClick={() => setOpen(false)}
        >
          <div
            className="rounded-2xl p-7 max-w-[760px] w-full relative"
            style={{ background: "#FAFAF8" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 text-[20px] leading-none px-2 py-1 rounded-lg transition-opacity hover:opacity-60"
              style={{ background: "transparent", color: "rgba(51,51,51,0.5)" }}
            >
              ×
            </button>
            <h2 id="trial-upsell-heading" className="font-display font-extrabold text-[23px] leading-[1.25] mb-2.5 pr-8" style={{ color: DARK }}>
              {heading}
            </h2>
            <p className="text-[14.5px] leading-[1.65] mb-6" style={{ color: "rgba(51,51,51,0.7)" }}>
              {body}
            </p>
            <PlanRow source={source} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-5 text-[13px] underline"
              style={{ background: "transparent", color: "rgba(51,51,51,0.55)" }}
            >
              Keep reading my report
            </button>
          </div>
        </div>
      )}

      <div
        className="rounded-2xl p-6 mt-8"
        style={{ background: "#F9F3D9", border: `1.5px solid rgba(51,51,51,0.1)` }}
      >
        <h2 className="font-display font-extrabold text-[20px] mb-2" style={{ color: DARK }}>
          {heading}
        </h2>
        <p className="text-[14px] leading-[1.65] mb-5" style={{ color: "rgba(51,51,51,0.7)" }}>
          {body}
        </p>
        <PlanRow source={source} />
        <p className="text-[12px] mt-4 mb-0" style={{ color: "rgba(51,51,51,0.5)" }}>
          This report and its recording are deleted after 24 hours — free sessions are not stored.
          {" "}
          <Link href="/" className="underline" style={{ color: "rgba(51,51,51,0.6)" }}>
            More about SCA Focus
          </Link>
        </p>
      </div>
    </>
  );
}

/** Dropped into the report right after the domain cards, so the component
 *  above has something to watch. Nothing visible. */
export function TrialFeedbackAnchor() {
  return <div id={ANCHOR_ID} aria-hidden="true" />;
}

