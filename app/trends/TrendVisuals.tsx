/**
 * The drawings. All server-rendered inline SVG — there is no chart library in
 * this project and none of this needs to be interactive, so none of it is a
 * client component. Hover text is a plain <title>, which works without JS.
 *
 * Deliberately plain: this dashboard's own code says its status lines should be
 * "findable without being shouted", and a page of bright chart furniture would
 * be a different product. Everything here is grey until it means something.
 */

import { DOMAIN_POINTS, GRADE_LABEL } from "./aggregate";
import { GRADE_ORDER, type Grade, type DomainKey } from "@/lib/skill-framework";

const DARK = "#333333";
const FAINT = "rgba(51,51,51,0.42)";
const RULE = "rgba(51,51,51,0.12)";

/** Worst to best, so a column of these reads as a progression. */
export const GRADE_COLOUR: Record<Grade, string> = {
  CF: "#B91C1C",
  F: "#C2410C",
  P: "#166534",
  CP: "#0F3D21",
};

/* ── The spread of grades in one domain ──────────────────────────────────── */

export function GradeSpread({
  counts,
  graded,
}: {
  counts: Record<Grade, number>;
  graded: number;
}) {
  if (!graded) {
    return <p className="text-[12px]" style={{ color: FAINT }}>Not graded yet</p>;
  }
  return (
    <>
      <div className="flex h-[10px] rounded-full overflow-hidden" style={{ background: "rgba(51,51,51,0.06)" }}>
        {GRADE_ORDER.map((g) =>
          counts[g] ? (
            <div
              key={g}
              title={`${GRADE_LABEL[g]}: ${counts[g]} of ${graded}`}
              style={{ width: `${(counts[g] / graded) * 100}%`, background: GRADE_COLOUR[g] }}
            />
          ) : null
        )}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        {GRADE_ORDER.map((g) =>
          counts[g] ? (
            <span key={g} className="text-[11px] flex items-center gap-1" style={{ color: FAINT }}>
              <span className="inline-block w-[7px] h-[7px] rounded-full" style={{ background: GRADE_COLOUR[g] }} />
              {GRADE_LABEL[g]} {counts[g]}
            </span>
          ) : null
        )}
      </div>
    </>
  );
}

/* ── The header primer ───────────────────────────────────────────────────── */

/**
 * The scoring model, stated before any of the numbers below it.
 *
 * It is here permanently rather than only as an empty state because it is the
 * most decision-relevant thing on the page and it is true on day one: two
 * Clear Passes elsewhere will not carry a Fail in Clinical Management, and
 * nobody works that out from a grade letter on a report.
 */
export function ScoringPrimer() {
  const rows: { domain: DomainKey; label: string }[] = [
    { domain: "data_gathering", label: "Data Gathering" },
    { domain: "clinical_management", label: "Clinical Management" },
    { domain: "relating_to_others", label: "Relating to Others" },
  ];
  return (
    <div className="flex flex-col gap-1.5">
      {rows.map(({ domain, label }) => (
        <div key={domain} className="flex items-center gap-2">
          <span className="text-[12px] w-[150px] shrink-0" style={{ color: DARK }}>{label}</span>
          <div className="flex-1 flex gap-[2px]">
            {GRADE_ORDER.map((g) => (
              <div
                key={g}
                title={`${GRADE_LABEL[g]} — ${DOMAIN_POINTS[domain][g]} points`}
                className="h-[6px] rounded-sm"
                style={{
                  width: `${(DOMAIN_POINTS[domain][g] / 4.5) * 100}%`,
                  background: GRADE_COLOUR[g],
                  opacity: 0.75,
                }}
              />
            ))}
          </div>
          <span className="text-[11px] w-[54px] text-right shrink-0" style={{ color: FAINT }}>
            max {DOMAIN_POINTS[domain].CP}
          </span>
        </div>
      ))}
    </div>
  );
}
