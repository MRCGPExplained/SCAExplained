import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getCurrentPricing } from "@/lib/pricing";
import { createEconLogger } from "@/lib/econ-logger";
import { mean, median, percentile, max as amax } from "@/lib/econ-stats";
import { loadCustomerProfiles, buildProjections } from "@/lib/economics-data";
import PricingEditor from "./PricingEditor";
import { LineChart, BarChart, type Point } from "./Charts";

export const dynamic = "force-dynamic";

const NAVY = "#333333";

const gbp = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const num = (v: unknown) => (v == null ? 0 : Number(v));
const int = (n: number) => Math.round(n).toLocaleString();

function currentMonth(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}
function monthRange(month: string) {
  const [y, m] = month.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 1));
  return {
    start: start.toISOString(),
    end: end.toISOString(),
    label: start.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }),
  };
}
function monthKey(iso: string): string {
  return iso.slice(0, 7);
}
function monthShort(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-GB", { month: "short", year: "2-digit", timeZone: "UTC" });
}

export default async function EconomicsPage({ searchParams }: { searchParams: Promise<{ month?: string; debug?: string }> }) {
  const sp = await searchParams;
  const month = sp.month || currentMonth();
  const isAll = month === "all";
  const debug = sp.debug === "1";
  const logger = createEconLogger(debug);
  const periodLabel = isAll ? "All time" : monthRange(month).label;

  const admin = getSupabaseAdmin();
  if (!admin) return <p style={{ color: NAVY }}>Database not available.</p>;

  const pricing = await getCurrentPricing(admin);
  logger.log("page", "pricing loaded", pricing ? { id: pricing.id } : "none");

  // Period-scoped query helper — applies the month window unless "all time".
  const range = isAll ? null : monthRange(month);
  const scoped = (table: string, cols: string) => {
    const q = admin.from(table).select(cols);
    return range ? q.gte("created_at", range.start).lt("created_at", range.end) : q;
  };

  const [ledgerRes, revenueRes, dailyRes, claudeRes, deepgramRes, allLedgerRes, allRevenueRes] = await Promise.all([
    scoped("consultation_costs", "deepgram_cost_gbp, claude_cost_gbp, daily_cost_gbp, gp_cost_gbp, total_cost_gbp, gp_reviewed, participants, created_at"),
    scoped("revenue_events", "amount_gross_gbp, stripe_fee_gbp, user_id, created_at"),
    scoped("daily_usage", "participant_minutes, room_duration_s, max_participants, cost_gbp, created_at"),
    scoped("claude_usage", "input_tokens, output_tokens, cost_gbp, created_at"),
    scoped("deepgram_usage", "audio_duration_s, cost_gbp, created_at"),
    admin.from("consultation_costs").select("deepgram_cost_gbp, claude_cost_gbp, daily_cost_gbp, gp_cost_gbp, created_at"),
    admin.from("revenue_events").select("amount_gross_gbp, stripe_fee_gbp, user_id, created_at"),
  ]);

  for (const [name, res] of Object.entries({ ledgerRes, revenueRes, dailyRes, claudeRes, deepgramRes, allLedgerRes, allRevenueRes })) {
    if (res.error) logger.error("page", res.error, { query: name });
  }

  type Row = Record<string, string | number | boolean | null>;
  const ledger = (ledgerRes.data ?? []) as unknown as Row[];
  const revenue = (revenueRes.data ?? []) as unknown as Row[];
  const daily = (dailyRes.data ?? []) as unknown as Row[];
  const claude = (claudeRes.data ?? []) as unknown as Row[];
  const deepgram = (deepgramRes.data ?? []) as unknown as Row[];
  const allLedger = (allLedgerRes.data ?? []) as unknown as Row[];
  const allRevenue = (allRevenueRes.data ?? []) as unknown as Row[];

  logger.log("page", "period rows", { ledger: ledger.length, revenue: revenue.length, daily: daily.length, claude: claude.length, deepgram: deepgram.length });

  // ── KPIs + cost breakdown (period) ──────────────────────────────────────────
  const revenueTotal = revenue.reduce((s, r) => s + num(r.amount_gross_gbp), 0);
  const stripeFees = revenue.reduce((s, r) => s + num(r.stripe_fee_gbp), 0);
  const dgCost = ledger.reduce((s, r) => s + num(r.deepgram_cost_gbp), 0);
  const clCost = ledger.reduce((s, r) => s + num(r.claude_cost_gbp), 0);
  const gpCost = ledger.reduce((s, r) => s + num(r.gp_cost_gbp), 0);
  const dailyMinutes = daily.reduce((s, r) => s + num(r.participant_minutes), 0);
  // Conservative: bill every participant-minute at full rate, ignoring Daily's
  // 10,000 free-minutes/month allowance.
  const dailyCost = ledger.reduce((s, r) => s + num(r.daily_cost_gbp), 0);

  const consultations = ledger.length;
  const gpReviews = ledger.filter((r) => r.gp_reviewed).length;
  const allCustomerIds = new Set(allRevenue.map((r) => r.user_id).filter(Boolean));
  const variableCosts = dgCost + clCost + dailyCost + gpCost + stripeFees;
  const grossProfit = revenueTotal - variableCosts;
  const margin = revenueTotal > 0 ? grossProfit / revenueTotal : null;

  logger.log("page", "KPIs", { revenueTotal, variableCosts, grossProfit, margin, consultations, gpReviews });

  const kpis = [
    { label: "Revenue", value: gbp(revenueTotal) },
    { label: "Variable Costs", value: gbp(variableCosts) },
    { label: "Gross Profit", value: gbp(grossProfit) },
    { label: "Gross Margin", value: margin === null ? "—" : pct(margin) },
    { label: "Customers", value: String(allCustomerIds.size), sub: "paying, all-time" },
    { label: "AI Consultations", value: String(consultations), sub: periodLabel },
    { label: "GP Reviews", value: String(gpReviews), sub: periodLabel },
  ];

  const breakdown = [
    { name: "Claude", spend: clCost },
    { name: "Deepgram", spend: dgCost },
    { name: "Daily", spend: dailyCost },
    { name: "GP Review", spend: gpCost },
    { name: "Stripe", spend: stripeFees },
    { name: "Other", spend: 0 },
  ];
  const breakdownTotal = breakdown.reduce((s, b) => s + b.spend, 0);

  // ── Consultation analytics ──────────────────────────────────────────────────
  const totals = ledger.map((r) => num(r.total_cost_gbp));
  const aiTotals = ledger.filter((r) => !r.gp_reviewed).map((r) => num(r.total_cost_gbp));
  const gpTotals = ledger.filter((r) => r.gp_reviewed).map((r) => num(r.total_cost_gbp));

  // ── Daily analytics ─────────────────────────────────────────────────────────
  const dailyParticipants = daily.map((r) => num(r.max_participants));
  const dailyDurations = daily.map((r) => num(r.room_duration_s));
  const dailyPMins = daily.map((r) => num(r.participant_minutes));
  const dailyCosts = daily.map((r) => num(r.cost_gbp));
  const dist = { 2: 0, 3: 0, 4: 0 } as Record<number, number>;
  for (const p of dailyParticipants) if (p >= 2 && p <= 4) dist[p as 2 | 3 | 4] += 1;

  // ── Claude analytics ────────────────────────────────────────────────────────
  const clInput = claude.map((r) => num(r.input_tokens));
  const clOutput = claude.map((r) => num(r.output_tokens));
  const clCosts = claude.map((r) => num(r.cost_gbp));

  // ── Deepgram analytics ──────────────────────────────────────────────────────
  const dgDurations = deepgram.map((r) => num(r.audio_duration_s));
  const dgCosts = deepgram.map((r) => num(r.cost_gbp));

  // ── Over-time monthly series (all time) ─────────────────────────────────────
  type MB = { revenue: number; stripe: number; deepgram: number; claude: number; daily: number; gp: number; consultations: number };
  const months = new Map<string, MB>();
  const mb = (k: string): MB => {
    let m = months.get(k);
    if (!m) { m = { revenue: 0, stripe: 0, deepgram: 0, claude: 0, daily: 0, gp: 0, consultations: 0 }; months.set(k, m); }
    return m;
  };
  for (const r of allRevenue) { if (!r.created_at) continue; const m = mb(monthKey(String(r.created_at))); m.revenue += num(r.amount_gross_gbp); m.stripe += num(r.stripe_fee_gbp); }
  for (const r of allLedger) { if (!r.created_at) continue; const m = mb(monthKey(String(r.created_at))); m.deepgram += num(r.deepgram_cost_gbp); m.claude += num(r.claude_cost_gbp); m.daily += num(r.daily_cost_gbp); m.gp += num(r.gp_cost_gbp); m.consultations += 1; }
  const sortedKeys = [...months.keys()].sort();

  const seriesRevenue: Point[] = [];
  const seriesProfit: Point[] = [];
  const seriesMargin: Point[] = [];
  const seriesCostPerConsult: Point[] = [];
  for (const k of sortedKeys) {
    const m = months.get(k)!;
    // Conservative: full-rate Daily, no free-minute allowance.
    const varCost = m.deepgram + m.claude + m.daily + m.gp + m.stripe;
    const profit = m.revenue - varCost;
    const label = monthShort(k);
    seriesRevenue.push({ label, value: m.revenue });
    seriesProfit.push({ label, value: profit });
    seriesMargin.push({ label, value: m.revenue > 0 ? (profit / m.revenue) * 100 : 0 });
    seriesCostPerConsult.push({ label, value: m.consultations > 0 ? varCost / m.consultations : 0 });
  }

  // ── Customers, subscription analytics, alerts, projections ───────────────────
  const customers = await loadCustomerProfiles(admin, logger);
  const premium = customers.filter((c) => c.planType === "case_bank_programme");

  const subAnalytics = premium.length
    ? {
        count: premium.length,
        avgAi: mean(premium.map((c) => c.aiConsultations)),
        avgGp: mean(premium.map((c) => c.gpReviews)),
        avgCost: mean(premium.map((c) => c.totalCost)),
        avgProfit: mean(premium.map((c) => c.grossProfit)),
        avgMargin: mean(premium.filter((c) => c.margin !== null).map((c) => c.margin as number)),
        highestCost: amax(premium.map((c) => c.totalCost)),
        lowestMargin: premium.filter((c) => c.margin !== null).sort((a, b) => (a.margin as number) - (b.margin as number))[0] ?? null,
      }
    : null;

  const projections = buildProjections(customers);
  const alerts = projections.filter((p) => p.reasons.length > 0).sort((a, b) => (a.projMargin ?? 1) - (b.projMargin ?? 1));

  // URL helpers for the period + debug controls
  const href = (m: string, d: boolean) => `/admin/economics?month=${m}${d ? "&debug=1" : ""}`;

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-extrabold text-[26px]" style={{ color: NAVY }}>Economics</h1>
          <p className="text-[13px] mt-1" style={{ color: "rgba(51,51,51,0.55)" }}>
            Actual unit economics from the consultation cost ledger · {periodLabel}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href={href(month, !debug)}
            className="rounded-lg px-3 py-2 text-[12px] font-bold no-underline"
            style={{ background: debug ? "#166534" : "rgba(51,51,51,0.08)", color: debug ? "white" : "rgba(51,51,51,0.6)" }}
          >
            Logging: {debug ? "On" : "Off"}
          </Link>
          <Link
            href={href("all", debug)}
            className="rounded-lg px-3 py-2 text-[12px] font-bold no-underline"
            style={{ background: isAll ? NAVY : "rgba(51,51,51,0.08)", color: isAll ? "white" : "rgba(51,51,51,0.6)" }}
          >
            All time
          </Link>
          <form method="get" className="flex items-end gap-2">
            {debug && <input type="hidden" name="debug" value="1" />}
            <input type="month" name="month" defaultValue={isAll ? currentMonth() : month} className="rounded-lg px-3 py-2 text-[13px]" style={{ border: "1px solid rgba(51,51,51,0.15)", background: "white", color: NAVY }} />
            <button type="submit" className="rounded-lg px-3 py-2 text-[13px] font-bold" style={{ background: NAVY, color: "white", border: "none", cursor: "pointer" }}>View</button>
          </form>
          <Link href="/admin/economics/customers" className="rounded-lg px-3 py-2 text-[12px] font-bold no-underline" style={{ background: "#F6D44B", color: NAVY }}>
            Customer profitability →
          </Link>
        </div>
      </div>

      {debug && (
        <div className="mb-6 rounded-xl px-4 py-2.5 text-[12px]" style={{ background: "rgba(22,101,52,0.08)", color: "#166534", border: "1px solid rgba(22,101,52,0.2)" }}>
          Logging on — query counts, computed aggregates and any errors are written to the browser/server console.
        </div>
      )}

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
      <Card title={`Cost breakdown — ${periodLabel}`}>
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
                <td className="py-2 text-right" style={{ fontVariantNumeric: "tabular-nums", color: "rgba(51,51,51,0.55)" }}>{breakdownTotal > 0 ? pct(b.spend / breakdownTotal) : "—"}</td>
                <td className="py-2 text-right" style={{ fontVariantNumeric: "tabular-nums", color: "rgba(51,51,51,0.55)" }}>{consultations > 0 ? gbp(b.spend / consultations) : "—"}</td>
              </tr>
            ))}
            <tr style={{ borderTop: "1.5px solid rgba(51,51,51,0.15)" }}>
              <td className="py-2 font-bold">Total variable cost</td>
              <td className="py-2 text-right font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>{gbp(breakdownTotal)}</td>
              <td className="py-2 text-right">100%</td>
              <td className="py-2 text-right font-bold" style={{ fontVariantNumeric: "tabular-nums" }}>{consultations > 0 ? gbp(breakdownTotal / consultations) : "—"}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-[11px] mt-3" style={{ color: "rgba(51,51,51,0.4)" }}>
          Daily billed at full rate on every participant-minute — the free-minute allowance is intentionally not applied (conservative). {dailyMinutes.toFixed(0)} participant-minutes this period.
        </p>
      </Card>

      {/* Analytics grid */}
      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <Card title="Consultation analytics">
          <Stat label="Avg AI-only consultation" value={aiTotals.length ? gbp(mean(aiTotals)) : "—"} />
          <Stat label="Avg GP-reviewed consultation" value={gpTotals.length ? gbp(mean(gpTotals)) : "—"} />
          <Stat label="Median cost" value={totals.length ? gbp(median(totals)) : "—"} />
          <Stat label="95th percentile" value={totals.length ? gbp(percentile(totals, 95)) : "—"} />
          <Stat label="Most expensive" value={totals.length ? gbp(amax(totals)) : "—"} />
        </Card>

        <Card title="Daily analytics">
          <Stat label="Avg participants" value={dailyParticipants.length ? mean(dailyParticipants).toFixed(1) : "—"} />
          <Stat label="Avg room duration" value={dailyDurations.length ? `${(mean(dailyDurations) / 60).toFixed(1)} min` : "—"} />
          <Stat label="Avg participant minutes" value={dailyPMins.length ? mean(dailyPMins).toFixed(1) : "—"} />
          <Stat label="Avg Daily cost" value={dailyCosts.length ? gbp(mean(dailyCosts)) : "—"} />
          <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(51,51,51,0.06)" }}>
            <BarChart bars={[{ label: "2 participants", value: dist[2] }, { label: "3 participants", value: dist[3] }, { label: "4 participants", value: dist[4] }]} format={(v) => String(v)} />
          </div>
        </Card>

        <Card title="Claude analytics">
          <Stat label="Avg input tokens" value={clInput.length ? int(mean(clInput)) : "—"} />
          <Stat label="Avg output tokens" value={clOutput.length ? int(mean(clOutput)) : "—"} />
          <Stat label="Avg Claude cost / call" value={clCosts.length ? gbp(mean(clCosts)) : "—"} />
          <Stat label="Most expensive request" value={clCosts.length ? gbp(amax(clCosts)) : "—"} />
          <Stat label="Avg per consultation" value={consultations ? gbp(clCost / consultations) : "—"} />
        </Card>

        <Card title="Deepgram analytics">
          <Stat label="Avg transcription duration" value={dgDurations.length ? `${(mean(dgDurations) / 60).toFixed(1)} min` : "—"} />
          <Stat label="Avg Deepgram cost / track" value={dgCosts.length ? gbp(mean(dgCosts)) : "—"} />
          <Stat label="Avg per consultation" value={consultations ? gbp(dgCost / consultations) : "—"} />
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        <Card title="Revenue over time"><LineChart points={seriesRevenue} format={gbp} /></Card>
        <Card title="Gross profit over time"><LineChart points={seriesProfit} format={gbp} color="#166534" allowNegative /></Card>
        <Card title="Gross margin over time"><LineChart points={seriesMargin} format={(v) => `${v.toFixed(0)}%`} color="#1D4ED8" allowNegative /></Card>
        <Card title="Cost per consultation over time"><LineChart points={seriesCostPerConsult} format={gbp} color="#B45309" /></Card>
      </div>

      {/* Subscription analytics */}
      <Card title="Subscription analytics — Complete SCA Programme (£295)">
        {subAnalytics ? (
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
            <Stat label="Customers on plan" value={String(subAnalytics.count)} />
            <Stat label="Avg AI consultations" value={subAnalytics.avgAi.toFixed(1)} />
            <Stat label="Avg GP reviews" value={subAnalytics.avgGp.toFixed(1)} />
            <Stat label="Avg customer cost" value={gbp(subAnalytics.avgCost)} />
            <Stat label="Avg customer profit" value={gbp(subAnalytics.avgProfit)} />
            <Stat label="Avg margin" value={pct(subAnalytics.avgMargin)} />
            <Stat label="Highest customer cost" value={gbp(subAnalytics.highestCost)} />
            <Stat label="Lowest-margin customer" value={subAnalytics.lowestMargin ? `${pct(subAnalytics.lowestMargin.margin as number)}` : "—"} sub={subAnalytics.lowestMargin?.email} />
          </div>
        ) : (
          <p className="text-[13px]" style={{ color: "rgba(51,51,51,0.4)" }}>No £295 customers yet.</p>
        )}
      </Card>

      {/* Power-user alerts */}
      <Card title={`Power-user alerts (${alerts.length})`}>
        <p className="text-[11px] mb-3" style={{ color: "rgba(51,51,51,0.45)" }}>Warnings only — no limits are enforced. Projections assume usage continues at the current rate.</p>
        {alerts.length === 0 ? (
          <p className="text-[13px]" style={{ color: "rgba(51,51,51,0.4)" }}>No customers currently flagged.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {alerts.map((a) => (
              <div key={a.customer.userId} className="flex items-center justify-between gap-3 flex-wrap rounded-lg px-3 py-2" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}>
                <Link href={`/admin/economics/customers/${a.customer.userId}`} className="text-[13px] font-semibold no-underline" style={{ color: NAVY }}>{a.customer.email || a.customer.userId.slice(0, 8)}</Link>
                <div className="flex items-center gap-3 flex-wrap text-[11px]" style={{ color: "rgba(51,51,51,0.6)" }}>
                  <span>{a.customer.aiConsultations} AI · {a.customer.gpReviews} GP</span>
                  <span>proj. margin {a.projMargin === null ? "—" : pct(a.projMargin)}</span>
                  {a.reasons.map((r) => (
                    <span key={r} className="px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(185,28,28,0.1)", color: "#B91C1C" }}>{r}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Projections */}
      <Card title={`Future usage projections (${projections.length} active subscriptions)`}>
        <p className="text-[11px] mb-3" style={{ color: "rgba(51,51,51,0.45)" }}>Projection — extrapolates current usage to the end of each subscription.</p>
        {projections.length === 0 ? (
          <p className="text-[13px]" style={{ color: "rgba(51,51,51,0.4)" }}>No active subscriptions.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="w-full text-[12.5px]" style={{ color: NAVY, borderCollapse: "collapse", minWidth: 640 }}>
              <thead>
                <tr style={{ color: "rgba(51,51,51,0.45)" }} className="text-[10.5px] uppercase tracking-[0.05em]">
                  <th className="text-left font-bold pb-2">Customer</th>
                  <th className="text-right font-bold pb-2">Days left</th>
                  <th className="text-right font-bold pb-2">AI now→proj</th>
                  <th className="text-right font-bold pb-2">GP now→proj</th>
                  <th className="text-right font-bold pb-2">Proj cost</th>
                  <th className="text-right font-bold pb-2">Proj profit</th>
                  <th className="text-right font-bold pb-2">Proj margin</th>
                </tr>
              </thead>
              <tbody>
                {projections.sort((a, b) => (a.projMargin ?? 1) - (b.projMargin ?? 1)).map((p) => (
                  <tr key={p.customer.userId} style={{ borderTop: "1px solid rgba(51,51,51,0.06)" }}>
                    <td className="py-2"><Link href={`/admin/economics/customers/${p.customer.userId}`} className="no-underline" style={{ color: NAVY }}>{p.customer.email || p.customer.userId.slice(0, 8)}</Link></td>
                    <td className="py-2 text-right" style={{ fontVariantNumeric: "tabular-nums" }}>{Math.round(p.daysRemaining)}</td>
                    <td className="py-2 text-right" style={{ fontVariantNumeric: "tabular-nums" }}>{p.customer.aiConsultations} → {Math.round(p.projAi)}</td>
                    <td className="py-2 text-right" style={{ fontVariantNumeric: "tabular-nums" }}>{p.customer.gpReviews} → {Math.round(p.projGp)}</td>
                    <td className="py-2 text-right" style={{ fontVariantNumeric: "tabular-nums" }}>{gbp(p.projCost)}</td>
                    <td className="py-2 text-right" style={{ fontVariantNumeric: "tabular-nums", color: p.projProfit < 0 ? "#B91C1C" : NAVY }}>{gbp(p.projProfit)}</td>
                    <td className="py-2 text-right" style={{ fontVariantNumeric: "tabular-nums" }}>{p.projMargin === null ? "—" : pct(p.projMargin)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pricing configuration */}
      {pricing && <PricingEditor pricing={pricing} />}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white mb-4" style={{ border: "1px solid rgba(51,51,51,0.1)" }}>
      <div className="px-5 py-3.5" style={{ borderBottom: "1px solid rgba(51,51,51,0.08)" }}>
        <h2 className="font-display font-bold text-[15px]" style={{ color: NAVY }}>{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5" style={{ borderBottom: "1px solid rgba(51,51,51,0.04)" }}>
      <div className="flex flex-col">
        <span className="text-[12px]" style={{ color: "rgba(51,51,51,0.55)" }}>{label}</span>
        {sub && <span className="text-[10px]" style={{ color: "rgba(51,51,51,0.4)" }}>{sub}</span>}
      </div>
      <span className="text-[14px] font-bold" style={{ color: NAVY, fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}
