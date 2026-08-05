"use client";

import { useState } from "react";

const DARK = "#333333";
const YELLOW = "#F6D44B";

export function PurchaseButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/case-bank/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleClick}
        disabled={loading}
        className="font-bold text-[15px] px-8 py-3.5 rounded-xl transition-opacity hover:opacity-90"
        style={{ background: YELLOW, color: DARK, border: "none", cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Redirecting to checkout…" : "Purchase — £295"}
      </button>
      {error && <p className="text-[13px]" style={{ color: "#B91C1C" }}>{error}</p>}
    </div>
  );
}
