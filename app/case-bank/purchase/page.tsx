"use client";

import { useState } from "react";
import Link from "next/link";

export default function PurchasePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePurchase() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/case-bank/checkout", { method: "POST" });
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block no-underline">
            <span className="font-display font-extrabold text-[22px]" style={{ color: "#1A1B52" }}>
              SCA <span style={{ color: "#F6D44B" }}>Explained</span>
            </span>
          </Link>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "white",
            border: "1px solid rgba(26,27,82,0.10)",
            boxShadow: "0 4px 24px rgba(26,27,82,0.07)",
          }}
        >
          {/* Header */}
          <div className="px-8 py-7" style={{ background: "#1A1B52" }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: "#F6D44B" }}>
              Case Bank Access
            </div>
            <div className="font-display font-extrabold text-[32px] text-white leading-tight">
              £30
            </div>
            <div className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
              90-day access — one payment, no subscription
            </div>
          </div>

          {/* Features */}
          <div className="px-8 py-6">
            <ul className="space-y-3 mb-6">
              {[
                "246 fully-structured SCA practice stations",
                "Doctor's Brief, Patient's Story, Marking Scheme",
                "Example explanations and key takeaways",
                "Personal notes and starred stations",
                "Study rooms with real-time timer sync",
                "Access for 90 days from purchase",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                    style={{ background: "rgba(246,212,75,0.2)", color: "#1A1B52" }}
                  >
                    ✓
                  </span>
                  <span className="text-[13.5px] leading-snug" style={{ color: "rgba(26,27,82,0.75)" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {error && (
              <div
                className="rounded-lg px-4 py-3 mb-4 text-[13px]"
                style={{
                  background: "rgba(239,68,68,0.07)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#B91C1C",
                }}
              >
                {error}
              </div>
            )}

            <button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full rounded-xl py-3.5 font-display font-bold text-[15px] transition-opacity"
              style={{
                background: "#F6D44B",
                color: "#1A1B52",
                opacity: loading ? 0.65 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Redirecting to Stripe…" : "Pay £30 — Get Access"}
            </button>

            <p className="text-center text-[11.5px] mt-3" style={{ color: "rgba(26,27,82,0.35)" }}>
              Secure payment via Stripe · No subscription
            </p>
          </div>
        </div>

        <p className="text-center text-[12px] mt-5" style={{ color: "rgba(26,27,82,0.4)" }}>
          Already purchased?{" "}
          <Link href="/case-bank/login" className="font-semibold no-underline" style={{ color: "#1A1B52" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
