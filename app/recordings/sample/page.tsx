import Link from "next/link";
import { SampleReportContent } from "@/app/components/SampleReportContent";

const NAVY = "#333333";

export default function SampleReportPage() {
  return (
    <div className="min-h-screen" style={{ background: "#F4F4F2" }}>
      <div className="max-w-[960px] mx-auto px-4 py-10">

        {/* Station header */}
        <div
          className="rounded-2xl px-5 py-4 mb-5 flex items-center justify-between gap-4"
          style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}
        >
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold shrink-0"
            style={{ border: "1px solid rgba(51,51,51,0.12)", color: "rgba(51,51,51,0.6)", textDecoration: "none" }}
          >
            ← Home
          </Link>

          <div className="flex flex-col items-center text-center min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] mb-0.5" style={{ color: "rgba(51,51,51,0.35)" }}>
              Station 7
            </span>
            <h1 className="font-bold text-[15px] leading-tight" style={{ color: NAVY }}>
              Asthma Review — Uncontrolled Symptoms in a 29-Year-Old
            </h1>
          </div>

          <div
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-bold shrink-0"
            style={{ background: "rgba(51,51,51,0.06)", color: "rgba(51,51,51,0.4)" }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 1.5L10.5 6L2.5 10.5V1.5Z" fill="currentColor" />
            </svg>
            Go to Station
          </div>
        </div>

        <SampleReportContent />

      </div>
    </div>
  );
}
