import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

const NAVY = "#333333";
const AMBER = "#B45309";

function Card({ title, kicker, children }: { title: string; kicker?: string; children: ReactNode }) {
  return (
    <section className="bg-white rounded-xl border border-black/10 p-6 mb-5">
      {kicker && (
        <div className="text-[11px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: AMBER }}>
          {kicker}
        </div>
      )}
      <h2 className="font-display font-bold text-[17px] mb-4" style={{ color: NAVY }}>
        {title}
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Field({
  name,
  what,
  contains,
  tip,
}: {
  name: string;
  what: string;
  contains: ReactNode;
  tip?: string;
}) {
  return (
    <div className="border-l-2 pl-4" style={{ borderColor: "rgba(51,51,51,0.12)" }}>
      <div className="text-[14px] font-bold mb-1" style={{ color: NAVY }}>
        {name}
      </div>
      <p className="text-[13.5px] leading-[1.6] mb-1" style={{ color: "rgba(51,51,51,0.75)" }}>
        <span className="font-semibold">What it is: </span>
        {what}
      </p>
      <p className="text-[13.5px] leading-[1.6]" style={{ color: "rgba(51,51,51,0.75)" }}>
        <span className="font-semibold">What to write: </span>
        {contains}
      </p>
      {tip && (
        <p className="text-[12.5px] leading-[1.6] mt-1.5 rounded-md px-3 py-2" style={{ background: "rgba(180,83,9,0.06)", color: AMBER }}>
          <span className="font-bold">Tip: </span>
          {tip}
        </p>
      )}
    </div>
  );
}

export default function CaseGuidePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-[22px] mb-1" style={{ color: NAVY }}>
          Case Authoring Guide
        </h1>
        <p className="text-[13px]" style={{ color: "rgba(51,51,51,0.5)" }}>
          What every tab and field means, and what it should contain. Reference this when writing or refining a station.
        </p>
      </div>

      <Card title="Philosophy — what a good case tests" kicker="Start here">
        <p className="text-[13.5px] leading-[1.7]" style={{ color: "rgba(51,51,51,0.8)" }}>
          The SCA is won and lost on <strong>nuance</strong>, not clinical recall: hidden agendas, ethical dilemmas,
          confidentiality, and real-world circumstances (childcare, transport, homelessness, caring responsibilities).
          A purely clinical vignette does not prepare candidates for that. <strong>Most cases should have a dilemma.</strong>
        </p>
        <p className="text-[13.5px] leading-[1.7]" style={{ color: "rgba(51,51,51,0.8)" }}>
          When triaging a case: keep it if it has (or can be given) genuine nuance; if it is purely clinical with no way to
          add nuance, set it to <strong>Archived</strong> with an Admin Note explaining why, rather than deleting it.
        </p>
      </Card>

      <Card title="Housekeeping" kicker="Core details">
        <Field
          name="Status — Draft / Published / Archived"
          what="Controls visibility. Draft = work in progress (hidden). Published = live to subscribers. Archived = deliberately retired (hidden), distinct from a draft."
          contains="Set Archived for a case you've decided not to use (e.g. purely clinical, no nuance)."
        />
        <Field
          name="Admin Note"
          what="Internal only — never shown to subscribers."
          contains="Why a case is archived, or any editorial note to your future self."
        />
      </Card>

      <Card title="Doctor's Brief" kicker="Candidate sees this — before the consult">
        <p className="text-[13px] leading-[1.6]" style={{ color: "rgba(51,51,51,0.6)" }}>
          The clinical record the candidate is given before the consultation begins. Keep it to what a GP would actually see on the screen.
        </p>
        <Field name="Patient Name & Age" what="Who the candidate is seeing." contains="Name and age/sex, e.g. &ldquo;30-year-old female&rdquo;." />
        <Field name="Reason for Consultation" what="The booking reason." contains="One line, as it would appear on the appointment list." />
        <Field name="Past Medical History" what="Relevant prior history." contains="One item per line. Shown to the candidate AND, in lay terms, to the role-player." />
        <Field name="Medications & Allergies" what="Current meds and allergy status." contains="One item per line. Include &ldquo;No known drug allergies&rdquo; explicitly if that's the case." />
        <Field
          name="Recent Notes"
          what="Recent consultation notes, results, or letters."
          contains="Free text or pipe-delimited rows (A | B | C) to render a table. Include lab/result values here."
          tip="Don't bury vitals or exam findings in a run-on sentence (&ldquo;BP 138/82, Pulse 78, no focal deficit, spinal tenderness…&rdquo;). Put vitals in their own small pipe-table (e.g. &ldquo;Observation | Result&rdquo; then &ldquo;BP | 138/82 mmHg&rdquo;) and give descriptive exam findings their own short paragraph, separate from the presenting complaint and plan."
        />
        <Field name="Images" what="Any images the candidate should see (rash, ECG, results)." contains="Upload and attribute the source. Optional." tip="Check images and lab values as you go — make sure they match the clinical story." />
      </Card>

      <Card title="Patient's Story" kicker="Role-player sees this — the acting brief">
        <p className="text-[13px] leading-[1.6]" style={{ color: "rgba(51,51,51,0.6)" }}>
          The brief for whoever plays the patient. The candidate never sees this. Sections render top to bottom in the order below.
        </p>
        <Field
          name="1. The Dilemma"
          what="The single most important field: the case's central tension AND how the role-player should act it. Written in the second person (&ldquo;You are…&rdquo;)."
          contains="Identity + presentation + the tension + reveal timing. e.g. &ldquo;You are Rachel, 30, 10 weeks pregnant with light bleeding… you're cooperative until the doctor suggests going to hospital, then you reveal you have no childcare…&rdquo; Close with a full sentence: &ldquo;The case tests whether the doctor…&rdquo;."
          tip="Maximum 4 sentences, each direct — no run-ons (don't chain multiple clauses together with commas/&ldquo;so&rdquo;/&ldquo;and&rdquo;). Tell the role-player WHEN to reveal the twist, so they don't blurt it out too early. Watch for prior-knowledge errors: don't give the patient knowledge (e.g. that it's a liver result) before the point in the consult where they'd actually learn it. Don't restate a SECONDARY reaction that's already scripted in Scenarios or Only-If-Asked (e.g. getting alarmed if the doctor says &ldquo;cirrhosis&rdquo;) — that belongs only in Scenarios/Only-If-Asked. But the CORE tension itself belongs in both, at different levels of detail: the Dilemma states the theme (e.g. &ldquo;you worry your drinking caused it&rdquo;), Scenarios own the precise execution (the exact trigger and how to ask). The closing &ldquo;the case tests…&rdquo; sentence can list a few things (gentle reveal, X, Y) — that's fine, it's still one direct sentence, not a fragment. Also fed to the AI grader as context. Never shown to the candidate."
        />
        <Field name="2. Opening Statement" what="The exact first line the patient says." contains="Verbatim, in the patient's own words. This is what they open the consultation with." />
        <Field name="3. If Asked to Explain Further" what="The next layer of detail, given freely once the doctor asks." contains="What the patient elaborates when prompted about the presenting complaint." />
        <Field
          name="4. Only Say If Directly Asked"
          what="Information the patient withholds unless the doctor specifically asks."
          contains="One item per line. Hidden agenda, sensitive details, red-flag negatives. The heart of many cases."
          tip="This is where a lot of the marks live — reward candidates who ask the right questions."
        />
        <Field name="5. ICE (Ideas, Concerns, Expectations)" what="The patient's mindset — it colours the whole performance." contains="Ideas (what they think is going on), Concerns (their main worry), Expectations (what they want from the visit)." />
        <Field
          name="6. Social History"
          what="Home, work, lifestyle — including the circumstances the case hinges on."
          contains="Write it as labelled lines — one per line as &ldquo;Label: value&rdquo; — and the labels render in bold. Use whatever labels the case needs: Occupation, Home, Smoking, Alcohol, Diet, Drugs, Family, Carer role."
          tip="Keep each line a concise fact, not a paragraph. Put any social barrier the case turns on here (childcare, transport, housing)."
        />
        <Field
          name="7. Past Medical History / 8. Medications & Allergies"
          what="Also shown here so the role-player can answer accurately."
          contains="Same content as the Doctor's Brief — the role-player needs to know their own history."
          tip="Documented facts (regular meds, results) belong in the record here, NOT scripted into the patient's speech or Scenarios. The patient's brief is for what they say/reveal; the record is for what's known."
        />
        <Field
          name="9. Specific Scenarios"
          what="Branching reactions — how the patient responds to what the doctor DOES or SUGGESTS."
          contains="&ldquo;If the doctor suggests/mentions/reveals X, react this way.&rdquo; Numbered. Optional. Behaviour and reactions only."
          tip="Facts the patient gives when asked (drinking amount, etc.) do NOT go here — they belong in Only-If-Asked, Social History, or the record."
        />
        <Field
          name="10. Questions for the Doctor"
          what="The question(s) the patient actively asks."
          contains="One question per line. These are things the role-player should raise during the consult."
          tip="If a question is important enough that it should always come up, put it here (not just in Trainer Q&A) so the role-player actually asks it."
        />
      </Card>

      <Card title="Data Gathering & Management" kicker="Assessment scaffolding">
        <Field name="Data Gathering" what="The key things a competent candidate should elicit." contains="One point per line — questions to ask, red flags to screen for, the working diagnosis to reach." />
        <Field
          name="Management"
          what="The expected management plan."
          contains="One step per line — reassurance, referrals, prescriptions, safety-netting."
          tip="Keep it tight. Over-long management lists are common in old cases — merge related points and cut low-value advice (e.g. non-evidence-based rest advice). Check every management step against NICE CKS before finalising — old-course cases sometimes state a threshold or rule confidently but wrong (e.g. gating antibiotics on a duration when the actual trigger is a clinical sign like discharge/perforation). Cite the real trigger, not an invented one, and link it inline on the phrase itself using &ldquo;[label](url)&rdquo; markdown syntax — e.g. &ldquo;[NICE guidance](https://cks.nice.org.uk/topics/otitis-media-acute/) supports…&rdquo; renders as a clickable link on the word &ldquo;guidance&rdquo;, not a raw URL. Never paste a bare https:// link or add a separate reference line — always wrap it in [label](url) so subscribers see clean text (this also works in Trainer Insight)."
        />
        <Field name="Marking Notes (per domain)" what="Extra examiner notes for Data Gathering, Clinical Management, and Relating to Others." contains="Any domain-specific expectations. Fed to the AI grader as context; not shown to subscribers." />
      </Card>

      <Card title="Example Conversation" kicker="Debrief — the model answer">
        <Field
          name="Example Conversation"
          what="A model answer in the candidate's own words: how to actually run the consultation, not just explain a result."
          contains="Write it as a DIALOGUE. Prefix each line with &ldquo;Doctor:&rdquo; or &ldquo;Patient:&rdquo; and it renders as a styled script. Model the whole interaction, including how the doctor handles the dilemma."
          tip="Keep it brief and easy for a patient to digest: short alternating turns, plain language, and don't recite numbers or stack several points at once (the results already appear in the brief). Avoid two Doctor lines back to back, and make sure the model doctor demonstrates the competency the case tests. Don't let the Patient's lines go flat — a string of one-word acknowledgements (&ldquo;Okay.&rdquo; &ldquo;I understand.&rdquo;) reads as dull. Give the patient at least one line that shows their actual dilemma-driven reaction (defensiveness, relief, worry, pushback), not just polite agreement."
        />
        <Field
          name="Rule of thumb for a strong conversation"
          what="Four things the model doctor should visibly do, not just get right."
          contains={
            <>
              <strong>1. Check understanding, then explain simply</strong> — ask what the patient already thinks/knows before explaining, and explain the diagnosis in plain terms, not jargon.
              <br />
              <strong>2. Tailor management to the patient</strong> — the plan should visibly respond to their circumstances (their work, their fears, their home situation), not read like a generic leaflet.
              <br />
              <strong>3. Chunk and check</strong> — don&rsquo;t deliver everything in one Doctor line. Break it into small pieces and check the patient is following before moving to the next.
              <br />
              <strong>4. Let Relating to Others shine where it&rsquo;s the point</strong> — if the case&rsquo;s dilemma is fundamentally an RTO case (a sensitive, non-clinical conversation), the dialogue should make that skill the visible centrepiece, not a rushed add-on after the clinical part.
            </>
          }
        />
      </Card>

      <Card title="Trainer Insight" kicker="Debrief — your teaching">
        <Field
          name="Message (bullets)"
          what="Your insight to the candidate about the case — NOT words to say."
          contains="One bullet per line: what the case really tests, common pitfalls, and what strong candidates do differently."
        />
        <Field
          name="Trainer Q&A"
          what="Questions candidates commonly ask you (as their trainer) about this case, and your answers."
          contains="Question + answer pairs. Shown below the Message in the same tab."
          tip="This is YOUR voice as the trainer — not questions the patient asks (those go in the Patient's Story)."
        />
      </Card>

      <Card title="Sample Consultation" kicker="Debrief — audio">
        <Field name="Sample Consultation (audio)" what="An audio recording of a good consultation for this case." contains="Upload an audio file. Optional — the tab is hidden if there's no audio." />
      </Card>

      <Card title="How the AI grader uses the case" kicker="Grading">
        <p className="text-[13.5px] leading-[1.7]" style={{ color: "rgba(51,51,51,0.8)" }}>
          The grader (currently Claude Haiku) is given the case facts as <strong>context, not a checklist</strong>: the Dilemma,
          reason for consultation, PMH, meds, recent notes, opening statement, if-asked / only-if-asked detail, social history,
          ICE, the patient&rsquo;s questions, data gathering, management, and the marking notes.
        </p>
        <p className="text-[13.5px] leading-[1.7]" style={{ color: "rgba(51,51,51,0.8)" }}>
          It credits the competency the candidate actually demonstrates, however it comes up, and does not penalise them for a
          question the patient never posed — with a safety carve-out (unsafe management given known meds/allergies/PMH lowers the
          Clinical Management mark). It grades only from the transcript and never fabricates. It also returns a single
          &ldquo;Focus for next time&rdquo; line.
        </p>
        <p className="text-[13px] leading-[1.6]" style={{ color: "rgba(51,51,51,0.6)" }}>
          Not fed to the grader (these are teaching material only): Example Conversation, Trainer Insight (Message + Q&A),
          Specific Scenarios, images.
        </p>
      </Card>
    </div>
  );
}
