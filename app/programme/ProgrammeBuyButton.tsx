"use client";

import { useState } from "react";

const NAVY = "#1A1B52";
const YELLOW = "#F6D44B";

export default function ProgrammeBuyButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePurchase() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/programme/checkout", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.url) {
        if (res.status === 401) {
          window.location.href = "/register?next=/programme";
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

  return (
    <>
      {error && (
        <div className="rounded-lg px-4 py-3 mb-4 text-[13px]" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#B91C1C" }}>
          {error}
        </div>
      )}
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="w-full rounded-xl py-4 font-display font-bold text-[15px] transition-opacity"
        style={{ background: YELLOW, color: NAVY, opacity: loading ? 0.65 : 1, cursor: loading ? "not-allowed" : "pointer" }}
      >
        {loading ? "Redirecting to Stripe…" : "Buy The Programme — £60"}
      </button>
    </>
  );
}
