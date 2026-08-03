import Link from "next/link";
import { AudioPlaceholder } from "./AudioPlaceholder";

const NAVY = "#333333";
const YELLOW = "#F6D44B";

const GRADE_META: Record<string, { label: string; color: string; bg: string }> = {
  F:  { label: "Fail",  color: "#92400E", bg: "rgba(245,158,11,0.09)" },
  P:  { label: "Pass",  color: "#166534", bg: "rgba(34,197,94,0.09)"  },
  CP: { label: "Clear Pass", color: "#1D4ED8", bg: "rgba(59,130,246,0.09)" },
};

function GradePill({ grade }: { grade: string }) {
  const meta = GRADE_META[grade];
  return (
    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md" style={{ background: meta.bg, color: meta.color }}>
      {meta.label}
    </span>
  );
}

function ScoreBar({ pts, max }: { pts: number; max: number }) {
  return (
    <div style={{ background: "rgba(51,51,51,0.08)", borderRadius: 99, height: 7, overflow: "hidden" }}>
      <div style={{ width: `${Math.round((pts / max) * 100)}%`, height: "100%", background: YELLOW, borderRadius: 99 }} />
    </div>
  );
}

const TRANSCRIPT = [
  { t: "0:00", s: "Doctor", l: "Come in, have a seat. I'm Dr Patel. What's brought you in today?" },
  { t: "0:08", s: "Patient", l: "Thanks. I've had this chest pain since yesterday evening and I'm a bit worried about it." },
  { t: "0:15", s: "Doctor", l: "Okay, I'm glad you came. Tell me about the pain — where is it exactly?" },
  { t: "0:20", s: "Patient", l: "It's kind of central, behind my sternum. It comes and goes." },
  { t: "0:26", s: "Doctor", l: "Does it go anywhere else — arm, jaw, back?" },
  { t: "0:31", s: "Patient", l: "Slight ache down my left arm, yeah. Maybe a two or three out of ten." },
  { t: "0:37", s: "Doctor", l: "And at its worst, how bad is the chest pain itself on that scale?" },
  { t: "0:42", s: "Patient", l: "About six or seven. It definitely stopped me watching TV last night." },
  { t: "0:48", s: "Doctor", l: "What makes it better or worse — does it change when you move or breathe?" },
  { t: "0:54", s: "Patient", l: "Not really, no. It's more of a constant dull heaviness." },
  { t: "1:00", s: "Doctor", l: "Any shortness of breath, sweating, nausea with it?" },
  { t: "1:05", s: "Patient", l: "A bit sweaty last night, yeah. And I did feel slightly sick." },
  { t: "1:10", s: "Doctor", l: "When did it start exactly, and did anything seem to bring it on?" },
  { t: "1:15", s: "Patient", l: "About eight o'clock yesterday. I'd just finished dinner, wasn't doing anything strenuous." },
  { t: "1:22", s: "Doctor", l: "Has this ever happened before?" },
  { t: "1:25", s: "Patient", l: "No, first time. Look — my dad had a heart attack last year and I'm really worried this is the same thing." },
  { t: "1:33", s: "Doctor", l: "How old are you, and do you smoke or have any health conditions?" },
  { t: "1:38", s: "Patient", l: "I'm 52. I used to smoke but I quit five years ago. I've got high blood pressure, on ramipril." },
  { t: "1:46", s: "Doctor", l: "Good that you've quit. And your blood pressure — is it well controlled as far as you know?" },
  { t: "1:51", s: "Patient", l: "Last check was okay, yeah." },
  { t: "1:54", s: "Doctor", l: "Given the symptoms, I want to get an ECG done today and some blood tests. If those show anything concerning we'd need to send you to hospital straight away for further assessment. Do you understand what I mean by that?" },
  { t: "2:05", s: "Patient", l: "So you think it could be my heart?" },
  { t: "2:08", s: "Doctor", l: "It's something we need to rule out urgently. The tests will give us a much clearer picture." },
  { t: "2:14", s: "Patient", l: "Okay. Should I be worried? I mean, I drove here — should I not have?" },
  { t: "2:20", s: "Doctor", l: "It's fine that you drove in, but if the pain comes on severely before we get the results, dial 999 rather than drive yourself. Do you have someone with you?" },
  { t: "2:28", s: "Patient", l: "My wife is in the waiting room." },
  { t: "2:30", s: "Doctor", l: "Good. Let me take you through to the nurse now to get that ECG done. We'll talk through the results together once we have them." },
];

export default function SampleReportPage() {
  const dgPts = 2;
  const cmPts = 3;
  const roPts = 1;
  const total = dgPts + cmPts + roPts;

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
              Station 12
            </span>
            <h1 className="font-bold text-[15px] leading-tight" style={{ color: NAVY }}>
              Chest Pain in a 52-Year-Old Male
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

        {/* Metadata row */}
        <div className="flex items-center gap-4 text-[11px] mb-5 px-1 flex-wrap" style={{ color: "rgba(51,51,51,0.4)" }}>
          <span>1 August 2026</span>
          <span>·</span>
          <span>Doctor: Dr S. Mehta</span>
          <span>·</span>
          <span>Patient: James Morrison</span>
          <span>·</span>
          <span>Marked by Dr R. Kapoor</span>
        </div>

        {/* Top row: score + overall */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          {/* Score card */}
          <div className="rounded-2xl p-6" style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.07em] mb-4" style={{ color: "rgba(51,51,51,0.4)" }}>
              Total Score
            </div>
            <div className="flex items-end gap-2 mb-1">
              <span className="font-extrabold leading-none" style={{ fontSize: 44, color: NAVY }}>
                {total}<span className="font-extrabold text-[28px]">/10.5</span>
              </span>
            </div>
            <p className="text-[12px] mb-5" style={{ color: "rgba(51,51,51,0.4)" }}>Pass threshold: 7 pts</p>

            <div className="text-[11px] font-bold uppercase tracking-[0.07em] mb-3" style={{ color: "rgba(51,51,51,0.4)" }}>
              Score Distribution
            </div>
            <div className="flex flex-col gap-3">
              {([
                { label: "Data Gathering",      pts: dgPts, max: 3   },
                { label: "Clinical Management", pts: cmPts, max: 4.5 },
                { label: "Relating to Others",  pts: roPts, max: 3   },
              ] as const).map(({ label, pts, max }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-medium" style={{ color: "rgba(51,51,51,0.7)" }}>{label}</span>
                    <span className="text-[12px] font-bold tabular-nums" style={{ color: NAVY }}>{pts}/{max}</span>
                  </div>
                  <ScoreBar pts={pts} max={max} />
                </div>
              ))}
            </div>
          </div>

          {/* Overall examiner summary */}
          <div className="rounded-2xl p-6" style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.07em] mb-3" style={{ color: "#111111" }}>
              Examiner's Overall Summary
            </div>
            <p className="text-[13.5px] leading-relaxed" style={{ color: "#111111" }}>
              A solid clinical performance undermined by missed emotional cues. This patient was frightened. He
              mentioned his father's heart attack unprompted and directly asked "do you think it could be my heart?"
              Those were clear invitations to explore his concerns, and both were passed over quickly. Data gathering
              was structured and covered the key red flags well. The management plan was appropriate but lacked
              specificity around immediate actions. Addressing the patient's ICE more fully would have transformed
              the Relating to Others score.
            </p>
            <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(51,51,51,0.07)" }}>
              <div className="text-[11px] mb-2" style={{ color: "rgba(51,51,51,0.4)" }}>Voice note</div>
              <AudioPlaceholder />
            </div>
          </div>
        </div>

        {/* Domain cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {([
            {
              key: "dg",
              label: "Data Gathering & Diagnosis",
              grade: "P",
              comment: "Good systematic history covering onset, character, radiation, and associated symptoms. Risk factors appropriately explored including smoking history and hypertension. The differential was implicitly cardiac but musculoskeletal and oesophageal causes weren't explicitly considered or excluded. Safety-netting was present but could have been more specific about what symptoms should prompt a 999 call.",
            },
            {
              key: "cm",
              label: "Clinical Management",
              grade: "P",
              comment: "Appropriate urgent management plan with ECG and troponin. Correctly identified the need for potential same-day hospital referral. Aspirin wasn't mentioned, and the explanation of next steps (both in the practice and if admitted) was brief. The patient was left with some uncertainty about the process, though the safety-netting around driving was handled well.",
            },
            {
              key: "ro",
              label: "Relating to Others",
              grade: "F",
              comment: "The patient disclosed his father's cardiac history early in the consultation and directly expressed worry. This was acknowledged minimally and not explored. When asked if it could be his heart, the response moved straight to the management plan without addressing the emotional content. ICE was partially covered but concerns were not fully explored. Language was professional but missed several opportunities to build rapport and address anxiety.",
            },
          ] as const).map(({ key, label, grade, comment }) => (
            <div
              key={key}
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}
            >
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <span className="text-[13px] font-bold" style={{ color: NAVY }}>{label}</span>
                <GradePill grade={grade} />
              </div>
              <p className="text-[12.5px] leading-relaxed" style={{ color: "rgba(51,51,51,0.7)" }}>{comment}</p>
            </div>
          ))}
        </div>

        {/* Transcript */}
        <details
          className="rounded-2xl overflow-hidden"
          style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}
        >
          <summary
            className="px-5 py-4 cursor-pointer select-none flex items-center justify-center gap-2"
            style={{ listStyle: "none" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
              <path d="M2 4h12M2 8h8M2 12h5" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-[12px] font-semibold" style={{ color: "rgba(51,51,51,0.5)" }}>View Consultation</span>
          </summary>

          <div style={{ borderTop: "1px solid rgba(51,51,51,0.07)" }}>
            <div className="px-5 pt-5 pb-4">
              <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-3" style={{ color: "rgba(51,51,51,0.4)" }}>
                Consultation Audio
              </div>
              <AudioPlaceholder />
            </div>
            <div className="px-5 pt-4 pb-5 flex flex-col gap-2.5" style={{ borderTop: "1px solid rgba(51,51,51,0.07)" }}>
              <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-1" style={{ color: "rgba(51,51,51,0.4)" }}>
                Transcript
              </div>
              {TRANSCRIPT.map((line, i) => (
                <div key={i}>
                  <span className="text-[11px] mr-1.5 font-mono" style={{ color: "rgba(51,51,51,0.3)" }}>[{line.t}]</span>
                  <span className="text-[12.5px] font-bold mr-1" style={{ color: NAVY }}>{line.s}:</span>
                  <span className="text-[12.5px]" style={{ color: "rgba(51,51,51,0.75)" }}>{line.l}</span>
                </div>
              ))}
            </div>
          </div>
        </details>

        {/* CTA footer */}
        <div className="mt-8 rounded-2xl p-7 text-center" style={{ background: "white", border: "1px solid rgba(51,51,51,0.08)" }}>
          <h2 className="font-display font-extrabold text-[20px] mb-2" style={{ color: NAVY }}>Ready to get your own report?</h2>
          <p className="text-[13.5px] mb-5" style={{ color: "rgba(51,51,51,0.55)" }}>
            Record a consultation, get it graded by AI, and reviewed by a GP. Usually back within 5 working days.
          </p>
          <Link
            href="/register"
            className="font-bold text-[14px] px-7 py-3 rounded-xl no-underline"
            style={{ background: NAVY, color: "white" }}
          >
            Create free account →
          </Link>
        </div>

      </div>
    </div>
  );
}
