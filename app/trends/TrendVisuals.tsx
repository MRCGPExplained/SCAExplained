/**
 * The drawings. All server-rendered inline SVG — there is no chart library in
 * this project and none of this needs to be interactive, so none of it is a
 * client component. Hover text is a plain <title>, which works without JS.
 *
 * Deliberately plain: this dashboard's own code says its status lines should be
 * "findable without being shouted", and a page of bright chart furniture would
 * be a different product. Everything here is grey until it means something.
 */

import {
  DOMAIN_POINTS,
  GRADE_LABEL,
  type DomainPoint,
  type StationRun,
} from "./aggregate";
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

/* ── One domain, attempt by attempt ──────────────────────────────────────── */

/**
 * Dots, not a line.
 *
 * There are four grades, so joining them produces a zigzag between whole
 * numbers that looks like violent swings in ability and is mostly the luck of
 * which case came up. The dots say what happened; the eye can find the drift
 * without being sold one.
 */
export function DomainDots({ points, domain }: { points: DomainPoint[]; domain: DomainKey }) {
  if (points.length === 0) {
    return <p className="text-[12px]" style={{ color: FAINT }}>Not graded yet</p>;
  }

  const W = 300;
  const H = 76;
  const padL = 26;
  const padR = 6;
  const padY = 10;
  const span = Math.max(1, points.length - 1);
  const rowFor = (g: Grade) => padY + (3 - GRADE_ORDER.indexOf(g)) * ((H - padY * 2) / 3);
  const xFor = (i: number) => padL + (i / span) * (W - padL - padR);

  // Between Fail and Pass: the only line on this chart that is a fact rather
  // than an inference.
  const passY = (rowFor("P") + rowFor("F")) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`${domain} by attempt`}>
      {GRADE_ORDER.map((g) => (
        <g key={g}>
          <line x1={padL} y1={rowFor(g)} x2={W - padR} y2={rowFor(g)} stroke={RULE} strokeWidth="1" />
          <text x={0} y={rowFor(g) + 3} fontSize="8" fill={FAINT}>{g}</text>
        </g>
      ))}
      <line
        x1={padL} y1={passY} x2={W - padR} y2={passY}
        stroke="rgba(22,101,52,0.45)" strokeWidth="1" strokeDasharray="3 3"
      />
      {points.map((p, i) => (
        <circle
          key={`${p.n}-${i}`}
          cx={xFor(i)}
          cy={rowFor(p.grade)}
          r={p.gpReviewed ? 4.5 : 3.5}
          fill={p.gpReviewed ? "white" : GRADE_COLOUR[p.grade]}
          stroke={GRADE_COLOUR[p.grade]}
          strokeWidth={p.gpReviewed ? 2 : 0}
        >
          <title>
            {`Attempt ${p.n} · Station ${p.stationNumber} · ${GRADE_LABEL[p.grade]}` +
              (p.gpReviewed ? " · GP reviewed" : "")}
          </title>
        </circle>
      ))}
    </svg>
  );
}

/* ── Skills, attempt by attempt ──────────────────────────────────────────── */

/**
 * This one does get a line, because the y axis is a percentage of however many
 * skills could be judged that time, which moves continuously rather than in
 * four steps. It is also the sensitive half of the page: the skill counts feed
 * the domain grades but can only move one by a single band, so real change
 * shows here weeks before it shows above.
 */
export function SkillCurve({
  points,
}: {
  points: { n: number; goodPct: number; assessed: number; gpReviewed: boolean }[];
}) {
  if (points.length === 0) {
    return <p className="text-[12px]" style={{ color: FAINT }}>Nothing assessable yet</p>;
  }

  const W = 300;
  const H = 86;
  const padL = 26;
  const padR = 6;
  const padY = 10;
  const span = Math.max(1, points.length - 1);
  const xFor = (i: number) => padL + (i / span) * (W - padL - padR);
  const yFor = (pct: number) => padY + (1 - pct / 100) * (H - padY * 2);

  const path = points.map((p, i) => `${i ? "L" : "M"}${xFor(i)},${yFor(p.goodPct)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Skills rated good, by attempt">
      {[0, 50, 100].map((pct) => (
        <g key={pct}>
          <line x1={padL} y1={yFor(pct)} x2={W - padR} y2={yFor(pct)} stroke={RULE} strokeWidth="1" />
          <text x={0} y={yFor(pct) + 3} fontSize="8" fill={FAINT}>{pct}%</text>
        </g>
      ))}
      {points.length > 2 && (
        <path d={path} fill="none" stroke="rgba(51,51,51,0.30)" strokeWidth="1.5" />
      )}
      {points.map((p, i) => (
        <circle
          key={`${p.n}-${i}`}
          cx={xFor(i)}
          cy={yFor(p.goodPct)}
          r={p.gpReviewed ? 4.5 : 3.5}
          fill={p.gpReviewed ? "white" : DARK}
          stroke={DARK}
          strokeWidth={p.gpReviewed ? 2 : 0}
        >
          <title>
            {`Attempt ${p.n} · ${Math.round(p.goodPct)}% of ${p.assessed} judged` +
              (p.gpReviewed ? " · GP reviewed" : "")}
          </title>
        </circle>
      ))}
    </svg>
  );
}

/* ── The same station, more than once ────────────────────────────────────── */

export function StationRunRow({ run }: { run: StationRun }) {
  const scored = run.points.filter((p) => p.total !== null);
  return (
    <div className="py-2.5" style={{ borderTop: `1px solid ${RULE}` }}>
      <p className="text-[12.5px] font-semibold" style={{ color: DARK }}>
        {run.stationNumber}. {run.stationTitle}
      </p>
      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
        {scored.length === 0 ? (
          <span className="text-[11.5px]" style={{ color: FAINT }}>No complete grades yet</span>
        ) : (
          scored.map((p, i) => (
            <span key={`${p.n}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-[11px]" style={{ color: FAINT }}>→</span>}
              <span
                className="text-[11.5px] font-bold px-1.5 py-0.5 rounded"
                title={`Attempt ${p.n}${p.gpReviewed ? " · GP reviewed" : ""}`}
                style={{
                  background: "rgba(51,51,51,0.05)",
                  color: DARK,
                  border: p.gpReviewed ? "1px solid rgba(51,51,51,0.3)" : "1px solid transparent",
                }}
              >
                {p.total}
              </span>
            </span>
          ))
        )}
        <span className="text-[11px] ml-1" style={{ color: FAINT }}>out of 10.5</span>
      </div>
    </div>
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
