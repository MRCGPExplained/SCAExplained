import { getSupabaseAdmin } from "@/lib/supabase";
import { getCurrentPricing } from "@/lib/pricing";
import PricingEditor from "./PricingEditor";

export const dynamic = "force-dynamic";

const NAVY = "#333333";

function gbp(n: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
}
function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function currentMonth(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthRange(month: string): { start: string; end: string; label: string } {
  const [y, m] = month.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 1));
  return {
    start: start.toISOString(),
    end: end.toISOString(),
    label: start.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }),
  };
}

type CostRow = {
  deepgram_cost_gbp: string | number;
  claude_cost_gbp: string | number;
  daily_cost_gbp: string | number | null;
  gp_cost_gbp: string | number;
  gp_reviewed: boolean;
};
type RevenueRow = { amount_gross_gbp: string | number; stripe_fee_gbp: string | number; user_id: string | null };
type DailyRow = { participant_minutes: string | number };

export default async function EconomicsPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const { month: monthParam } = await searchParams;
  const month = monthParam || currentMonth();
  const { start, end, label } = monthRange(month);

  const admin = getSupabaseAdmin();
  if (!admin) {
    return <p className="text-[14px]" style={{ color: NAVY }}>Database not available.</p>;
  }

  const pricing = await getCurrentPricing(admin);

  const [costsRes, revenueRes, dailyRes, allCustomersRes] = await Promise.all([
    admin
      .from("consultation_costs")
      .select("deepgram_cost_gbp, claude_cost_gbp, daily_cost_gbp, gp_cost_gbp, gp_reviewed")
      .gte("created_at", start)
      .lt("created_at", end),
    admin
      .from("revenue_events")
      .select("amount_gross_gbp, stripe_fee_gbp, user_id")
      .gte("created_at", start)
      .lt("created_at", end),
    admin
      .from("daily_usage")
      .select("participant_minutes")
      .gte("created_at", start)
      .lt("created_at", end),
    admin.from("revenue_events").select("user_id"),
  ]);

  const costs = (costsRes.data ?? []) as CostRow[];
  const revenue = (revenueRes.data ?? []) as RevenueRow[];
  const daily = (dailyRes.data ?? []) as DailyRow[];
  const allCustomers = (allCustomersRes.data ?? []) as { user_id: string | null }[];

  const num = (v: string | number | null | undefined) => (v == null ? 0 : Number(v));

  // Revenue + Stripe
  const revenueTotal = revenue.reduce((s, r) => s + num(r.amount_gross_gbp), 0);
  const stripeFees = revenue.reduce((s, r) => s + num(r.stripe_fee_gbp), 0);

  // Provider costs (from the immutable ledger)
  const deepgram = costs.reduce((s, r) => s + num(r.deepgram_cost_gbp), 0);
  const claude = costs.reduce((s, r) => s + num(r.claude_cost_gbp), 0);
  const gp = costs.reduce((s, r) => s + num(r.gp_cost_gbp), 0);
  const dailyGross = costs.reduce((s, r) => s + num(r.daily_cost_gbp), 0);

  // Daily: apply the monthly free participant-minute allowance at the audio rate.
  const dailyMinutes = daily.reduce((s, r) => s + num(r.participant_minutes), 0);
  const freeMin = pricing?.dailyFreeMinutesPerMonth ?? 0;
  const audioRateGbp = pricing ? pricing.dailyAudioUsdPerMin * pricing.usdToGbp : 0;
  const freeDiscount = Math.min(dailyMinutes, freeMin) * audioRateGbp;
  const dailyCost = Math.max(0, dailyGross - freeDiscount);

  const consultations = costs.length;
  const gpReviews = costs.filter((r) => r.gp_reviewed).length;
  const customers = new Set(allCustomers.map((c) => c.user_id).filter(Boolean)).size;

  const variableCosts = deepgram + claude + dailyCost + gp + stripeFees;
  const grossProfit = revenueTotal - variableCosts;
  const margin = revenueTotal > 0 ? grossProfit / revenueTotal : null;

  const breakdown = [
    { name: "Claude", spend: claude },
    { name: "Deepgram", spend: deepgram },
    { name: "Daily", spend: dailyCost },
    { name: "GP Review", spend: gp },
    { name: "Stripe", spend: stripeFees },
    { name: "Other", spend: 0 },
  ];
  const breakdownTotal = breakdown.reduce((s, b) => s + b.spend, 0);

  const kpis = [
    { label: "Revenue", value: gbp(revenueTotal) },
    { label: "Variable Costs", value: gbp(variableCosts) },
    { label: "Gross Profit", value: gbp(grossProfit) },
    { label: "Gross Margin", value: margin === null ? "—" : pct(margin) },
    { label: "Customers", value: String(customers), sub: "paying, all-time" },
    { label: "AI Consultations", value: String(consultations), sub: label },
    { label: "GP Reviews", value: String(gpReviews), sub: label },
  ];

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-extrabold text-[26px]" style={{ color: NAVY }}>Economics</h1>
          <p className="text-[13px] mt-1" style={{ color: "rgba(51,51,51,0.55)" }}>
            Actual unit economics from the consultation cost ledger · {label}
          </p>
        </div>
        <form method="get" className="flex items-end gap-2">
          <input
            type="month"
            name="month"
            defaultValue={month}
            className="rounded-lg px-3 py-2 text-[13px]"
            style={{ border: "1px solid rgba(51,51,51,0.15)", background: "white", color: NAVY }}
          />
          <button type="submit" className="rounded-lg px-3 py-2 text-[13px] font-bold" style={{ background: NAVY, color: "white", border: "none", cursor: "pointer" }}>
            View
          </button>
        </form>
      </div>

      {!pricing && (
        <div className="mb-6 rounded-xl px-4 py-3 text-[13px]" style={{ background: "rgba(245,158,11,0.1)", color: "#92400E", border: "1px solid rgba(245,158,11,0.25)" }}>
          No pricing configuration found — costs cannot be calculated. Set pricing below.
        </div>
      )}

      {/* KPI cards */}
      <div className="grid gap-3 mb-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl p-4 bg-white" style={{ border: "1px solid rgba(51,51,51,0.1)" }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.05em] mb-1.5" style={{ color: "rgba(51,51,51,0.45)" }}>{k.label}</div>
            <div className="font-display font-extrabold text-[22px]" style={{ color: NAVY }}>{k.value}</div>
            {k.sub && <div className="text-[11px] mt-0.5" style={{ color: "rgba(51,51,51,0.4)" }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Cost breakdown */}
      <div className="rounded-2xl bg-white mb-8" style={{ border: "1px solid rgba(51,51,51,0.1)" }}>
        <div className="px-5 py-3.5" style={{ borderBottom: "1px solid rgba(51,51,51,0.08)" }}>
          <h2 className="font-display font-bold text-[15px]" style={{ color: NAVY }}>Cost breakdown — {label}</h2>
        </div>
        <div className="p-5">
          <table className="w-full text-[13px]" style={{ color: NAVY, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ color: "rgba(51,51,51,0.45)" }} className="text-[11px] uppercase tracking-[0.05em]">
                <th className="text-left font-bold pb-2">Provider</th>
                <th className="text-right font-bold pb-2">Spend</th>
                <th className="text-right font-bold pb-2">% of cost</th>
                <th className="text-right font-bold pb-2">Avg / consultation</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((b) => (
                <tr key={b.name} style={{ borderTop: "1px solid rgba(51,51,51,0.06)" }}>
                  <td className="py-2 font-semibold">{b.name}</td>
                  <td className="py-2 text-right" style={{ fontVariantNumeric: "tabular-nums" }}>{gbp(b.spend)}</td>
                  <td className="py-2 text-right" style={{ fontVariantNumeric: "tabular-nums", color: "rgba(51,51,51,0.55)" }}>
                    {breakdownTotal > 0 ? pct(b.spend / breakdownTotal) : "—"}
                  </td>
                  <td className="py-2 text-right" style={{ fontVariantNumeric: "tabular-nums", color: "rgba(51,51,51,0.55)" }}>
                    {consultations > 0 ? gbp(b.spend / consultations) : "—"}
                  </td>
                </tr>
              ))}
              <tr style={{ borderTop: "1.5px solid rgba(51,51,51,0.15)" }}>
                <td className="py-2 font-bold">Total variable cost</td>
                <td className="py-2 text-right font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>{gbp(breakdownTotal)}</td>
                <td className="py-2 text-right">100%</td>
                <td className="py-2 text-right font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {consultations > 0 ? gbp(breakdownTotal / consultations) : "—"}
                </td>
              </tr>
            </tbody>
          </table>
          <p className="text-[11px] mt-3" style={{ color: "rgba(51,51,51,0.4)" }}>
            Daily is shown after the {freeMin.toLocaleString()} free participant-minutes/month allowance
            ({dailyMinutes.toFixed(0)} used this month). Costs come from the immutable per-consultation ledger.
          </p>
        </div>
      </div>

      {/* Pricing configuration */}
      {pricing && <PricingEditor pricing={pricing} />}
    </div>
  );
}
