import { ContentPage, H2, H3, P, UL, LI, Divider, Notice } from "@/app/components/ContentPage";

export const metadata = {
  title: "FAQ — SCA Explained",
  description: "Answers to common questions about How To Get A Clear Pass and the SCA Intensive.",
};

export default function FAQPage() {
  return (
    <ContentPage
      title="Frequently Asked Questions"
      subtitle="Everything you need to know before booking."
    >
      <H2>The SCA</H2>

      <H3>What is the SCA?</H3>
      <P>
        The Simulated Consultation Assessment (SCA) is the clinical skills
        examination sat by GP trainees in their ST3 year. It consists of thirteen
        simulated ten-minute consultations assessed by trained RCGP examiners.
        Each consultation is marked against a defined set of criteria covering
        data-gathering, clinical management, and interpersonal skills.
      </P>

      <H3>Why do candidates fail the SCA?</H3>
      <P>
        The most common reason isn&apos;t a lack of medical knowledge — it&apos;s
        not knowing what examiners are specifically looking for. Candidates who
        consult competently in day-to-day practice can still fall short because
        they haven&apos;t learned to demonstrate the exact skills the mark scheme
        rewards: exploring ICE naturally, handling uncertainty, committing to
        plans, and managing emotion and expectations. That gap is exactly what
        SCA Explained addresses.
      </P>

      <Divider />
      <H2>How To Get A Clear Pass (Free Webinar)</H2>

      <H3>What is the webinar?</H3>
      <P>
        &quot;How To Get A Clear Pass&quot; is a free, 90–120 minute online
        training session. It covers how the SCA is marked, the most common
        reasons candidates don&apos;t pass, consultation structure, time
        management, ICE, safety-netting, shared decision making, communication,
        and the pitfalls that quietly cost marks.
      </P>

      <H3>Is it really free?</H3>
      <P>
        Yes — no charge, no card required. Book a date, and your place is
        confirmed immediately. You&apos;ll receive a confirmation email with the
        Zoom joining link.
      </P>

      <H3>How long is it?</H3>
      <P>
        Approximately 90–120 minutes, including time for questions.
      </P>

      <H3>How do I join?</H3>
      <P>
        After booking, you&apos;ll receive a confirmation email containing the
        Zoom join link. You don&apos;t need a Zoom account to join — just click
        the link at the session start time. We recommend joining a couple of
        minutes early.
      </P>

      <Divider />
      <H2>The SCA Intensive</H2>

      <H3>What is the SCA Intensive?</H3>
      <P>
        A small-group live workshop where active candidates practise realistic
        SCA consultations and receive detailed, examiner-style feedback. Each
        session has a maximum of two active candidates, each completing three
        consultations (six consultations total across the session). Observer
        places are also available for candidates who want to learn from watching
        before practising themselves.
      </P>

      <H3>What&apos;s the difference between an Active Candidate and an Observer?</H3>
      <UL>
        <LI>
          <strong>Active Candidate (£200)</strong> — you take part directly.
          You complete three realistic SCA consultations and receive individual
          examiner-style feedback, a score prediction, and a personalised
          improvement plan after each one.
        </LI>
        <LI>
          <strong>Observer (£50)</strong> — you watch both active candidates
          complete their consultations and receive the same feedback and
          teaching in real time. Ideal if you want to see the process in detail
          before booking an active place, or if you learn well by observation.
        </LI>
      </UL>

      <H3>How many people are in a session?</H3>
      <P>
        Each session has a maximum of two active candidates and a small number
        of observer places. This keeps the group small enough that feedback is
        genuinely individual and detailed — not generic group commentary.
      </P>

      <H3>How long does the Intensive run?</H3>
      <P>
        Approximately 2 hours. With two candidates each completing three
        consultations, plus feedback after each one, the session is substantial
        — plan to be available for the full duration.
      </P>

      <H3>What do I receive as an Active Candidate?</H3>
      <UL>
        <LI>Three realistic, SCA-style consultations (ten minutes each).</LI>
        <LI>Examiner-style feedback immediately after each consultation.</LI>
        <LI>A score prediction against the actual examiner criteria.</LI>
        <LI>Specific coaching on communication, structure, and management.</LI>
        <LI>An individual improvement plan to take into your exam preparation.</LI>
      </UL>

      <H3>Do I need to prepare anything?</H3>
      <P>
        No specific preparation is needed. Come as you would to a normal
        consultation. The cases are designed to reflect real SCA stations, so
        your everyday clinical knowledge is the foundation — the coaching is
        about how you demonstrate that knowledge in the consultation.
      </P>

      <H3>How do I join?</H3>
      <P>
        The same as the webinar — after your payment is confirmed, you&apos;ll
        receive an email with the Zoom join link. Intensive sessions use a Zoom
        Waiting Room; the host will admit participants at the start time.
      </P>

      <Divider />
      <H2>Booking and Payment</H2>

      <H3>How do I book?</H3>
      <P>
        Choose a date from the homepage, select your ticket type, enter your
        name and email, and follow the steps. Free webinar places are confirmed
        immediately. Intensive bookings go through our secure Stripe checkout.
      </P>

      <H3>Is payment secure?</H3>
      <P>
        Yes. Payments are handled entirely by{" "}
        <strong>Stripe</strong>, a certified PCI-compliant payment processor.
        We never see or store your card details.
      </P>

      <H3>Can I transfer or cancel my booking?</H3>
      <P>
        Please see our <a href="/terms" className="text-navy font-semibold border-b border-yellow/60 no-underline hover:border-yellow">Terms</a> for
        the full cancellation and transfer policy. In short: if you need to
        rearrange, contact us as early as possible at{" "}
        <a href="mailto:mrcgpexplained@outlook.com" className="text-navy font-semibold border-b border-yellow/60 no-underline hover:border-yellow">
          mrcgpexplained@outlook.com
        </a>{" "}
        and we&apos;ll do our best to help.
      </P>

      <H3>I have a question not answered here.</H3>
      <Notice>
        Email us at{" "}
        <a href="mailto:mrcgpexplained@outlook.com" className="font-semibold text-navy">
          mrcgpexplained@outlook.com
        </a>{" "}
        and we&apos;ll get back to you.
      </Notice>
    </ContentPage>
  );
}
