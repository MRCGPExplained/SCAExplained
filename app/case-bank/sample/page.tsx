"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const NAVY = "#1F2937";
const YELLOW = "#F6D44B";
const LIGHT_BG = "#F3F2FB";

type TabKey = "brief" | "story" | "data" | "management" | "explanation" | "takeaways";

const TABS: { key: TabKey; label: string }[] = [
  { key: "brief",       label: "Doctor's Brief" },
  { key: "story",       label: "Patient's Story" },
  { key: "data",        label: "Data Gathering" },
  { key: "management",  label: "Management" },
  { key: "explanation", label: "Example Explanation" },
  { key: "takeaways",   label: "Key Takeaways" },
];

// ── Shared "needs account" modal ──────────────────────────────────────────────

function AccountModal({ onClose, message }: { onClose: () => void; message: string }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-7 max-w-[320px] w-full text-center"
        style={{ background: "white", boxShadow: "0 12px 40px rgba(0,0,0,0.16)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display font-bold text-[17px] mb-2" style={{ color: NAVY }}>
          Available with an account
        </h2>
        <p className="text-[13px] mb-5" style={{ color: "rgba(31,41,55,0.55)" }}>
          {message}
        </p>
        <button
          onClick={onClose}
          className="font-semibold text-[14px] py-2.5 rounded-xl w-full"
          style={{ background: NAVY, border: "none", color: "white", cursor: "pointer" }}
        >
          OK
        </button>
      </div>
    </div>
  );
}

// ── Content helpers ───────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "rgba(26,27,82,0.5)" }}>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="m-0 p-0 list-none flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 items-start">
          <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-2" style={{ background: "rgba(31,41,55,0.25)" }} />
          <span className="text-[13.5px] leading-[1.65]" style={{ color: "rgba(26,27,82,0.8)" }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ── Tab content ───────────────────────────────────────────────────────────────

function BriefTab() {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <Label>Patient</Label>
          <div className="text-[14px] font-bold" style={{ color: NAVY }}>James Morrison</div>
          <div className="text-[13px]" style={{ color: "rgba(26,27,82,0.65)" }}>52 years old, Male</div>
        </div>
        <div>
          <Label>Type</Label>
          <div className="text-[13px]" style={{ color: "rgba(26,27,82,0.75)" }}>Face to face</div>
        </div>
      </div>
      <div>
        <Label>Past Medical History</Label>
        <BulletList items={["Hypertension"]} />
      </div>
      <div>
        <Label>Drug &amp; Allergy History</Label>
        <BulletList items={["Ramipril 5mg once daily", "No known allergies"]} />
      </div>
      <div>
        <Label>Recent Notes</Label>
        <p className="text-[13.5px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.8)" }}>
          BP check 3 months ago: 138/88 mmHg. Advised to continue current medication. Next review in 6 months.
        </p>
      </div>
      <div>
        <Label>Reason for Consultation</Label>
        <p className="text-[13.5px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.8)" }}>
          James is a 52-year-old male presenting with central chest pain that started yesterday evening. He has booked an urgent appointment this morning.
        </p>
      </div>
    </div>
  );
}

function StoryTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg p-4" style={{ background: "#EFF6FF" }}>
        <div className="text-[10px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(31,41,55,0.45)" }}>Opening Statement</div>
        <p className="text-[13.5px] leading-[1.65] italic" style={{ color: NAVY }}>
          "I've had this pain in my chest since last night. I'm a bit worried about it. My dad had a heart attack last year and I just want to make sure it's nothing like that."
        </p>
      </div>

      <div>
        <Label>If Asked to Explain Further</Label>
        <p className="text-[13.5px] leading-[1.65]" style={{ color: "rgba(26,27,82,0.8)" }}>
          The pain is central, heavy and dull, like a pressure behind the sternum. Rates 6 or 7 out of 10 at worst. Mild ache down the left arm. Started at rest around 8pm after dinner and has come and gone since. Associated with sweating and feeling slightly sick. No shortness of breath at rest. No leg swelling. No change with movement or breathing.
        </p>
      </div>

      <div className="rounded-lg p-4" style={{ background: "rgba(246,212,75,0.08)", border: "1px solid rgba(246,212,75,0.25)" }}>
        <div className="text-[10px] font-bold uppercase tracking-[0.08em] mb-2.5" style={{ color: NAVY }}>
          Only Say Below If Directly Asked
        </div>
        <ul className="m-0 p-0 list-none flex flex-col gap-2">
          {[
            "First time this has ever happened — no previous episodes",
            "No recent illness or fever",
            "Compliance with ramipril is good, takes it every morning",
            "Last smoked 5 years ago, was a 10-a-day smoker for 20 years",
          ].map((item, i) => (
            <li key={i} className="flex gap-2.5 items-start">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-2 opacity-40" style={{ background: NAVY }} />
              <span className="text-[13px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.75)" }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Label>Social History</Label>
        <p className="text-[13.5px] leading-[1.65]" style={{ color: "rgba(26,27,82,0.8)" }}>
          Works as an accountant. Lives with his wife. Ex-smoker, quit 5 years ago. Drinks around 12 units of alcohol per week. Drives to work daily.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {([
          ["Ideas",        "Thinks it could be his heart, like his father's heart attack last year."],
          ["Concerns",     "Worried he is having a heart attack. Anxious about having driven himself in."],
          ["Expectations", "Wants to know if it is serious and what will happen next. Hoping for answers."],
        ] as const).map(([label, value]) => (
          <div key={label} className="rounded-lg p-3" style={{ background: LIGHT_BG }}>
            <div className="text-[10px] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: NAVY }}>{label}</div>
            <p className="text-[12px] leading-[1.55]" style={{ color: "rgba(26,27,82,0.75)" }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg p-4" style={{ background: "#EFF6FF" }}>
        <div className="text-[10px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(31,41,55,0.45)" }}>Question for the Doctor</div>
        <p className="text-[13px] leading-[1.6]" style={{ color: NAVY }}>
          "Do you think it could be my heart? Should I not have driven here?"
        </p>
      </div>

      <div className="pt-3 border-t" style={{ borderColor: "rgba(26,27,82,0.08)" }}>
        <p className="text-[12px] italic" style={{ color: "rgba(26,27,82,0.5)" }}>
          Role player: appear anxious but not distressed. Mention your father's cardiac history early and again when asked about concerns. If the doctor addresses this directly, visibly relax.
        </p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

// Pre-read 2 min, then consultation 10 min
const PHASES: { label: string; secs: number }[] = [
  { label: "Pre-Read", secs: 120 },
  { label: "Consultation", secs: 600 },
];

export default function SampleCasePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("brief");
  const [modal, setModal] = useState<string | null>(null);

  const [phaseIdx, setPhaseIdx] = useState(0);
  const [remaining, setRemaining] = useState(PHASES[0].secs);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            const next = phaseIdx + 1;
            if (next < PHASES.length) {
              setPhaseIdx(next);
              setRemaining(PHASES[next].secs);
            } else {
              setRunning(false);
              clearInterval(intervalRef.current!);
              return 0;
            }
            return PHASES[next]?.secs ?? 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, phaseIdx]);

  const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");

  function handleStart() {
    if (remaining === 0) {
      setPhaseIdx(0);
      setRemaining(PHASES[0].secs);
    }
    setRunning(true);
  }

  function handleSkip() {
    const next = phaseIdx + 1;
    if (next < PHASES.length) {
      setPhaseIdx(next);
      setRemaining(PHASES[next].secs);
      setRunning(true);
    } else {
      setRunning(false);
      setRemaining(0);
    }
  }

  const dataGathering = [
    "Onset, character, severity and radiation of the chest pain. Specifically ask about left arm, jaw and back.",
    "Associated symptoms: diaphoresis, nausea, vomiting, dyspnoea, palpitations, presyncope.",
    "Timing: at rest versus exertion, duration, progression, whether it has changed since onset.",
    "Cardiac risk factors: hypertension, diabetes, hypercholesterolaemia, smoking, family history of premature cardiac disease.",
    "Previous cardiac history or similar episodes.",
    "Medication compliance, particularly antihypertensives.",
    "Exclude non-cardiac causes: pleuritic component (PE, pneumonia), positional or movement-related (MSK), relationship to food or acid (GI).",
    "Social history: smoking, alcohol, driving, who is with them.",
    "ICE: explore concerns specifically relating to father's cardiac event. This is heavily marked in Relating to Others.",
  ];

  const management = [
    "Perform urgent ECG immediately. Do not delay.",
    "Bloods: troponin (repeat at 3 hours), FBC, U&E, LFTs, fasting lipids, glucose.",
    "Aspirin 300mg stat if ACS suspected and no contraindication. This is commonly missed and costs Clinical Management marks.",
    "If clinical picture suggests ACS: arrange same-day emergency admission via 999. Do not ask the patient to drive.",
    "Safety-net specifically: call 999 immediately if pain worsens significantly, breathlessness develops, or patient feels faint or loses consciousness.",
    "Advise patient not to drive until fully assessed and cleared.",
    "Ask patient to stay in the surgery until initial results are available.",
    "Acknowledge and address the patient's anxiety about his father's history. This directly affects the Relating to Others score.",
    "Arrange urgent GP follow-up the same day if not admitted.",
  ];

  const explanation = `James, based on what you've told me, I'm concerned this could be coming from your heart and I want to make sure we assess you properly today.

The first thing I'd like to do right now is an ECG. That's a tracing of your heart's electrical activity and it only takes a couple of minutes. Alongside that, we need to take some blood, including a special test called a troponin level which tells us whether the heart muscle has been under any strain. We'll have an initial result within a couple of hours.

Before we do that, I'd like you to take an aspirin tablet (300mg) if you're not allergic to it. It has a protective effect on the heart's blood supply while we wait for results.

If the ECG or the blood tests show anything concerning, we would arrange for you to be seen urgently in hospital today. We would not send you home to wait if there's any doubt. And importantly, please do not drive. Your wife is here, which is good, but if it does come to hospital we'd arrange transport rather than have you driving.

While you're here, if at any point the pain gets significantly worse, you feel short of breath, or you feel faint, please tell us or press the call buzzer immediately.

I can see this is worrying, especially given what happened with your dad. It's absolutely right that you came in this morning, and we're going to get to the bottom of it together.`;

  const takeaways = [
    "Chest pain with radiation, diaphoresis and nausea in a hypertensive ex-smoker with a first-degree family history of cardiac disease must be treated as ACS until proven otherwise.",
    "Aspirin 300mg is part of immediate management for suspected ACS. Failing to mention it is a very common reason for losing Clinical Management marks.",
    "Do not anchor on one diagnosis. Keep musculoskeletal (positional, worse on movement), GI (after food, acid-related) and PE (pleuritic, breathlessness) in your differential until excluded.",
    "ICE is not a box-ticking exercise. The patient has told you their father had a heart attack. That is their biggest fear. Acknowledging it directly changes the entire Relating to Others score.",
    "Safety-netting must be specific. Name the red flag symptoms (severe pain, breathlessness, syncope) and tell the patient exactly what to do (call 999, not just 'go to A&E').",
    "Never ask a patient with suspected ACS to drive themselves anywhere. If they need hospital, arrange it.",
    "The patient's emotional cues are clinical data. A patient who mentions their father's cardiac event and asks whether it could be their heart has given you everything you need to score highly in Relating to Others.",
  ];

  function NavBtn({ children, icon, message }: { children: React.ReactNode; icon: React.ReactNode; message: string }) {
    return (
      <button
        onClick={() => setModal(message)}
        className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold"
        style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}
      >
        {icon}
        {children}
      </button>
    );
  }

  return (
    <main style={{ fontFamily: "Inter, system-ui, sans-serif", minHeight: "100vh", background: "#FAFAF8" }}>

      {modal && <AccountModal message={modal} onClose={() => setModal(null)} />}

      {/* Top nav */}
      <div className="flex flex-wrap items-center justify-between px-6 py-2.5 gap-2" style={{ background: NAVY, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-3.5">
          <Link href="/" className="text-[12px] no-underline" style={{ color: "rgba(255,255,255,0.5)" }}>
            ← Home
          </Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
          <span className="text-[12px] font-semibold rounded-md" style={{ color: "rgba(255,255,255,0.65)", border: "1.5px solid rgba(255,255,255,0.25)", padding: "3px 10px" }}>
            Sample Station
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <NavBtn
            message="Recording credits start from £10 for 3 consultations. Create a free account to get started."
            icon={
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="11" rx="3"/>
                <path d="M5 10a7 7 0 0 0 14 0"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
                <line x1="9" y1="21" x2="15" y2="21"/>
              </svg>
            }
          >Record</NavBtn>

          <NavBtn
            message="Create a free account to access study rooms and practise cases with a partner."
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            }
          >Study Room</NavBtn>

          <NavBtn
            message="Create a free account to star cases and track your progress across the full case bank."
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            }
          >Star</NavBtn>
        </div>
      </div>

      {/* Tab strip */}
      <div style={{ background: "white", borderBottom: "1px solid rgba(31,41,55,0.10)" }}>
        <div className="max-w-[1300px] mx-auto px-6 flex items-end overflow-x-auto">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="py-2.5 px-4 text-[12.5px] transition-colors whitespace-nowrap"
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: active ? `2px solid ${YELLOW}` : "2px solid transparent",
                  marginBottom: "-1px",
                  cursor: "pointer",
                  color: active ? NAVY : "rgba(31,41,55,0.40)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-[1300px] mx-auto px-6 py-6">
        <div className="grid gap-5 items-start" style={{ gridTemplateColumns: "1fr 240px" }}>

          {/* Tab content */}
          <div className="rounded-xl bg-white px-6 py-5" style={{ border: "1px solid rgba(31,41,55,0.10)" }}>
            {activeTab === "brief"       && <BriefTab />}
            {activeTab === "story"       && <StoryTab />}
            {activeTab === "data"        && <BulletList items={dataGathering} />}
            {activeTab === "management"  && <BulletList items={management} />}
            {activeTab === "explanation" && (
              <p className="text-[13.5px] leading-[1.85]" style={{ color: "rgba(26,27,82,0.82)", whiteSpace: "pre-line" }}>
                {explanation}
              </p>
            )}
            {activeTab === "takeaways"   && <BulletList items={takeaways} />}
          </div>

          {/* Right column: live timer */}
          <div className="sticky top-4">
            <div className="rounded-xl p-5 flex flex-col gap-4" style={{ background: "white", border: "1px solid rgba(31,41,55,0.10)" }}>
              <div className="text-center">
                <div className="text-[10px] font-bold uppercase tracking-[0.07em] mb-1" style={{ color: "rgba(31,41,55,0.4)" }}>
                  {PHASES[phaseIdx].label}
                </div>
                <div
                  className="font-mono font-bold text-[38px] leading-none tabular-nums"
                  style={{ color: remaining <= 30 && running ? "#DC2626" : NAVY }}
                >
                  {mins}:{secs}
                </div>
              </div>

              <div className="flex gap-2">
                {!running ? (
                  <button
                    onClick={handleStart}
                    className="flex-1 rounded-lg py-2 text-[12px] font-bold"
                    style={{ background: NAVY, border: "none", color: "white", cursor: "pointer" }}
                  >
                    {remaining === PHASES[phaseIdx].secs ? "Start" : "Resume"}
                  </button>
                ) : (
                  <button
                    onClick={() => setRunning(false)}
                    className="flex-1 rounded-lg py-2 text-[12px] font-bold"
                    style={{ background: "rgba(31,41,55,0.08)", border: "none", color: NAVY, cursor: "pointer" }}
                  >
                    Pause
                  </button>
                )}
                {phaseIdx < PHASES.length - 1 && (
                  <button
                    onClick={handleSkip}
                    className="rounded-lg py-2 px-3 text-[12px] font-semibold"
                    style={{ background: "rgba(31,41,55,0.06)", border: "1px solid rgba(31,41,55,0.10)", color: "rgba(31,41,55,0.55)", cursor: "pointer" }}
                  >
                    Skip
                  </button>
                )}
              </div>

              {PHASES.length > 1 && (
                <div className="flex gap-1.5">
                  {PHASES.map((p, i) => (
                    <div
                      key={i}
                      className="flex-1 h-1 rounded-full"
                      style={{ background: i < phaseIdx ? YELLOW : i === phaseIdx ? NAVY : "rgba(31,41,55,0.12)" }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
