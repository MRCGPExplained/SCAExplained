"use client";

import { useActionState } from "react";
import { updatePricingAction } from "./actions";
import type { Pricing } from "@/lib/pricing";

const NAVY = "#333333";

export default function PricingEditor({ pricing }: { pricing: Pricing }) {
  const [state, formAction, pending] = useActionState(updatePricingAction, {});

  const fields: { name: string; label: string; value: number; step?: string }[] = [
    { name: "claude_input_usd_per_mtok", label: "Claude input $/1M tokens", value: pricing.claudeInputUsdPerMTok, step: "0.01" },
    { name: "claude_output_usd_per_mtok", label: "Claude output $/1M tokens", value: pricing.claudeOutputUsdPerMTok, step: "0.01" },
    { name: "claude_cache_write_usd_per_mtok", label: "Claude cache-write $/1M", value: pricing.claudeCacheWriteUsdPerMTok, step: "0.01" },
    { name: "claude_cache_read_usd_per_mtok", label: "Claude cache-read $/1M", value: pricing.claudeCacheReadUsdPerMTok, step: "0.01" },
    { name: "deepgram_usd_per_min", label: "Deepgram $/min", value: pricing.deepgramUsdPerMin, step: "0.0001" },
    { name: "daily_audio_usd_per_min", label: "Daily audio $/participant-min", value: pricing.dailyAudioUsdPerMin, step: "0.00001" },
    { name: "daily_video_usd_per_min", label: "Daily video $/participant-min", value: pricing.dailyVideoUsdPerMin, step: "0.0001" },
    { name: "daily_free_minutes_per_month", label: "Daily free min/month", value: pricing.dailyFreeMinutesPerMonth, step: "1" },
    { name: "gp_review_gbp", label: "GP review £", value: pricing.gpReviewGbp, step: "0.01" },
    { name: "stripe_percent", label: "Stripe fee %", value: pricing.stripePercent, step: "0.01" },
    { name: "stripe_fixed_gbp", label: "Stripe fixed £", value: pricing.stripeFixedGbp, step: "0.01" },
    { name: "usd_to_gbp", label: "USD → GBP rate", value: pricing.usdToGbp, step: "0.0001" },
  ];

  return (
    <div className="rounded-2xl bg-white" style={{ border: "1px solid rgba(51,51,51,0.1)" }}>
      <div className="px-5 py-3.5" style={{ borderBottom: "1px solid rgba(51,51,51,0.08)" }}>
        <h2 className="font-display font-bold text-[15px]" style={{ color: NAVY }}>Pricing configuration</h2>
        <p className="text-[12px] mt-0.5" style={{ color: "rgba(51,51,51,0.5)" }}>
          Saving creates a new version. Historical consultation costs are snapshotted and never change.
        </p>
      </div>
      <form action={formAction} className="p-5">
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {fields.map((f) => (
            <label key={f.name} className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold" style={{ color: "rgba(51,51,51,0.55)" }}>{f.label}</span>
              <input
                name={f.name}
                type="number"
                step={f.step ?? "0.01"}
                min="0"
                defaultValue={f.value}
                required
                className="rounded-lg px-3 py-2 text-[13px]"
                style={{ border: "1px solid rgba(51,51,51,0.15)", background: "#FAFAF8", color: NAVY, fontVariantNumeric: "tabular-nums" }}
              />
            </label>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg px-4 py-2 text-[13px] font-bold"
            style={{ background: NAVY, color: "white", border: "none", cursor: pending ? "default" : "pointer", opacity: pending ? 0.6 : 1 }}
          >
            {pending ? "Saving…" : "Save new pricing version"}
          </button>
          {state.error && <span className="text-[12px]" style={{ color: "#B91C1C" }}>{state.error}</span>}
          {state.success && <span className="text-[12px]" style={{ color: "#166534" }}>Saved — new version active.</span>}
        </div>
      </form>
    </div>
  );
}
