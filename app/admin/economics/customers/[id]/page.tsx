import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createEconLogger } from "@/lib/econ-logger";
import { loadCustomerProfiles } from "@/lib/economics-data";

export const dynamic = "force-dynamic";

const NAVY = "#333333";
const gbp = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
const pct = (n: number | null) => (n === null ? "—" : `${(n * 100).toFixed(1)}%`);
const num = (v: unknown) => (v == null ? 0 : Number(v));

type ConsultRow = {
  recording_id: string;
  created_at: string;
  gp_reviewed: boolean;
  deepgram_cost_gbp: number | string;
  claude_cost_gbp: number | string;
  daily_cost_gbp: number | string | null;
  gp_cost_gbp: number | string;
  total_cost_gbp: number | string;
  station_recordings: { station_number: number; station_title: string; started_at: string } | null;
};

export default async function CustomerDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ debug?: string }>;
}) {
  const { id } = await params;
  const { debug } = await searchParams;
  const logger = createEconLogger(debug === "1");

  const admin = getSupabaseAdmin();
  if (!admin) return <p style={{ color: NAVY }}>Database not available.</p>;

  const [profiles, consultRes] = await Promise.all([
    loadCustomerProfiles(admin, logger),
    admin
      .from("consultation_costs")
      .select("recording_id, created_at, gp_reviewed, deepgram_cost_gbp, claude_cost_gbp, daily_cost_gbp, gp_cost_gbp, total_cost_gbp, station_recordings(station_number, station_title, started_at)")
      .eq("doctor_user_id", id)
      .order("created_at", { ascending: false }),
  ]);
  if (consultRes.error) logger.error("customer-detail", consultRes.error, { id });

  const customer = profiles.find((p) => p.userId === id);
  const consults = (consultRes.data ?? []) as unknown as ConsultRow[];
  logger.log("customer-detail", "loaded", { id, found: !!customer, consultations: consults.length });

  if (!customer) {
    return (
      <div>
        <Link href="/admin/economics/customers" className="text-[13px] no-underline" style={{ color: "rgba(51,51,51,0.5)" }}>← Customers</Link>
        <p className="mt-4 text-[14px]" style={{ color: NAVY }}>No paying customer found for this account.</p>
      </div>
    );
  }

  const summary = [
    { label: "Revenue", value: gbp(customer.revenue) },
    { label: "Consultations", value: String(customer.aiConsultations) },
    { label: "AI reviews", value: String(customer.aiConsultations - customer.gpReviews) },
    { label: "GP reviews", value: String(customer.gpReviews) },
  ];
  const costs = [
    { label: "Deepgram", value: gbp(customer.deepgram) },
    { label: "Claude", value: gbp(customer.claude) },
    { label: "Daily", value: gbp(customer.daily) },
    { label: "GP", value: gbp(customer.gp) },
    { label: "Stripe", value: gbp(customer.stripeFee) },
    { label: "Total cost", value: gbp(customer.totalCost) },
    { label: "Gross profit", value: gbp(customer.grossProfit) },
    { label: "Gross margin", value: pct(customer.margin) },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display font-extrabold text-[22px]" style={{ color: NAVY }}>{customer.email || customer.userId}</h1>
          <p className="text-[12px] mt-1" style={{ color: "rgba(51,51,51,0.5)" }}>
            {customer.hasCaseBank && customer.caseBankExpiresAt
              ? `Programme access until ${new Date(customer.caseBankExpiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
              : "No active programme access"}
          </p>
        </div>
        <Link href={`/admin/economics/customers${debug === "1" ? "?debug=1" : ""}`} className="text-[13px] no-underline" style={{ color: "rgba(51,51,51,0.5)" }}>← Customers</Link>
      </div>

      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
        {summary.map((s) => (
          <div key={s.label} className="rounded-2xl p-4 bg-white" style={{ border: "1px solid rgba(51,51,51,0.1)" }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.05em] mb-1.5" style={{ color: "rgba(51,51,51,0.45)" }}>{s.label}</div>
            <div className="font-display font-extrabold text-[20px]" style={{ color: NAVY }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white mb-5" style={{ border: "1px solid rgba(51,51,51,0.1)" }}>
        <div className="px-5 py-3.5" style={{ borderBottom: "1px solid rgba(51,51,51,0.08)" }}>
          <h2 className="font-display font-bold text-[15px]" style={{ color: NAVY }}>Cost & profit</h2>
        </div>
        <div className="p-5 grid gap-x-8 gap-y-1.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
          {costs.map((c) => (
            <div key={c.label} className="flex items-center justify-between py-1" style={{ borderBottom: "1px solid rgba(51,51,51,0.05)" }}>
              <span className="text-[12px]" style={{ color: "rgba(51,51,51,0.55)" }}>{c.label}</span>
              <span className="text-[13px] font-bold" style={{ color: NAVY, fontVariantNumeric: "tabular-nums" }}>{c.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white" style={{ border: "1px solid rgba(51,51,51,0.1)" }}>
        <div className="px-5 py-3.5" style={{ borderBottom: "1px solid rgba(51,51,51,0.08)" }}>
          <h2 className="font-display font-bold text-[15px]" style={{ color: NAVY }}>Consultations ({consults.length})</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="w-full text-[12.5px]" style={{ color: NAVY, borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
              <tr style={{ color: "rgba(51,51,51,0.5)" }} className="text-[10.5px] uppercase tracking-[0.04em]">
                <th className="text-left font-bold px-4 py-2.5">Date</th>
                <th className="text-left font-bold px-4 py-2.5">Station</th>
                <th className="text-left font-bold px-4 py-2.5">Type</th>
                <th className="text-right font-bold px-4 py-2.5">Deepgram</th>
                <th className="text-right font-bold px-4 py-2.5">Claude</th>
                <th className="text-right font-bold px-4 py-2.5">Daily</th>
                <th className="text-right font-bold px-4 py-2.5">GP</th>
                <th className="text-right font-bold px-4 py-2.5">Total</th>
              </tr>
            </thead>
            <tbody>
              {consults.map((c) => (
                <tr key={c.recording_id} style={{ borderTop: "1px solid rgba(51,51,51,0.06)" }}>
                  <td className="px-4 py-2" style={{ whiteSpace: "nowrap" }}>{new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })}</td>
                  <td className="px-4 py-2">{c.station_recordings ? `${c.station_recordings.station_number}. ${c.station_recordings.station_title}` : "—"}</td>
                  <td className="px-4 py-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={c.gp_reviewed ? { background: "rgba(34,197,94,0.1)", color: "#166534" } : { background: "rgba(59,130,246,0.1)", color: "#1D4ED8" }}>
                      {c.gp_reviewed ? "GP" : "AI"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right" style={{ fontVariantNumeric: "tabular-nums", color: "rgba(51,51,51,0.6)" }}>{gbp(num(c.deepgram_cost_gbp))}</td>
                  <td className="px-4 py-2 text-right" style={{ fontVariantNumeric: "tabular-nums", color: "rgba(51,51,51,0.6)" }}>{gbp(num(c.claude_cost_gbp))}</td>
                  <td className="px-4 py-2 text-right" style={{ fontVariantNumeric: "tabular-nums", color: "rgba(51,51,51,0.6)" }}>{gbp(num(c.daily_cost_gbp))}</td>
                  <td className="px-4 py-2 text-right" style={{ fontVariantNumeric: "tabular-nums", color: "rgba(51,51,51,0.6)" }}>{gbp(num(c.gp_cost_gbp))}</td>
                  <td className="px-4 py-2 text-right font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>{gbp(num(c.total_cost_gbp))}</td>
                </tr>
              ))}
              {consults.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-[13px]" style={{ color: "rgba(51,51,51,0.4)" }}>No consultations yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
