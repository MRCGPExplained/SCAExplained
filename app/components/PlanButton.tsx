"use client";

import { useState } from "react";
import type { PlanKey } from "@/lib/plans";

const DARK = "#333333";
const YELLOW = "#F6D44B";

/**
 * `source` is where the click came from, and it is the whole of the
 * trial's conversion tracking.
 *
 * It rides into the Stripe session's metadata and out again into
 * revenue_events.source, so "how many sales came from the free trial" is one
 * query rather than a guess. Undefined on the ordinary pricing page, which
 * is the honest answer there — a visitor who scrolled to the plans came from
 * nowhere in particular.
 */
export function PlanButton({ plan, label, source }: { plan: PlanKey; label: string; source?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function go() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/plan/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan, source }),
      });
      const data = await res.json();
      // Not signed in is the common case on a pricing page, and a red error
      // under the button is a dead end. Send them to register and bring them
      // back to the plan they picked.
      if (res.status === 401) {
        // The source has to survive the round trip, or every sale that went
        // through register — which is every sale from the trial, since a
        // trial visitor is by definition not signed in — comes back
        // unattributed.
        const back = source ? `/case-bank/upgrade?source=${encodeURIComponent(source)}` : "/#pricing";
        window.location.href = `/register?next=${encodeURIComponent(back)}`;
        return;
      }
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={go}
        disabled={loading}
        className="w-full font-bold text-[14px] py-3 rounded-xl transition-opacity hover:opacity-90"
        style={{
          background: YELLOW,
          color: DARK,
          border: "none",
          cursor: loading ? "default" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {label}
      </button>
      {error && (
        <p className="text-[12px] text-center mt-2" style={{ color: "#B91C1C" }}>{error}</p>
      )}
    </>
  );
}
