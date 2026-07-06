"use client";

import { useState } from "react";
import { validatePromoCodeAction, claimPromoAccessAction } from "./actions";

const DARK = "#333333";
const YELLOW = "#F6D44B";

export function CheckoutClient() {
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoState, setPromoState] = useState<"idle" | "valid" | "invalid">("idle");
  const [promoError, setPromoError] = useState("");
  const [applying, setApplying] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");

  async function handleApply() {
    if (!promoCode.trim()) return;
    setApplying(true);
    setPromoError("");
    const result = await validatePromoCodeAction(promoCode.trim());
    setApplying(false);
    if (result.valid) {
      setPromoState("valid");
    } else {
      setPromoState("invalid");
      setPromoError(result.error ?? "That code isn't valid.");
    }
  }

  async function handleClaim() {
    setClaiming(true);
    const result = await claimPromoAccessAction(promoCode.trim());
    if (result?.error) {
      setClaiming(false);
      setPromoState("invalid");
      setPromoError(result.error);
    }
    // redirect happens inside the action on success
  }

  async function handlePay() {
    setPayLoading(true);
    setPayError("");
    try {
      const res = await fetch("/api/programme/checkout", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.url) {
        setPayError(json.error ?? "Something went wrong. Please try again.");
        setPayLoading(false);
        return;
      }
      window.location.href = json.url;
    } catch {
      setPayError("Network error. Please try again.");
      setPayLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6 py-12" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[480px]">
        <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid rgba(51,51,51,0.10)", boxShadow: "0 4px 24px rgba(51,51,51,0.08)" }}>
          {/* Header */}
          <div className="px-8 py-7" style={{ background: DARK }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: YELLOW }}>The Complete SCA Package</div>
            <div className="flex items-baseline gap-3">
              <span className="font-display font-extrabold text-[36px] text-white">£60</span>
              <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>90 days · one payment</span>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-7">
            <p className="text-[14px] leading-[1.7] mb-6" style={{ color: "rgba(51,51,51,0.65)" }}>
              90 days access to the Skills Video Course, Consultation Video Course, and Case Bank.
            </p>

            {/* Promo code */}
            <div className="mb-6">
              {!promoOpen ? (
                <button
                  type="button"
                  onClick={() => setPromoOpen(true)}
                  className="text-[13px] no-underline transition-opacity hover:opacity-70"
                  style={{ color: "rgba(51,51,51,0.45)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}
                >
                  Have a promo code? Click here
                </button>
              ) : promoState === "valid" ? (
                <div className="rounded-lg px-4 py-3 text-[13px] font-semibold" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", color: "#15803D" }}>
                  Code applied — your access is free
                </div>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => { setPromoCode(e.target.value); setPromoState("idle"); setPromoError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleApply()}
                      placeholder="Enter promo code"
                      className="flex-1 rounded-lg px-4 py-2.5 text-[13.5px]"
                      style={{ border: `1.5px solid ${promoState === "invalid" ? "rgba(239,68,68,0.5)" : "rgba(51,51,51,0.15)"}`, color: DARK, background: "#F3F2F0", outline: "none", fontFamily: "inherit" }}
                    />
                    <button
                      type="button"
                      onClick={handleApply}
                      disabled={applying || !promoCode.trim()}
                      className="px-4 py-2.5 rounded-lg text-[13px] font-bold transition-opacity"
                      style={{ background: DARK, color: "white", opacity: applying || !promoCode.trim() ? 0.5 : 1, cursor: applying || !promoCode.trim() ? "not-allowed" : "pointer", fontFamily: "inherit" }}
                    >
                      {applying ? "…" : "Apply"}
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[12.5px] mt-2" style={{ color: "#B91C1C" }}>{promoError}</p>
                  )}
                </div>
              )}
            </div>

            {/* CTA */}
            {payError && (
              <div className="rounded-lg px-4 py-3 mb-4 text-[13px]" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#B91C1C" }}>
                {payError}
              </div>
            )}

            {promoState === "valid" ? (
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="w-full rounded-xl py-4 font-display font-bold text-[15px] transition-opacity"
                style={{ background: YELLOW, color: DARK, opacity: claiming ? 0.65 : 1, cursor: claiming ? "not-allowed" : "pointer" }}
              >
                {claiming ? "Activating access…" : "Claim Free Access"}
              </button>
            ) : (
              <button
                onClick={handlePay}
                disabled={payLoading}
                className="w-full rounded-xl py-4 font-display font-bold text-[15px] transition-opacity"
                style={{ background: YELLOW, color: DARK, opacity: payLoading ? 0.65 : 1, cursor: payLoading ? "not-allowed" : "pointer" }}
              >
                {payLoading ? "Redirecting to Stripe…" : "Continue to Payment"}
              </button>
            )}

            <p className="text-center text-[11.5px] mt-3" style={{ color: "rgba(51,51,51,0.35)" }}>
              {promoState === "valid" ? "No payment required." : "Secure payment via Stripe · No subscription"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
