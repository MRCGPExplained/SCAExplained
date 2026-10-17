const DARK = "#1F2937";
const YELLOW = "#F6D44B";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="rounded font-bold"
      style={{ background: "rgba(34,197,94,0.12)", color: "#166534", fontSize: 9.5, padding: "2px 7px" }}
    >
      {children}
    </span>
  );
}

/**
 * The examiner's half of a report: the written summary, the voice note, and a
 * domain comment. Deliberately not the score card — the hero already shows
 * that, and a number is the part an algorithm could have produced. What this
 * panel is for is the part that visibly came from a person who watched the
 * consultation, which is the thing being sold.
 *
 * Live markup rather than a screenshot, like the other panels on this page.
 */
export function ExaminerFeedbackMockup() {
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
      <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: DARK }}>
        <span className="font-bold uppercase" style={{ fontSize: 9.5, letterSpacing: "0.08em", color: "white" }}>
          Examiner&apos;s report
        </span>
        <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.45)" }}>Marked by Dr P. Hargreaves</span>
      </div>

      <div className="px-4 py-3.5">
        <div className="font-bold uppercase mb-1.5" style={{ fontSize: 9, letterSpacing: "0.08em", color: "rgba(31,41,55,0.4)" }}>
          Overall summary
        </div>
        <p style={{ fontSize: 11.5, lineHeight: 1.6, color: "rgba(31,41,55,0.8)" }}>
          A solid consultation with good clinical instincts. The step-up to a combination inhaler was
          appropriate and clearly explained. Where marks were lost was in the detail — inhaler
          technique was mentioned but not properly assessed, so I was left unsure whether you knew
          what specifically to correct.
        </p>

        {/* Voice note */}
        <div
          className="rounded-lg mt-3 px-3 py-2.5 flex items-center gap-2.5"
          style={{ background: "#F4F4F2", border: "1px solid rgba(31,41,55,0.08)" }}
        >
          <span
            className="shrink-0 flex items-center justify-center rounded-full"
            style={{ width: 24, height: 24, background: DARK }}
          >
            <svg width="9" height="9" viewBox="0 0 10 12" fill="white" aria-hidden="true">
              <path d="M0 0l10 6-10 6z" />
            </svg>
          </span>
          <span className="flex-1 min-w-0">
            <span className="block font-semibold" style={{ fontSize: 10, color: "rgba(31,41,55,0.75)" }}>Voice note</span>
            <span className="block rounded-full mt-1" style={{ height: 3, background: "rgba(31,41,55,0.13)" }}>
              <span className="block rounded-full" style={{ height: 3, width: "38%", background: YELLOW }} />
            </span>
          </span>
          <span style={{ fontSize: 9.5, color: "rgba(31,41,55,0.4)", fontVariantNumeric: "tabular-nums" }}>1:42</span>
        </div>

        {/* One domain */}
        <div className="mt-3.5 pt-3" style={{ borderTop: "1px solid rgba(31,41,55,0.08)" }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-extrabold" style={{ fontSize: 11.5, color: DARK }}>Relating to Others</span>
            <Chip>Pass</Chip>
          </div>
          <p style={{ fontSize: 11, lineHeight: 1.55, color: "rgba(31,41,55,0.6)" }}>
            You picked up the steroid concern and addressed it clearly — she was visibly reassured.
            When she said she missed yoga, that was a motivating goal you moved past too quickly.
          </p>
        </div>
      </div>
    </div>
  );
}
