"use client";

import { useState } from "react";
import Link from "next/link";

export default function VideoCoursePurchasePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePurchase() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/video-course/checkout", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.url) {
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
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block no-underline">
            <span className="font-display font-extrabold text-[22px]" style={{ color: NAVY }}>
              SCA <span style={{ color: YELLOW }}>Explained</span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid rgba(26,27,82,0.10)", boxShadow: "0 4px 24px rgba(26,27,82,0.07)" }}>
          <div className="px-8 py-7" style={{ background: NAVY }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: YELLOW }}>
              Video Course Access
            </div>
            <div className="font-display font-extrabold text-[32px] text-white leading-tight">£30</div>
            <div className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
              90-day access — one payment, no subscription
            </div>
          </div>

          <div className="px-8 py-6">
            <ul className="space-y-3 mb-6">
              {[
                "System-by-system video teaching",
                "Cardiovascular, Respiratory, Mental Health and more",
                "Built on the same framework as the free webinar",
                "Watch at your own pace, as many times as you like",
                "Access for 90 days from purchase",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5" style={{ background: "rgba(246,212,75,0.2)", color: NAVY }}>✓</span>
                  <span className="text-[13.5px] leading-snug" style={{ color: "rgba(26,27,82,0.75)" }}>{item}</span>
                </li>
              ))}
            </ul>

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
              {loading ? "Redirecting to Stripe…" : "Pay £30 — Get Access"}
            </button>

            <p className="text-center text-[11.5px] mt-3" style={{ color: "rgba(26,27,82,0.35)" }}>
              Secure payment via Stripe · No subscription
            </p>

            <p className="text-center text-[12px] mt-4" style={{ color: "rgba(26,27,82,0.45)" }}>
              Want both?{" "}
              <Link href="/bundle/purchase" className="font-semibold no-underline" style={{ color: NAVY }}>
                Get the bundle for £50
              </Link>
            </p>
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
