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
      <H2 underline>Why SCA Explained exists</H2>

      <H3>Most preparation is based on assumption, not what RCGP examiners are actually looking for</H3>
      <P>
        There&apos;s a lot of SCA advice out there. Most of it is well-intentioned.
        But a significant amount is imprecise or simply not grounded in what the
        RCGP examiners are looking for. Everything I teach is anchored in the
        school of thought as explained by RCGP examiners, packaged and delivered
        to you.
      </P>

      <H3>Your time is limited — preparation should be high-yield</H3>
      <P>
        You&apos;re a GP trainee. You have clinics, e-learning, supervision, portfolio
        entries, and a life. The last thing you need is a course that pads its
        content to justify its price. SCA Explained is designed to give you the
        highest-yield insight in the least time. The free How To Get A Clear Pass
        webinar covers the essentials clearly. The Intensive gives you coached,
        realistic practice with genuine individual feedback. Nothing is there to
        fill time.
      </P>

      <Divider />

      <H2 underline>What we focus on</H2>
      <UL>
        <LI>
          <strong>Accuracy over anecdote.</strong> Everything is grounded in
          what RCGP examiners are actually instructed to look for — not rumour,
          not conventional wisdom.
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

      <Divider />

      {/* Bio */}
      <div className="flex gap-6 items-start max-sm:flex-col">
        <div className="shrink-0">
          <div className="w-[140px] h-[160px] rounded-2xl bg-navy relative overflow-hidden flex items-center justify-center max-sm:w-full max-sm:h-[180px]">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(135deg, rgba(246,212,75,0.06) 0px, rgba(246,212,75,0.06) 2px, transparent 2px, transparent 18px)",
              }}
            />
            <span className="relative text-white/35 text-[11px] font-semibold tracking-[0.04em]">
              Photo
            </span>
          </div>
          <p className="text-[11px] text-navy/45 mt-2 leading-[1.5]">
            BMS, MBBS, MRCGP
          </p>
        </div>
        <div className="pt-1">
          <p className="font-display font-bold text-[17px] text-navy mb-1.5">
            The Instructor
          </p>
          <p className="text-[14.5px] leading-[1.75] text-navy/75">
            A GP with a passion for medical education, always thinking about
            how to make the learning experience better for those in training.
          </p>
        </div>
      </div>
    </ContentPage>
  );
}
