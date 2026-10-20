import { ContentPage, H2, H3, P, UL, LI, Divider } from "@/app/components/ContentPage";

export const metadata = {
  title: "Terms & Conditions, SCA Focus",
  description: "Booking terms and conditions for SCA Focus sessions.",
};

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms & Conditions"
      subtitle="Last updated: 3 August 2026"
    >
      <P>
        These terms govern your use of the SCA Focus website
        (scafocus.com) and your booking of any session offered through it.
        By completing a booking you agree to these terms. Please read them
        before booking.
      </P>

      <H2>1. About us</H2>
      <P>
        SCA Focus provides online training and coaching for GP trainees
        preparing for the Simulated Consultation Assessment. Contact:{" "}
        <a
          href="mailto:mrcgpexplained@outlook.com"
          className="font-semibold no-underline border-b-2" style={{ color: "#333333", borderColor: "rgba(246,212,75,0.60)" }}
        >
          mrcgpexplained@outlook.com
        </a>
        .
      </P>

      <Divider />
      <H2>2. Our sessions</H2>
      <P>
        We offer online training sessions delivered via Zoom. Details of
        available sessions, including format and pricing, are shown on the
        website at the time of booking. Where a session requires payment,
        this is taken in full at the time of booking via our payment processor,
        Stripe. A booking is confirmed once payment is successfully processed
        or, for free sessions, once you receive a confirmation email. Your
        Zoom joining link will be sent to you by email. Please keep this safe
        as we do not display session links publicly.
      </P>

      <Divider />
      <H2>3. Plans: purchases and refunds</H2>
      <P>
        Access to the Case Bank is sold as one of three plans. Each is a
        one-off payment giving access for 4 months from the date of purchase,
        and each includes the full case bank of 240+ stations, study groups,
        and unlimited recording and transcription. The plans differ in two
        allowances: the number of AI gradings and the number of GP reviews
        they include. The current plans, their prices and their allowances
        are set out on our homepage, and the allowance granted to you is the
        one shown at the point you paid.
      </P>
      <P>
        Recording a consultation and having it transcribed does not use
        either allowance. An AI grading is used only when you choose to send
        a transcript for AI grading, and a GP review credit is used only when
        you choose to submit one for review, at which point it is queued for
        a GP to assess and finalise your feedback. Where an AI grading fails
        for technical reasons it is not counted against your allowance.
      </P>
      <P>
        Both allowances may be extended by purchasing a top-up. A top-up adds
        to the relevant balance and does not change your plan or the date it
        expires. Unused allowances expire with your access and are not
        refundable. Allowances and access are personal to your account and
        are non-transferable; we may contact you if usage suggests an account
        is being shared or resold, and reserve the right to suspend access in
        such cases.
      </P>
      <P>
        By completing a purchase you expressly request that the digital
        service begins immediately and acknowledge that, in doing so, you
        waive your right to cancel under the Consumer Contracts (Information,
        Cancellation and Additional Charges) Regulations 2013. Purchases are
        non-refundable once made. Access is personal to your account and may
        not be shared, resold, or transferred.
      </P>
      <P>
        Audio recordings submitted through the platform are stored for up to
        3 months from the date of submission, after which they are permanently
        deleted from our systems. Transcripts and examiner feedback are retained
        for up to 2 years from the date of submission.
      </P>
      <P>
        This does not affect your statutory rights in respect of defective or
        misdescribed products, nor does it limit our liability for fraud or any
        matter that cannot be excluded by law. If you experience a technical
        fault that prevents you from using credits you have purchased, please
        contact us at{" "}
        <a
          href="mailto:mrcgpexplained@outlook.com"
          className="font-semibold no-underline border-b-2" style={{ color: "#333333", borderColor: "rgba(246,212,75,0.60)" }}
        >
          mrcgpexplained@outlook.com
        </a>{" "}
        and we will resolve the issue.
      </P>

      <Divider />
      <H2>4. Conduct during sessions</H2>
      <P>
        All participants are expected to behave professionally and respectfully
        towards other attendees, the facilitator, and any simulated patients.
        We reserve the right to remove any participant whose conduct is
        disruptive or inappropriate, without refund.
      </P>
      <P>
        Sessions (including any simulated consultations) must not be recorded
        without the prior written consent of all participants.
      </P>

      <Divider />
      <H2>5. Intellectual property</H2>
      <P>
        All content delivered in our sessions (including materials, feedback
        frameworks, case structures, and improvement plans) is the intellectual
        property of SCA Focus. You may use it for your own personal exam
        preparation only. You may not reproduce, distribute, or resell any part
        of our content without our written permission.
      </P>

      <Divider />
      <H2>6. Disclaimer</H2>
      <P>
        SCA Focus provides coaching and educational content to support your
        SCA preparation. Our sessions are designed to help you develop skills
        and understand examiner expectations. They are not a guarantee of any
        particular exam outcome.
      </P>
      <P>
        Content delivered in sessions is for educational purposes only and does
        not constitute medical advice. Clinical decisions in practice must always
        be made in accordance with current guidelines and your own professional
        judgement.
      </P>

      <Divider />
      <H2>7. Limitation of liability</H2>
      <P>
        To the fullest extent permitted by law, SCA Focus shall not be
        liable for any indirect, incidental, or consequential losses arising
        from your use of our services, including (without limitation) any loss
        of income, exam fees, or opportunity costs. Our total liability for any
        claim arising from a booking shall not exceed the amount you paid for
        that booking.
      </P>
      <P>
        Nothing in these terms limits our liability for death or personal injury
        caused by our negligence, fraud, or any other liability that cannot be
        excluded by law.
      </P>

      <Divider />
      <H2>8. Governing law</H2>
      <P>
        These terms are governed by the laws of England and Wales. Any disputes
        shall be subject to the exclusive jurisdiction of the courts of England
        and Wales.
      </P>

      <Divider />
      <H2>9. Changes to these terms</H2>
      <P>
        We may update these terms from time to time. The version in force at the
        time of your booking is the one that applies to it. Material changes
        will be indicated by an updated date at the top of this page.
      </P>
    </ContentPage>
  );
}
