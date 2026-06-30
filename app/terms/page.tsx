import { ContentPage, H2, H3, P, UL, LI, Divider } from "@/app/components/ContentPage";

export const metadata = {
  title: "Terms & Conditions — SCA Explained",
  description: "Booking terms and conditions for SCA Explained sessions.",
};

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms & Conditions"
      subtitle="Last updated: 30 June 2026"
    >
      <P>
        These terms govern your use of the SCA Explained website
        (scaexplained.com) and your booking of any session offered through it.
        By completing a booking you agree to these terms. Please read them
        before booking.
      </P>

      <H2>1. About us</H2>
      <P>
        SCA Explained provides online training and coaching for GP trainees
        preparing for the Simulated Consultation Assessment. Contact:{" "}
        <a
          href="mailto:mrcgpexplained@outlook.com"
          className="text-navy font-semibold border-b border-yellow/60 no-underline hover:border-yellow"
        >
          mrcgpexplained@outlook.com
        </a>
        .
      </P>

      <Divider />
      <H2>2. Our sessions</H2>

      <H3>How To Get A Clear Pass (free webinar)</H3>
      <P>
        This is a free online training session. Booking confirms your place at
        no charge. We reserve the right to limit places and to close bookings
        when capacity is reached.
      </P>

      <H3>SCA Intensive (paid workshop)</H3>
      <P>
        A live online workshop with a maximum of two active candidate places and
        a limited number of observer places per session. Prices are:
      </P>
      <UL>
        <LI>Active Candidate — £200 per session.</LI>
        <LI>Observer — £50 per session.</LI>
      </UL>
      <P>
        Prices include VAT where applicable. Payment is taken in full at the
        time of booking via our payment processor, Stripe.
      </P>

      <Divider />
      <H2>3. Booking confirmation</H2>
      <P>
        A booking is confirmed when:
      </P>
      <UL>
        <LI>
          For the free webinar: when you submit your booking form and receive a
          confirmation email.
        </LI>
        <LI>
          For a paid Intensive: when payment is successfully processed by Stripe
          and you receive a confirmation email. Submitting the form without
          completing payment does not constitute a confirmed booking.
        </LI>
      </UL>
      <P>
        Your confirmation email contains your Zoom joining link. Keep this
        safe — we do not display Zoom links publicly.
      </P>

      <Divider />
      <H2>4. Cancellations and transfers</H2>

      <H3>Cancellation by you</H3>
      <UL>
        <LI>
          <strong>More than 48 hours before the session:</strong> contact us at{" "}
          <a
            href="mailto:mrcgpexplained@outlook.com"
            className="text-navy font-semibold border-b border-yellow/60 no-underline hover:border-yellow"
          >
            mrcgpexplained@outlook.com
          </a>{" "}
          and we will offer a full refund or a transfer to another available
          date, at your choice.
        </LI>
        <LI>
          <strong>Within 48 hours of the session:</strong> we are unable to
          offer a refund, as places are allocated and preparation is under way.
          We will try to accommodate a transfer to a future date where possible,
          but this cannot be guaranteed.
        </LI>
        <LI>
          Free webinar places may be cancelled at any time with no charge.
        </LI>
      </UL>

      <H3>Cancellation by us</H3>
      <P>
        In the unlikely event that we need to cancel a session (for example, due
        to technical failure or insufficient bookings), we will notify you as
        soon as possible and offer either a full refund or a transfer to the
        next available date.
      </P>

      <H3>Non-attendance</H3>
      <P>
        If you do not attend a session without prior notice, no refund or
        transfer will be offered.
      </P>

      <Divider />
      <H2>5. Conduct during sessions</H2>
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
      <H2>6. Intellectual property</H2>
      <P>
        All content delivered in our sessions — including materials, feedback
        frameworks, case structures, and improvement plans — is the intellectual
        property of SCA Explained. You may use it for your own personal exam
        preparation only. You may not reproduce, distribute, or resell any part
        of our content without our written permission.
      </P>

      <Divider />
      <H2>7. Disclaimer</H2>
      <P>
        SCA Explained provides coaching and educational content to support your
        SCA preparation. Our sessions are designed to help you develop skills
        and understand examiner expectations — they are not a guarantee of any
        particular exam outcome.
      </P>
      <P>
        Content delivered in sessions is for educational purposes only and does
        not constitute medical advice. Clinical decisions in practice must always
        be made in accordance with current guidelines and your own professional
        judgement.
      </P>

      <Divider />
      <H2>8. Limitation of liability</H2>
      <P>
        To the fullest extent permitted by law, SCA Explained shall not be
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
      <H2>9. Governing law</H2>
      <P>
        These terms are governed by the laws of England and Wales. Any disputes
        shall be subject to the exclusive jurisdiction of the courts of England
        and Wales.
      </P>

      <Divider />
      <H2>10. Changes to these terms</H2>
      <P>
        We may update these terms from time to time. The version in force at the
        time of your booking is the one that applies to it. Material changes
        will be indicated by an updated date at the top of this page.
      </P>
    </ContentPage>
  );
}
