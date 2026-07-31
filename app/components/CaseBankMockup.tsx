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
          {["Study Room", "Star", "Feedback"].map((label) => (
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
            { label: "Example Explanation", active: false },
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
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(26,27,82,0.45)" }}>Pre-read</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: NAVY, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>2:00</div>
            <div
              className="rounded-lg text-center"
              style={{
                background: NAVY,
                color: "white",
                fontSize: 11,
                fontWeight: 600,
                padding: "6px 20px",
                width: "100%",
              }}
            >
              Start
            </div>
            <div style={{ fontSize: 10, color: "rgba(26,27,82,0.35)", textAlign: "center" }}>Skip to consult →</div>
          </div>

          <div
            className="rounded-xl p-3"
            style={{ background: "white", border: "1px solid rgba(31,41,55,0.09)" }}
          >
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(26,27,82,0.45)", marginBottom: 8 }}>Study Room</div>
            <div style={{ fontSize: 11, color: "rgba(26,27,82,0.50)", lineHeight: 1.5 }}>Practise with others in real time.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
