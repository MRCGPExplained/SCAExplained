// Lightweight inline-SVG charts (server-rendered, no external libraries).

const NAVY = "#333333";
const YELLOW = "#F6D44B";
const GRID = "rgba(51,51,51,0.08)";

export interface Point {
  label: string;
  value: number;
}

function niceMax(v: number): number {
  if (v <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / mag) * mag;
}

export function LineChart({
  points,
  format,
  height = 140,
  color = NAVY,
  allowNegative = false,
}: {
  points: Point[];
  format: (n: number) => string;
  height?: number;
  color?: string;
  allowNegative?: boolean;
}) {
  if (points.length === 0) {
    return <div className="text-[12px]" style={{ color: "rgba(51,51,51,0.4)" }}>No data.</div>;
  }
  const w = 600;
  const h = height;
  const padL = 8;
  const padR = 8;
  const padT = 10;
  const padB = 22;
  const values = points.map((p) => p.value);
  const rawMax = Math.max(...values, 0);
  const rawMin = allowNegative ? Math.min(...values, 0) : 0;
  const top = niceMax(rawMax);
  const bottom = allowNegative ? -niceMax(Math.abs(rawMin)) : 0;
  const range = top - bottom || 1;

  const x = (i: number) => padL + (i * (w - padL - padR)) / Math.max(1, points.length - 1);
  const y = (v: number) => padT + (h - padT - padB) * (1 - (v - bottom) / range);

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
  const zeroY = y(0);

  return (
    <div style={{ overflowX: "auto" }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="none" style={{ display: "block" }}>
        <line x1={padL} y1={zeroY} x2={w - padR} y2={zeroY} stroke={GRID} strokeWidth="1" />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle key={i} cx={x(i)} cy={y(p.value)} r="2.5" fill={color} />
        ))}
        {points.map((p, i) => (
          <text key={i} x={x(i)} y={h - 7} fontSize="9" fill="rgba(51,51,51,0.45)" textAnchor="middle">
            {p.label}
          </text>
        ))}
      </svg>
      <div className="flex justify-between text-[10px] mt-0.5" style={{ color: "rgba(51,51,51,0.4)" }}>
        <span>{format(bottom)}</span>
        <span>{format(top)}</span>
      </div>
    </div>
  );
}

export function BarChart({
  bars,
  format,
  color = YELLOW,
}: {
  bars: Point[];
  format: (n: number) => string;
  color?: string;
}) {
  if (bars.length === 0) {
    return <div className="text-[12px]" style={{ color: "rgba(51,51,51,0.4)" }}>No data.</div>;
  }
  const top = niceMax(Math.max(...bars.map((b) => b.value), 0));
  return (
    <div className="flex flex-col gap-1.5">
      {bars.map((b) => (
        <div key={b.label} className="flex items-center gap-2">
          <span className="text-[11px] w-[110px] shrink-0" style={{ color: "rgba(51,51,51,0.6)" }}>{b.label}</span>
          <div className="flex-1 h-[16px] rounded" style={{ background: "rgba(51,51,51,0.05)" }}>
            <div
              className="h-[16px] rounded"
              style={{ width: `${top > 0 ? (b.value / top) * 100 : 0}%`, background: color, minWidth: b.value > 0 ? 2 : 0 }}
            />
          </div>
          <span className="text-[11px] w-[80px] text-right shrink-0" style={{ color: NAVY, fontVariantNumeric: "tabular-nums" }}>
            {format(b.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
