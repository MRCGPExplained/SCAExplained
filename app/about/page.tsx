import type { Metadata } from "next";
import { ContentPage, H2, H3, P, UL, LI, Divider } from "@/app/components/ContentPage";

export const metadata: Metadata = {
  title: "About: SCA Focus",
  description:
    "SCA Focus is built by two GPs with a passion for medical education: grounded in RCGP guidance, designed to be high-yield and respect your time.",
};

/**
 * Kept in step with what the site actually sells. This page had drifted into
 * describing a different business: a free webinar under a name it no longer
 * goes by, and an "Intensive" that is not among the things anyone can buy —
 * the coached-practice-with-feedback product is the case bank, the AI pass
 * and the GP reviews now. It also spoke as one person, in the first person
 * singular, and there are two.
 */
export default function AboutPage() {
  return (
    <ContentPage
      title="About SCA Focus"
      subtitle="Built by two GPs, for GP trainees."
    >
      <H2 underline>Why SCA Focus exists</H2>

      <H3>Most preparation is based on assumption, not what RCGP examiners are actually looking for</H3>
      <P>
        There&apos;s a lot of SCA advice out there. Most of it is well-intentioned.
        But a significant amount is imprecise or simply not grounded in what the
        RCGP examiners are looking for. Everything we teach is anchored in the
        school of thought as explained by RCGP examiners, packaged and delivered
        to you.
      </P>

      <H3>Your time is limited: preparation should be high-yield</H3>
      <P>
        You&apos;re a GP trainee. You have clinics, e-learning, supervision, portfolio
        entries, and a life. The last thing you need is a course that pads its
        content to justify its price. SCA Focus is designed to give you the
        highest-yield insight in the least time. The free monthly webinar covers
        the essentials clearly. The programme gives you 240+ cases to work
        through with a study partner, a provisional score within minutes of
        every consultation you record, and twenty of those read by a GP who
        writes back about what actually happened in yours. Nothing is there to
        fill time.
      </P>

      <Divider />

      <H2 underline>What we focus on</H2>
      <UL>
        <LI>
          <strong>Accuracy over anecdote.</strong> Everything is grounded in
          what RCGP examiners are actually instructed to look for, not rumour,
          not conventional wisdom.
        </LI>
        <LI>
          <strong>Skills over knowledge.</strong> The SCA scores consultation
          skills. ICE, shared decision-making, handling uncertainty, managing
          emotion: these are the domains that matter and the ones we practise.
        </LI>
        <LI>
          <strong>Efficiency.</strong> Concise, direct, no filler. Your
          preparation time is finite and should be spent on what actually moves
          the needle.
        </LI>
        <LI>
          {/* Explicit space: the plain one after </strong> was being dropped
              here, rendering "feedback.Send", while the identical construct in
              the three bullets above survived. */}
          <strong>Honest feedback.</strong>{" "}
          Send a consultation for GP review
          and you&apos;ll hear what you did well and what cost you marks, including
          the subtle habits that get noticed and that most people never get told
          about.
        </LI>
      </UL>

      <Divider />

      {/* Bios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {(
          [
            {
              name: "Dr Brandon Ten-Fah",
              quals: "BMS, MBBS, MRCGP",
              bio: "A GP with a passion for medical education, always thinking about how to make the learning experience better for those in training.",
            },
            {
              name: "Dr Oladotun Arogun",
              quals: "MBBS, MRCGP",
              bio: "A GP and medical educator, writing the cases and reading the consultations you send for review.",
            },
          ] as const
        ).map(({ name, quals, bio }) => (
          <div key={name} className="flex gap-5 items-start max-sm:flex-col">
            <div className="shrink-0">
              <div className="w-[118px] h-[136px] rounded-2xl bg-navy relative overflow-hidden flex items-center justify-center max-sm:w-full max-sm:h-[180px]">
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
              {quals && (
                <p className="text-[11px] text-navy/45 mt-2 leading-[1.5]">{quals}</p>
              )}
            </div>
            <div className="pt-1 min-w-0">
              <p className="font-display font-bold text-[16px] text-navy mb-1.5">{name}</p>
              <p className="text-[14px] leading-[1.7] text-navy/75">{bio}</p>
            </div>
          </div>
        ))}
      </div>
    </ContentPage>
  );
}
