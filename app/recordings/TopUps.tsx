"use client";

import { useState } from "react";
import { TOPUPS, AI_TOPUPS, GP_TOPUPS, topUpPrice, type TopUpKey } from "@/lib/topups";

const DARK = "#333333";
const YELLOW = "#F6D44B";
const WASH = "#F9F3D9";

/**
 * Top-ups, for a plan that ran out of one thing before the exam.
 *
 * Shown here rather than on the homepage because nobody shops for these:
 * you want them at the moment a dialog tells you there is nothing left, and
 * this is the page both meters live on.
 *
 * A top-up adds to a meter and nothing else, which is why it is separate
 * from the plans. Someone whose four months have ended needs a plan; selling
 * them gradings would be taking money for something they cannot use, and
 * letting a pack buy time would make an account that never has to expire.
 */
export function TopUps() {
  const [busy, setBusy] = useState<TopUpKey | null>(null);
  const [error, setError] = useState("");

  async function buy(key: TopUpKey) {
    setBusy(key);
    setError("");
    try {
      const res = await fetch("/api/topup/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topup: key }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setBusy(null);
    }
  }

  const card = (key: TopUpKey) => {
    const t = TOPUPS[key];
    return (
      <button
        key={key}
        type="button"
        onClick={() => buy(key)}
        disabled={busy !== null}
        className="rounded-xl px-4 py-3.5 text-left transition-opacity"
        style={{
          background: "white",
          border: "1px solid rgba(51,51,51,0.12)",
          cursor: busy ? "default" : "pointer",
          opacity: busy && busy !== key ? 0.5 : 1,
        }}
      >
        <span className="block font-display font-extrabold text-[20px] leading-none mb-1" style={{ color: DARK }}>
          {busy === key ? "…" : topUpPrice(t)}
        </span>
        <span className="block text-[12.5px] font-semibold" style={{ color: DARK }}>{t.label}</span>
        <span className="block text-[11.5px]" style={{ color: "rgba(51,51,51,0.45)" }}>{t.detail}</span>
      </button>
    );
  };

  return (
    <div id="topups" className="rounded-2xl p-5 mb-6 scroll-mt-6" style={{ background: WASH, border: `1px solid ${YELLOW}` }}>
      <p className="font-display font-extrabold text-[15px] mb-1" style={{ color: DARK }}>
        Top up
      </p>
      <p className="text-[12.5px] leading-[1.55] mb-4" style={{ color: "rgba(51,51,51,0.6)" }}>
        Adds to your balance without changing your plan or when it expires.
      </p>

      <p className="text-[11px] font-bold uppercase tracking-[0.06em] mb-2" style={{ color: "rgba(51,51,51,0.45)" }}>
        AI gradings
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        {AI_TOPUPS.map(card)}
      </div>

      <p className="text-[11px] font-bold uppercase tracking-[0.06em] mb-2" style={{ color: "rgba(51,51,51,0.45)" }}>
        GP reviews
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {GP_TOPUPS.map(card)}
      </div>

      {error && <p className="text-[12px] mt-3" style={{ color: "#B91C1C" }}>{error}</p>}
    </div>
  );
}
