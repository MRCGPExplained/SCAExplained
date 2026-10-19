const NAVY = "#1F2937";
const YELLOW = "#F6D44B";
const LIGHT_BG = "#F3F2FB";

export function CaseBankMockup() {
  return (
    <div
      className="rounded-xl overflow-hidden select-none pointer-events-none"
      style={{
        border: "1px solid rgba(31,41,55,0.13)",
        boxShadow: "0 8px 32px rgba(31,41,55,0.12)",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 12,
        background: "white",
      }}
    >
      {/* Top nav */}
      <div
        className="flex items-center justify-between px-4 py-2.5 gap-3"
        style={{ background: NAVY }}
      >
        <div className="flex items-center gap-3">
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>← Case Bank</span>
          <span style={{ color: "rgba(255,255,255,0.18)" }}>|</span>
          <span
            className="rounded"
            style={{
              border: "1.5px solid rgba(255,255,255,0.22)",
              color: "rgba(255,255,255,0.65)",
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 9px",
            }}
          >
            Station 14 / 246
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {["Study Group", "Star", "Feedback"].map((label) => (
            <span
              key={label}
              className="rounded"
              style={{
                border: "1.5px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.50)",
                fontSize: 10,
                padding: "2px 8px",
              }}
            >
              {label}
            </span>
          ))}
          <span
            style={{
              background: "rgba(255,255,255,0.10)",
              color: "rgba(255,255,255,0.55)",
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 4,
              marginLeft: 4,
            }}
          >
            ← Prev
          </span>
          <span
            style={{
              background: "rgba(255,255,255,0.10)",
              color: "rgba(255,255,255,0.55)",
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 4,
            }}
          >
            Next →
          </span>
        </div>
      </div>

      {/* Tab strip */}
      <div style={{ background: "white", borderBottom: "1px solid rgba(31,41,55,0.09)" }}>
        <div className="flex px-4">
          {[
            { label: "Doctor's Brief", active: true },
            { label: "Patient's Story", active: false },
            { label: "Data Gathering", active: false },
            { label: "Management", active: false },
            { label: "Example Conversation", active: false },
          ].map(({ label, active }) => (
            <div
              key={label}
              style={{
                padding: "9px 14px",
                fontSize: 11,
                fontWeight: active ? 600 : 400,
                color: active ? NAVY : "rgba(31,41,55,0.38)",
                borderBottom: active ? `2px solid ${YELLOW}` : "2px solid transparent",
                marginBottom: -1,
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Content grid */}
      <div className="grid gap-4 p-4" style={{ gridTemplateColumns: "1fr 160px", background: "#F7F7F5" }}>
        {/* Main content */}
        <div className="rounded-xl bg-white p-4 flex flex-col gap-3.5" style={{ border: "1px solid rgba(31,41,55,0.09)" }}>
          {/* Patient + Type */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(26,27,82,0.45)", marginBottom: 3 }}>Patient</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Sarah Okonkwo</div>
              <div style={{ fontSize: 11, color: "rgba(26,27,82,0.60)" }}>38 years old</div>
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(26,27,82,0.45)", marginBottom: 3 }}>Type</div>
              <div style={{ fontSize: 11, color: "rgba(26,27,82,0.70)" }}>Standard</div>
            </div>
          </div>

          {/* PMH */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(26,27,82,0.45)", marginBottom: 6 }}>Past Medical History</div>
            <div className="flex flex-col gap-1.5">
              {["Hypothyroidism — on Levothyroxine", "Anxiety — not on medication"].map((item) => (
                <div key={item} className="flex gap-2.5 items-start">
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(31,41,55,0.22)", flexShrink: 0, marginTop: 4 }} />
                  <span style={{ fontSize: 11.5, color: "rgba(26,27,82,0.75)", lineHeight: 1.55 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Drug history */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(26,27,82,0.45)", marginBottom: 6 }}>Drug &amp; Allergy History</div>
            <div className="flex gap-2.5 items-start">
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(31,41,55,0.22)", flexShrink: 0, marginTop: 4 }} />
              <span style={{ fontSize: 11.5, color: "rgba(26,27,82,0.75)", lineHeight: 1.55 }}>Levothyroxine 75mcg daily — NKDA</span>
            </div>
          </div>

          {/* Reason */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(26,27,82,0.45)", marginBottom: 6 }}>Reason for Consultation</div>
            <p style={{ fontSize: 11.5, lineHeight: 1.6, color: "rgba(26,27,82,0.80)", margin: 0 }}>
              Patient has booked to discuss persistent fatigue and weight gain over the past three months despite compliance with medication.
            </p>
          </div>
        </div>

        {/* Timer sidebar */}
        <div className="flex flex-col gap-3">
          <div
            className="rounded-xl p-3 flex flex-col items-center gap-2"
            style={{ background: "white", border: "1px solid rgba(31,41,55,0.09)" }}
          >
            {/*
              Mid-consultation, not waiting to start. The card underneath
              shows four people and a recording light, so a pre-read clock
              with a Start button under it was the panel contradicting
              itself — the one state this timer must not be in is the one
              where nothing has happened yet.
            */}
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(26,27,82,0.45)" }}>Consultation</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: NAVY, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>08:14</div>
            {/* Remaining, out of the twelve minutes the exam allows. */}
            <div className="rounded-full overflow-hidden" style={{ height: 3, width: "100%", background: "rgba(31,41,55,0.10)" }}>
              <div style={{ width: "69%", height: "100%", background: NAVY, borderRadius: 999 }} />
            </div>
            <div
              className="rounded-lg text-center"
              style={{
                background: "#DC2626",
                color: "white",
                fontSize: 11,
                fontWeight: 600,
                padding: "6px 20px",
                width: "100%",
              }}
            >
              Stop
            </div>
            <div style={{ fontSize: 10, color: "rgba(26,27,82,0.35)", textAlign: "center" }}>Stops itself at 12:00</div>
          </div>

          {/*
            The group, mid-consultation, rather than a sentence saying one
            exists. "Practise with others in real time" asked the reader to
            take the live part on trust; four names and a recording light
            show it. This is the only place the group feature appears on the
            homepage now that its own band has gone, so it is worth the room.
          */}
          <div
            className="rounded-xl p-3"
            style={{ background: "white", border: "1px solid rgba(31,41,55,0.09)" }}
          >
            <style>{`
              @keyframes cb-rec-pulse {
                0%, 100% { opacity: 1;    transform: scale(1); }
                50%      { opacity: 0.35; transform: scale(0.78); }
              }
              @media (prefers-reduced-motion: reduce) {
                .cb-rec-dot { animation: none !important; }
              }
            `}</style>

            <div className="flex items-center gap-1.5" style={{ marginBottom: 9 }}>
              <span
                className="cb-rec-dot"
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#ef4444",
                  display: "inline-block",
                  animation: "cb-rec-pulse 1.25s ease-in-out infinite",
                }}
              />
              <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#ef4444" }}>
                Recording
              </span>
            </div>

            <div className="flex flex-col gap-[7px]">
              {(
                [
                  ["KS", "Kate Snow", "Doctor"],
                  ["OH", "Olivia Hartley", "Patient"],
                  ["TB", "Tom Bradshaw", "Observer"],
                  ["DA", "Daniel Ashworth", "Observer"],
                ] as const
              ).map(([initials, name, role]) => (
                <div key={name} className="flex items-center gap-1.5">
                  <span
                    className="shrink-0 flex items-center justify-center rounded-full"
                    style={{
                      width: 17,
                      height: 17,
                      // The doctor is the one being marked, so they carry the
                      // accent and everyone else recedes.
                      background: role === "Doctor" ? YELLOW : LIGHT_BG,
                      color: NAVY,
                      fontSize: 7.5,
                      fontWeight: 700,
                    }}
                  >
                    {initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate" style={{ fontSize: 9.5, fontWeight: 700, color: NAVY, lineHeight: 1.25 }}>
                      {name}
                    </span>
                    <span className="block" style={{ fontSize: 8, color: "rgba(26,27,82,0.45)", lineHeight: 1.25 }}>
                      {role}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
