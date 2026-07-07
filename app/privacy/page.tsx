import { ContentPage, H2, H3, P, UL, LI, Divider } from "@/app/components/ContentPage";

export const metadata = {
  title: "Privacy Policy — SCA Explained",
  description: "How SCA Explained collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      subtitle="Last updated: 30 June 2026"
    >
      <P>
        This policy explains what personal data SCA Explained collects, why,
        how it is used, and your rights under UK data protection law (UK GDPR
        and the Data Protection Act 2018).
      </P>

      <H2>Who we are</H2>
      <P>
        SCA Explained is the data controller for the personal data described in
        this policy. If you have any questions, you can contact us at{" "}
        <a
          href="mailto:mrcgpexplained@outlook.com"
          className="font-semibold no-underline border-b-2" style={{ color: "#333333", borderColor: "rgba(246,212,75,0.60)" }}
        >
          mrcgpexplained@outlook.com
        </a>
        .
      </P>

      <Divider />
      <H2>What data we collect and why</H2>

      <H3>Booking data</H3>
      <P>
        When you book a place at a webinar or SCA Intensive, we collect your
        name and email address. We use this to:
      </P>
      <UL>
        <LI>Confirm your booking and send you the Zoom joining link.</LI>
        <LI>Contact you about your booking if anything changes.</LI>
      </UL>
      <P>
        The lawful basis for this processing is <strong>contract performance</strong>{" "}
        — we need your details to provide the service you&apos;ve booked.
      </P>

      <H3>Payment data</H3>
      <P>
        Payments for the SCA Intensive are processed by{" "}
        <strong>Stripe</strong>. We never receive or store your card number,
        CVV, or other sensitive payment details — these go directly to Stripe
        and are subject to their own privacy policy. We do store a Stripe
        checkout session reference alongside your booking record, so we can
        confirm payment status.
      </P>

      <H3>Technical data</H3>
      <P>
        Our hosting infrastructure (Vercel) and database (Supabase) may log
        standard server access data such as IP addresses and request timestamps
        for security and operational purposes. We do not use this data to
        profile or track individual users.
      </P>

      <H3>Cookies</H3>
      <P>
        This site does not use advertising, analytics, or tracking cookies. The
        only cookies set are those required for the website to function
        (e.g. session state during the checkout flow). No consent banner is
        required for strictly necessary cookies under UK law.
      </P>

      <Divider />
      <H2>How long we keep your data</H2>
      <P>
        We keep booking records (name, email, payment reference, booking status)
        for up to two years from the date of the session, after which they are
        deleted. We may retain anonymised booking counts for longer for our own
        internal records (e.g. how many sessions we have run).
      </P>

      <Divider />
      <H2>Who we share your data with</H2>
      <P>
        We share data only to the extent necessary to provide the service:
      </P>
      <UL>
        <LI>
          <strong>Stripe</strong> — to process your payment. Stripe processes
          payment data as an independent data controller under their own terms.
        </LI>
        <LI>
          <strong>Resend</strong> — to send transactional emails (booking
          confirmations). Your email address is passed to Resend solely to
          deliver your confirmation.
        </LI>
        <LI>
          <strong>Supabase / Vercel</strong> — infrastructure providers that
          host the database and website. These act as data processors on our
          behalf and are contractually bound to appropriate data protection
          standards.
        </LI>
        <LI>
          <strong>Zoom</strong> — you join sessions via a Zoom link. Zoom
          processes data about session participants under their own terms. We
          do not share your personal data with Zoom; your name and email are
          not transmitted to Zoom by us.
        </LI>
      </UL>
      <P>
        We do not sell, rent, or share your personal data with third parties
        for marketing purposes.
      </P>

      <Divider />
      <H2>Your rights</H2>
      <P>Under UK GDPR you have the right to:</P>
      <UL>
        <LI>
          <strong>Access</strong> — request a copy of the personal data we hold
          about you.
        </LI>
        <LI>
          <strong>Rectification</strong> — ask us to correct inaccurate data.
        </LI>
        <LI>
          <strong>Erasure</strong> — ask us to delete your data, where we have
          no overriding legal obligation to retain it.
        </LI>
        <LI>
          <strong>Restriction</strong> — ask us to limit how we process your
          data in certain circumstances.
        </LI>
        <LI>
          <strong>Portability</strong> — receive your data in a structured,
          machine-readable format.
        </LI>
        <LI>
          <strong>Object</strong> — object to processing based on legitimate
          interests. (We do not rely on legitimate interests as a basis for any
          processing described in this policy.)
        </LI>
      </UL>
      <P>
        To exercise any of these rights, email us at{" "}
        <a
          href="mailto:mrcgpexplained@outlook.com"
          className="font-semibold no-underline border-b-2" style={{ color: "#333333", borderColor: "rgba(246,212,75,0.60)" }}
        >
          mrcgpexplained@outlook.com
        </a>
        . We will respond within one month. We will not charge a fee for
        reasonable requests.
      </P>

      <Divider />
      <H2>Complaints</H2>
      <P>
        If you are unhappy with how we have handled your data, you have the
        right to lodge a complaint with the UK&apos;s supervisory authority, the
        Information Commissioner&apos;s Office (ICO), at{" "}
        <a
          href="https://ico.org.uk/make-a-complaint"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold no-underline border-b-2" style={{ color: "#333333", borderColor: "rgba(246,212,75,0.60)" }}
        >
          ico.org.uk/make-a-complaint
        </a>
        . We would, however, appreciate the opportunity to address your concern
        directly first.
      </P>

      <Divider />
      <H2>Changes to this policy</H2>
      <P>
        If we make material changes to this policy, we will update the date at
        the top of this page. We recommend checking back periodically.
      </P>
    </ContentPage>
  );
}
