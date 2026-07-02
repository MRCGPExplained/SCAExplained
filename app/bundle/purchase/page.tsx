"use client";

import { useState } from "react";
import Link from "next/link";

export default function BundlePurchasePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePurchase() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bundle/checkout", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.url) {
        if (res.status === 401) {
          window.location.href = "/case-bank/login?next=/bundle/purchase";
          return;
        }
        setError(json.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = json.url;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  const NAVY = "#1A1B52";
  const YELLOW = "#F6D44B";

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block no-underline">
            <span className="font-display font-extrabold text-[22px]" style={{ color: NAVY }}>
              SCA <span style={{ color: YELLOW }}>Explained</span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid rgba(26,27,82,0.10)", boxShadow: "0 4px 24px rgba(26,27,82,0.07)" }}>
          {/* Header */}
          <div className="px-8 py-7" style={{ background: NAVY }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: YELLOW }}>
                Complete Bundle
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: YELLOW, color: NAVY }}>
                Best Value
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <div className="font-display font-extrabold text-[32px] text-white leading-tight">£50</div>
              <div className="text-[13px] line-through" style={{ color: "rgba(255,255,255,0.35)" }}>£60</div>
              <div className="text-[12px] font-semibold" style={{ color: YELLOW }}>Save £10</div>
            </div>
            <div className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
              Video Course + Case Bank · 90 days · one payment
            </div>
          </div>

          <div className="px-8 py-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Video Course */}
              <div className="rounded-xl p-4" style={{ background: "rgba(246,212,75,0.07)", border: "1px solid rgba(246,212,75,0.3)" }}>
                <div className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: NAVY }}>Video Course</div>
                {["System-by-system teaching", "All clinical areas", "Watch anytime"].map((f) => (
                  <div key={f} className="flex items-start gap-2 mb-1">
                    <span className="text-[10px] font-bold mt-0.5" style={{ color: NAVY }}>✓</span>
                    <span className="text-[12px]" style={{ color: "rgba(26,27,82,0.65)" }}>{f}</span>
                  </div>
                ))}
              </div>
              {/* Case Bank */}
              <div className="rounded-xl p-4" style={{ background: "rgba(246,212,75,0.07)", border: "1px solid rgba(246,212,75,0.3)" }}>
                <div className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: NAVY }}>Case Bank</div>
                {["246 SCA stations", "Study rooms", "Notes & stars"].map((f) => (
                  <div key={f} className="flex items-start gap-2 mb-1">
                    <span className="text-[10px] font-bold mt-0.5" style={{ color: NAVY }}>✓</span>
                    <span className="text-[12px]" style={{ color: "rgba(26,27,82,0.65)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-lg px-4 py-3 mb-4 text-[13px]" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#B91C1C" }}>
                {error}
              </div>
            )}

            <button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full rounded-xl py-3.5 font-display font-bold text-[15px] transition-opacity"
              style={{ background: YELLOW, color: NAVY, opacity: loading ? 0.65 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Redirecting to Stripe…" : "Pay £50 — Get Both"}
            </button>

            <p className="text-center text-[11.5px] mt-3" style={{ color: "rgba(26,27,82,0.35)" }}>
              Secure payment via Stripe · No subscription
            </p>

            <div className="flex justify-center gap-4 mt-4 text-[12px]" style={{ color: "rgba(26,27,82,0.45)" }}>
              <Link href="/video-course/purchase" className="no-underline hover:underline" style={{ color: "rgba(26,27,82,0.55)" }}>
                Video Course only — £30
              </Link>
              <span style={{ color: "rgba(26,27,82,0.2)" }}>·</span>
              <Link href="/case-bank/purchase" className="no-underline hover:underline" style={{ color: "rgba(26,27,82,0.55)" }}>
                Case Bank only — £30
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-[12px] mt-5" style={{ color: "rgba(26,27,82,0.4)" }}>
          Already purchased?{" "}
          <Link href="/case-bank/login" className="font-semibold no-underline" style={{ color: NAVY }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
