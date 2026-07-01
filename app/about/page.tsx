import type { Metadata } from "next";
import { ContentPage, H2, H3, P, UL, LI, Divider } from "@/app/components/ContentPage";

export const metadata: Metadata = {
  title: "About — SCA Explained",
  description:
    "SCA Explained was built by a GP with a passion for medical education — grounded in RCGP guidance, designed to be high-yield and respect your time.",
};

export default function AboutPage() {
  return (
    <ContentPage
      title="About SCA Explained"
      subtitle="Built by a GP, for GP trainees."
    >
      <H2>Who I am</H2>
      <P>
        I&apos;m a GP with a genuine passion for medical education. I&apos;ve spent a
        significant amount of time thinking about how doctors learn — not just
        what they need to know, but how to make that learning stick, stay
        accurate, and actually change what happens in a consultation.
      </P>
      <P>
        The SCA brought that interest into sharp focus. It&apos;s an exam that
        assesses consultation skills, not clinical knowledge — and yet most
        trainees prepare for it as if it were the other way around. I built SCA
        Explained to fix that.
      </P>

      <Divider />

      <H2>Why SCA Explained exists</H2>

      <H3>Most preparation is based on assumption, not what RCGP actually says</H3>
      <P>
        There&apos;s a lot of SCA advice out there. Most of it is well-intentioned.
        But a significant amount is imprecise, extrapolated from CSA muscle
        memory, or simply not grounded in what the RCGP examiners are actually
        told to score. Misconceptions spread quickly in registrar cohorts, and
        they can be genuinely costly on exam day.
      </P>
      <P>
        Everything I teach is anchored in RCGP guidance — the actual criteria,
        the actual language, the actual domains. Not interpretation. Not
        &quot;this is what worked for me.&quot; The source material itself. That
        discipline matters.
      </P>

      <H3>Your time is limited — preparation should be high-yield</H3>
      <P>
        You&apos;re a GP trainee. You have clinics, e-learning, supervision,
        portfolio entries, and a life. The last thing you need is a course that
        pads its content to justify its price.
      </P>
      <P>
        SCA Explained is designed to give you the highest-yield insight in the
        least time. The free How To Get A Clear Pass webinar covers the
        essentials clearly. The Intensive gives you coached, realistic practice
        with genuine individual feedback. Nothing is there to fill time.
      </P>

      <Divider />

      <H2>What we focus on</H2>
      <UL>
        <LI>
          <strong>Accuracy over anecdote.</strong> Everything is grounded in
          what RCGP examiners are actually instructed to look for — not rumour,
          not convention wisdom.
        </LI>
        <LI>
          <strong>Skills over knowledge.</strong> The SCA scores consultation
          skills. ICE, shared decision-making, handling uncertainty, managing
          emotion — these are the domains that matter and the ones we practise.
        </LI>
        <LI>
          <strong>Efficiency.</strong> Concise, direct, no filler. Your
          preparation time is finite and should be spent on what actually moves
          the needle.
        </LI>
        <LI>
          <strong>Honest feedback.</strong> In the Intensive, you&apos;ll hear what
          you&apos;re doing well and what&apos;s costing you marks — including the subtle
          habits examiners notice that most people never get told about.
        </LI>
      </UL>
    </ContentPage>
  );
}
