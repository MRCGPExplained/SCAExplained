import Link from "next/link";
import { AudioPlaceholder } from "@/app/recordings/sample/AudioPlaceholder";

const NAVY = "#333333";
const YELLOW = "#F6D44B";

const GRADE_META: Record<string, { label: string; color: string; bg: string }> = {
  F:  { label: "Fail",       color: "#92400E", bg: "rgba(245,158,11,0.09)" },
  P:  { label: "Pass",       color: "#166534", bg: "rgba(34,197,94,0.09)"  },
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
  { t: "0:00", s: "Doctor", l: "Come in, Amy. I'm Dr Whitfield. I see you're here for your asthma review today — how have things been going?" },
  { t: "0:08", s: "Patient", l: "Not great, honestly. I've been using my blue inhaler a lot more than usual lately, and about three weeks ago I had a bad episode after a cold and ended up at the walk-in needing steroid tablets." },
  { t: "0:21", s: "Doctor", l: "I'm sorry to hear that. Let me ask you a few specific things to get a sense of where things are. In the past week, have you had any symptoms that woke you at night — breathlessness, wheeze, cough?" },
  { t: "0:31", s: "Patient", l: "Yes, probably a couple of nights. Maybe one or two." },
  { t: "0:35", s: "Doctor", l: "And has your asthma stopped you doing things you'd normally do — exercise, activities, anything like that?" },
  { t: "0:41", s: "Patient", l: "Definitely. I used to go to yoga on Thursdays but I've stopped going. I basically can't exercise without needing my inhaler first." },
  { t: "0:49", s: "Doctor", l: "And during the day — are you getting tightness or wheeze most days?" },
  { t: "0:53", s: "Patient", l: "Yes, most days. It's usually worst in the morning." },
  { t: "0:57", s: "Doctor", l: "How often are you needing the blue inhaler in a typical week?" },
  { t: "1:02", s: "Patient", l: "Probably five or six times. Sometimes more." },
  { t: "1:06", s: "Doctor", l: "That does tell me things aren't well controlled at the moment. What about your brown preventer inhaler — how are you getting on with that?" },
  { t: "1:14", s: "Patient", l: "I try to take it but I forget the morning dose a lot. Mostly I just do the evening one." },
  { t: "1:20", s: "Doctor", l: "So roughly once a day rather than twice?" },
  { t: "1:23", s: "Patient", l: "Yeah, pretty much." },
  { t: "1:26", s: "Doctor", l: "Do you use a spacer device at all when you take your inhalers?" },
  { t: "1:30", s: "Patient", l: "No, I just use it straight." },
  { t: "1:32", s: "Doctor", l: "And after you take a puff, do you hold your breath at all?" },
  { t: "1:36", s: "Patient", l: "Maybe a couple of seconds. Not really." },
  { t: "1:39", s: "Doctor", l: "That's good to know. What sorts of things seem to trigger your asthma?" },
  { t: "1:43", s: "Patient", l: "Cold air, exercise. And my boyfriend has a cat — I've noticed it's worse when I'm at his place." },
  { t: "1:51", s: "Doctor", l: "Tell me a bit more about the episode three weeks ago." },
  { t: "1:55", s: "Patient", l: "I got a cold and within two days my chest was really tight and wheezy. The blue inhaler wasn't touching it so I went to the walk-in and they gave me a five-day course of prednisolone." },
  { t: "2:07", s: "Doctor", l: "Did the steroids help?" },
  { t: "2:09", s: "Patient", l: "Yes, quite quickly. Much better within a day or so." },
  { t: "2:13", s: "Doctor", l: "Have you ever needed to go to A&E for your asthma, or been admitted to hospital?" },
  { t: "2:18", s: "Patient", l: "Not in the last couple of years, no. It was bad when I was a teenager but settled for a while." },
  { t: "2:25", s: "Doctor", l: "Any other health conditions or regular medications besides the inhalers?" },
  { t: "2:29", s: "Patient", l: "No, nothing." },
  { t: "2:31", s: "Doctor", l: "Do you smoke or have you ever smoked?" },
  { t: "2:34", s: "Patient", l: "No, never." },
  { t: "2:36", s: "Doctor", l: "You work from home, is that right? Any pattern to symptoms being better or worse on certain days?" },
  { t: "2:42", s: "Patient", l: "At home it's fine mostly. It's mainly outdoors and at my boyfriend's." },
  { t: "2:47", s: "Doctor", l: "Okay. I want to understand a bit more about how this is affecting you and what your concerns are. How are you feeling about it all?" },
  { t: "2:55", s: "Patient", l: "I'm worried about it. And I'm a bit concerned about the steroid inhaler long-term. I've read that steroids can weaken your bones and cause weight gain. I don't want to be on them if there's something else I could use." },
  { t: "3:08", s: "Doctor", l: "That's a really understandable concern and I'm glad you've raised it. What do you think is going on with your asthma — do you have a sense of it?" },
  { t: "3:16", s: "Patient", l: "I think maybe the inhaler isn't strong enough, or maybe I'm not using it properly." },
  { t: "3:21", s: "Doctor", l: "That's actually a pretty accurate read. What were you hoping we could sort out today?" },
  { t: "3:26", s: "Patient", l: "I'd like to know whether there's a better option, and whether I really need the steroid one." },
  { t: "3:32", s: "Doctor", l: "Understood. Let me measure your peak flow now, if that's all right." },
  { t: "3:36", s: "Patient", l: "Of course." },
  { t: "3:50", s: "Doctor", l: "Your best reading is 375 litres per minute. For your age and height we'd expect around 430, so you're at about 87 percent of predicted. That backs up the picture you've been describing." },
  { t: "4:02", s: "Patient", l: "So it is uncontrolled?" },
  { t: "4:04", s: "Doctor", l: "Yes, based on your symptoms and this reading, it is. But the important thing is that there's a clear plan and we can address this today." },
  { t: "4:12", s: "Doctor", l: "Now, your concern about the steroid inhaler is important and I want to deal with it properly. The steroids in your preventer inhaler are inhaled directly into the airways. They don't behave like the tablets you had three weeks ago. The amount that enters your bloodstream is very small. At the dose you're currently on, there is no meaningful risk to your bones. The long-term safety profile for inhaled steroids at standard doses is well established." },
  { t: "4:38", s: "Patient", l: "So it's genuinely different from the oral tablets?" },
  { t: "4:41", s: "Doctor", l: "Very different. Tablets give a much higher systemic dose. The inhaler is mostly local. I understand the concern, but I want you to feel confident using it, because the risk of poorly controlled asthma, including a serious attack, is a much greater problem than any risk from the inhaler at this dose." },
  { t: "4:57", s: "Patient", l: "That actually makes a lot of sense. I didn't realise they were that different." },
  { t: "5:01", s: "Doctor", l: "Most people don't. And I suspect that concern might have made you a bit less likely to take it regularly, which is completely understandable." },
  { t: "5:09", s: "Patient", l: "Honestly, yes. I think that's probably true." },
  { t: "5:13", s: "Doctor", l: "Right. So with that in mind, let me explain what I'd like to change." },
  { t: "5:16", s: "Patient", l: "Please." },
  { t: "5:18", s: "Doctor", l: "At the moment you're on a low-dose steroid inhaler and a separate blue reliever. I want to move you onto a combination inhaler called Fostair. It contains both a steroid and a long-acting bronchodilator in one device. You'd use it twice a day as your regular preventer, and also as your reliever when you need it in between. So instead of two inhalers, you'd just have the one." },
  { t: "5:41", s: "Patient", l: "That sounds much simpler." },
  { t: "5:43", s: "Doctor", l: "It is. And the long-acting bronchodilator gives you background airway protection throughout the day that you don't currently have. That's what will stop you needing the blue inhaler five or six times a week." },
  { t: "5:56", s: "Patient", l: "And the steroid in it — is it a higher dose than what I'm on now?" },
  { t: "6:00", s: "Doctor", l: "It's broadly similar. The step-up comes mainly from adding that second component, not from dramatically increasing the steroid. You would still be well within the standard safe range." },
  { t: "6:11", s: "Patient", l: "Okay. I feel much better about that." },
  { t: "6:14", s: "Doctor", l: "Good. Now, the other thing I want to address is how you're using your inhaler. You mentioned you don't use a spacer. Using a spacer with a metered dose inhaler like Fostair makes a significant difference to how much medicine actually reaches your lungs rather than hitting the back of your throat. It also makes technique much easier." },
  { t: "6:32", s: "Patient", l: "I've seen them but I've never been shown how to use one." },
  { t: "6:36", s: "Doctor", l: "That's what I want to sort out. I'm going to refer you to our asthma nurse today, and they'll take you through the full technique with the spacer. It's much more straightforward than it looks." },
  { t: "6:46", s: "Patient", l: "That would be really helpful." },
  { t: "6:48", s: "Doctor", l: "I also want to make sure you go home with a written asthma action plan today. It's essentially a simple guide that tells you what to do depending on your symptoms. When you're well, carry on with your regular inhaler. If symptoms start worsening, say after a cold, it tells you to increase your inhaler use and to contact us early. And if things deteriorate rapidly, it tells you exactly when to call 999." },
  { t: "7:10", s: "Patient", l: "I've never had anything like that before." },
  { t: "7:12", s: "Doctor", l: "Many patients haven't, but it really does make a difference. Especially for you, given what happened last time with the cold. If you'd had the plan and contacted us early, we might have been able to get you a steroid course before you needed the walk-in." },
  { t: "7:25", s: "Patient", l: "That's good to know for next time." },
  { t: "7:28", s: "Doctor", l: "Exactly. I'll print it for you before you leave. Now, one more thing: the cat. I know it's not straightforward, but cat dander is a significant trigger for you." },
  { t: "7:38", s: "Patient", l: "I know. I'm not sure what to do about it because it's my boyfriend's." },
  { t: "7:43", s: "Doctor", l: "In practice, if avoiding the cat completely isn't possible, keeping your asthma well controlled with the new inhaler will help reduce your sensitivity overall. It would also be worth making sure the cat doesn't go in the bedroom when you stay there. If you're still getting significant symptoms at his flat even when well controlled, we could discuss allergy testing." },
  { t: "8:00", s: "Patient", l: "That seems reasonable." },
  { t: "8:02", s: "Doctor", l: "In terms of safety, I want to make sure you know what to do if things get bad acutely. If you have an attack and your usual inhaler isn't helping, use up to ten puffs one at a time. If after those ten puffs you're not improving, or if you're struggling significantly with breathing, call 999. Don't drive yourself and don't wait." },
  { t: "8:19", s: "Patient", l: "Ten puffs. Okay." },
  { t: "8:21", s: "Doctor", l: "The action plan will have all of that written down so you don't have to remember it in the moment." },
  { t: "8:26", s: "Patient", l: "How quickly should I expect to see a difference with the new inhaler?" },
  { t: "8:30", s: "Doctor", l: "The long-acting bronchodilator works relatively quickly, within a few days you should notice you're reaching for the inhaler less often. The full anti-inflammatory effect from the steroid builds over two to four weeks, so give it that amount of time before you judge it." },
  { t: "8:44", s: "Patient", l: "And if I'm still not doing well after that?" },
  { t: "8:47", s: "Doctor", l: "Come back and see us. I want to review you in four to six weeks in any case to check your peak flow and see how you're feeling. If things haven't improved enough even on the new inhaler with good technique, there are further steps we can take, including referral to a specialist." },
  { t: "9:01", s: "Patient", l: "Okay. What about exercise? Can I get back to yoga?" },
  { t: "9:05", s: "Doctor", l: "That's exactly the goal. Once the Fostair has had a few weeks to work, your threshold for exercise-triggered symptoms should improve significantly. In the meantime, a gentle warm-up before exercise and using your inhaler before you start will help." },
  { t: "9:18", s: "Patient", l: "That's really encouraging actually." },
  { t: "9:21", s: "Doctor", l: "It should be. Uncontrolled asthma is very treatable when we get the medication and technique right. There's no reason you shouldn't be back at yoga." },
  { t: "9:29", s: "Patient", l: "I really hope so. I miss it." },
  { t: "9:32", s: "Doctor", l: "Let me summarise what we've agreed. I'm prescribing Fostair 100/6 MDI twice a day, which replaces both your current inhalers. I'm referring you to the asthma nurse for technique and spacer training. You'll leave with a written action plan. I'll see you in four to six weeks. And if anything worsens acutely before then, you know the steps." },
  { t: "9:50", s: "Patient", l: "Yes. And if the blue inhaler isn't working, ten puffs, and if no improvement, 999." },
  { t: "9:55", s: "Doctor", l: "Exactly right. Any other questions?" },
  { t: "9:57", s: "Patient", l: "I don't think so. This has been really helpful actually." },
  { t: "10:01", s: "Doctor", l: "Good. Let me get that prescription and action plan printed for you now." },
];

interface SampleReportContentProps {
  /** False on the homepage preview — voice note/transcript disclosure become
   * purely visual (no modal, no expand) and the "Create free account" CTA
   * is omitted, since the homepage already has its own conversion CTAs. */
  interactive?: boolean;
}

/** The full sample SCA report — shared between /recordings/sample and the homepage's Examples section. */
export function SampleReportContent({ interactive = true }: SampleReportContentProps) {
  const dgPts = 2;
  const cmPts = 3;
  const roPts = 2;
  const total = dgPts + cmPts + roPts;

  return (
    <div>
      {/* Metadata row */}
      <div className="flex items-center gap-4 text-[11px] mb-5 px-1 flex-wrap" style={{ color: "rgba(51,51,51,0.4)" }}>
        <span>1 August 2026</span>
        <span>·</span>
        <span>Doctor: Dr S. Whitfield</span>
        <span>·</span>
        <span>Patient: Amy Clarke</span>
        <span>·</span>
        <span>Marked by Dr P. Hargreaves</span>
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
            Examiner&apos;s Overall Summary
          </div>
          <p className="text-[13.5px] leading-relaxed" style={{ color: "#111111" }}>
            A solid consultation with good clinical instincts. The RCP 3 questions were used well and the step-up to a combination inhaler was appropriate and clearly explained. The steroid concern was identified and addressed. Where marks were lost was in the detail. Inhaler technique was mentioned but not properly assessed: the examiner was left unsure whether the candidate understood why the technique was suboptimal or what specifically to correct. The written asthma action plan was issued but its structure was not explained to the patient in a way that would make it useful at home. The candidate should also have asked about occupational exposures given this is adult-onset worsening asthma.
          </p>
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(51,51,51,0.07)" }}>
            <div className="text-[11px] mb-2" style={{ color: "rgba(51,51,51,0.4)" }}>Voice note</div>
            <AudioPlaceholder disabled={!interactive} />
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
            comment: "Good use of the RCP 3 questions to establish uncontrolled asthma. SABA frequency, night symptoms, and activity limitation were all covered. Preventer adherence was explored and the walk-in episode was picked up from the history. Inhaler technique was mentioned but not examined in enough detail to assess what the actual fault was. Occupational history was not asked: the candidate established the patient works from home but did not ask specifically whether symptoms relate to the working environment, which is a standard question in adult asthma.",
          },
          {
            key: "cm",
            label: "Clinical Management",
            grade: "P",
            comment: "Appropriate step-up from ICS alone to ICS/LABA combination. Choice of Fostair and explanation of MART was accurate. Peak flow was measured. Spacer was recommended and referral to the asthma nurse was made. The written asthma action plan was issued but the candidate did not explain the green, amber, and red zones in a way that would enable the patient to use it independently. Safety-netting around acute episodes was present but did not include guidance on what to do in the first 24 hours of an upper respiratory infection, which is when this patient is most at risk.",
          },
          {
            key: "ro",
            label: "Relating to Others",
            grade: "P",
            comment: "The steroid concern was picked up and addressed clearly, and the patient was visibly reassured. ICE was explored. The candidate made a good observation that the steroid concern likely contributed to non-adherence. However, when the patient expressed that she missed yoga, the opportunity to build on this as a motivating goal was passed over quickly. The consultation was well-structured and the patient left informed. Checking the patient's understanding of the action plan at the end would have strengthened the closing.",
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
          onClick={interactive ? undefined : (e) => e.preventDefault()}
          className="px-5 py-4 select-none flex items-center justify-center gap-2"
          style={{ listStyle: "none", cursor: interactive ? "pointer" : "default" }}
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
            <AudioPlaceholder disabled={!interactive} />
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
      {interactive && (
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
      )}
    </div>
  );
}
