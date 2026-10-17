const NAVY = "#1F2937";
const YELLOW = "#F6D44B";

/**
 * Bars that rise and fall on a stagger, the way a level meter does while
 * something is being said. Pure CSS — no canvas, no audio, no asset — and the
 * delays are spread across the row so they never move as one block, which is
 * what makes it read as sound rather than as a loading spinner.
 */
function Waveform({ bars = 14, color = YELLOW }: { bars?: number; color?: string }) {
  return (
    <span className="flex items-end gap-[2px]" style={{ height: 14 }} aria-hidden="true">
      <style>{`
        @keyframes sr-wave {
          0%, 100% { transform: scaleY(0.25); }
          50%      { transform: scaleY(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sr-wave-bar { animation: none !important; transform: scaleY(0.5); }
        }
      `}</style>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="sr-wave-bar"
          style={{
            display: "block",
            width: 2,
            height: 14,
            borderRadius: 1,
            background: color,
            transformOrigin: "bottom",
            // Irrational-ish spacing so the row never falls into a visible
            // repeating pattern the eye can lock onto.
            animation: `sr-wave ${0.7 + ((i * 7) % 5) * 0.12}s ease-in-out ${(i * 0.09).toFixed(2)}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

function Person({ initials, name, role, speaking }: { initials: string; name: string; role: string; speaking?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="shrink-0 flex items-center justify-center rounded-full font-bold"
        style={{ width: 28, height: 28, background: speaking ? YELLOW : "rgba(31,41,55,0.08)", color: NAVY, fontSize: 10.5 }}
      >
        {initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold truncate" style={{ fontSize: 11.5, color: NAVY }}>{name}</span>
        <span className="block" style={{ fontSize: 10, color: "rgba(31,41,55,0.45)" }}>{role}</span>
      </span>
      {speaking && <Waveform bars={7} color="rgba(31,41,55,0.35)" />}
    </div>
  );
}

/**
 * A still of the study room mid-consultation, built the way the hero's report
 * preview is: real markup at a small scale rather than a screenshot, so it
 * stays sharp at any size and cannot drift out of date into a picture of a
 * product that no longer looks like this.
 */
export function StudyRoomMockup() {
  return (
    <div
      className="rounded-xl overflow-hidden select-none pointer-events-none"
      style={{
        border: "1px solid rgba(31,41,55,0.13)",
        boxShadow: "0 8px 32px rgba(31,41,55,0.12)",
        fontFamily: "Inter, system-ui, sans-serif",
        background: "white",
      }}
    >
      {/* Panel header, recording */}
      <div className="px-3.5 py-3 flex items-center justify-between gap-3" style={{ background: NAVY }}>
        <span>
          <span className="block font-bold uppercase" style={{ fontSize: 10.5, letterSpacing: "0.08em", color: "white" }}>
            Study Room
          </span>
          <span className="block" style={{ fontSize: 9.5, color: "rgba(255,255,255,0.4)" }}>Station 42 · Chest pain</span>
        </span>
        <span className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5" style={{ fontSize: 9.5, color: "#FCA5A5" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
            REC
          </span>
          <Waveform />
          <span className="rounded" style={{ background: "rgba(239,68,68,0.25)", color: "#FCA5A5", fontSize: 9.5, padding: "3px 7px" }}>
            Stop
          </span>
        </span>
      </div>

      <div className="px-3.5 py-3 flex flex-col gap-3">
        <Person initials="BT" name="You" role="Doctor" speaking />
        <div style={{ borderTop: "1px solid rgba(31,41,55,0.07)" }} />
        <Person initials="AO" name="Dr Amara Osei" role="Patient" />
      </div>

      {/* Consultation clock */}
      <div className="px-3.5 pb-3.5">
        <div className="rounded-xl px-4 py-3 text-center" style={{ background: "white", border: `2px solid ${NAVY}` }}>
          <div className="font-bold uppercase" style={{ fontSize: 9, letterSpacing: "0.1em", color: "rgba(31,41,55,0.4)" }}>
            Consultation
          </div>
          <div className="font-extrabold" style={{ fontSize: 26, color: NAVY, fontVariantNumeric: "tabular-nums", letterSpacing: "0.02em" }}>
            08:14
          </div>
          <div className="rounded-full overflow-hidden" style={{ height: 3, background: "rgba(31,41,55,0.08)", marginTop: 6 }}>
            <div style={{ width: "68%", height: "100%", background: NAVY, borderRadius: 999 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
