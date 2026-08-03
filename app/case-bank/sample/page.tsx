"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Timer } from "../components/Timer";
import type { TimerPhase } from "@/lib/case-bank-types";
import { PHASE_DURATIONS } from "@/lib/case-bank-types";

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
        <p className="text-[16px] mb-5" style={{ color: "rgba(31,41,55,0.55)" }}>
          {message}
        </p>
        <button
          onClick={onClose}
          className="font-semibold text-[16px] py-2.5 rounded-xl w-full"
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
          <span className="text-[16px] leading-[1.65]" style={{ color: "rgba(26,27,82,0.8)" }}>{item}</span>
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
          <div className="text-[16px] font-bold" style={{ color: NAVY }}>Amy Clarke</div>
          <div className="text-[16px]" style={{ color: "rgba(26,27,82,0.65)" }}>29 years old, Female</div>
        </div>
        <div>
          <Label>Type</Label>
          <div className="text-[16px]" style={{ color: "rgba(26,27,82,0.75)" }}>Face to face</div>
        </div>
      </div>
      <div>
        <Label>Past Medical History</Label>
        <BulletList items={["Asthma (diagnosed age 8)"]} />
      </div>
      <div>
        <Label>Drug &amp; Allergy History</Label>
        <BulletList items={["Clenil Modulite 100mcg MDI — 2 puffs twice daily (beclometasone)", "Salbutamol 100mcg MDI — 2 puffs as required", "No known drug allergies"]} />
      </div>
      <div>
        <Label>Recent Notes</Label>
        <p className="text-[16px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.8)" }}>
          Annual asthma review 11 months ago. PEFR 420 L/min. Advised to use preventer regularly. Repeat prescription issued. Prescription records show 5 salbutamol inhalers collected in the past 3 months.
        </p>
      </div>
      <div>
        <Label>Reason for Consultation</Label>
        <p className="text-[16px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.8)" }}>
          Amy is a 29-year-old graphic designer attending for her annual asthma review. She works from home. Prescription data flags high salbutamol use over the past 3 months.
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
        <p className="text-[16px] leading-[1.65] italic" style={{ color: NAVY }}>
          "I've been using my blue inhaler a lot more than usual lately. I had a bad episode about three weeks ago after a cold and ended up at the walk-in needing steroid tablets. I'm a bit worried about where things are heading."
        </p>
      </div>

      <div>
        <Label>If Asked to Explain Further</Label>
        <p className="text-[16px] leading-[1.65]" style={{ color: "rgba(26,27,82,0.8)" }}>
          Chest tightness and wheeze most days, worst in the mornings. Waking 1 to 2 nights a week with breathlessness or cough. Stopped going to yoga on Thursdays as exercise brings on symptoms. Using salbutamol 5 to 6 times a week, sometimes more. The episode 3 weeks ago followed a cold, salbutamol was not controlling it, attended walk-in and was given a 5-day course of prednisolone which helped quickly.
        </p>
      </div>

      <div className="rounded-lg p-4" style={{ background: "rgba(246,212,75,0.08)", border: "1px solid rgba(246,212,75,0.25)" }}>
        <div className="text-[10px] font-bold uppercase tracking-[0.08em] mb-2.5" style={{ color: NAVY }}>
          Only Say Below If Directly Asked
        </div>
        <ul className="m-0 p-0 list-none flex flex-col gap-2">
          {[
            "Preventer inhaler: takes it most evenings but regularly forgets the morning dose. Probably takes it once a day in practice.",
            "Inhaler technique: no spacer. Holds breath for a couple of seconds after each puff.",
            "Triggers: cold air, exercise, and her boyfriend's cat (noticeably worse when at his flat).",
            "No hospital admissions for asthma in the past 2 years.",
            "Never smoked. Drinks 6 to 8 units of alcohol per week.",
            "Works from home as a graphic designer. No workplace trigger exposure.",
          ].map((item, i) => (
            <li key={i} className="flex gap-2.5 items-start">
              <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-2 opacity-40" style={{ background: NAVY }} />
              <span className="text-[16px] leading-[1.6]" style={{ color: "rgba(26,27,82,0.75)" }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Label>Social History</Label>
        <p className="text-[16px] leading-[1.65]" style={{ color: "rgba(26,27,82,0.8)" }}>
          Graphic designer, works from home. Lives alone. Partner has a cat. Non-smoker. Drinks 6 to 8 units per week. Enjoys yoga but has stopped due to symptoms.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {([
          ["Ideas",        "Thinks her current inhaler is not strong enough, or that she may be using it incorrectly."],
          ["Concerns",     "Worried about long-term steroid use: has read that steroids can cause bone thinning and weight gain. Concerned she may need another course of oral steroids."],
          ["Expectations", "Wants to understand whether there is an alternative to the steroid inhaler, and how to get her asthma under better control."],
        ] as const).map(([label, value]) => (
          <div key={label} className="rounded-lg p-3" style={{ background: LIGHT_BG }}>
            <div className="text-[10px] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: NAVY }}>{label}</div>
            <p className="text-[16px] leading-[1.55]" style={{ color: "rgba(26,27,82,0.75)" }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg p-4" style={{ background: "#EFF6FF" }}>
        <div className="text-[10px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(31,41,55,0.45)" }}>Question for the Doctor</div>
        <p className="text-[16px] leading-[1.6]" style={{ color: NAVY }}>
          "Is there anything I could take instead of the steroid inhaler? I've read that steroids can cause problems if you use them for a long time."
        </p>
      </div>

      <div className="pt-3 border-t" style={{ borderColor: "rgba(26,27,82,0.08)" }}>
        <p className="text-[16px] italic" style={{ color: "rgba(26,27,82,0.5)" }}>
          Role player: appear quietly concerned, not distressed. Raise the steroid concern proactively if the doctor discusses stepping up treatment. Visibly relax if the doctor addresses the concern with a clear explanation. If steroid concerns are not addressed, re-raise them as a question before the end.
        </p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function SampleCasePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("brief");
  const [modal, setModal] = useState<string | null>(null);

  const [timerPhase, setTimerPhase] = useState<TimerPhase>("PREREAD");
  const [timeLeft, setTimeLeft] = useState(PHASE_DURATIONS.PREREAD);
  const [timerRunning, setTimerRunning] = useState(false);

  const handleTick = useCallback((t: number) => setTimeLeft(t), []);
  const handlePhaseComplete = useCallback(() => {
    if (timerPhase === "PREREAD") {
      setTimerPhase("CONSULT");
      setTimeLeft(PHASE_DURATIONS.CONSULT);
    } else {
      setTimerRunning(false);
    }
  }, [timerPhase]);

  const dataGathering = [
    "RCP 3 questions: (1) In the past week, have symptoms woken you at night? (2) Have symptoms limited your usual activities? (3) Have you had daytime symptoms? Two or more positive answers define uncontrolled asthma.",
    "Frequency of SABA use: how many times per week is the patient using their blue reliever inhaler? More than twice a week indicates poor control. More than 3 canisters per year is a marker of serious risk.",
    "Preventer adherence: ask specifically about timing, frequency, and missed doses. Many patients take ICS once daily rather than twice, halving its efficacy.",
    "Inhaler technique: spacer use, actuation timing, breath-hold duration. Poor technique is a common and correctable cause of apparent treatment failure.",
    "Triggers: cold air, exercise, occupational exposures (ask explicitly — occupational asthma accounts for 15% of adult cases), pets, pollen, aspirin or NSAID sensitivity.",
    "Exacerbation history: last severe episode, oral steroid courses in past year, A&E attendances, any previous ITU admissions (the highest-risk marker).",
    "Peak flow: current reading and comparison to personal best or predicted for age and height.",
    "Smoking history: current or past smoking. Smoking worsens asthma control and reduces ICS efficacy.",
    "Atopic history: eczema, allergic rhinitis, food allergies — supports atopic asthma diagnosis.",
    "ICE: specifically explore concerns about steroid use, as this is a common reason for non-adherence and will heavily influence the Relating to Others score.",
  ];

  const management = [
    "Address adherence and inhaler technique first. Correcting technique alone can be equivalent to stepping up treatment.",
    "Recommend a spacer device with the MDI. Spacers significantly improve lung deposition and reduce oropharyngeal deposition.",
    "Step up from BTS/SIGN Step 2 (ICS alone) to Step 3 (ICS + LABA). Fostair 100/6 MDI BD contains beclometasone and formoterol in a single inhaler, replacing both current inhalers.",
    "Consider MART (Maintenance and Reliever Therapy): Fostair used both as regular BD preventer and as reliever as needed. Reduces exacerbations and simplifies the regimen.",
    "Directly address steroid concerns: inhaled steroids have minimal systemic absorption at standard doses. Bone effects are not a concern at beclometasone 200mcg daily. Patients who are reassured are far more likely to adhere.",
    "Issue a written personalised asthma action plan (PAAP). BTS/SIGN Grade A recommendation. Frequently missed in the SCA. Describe the green, amber, and red zones explicitly.",
    "Advise on trigger avoidance: minimise cat exposure if possible, use preventer before exercise (or use MART as reliever), avoid cold air where practical.",
    "Safety-net for acute episodes: up to 10 puffs salbutamol one at a time. If not improving after 10 puffs, call 999. Do not drive during an acute attack.",
    "Refer to asthma nurse for inhaler education and technique review.",
    "Review in 4 to 6 weeks to assess response. If still uncontrolled at Step 3, consider referral to respiratory or allergy specialist.",
  ];

  const explanation = `Amy, thank you for coming in. After what you've told me, your asthma is clearly not as well controlled as we'd like, and I want to go through exactly what I think is happening and what we're going to change.

I want to start with your concern about the steroid inhaler, because I think it matters for everything else. The steroids in your preventer inhaler are inhaled directly into your airways. The amount that gets into your bloodstream is a small fraction of what you'd get from the tablets you took three weeks ago. At the dose you're on, the evidence on long-term safety, including bone density, is very reassuring. I don't want worries about the inhaler to be the reason your asthma stays poorly controlled, because the risk of an uncontrolled attack is much greater than any risk from the inhaler itself. I hope that helps put it in perspective.

That said, I do think your current treatment needs adjusting. At the moment you're on a low-dose steroid inhaler twice a day and a separate blue reliever. I'd like to move you onto a single combination inhaler called Fostair. It contains a steroid and a long-acting bronchodilator in one, so it replaces both your current inhalers. You'd use it twice a day as your regular preventer, and also as your reliever when you need it. One inhaler instead of two, and a meaningful step up in protection.

For it to work as well as it can, I'd strongly recommend using it with a spacer device. I know you haven't used one before, but it makes the medicine considerably more effective and easier to use. Our asthma nurse will be able to show you the full technique, and I'll refer you to them today.

I also want to make sure you leave here with a written asthma action plan. It tells you exactly what to do at each stage: when you're well, when symptoms are worsening, and when to get emergency help. It will include what to do if you get another cold. Please contact us early next time, because we can start a short steroid course before things escalate rather than waiting until you need the walk-in.

On the cat: I know that is a difficult one, but cat dander is a significant trigger for you. Minimising time in rooms where the cat sleeps and keeping your asthma well controlled overall will help.

If you ever have an acute episode, use up to 10 puffs of your reliever one at a time. If you're not improving after that, call 999 rather than waiting.

I'd like to see you again in four to six weeks to see how you're getting on with the new inhaler. Do you have any questions?`;

  const takeaways = [
    "The RCP 3 questions are your fast screen for uncontrolled asthma: night symptoms, activity limitation, and daytime symptoms in the past week. Two or more positives mean the patient is uncontrolled.",
    "Five salbutamol inhalers in three months is a serious red flag. More than 3 canisters per year is associated with significantly increased risk of death from asthma. Name this when discussing management.",
    "Always check adherence and inhaler technique before stepping up treatment. A patient taking their ICS once daily instead of twice is receiving half the prescribed dose. Technique faults can account for most apparent treatment failure.",
    "Steroid concerns are common and are a known driver of non-adherence. The distinction between inhaled and systemic steroids must be explained clearly. This directly affects both Clinical Management and Relating to Others marks.",
    "The step-up from BTS/SIGN Step 2 to Step 3 adds a LABA to the ICS. Fostair (beclometasone/formoterol) as a MART inhaler is a strong choice: it replaces both inhalers, simplifies adherence, and reduces exacerbation risk.",
    "A written personalised asthma action plan is a BTS/SIGN Grade A recommendation and one of the most commonly missed management points in the SCA. Name it explicitly and describe the zones.",
    "Always ask about occupational triggers in adult asthma. It accounts for 15% of cases and is easily missed. A simple question about whether symptoms improve on days off or holidays is enough.",
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
            message="Recording credits start from £24 for 3 consultations. Create a free account to get started."
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
            message="Create a free account to access study rooms and sync your case with a partner to record together."
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
              <p className="text-[16px] leading-[1.85]" style={{ color: "rgba(26,27,82,0.82)", whiteSpace: "pre-line" }}>
                {explanation}
              </p>
            )}
            {activeTab === "takeaways"   && <BulletList items={takeaways} />}
          </div>

          {/* Right column: timer (same as real case bank) */}
          <div className="sticky top-4">
            <Timer
              phase={timerPhase}
              timeLeft={timeLeft}
              running={timerRunning}
              isHost={true}
              onStart={() => setTimerRunning(true)}
              onPause={() => setTimerRunning(false)}
              onSkipPreread={() => {
                setTimerPhase("CONSULT");
                setTimeLeft(PHASE_DURATIONS.CONSULT);
                setTimerRunning(true);
              }}
              onReset={() => {
                setTimerPhase("PREREAD");
                setTimeLeft(PHASE_DURATIONS.PREREAD);
                setTimerRunning(false);
              }}
              onTick={handleTick}
              onPhaseComplete={handlePhaseComplete}
            />
          </div>

        </div>
      </div>
    </main>
  );
}
