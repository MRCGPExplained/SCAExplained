"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CustomerProfile } from "@/lib/economics-data";
import { createEconLogger } from "@/lib/econ-logger";

const NAVY = "#333333";
const gbp = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
const pct = (n: number | null) => (n === null ? "—" : `${(n * 100).toFixed(1)}%`);

type SortKey =
  | "email" | "planType" | "revenue" | "aiConsultations" | "gpReviews"
  | "deepgram" | "claude" | "daily" | "gp" | "stripeFee" | "totalCost" | "grossProfit" | "margin";

const COLUMNS: { key: SortKey; label: string; numeric: boolean }[] = [
  { key: "email", label: "Customer", numeric: false },
  { key: "planType", label: "Plan", numeric: false },
  { key: "revenue", label: "Revenue", numeric: true },
  { key: "aiConsultations", label: "AI", numeric: true },
  { key: "gpReviews", label: "GP", numeric: true },
  { key: "deepgram", label: "Deepgram", numeric: true },
  { key: "claude", label: "Claude", numeric: true },
  { key: "daily", label: "Daily", numeric: true },
  { key: "gp", label: "GP £", numeric: true },
  { key: "stripeFee", label: "Stripe", numeric: true },
  { key: "totalCost", label: "Total cost", numeric: true },
  { key: "grossProfit", label: "Profit", numeric: true },
  { key: "margin", label: "Margin", numeric: true },
];

const PLAN_LABEL: Record<string, string> = {
  case_bank_programme: "Complete (£295)",
  programme: "90-Day",
  recording_credits: "Credits",
};

export default function CustomerTable({ customers, debug }: { customers: CustomerProfile[]; debug: boolean }) {
  const router = useRouter();
  const logger = useMemo(() => createEconLogger(debug), [debug]);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [asc, setAsc] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? customers.filter((c) => c.email.toLowerCase().includes(q) || c.userId.toLowerCase().includes(q)) : customers;
    const sorted = [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" || typeof bv === "string") {
        return String(av ?? "").localeCompare(String(bv ?? "")) * (asc ? 1 : -1);
      }
      return ((Number(av ?? 0)) - (Number(bv ?? 0))) * (asc ? 1 : -1);
    });
    logger.log("customer-table", "rendered rows", { query: q, count: sorted.length, sortKey, asc });
    return sorted;
  }, [customers, query, sortKey, asc, logger]);

  function setSort(key: SortKey) {
    if (key === sortKey) setAsc((v) => !v);
    else { setSortKey(key); setAsc(false); }
  }

  return (
    <div className="rounded-2xl bg-white" style={{ border: "1px solid rgba(51,51,51,0.1)" }}>
      <div className="px-5 py-3.5 flex items-center justify-between gap-3 flex-wrap" style={{ borderBottom: "1px solid rgba(51,51,51,0.08)" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by email…"
          className="rounded-lg px-3 py-2 text-[13px]"
          style={{ border: "1px solid rgba(51,51,51,0.15)", background: "#FAFAF8", color: NAVY, minWidth: 240 }}
        />
        <span className="text-[12px]" style={{ color: "rgba(51,51,51,0.45)" }}>{rows.length} customer{rows.length === 1 ? "" : "s"}</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="w-full text-[12.5px]" style={{ color: NAVY, borderCollapse: "collapse", minWidth: 900 }}>
          <thead>
            <tr style={{ color: "rgba(51,51,51,0.5)" }} className="text-[10.5px] uppercase tracking-[0.04em]">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => setSort(col.key)}
                  className={`${col.numeric ? "text-right" : "text-left"} font-bold px-3 py-2.5`}
                  style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  {col.label}{sortKey === col.key ? (asc ? " ▲" : " ▼") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr
                key={c.userId}
                onClick={() => router.push(`/admin/economics/customers/${c.userId}${debug ? "?debug=1" : ""}`)}
                className="transition hover:bg-[rgba(246,212,75,0.08)]"
                style={{ borderTop: "1px solid rgba(51,51,51,0.06)", cursor: "pointer" }}
              >
                <td className="px-3 py-2 font-semibold" style={{ whiteSpace: "nowrap" }}>{c.email || c.userId.slice(0, 8)}</td>
                <td className="px-3 py-2" style={{ color: "rgba(51,51,51,0.55)", whiteSpace: "nowrap" }}>{c.planType ? PLAN_LABEL[c.planType] ?? c.planType : "—"}</td>
                <td className="px-3 py-2 text-right" style={{ fontVariantNumeric: "tabular-nums" }}>{gbp(c.revenue)}</td>
                <td className="px-3 py-2 text-right" style={{ fontVariantNumeric: "tabular-nums" }}>{c.aiConsultations}</td>
                <td className="px-3 py-2 text-right" style={{ fontVariantNumeric: "tabular-nums" }}>{c.gpReviews}</td>
                <td className="px-3 py-2 text-right" style={{ fontVariantNumeric: "tabular-nums", color: "rgba(51,51,51,0.6)" }}>{gbp(c.deepgram)}</td>
                <td className="px-3 py-2 text-right" style={{ fontVariantNumeric: "tabular-nums", color: "rgba(51,51,51,0.6)" }}>{gbp(c.claude)}</td>
                <td className="px-3 py-2 text-right" style={{ fontVariantNumeric: "tabular-nums", color: "rgba(51,51,51,0.6)" }}>{gbp(c.daily)}</td>
                <td className="px-3 py-2 text-right" style={{ fontVariantNumeric: "tabular-nums", color: "rgba(51,51,51,0.6)" }}>{gbp(c.gp)}</td>
                <td className="px-3 py-2 text-right" style={{ fontVariantNumeric: "tabular-nums", color: "rgba(51,51,51,0.6)" }}>{gbp(c.stripeFee)}</td>
                <td className="px-3 py-2 text-right font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>{gbp(c.totalCost)}</td>
                <td className="px-3 py-2 text-right font-semibold" style={{ fontVariantNumeric: "tabular-nums", color: c.grossProfit < 0 ? "#B91C1C" : "#166534" }}>{gbp(c.grossProfit)}</td>
                <td className="px-3 py-2 text-right" style={{ fontVariantNumeric: "tabular-nums" }}>{pct(c.margin)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={COLUMNS.length} className="px-3 py-8 text-center text-[13px]" style={{ color: "rgba(51,51,51,0.4)" }}>No customers.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
