# SCA Explained

Premium SCA coaching site for GP trainees. Sells a **free webinar** ("What Makes
a Clear Pass") as the funnel and a paid **SCA Intensive** workshop. Built with
Next.js (App Router) + TypeScript + Tailwind v4, Supabase/Postgres, Stripe
Checkout, and Resend for email.

## Architecture at a glance

| Concern | Where |
| --- | --- |
| Homepage | `app/page.tsx` (+ `app/components/*`) |
| Booking pages (per date) | `app/book/{clear-pass-webinar,sca-intensive}/[date]/page.tsx` |
| Booking logic (RPC → Stripe / free confirm) | `app/book/actions.ts` |
| Stripe webhook | `app/api/webhooks/stripe/route.ts` |
| Confirmation page | `app/book/confirmed/page.tsx` |
| Shared events query (single source of truth) | `lib/events.ts` |
| DB schema + atomic reservation RPC | `supabase/schema.sql` |
| Sample dates | `supabase/seed.sql` |

Key design decisions live in `SCA_EXPLAINED_BUILD_BRIEF.md` (on the Desktop).

## Local setup

1. `cp .env.example .env.local` and fill in the values (see below).
2. `npm install`
3. `npm run dev` → http://localhost:3000

Without env vars the site still boots and renders the empty "no upcoming dates"
state — it won't crash.

## Environment variables

See `.env.example`. Summary:

- **Supabase** — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY` (secret, server-only).
- **Stripe** — `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and optionally
  `STRIPE_PRICE_ACTIVE` / `STRIPE_PRICE_OBSERVER` (the two reusable Price IDs).
- **Resend** — `RESEND_API_KEY`, `EMAIL_FROM` (a verified sender domain).
- **Site** — `NEXT_PUBLIC_SITE_URL` (used for Stripe success/cancel URLs).

## Supabase

1. In the SQL editor, run `supabase/schema.sql` (tables, availability view,
   `reserve_booking` RPC, RLS). Then optionally `supabase/seed.sql` for sample
   dates matching the original mockup.
2. All DB access is **server-side via the service-role key**. RLS is enabled
   with no public policies, so the anon key can read nothing — this guarantees
   `zoom_link` never leaks to a browser.
3. To add a real session: insert an `events` row (`event_type` `'webinar'` or
   `'intensive'`, full `start_time`/`end_time`, and a `zoom_link`) plus its
   `ticket_types`. Past dates drop off every list automatically.

## Stripe

1. Create **two persistent Prices** once (GBP): Active Candidate £150, Observer
   £50. Put their IDs in `STRIPE_PRICE_ACTIVE` / `STRIPE_PRICE_OBSERVER`. (If you
   skip this, checkout falls back to inline pricing from the DB amount.)
2. Add a webhook endpoint → `https://<your-domain>/api/webhooks/stripe`,
   subscribe to `checkout.session.completed`, and copy the signing secret into
   `STRIPE_WEBHOOK_SECRET`.
3. Local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
   and use the `whsec_…` it prints.
4. Identity verification can take a day or two before live payments are enabled
   — start early.

## Zoom (manual for MVP)

Create each session's meeting by hand and paste the join link into that event's
`zoom_link`. Use a **Waiting Room** for Intensives. The link is emailed on
confirmation only — never shown on a public page.

## Booking flow

1. User picks a ticket + date → `createBooking` server action.
2. `reserve_booking` RPC reserves a seat in a single locked transaction
   (prevents two people grabbing the last Intensive seat at once).
3. **Paid** → Stripe Checkout (our UUIDs ride along in `metadata`) → webhook
   marks the booking `paid` → confirmation email with Zoom link.
   **Free** → confirmed immediately by the RPC → confirmation email sent on the
   spot → straight to `/book/confirmed`.

## Still to do before public launch

- Real, licensed GP/consultation hero photo (placeholder in `app/page.tsx`).
- FAQ / **Privacy** / **Terms** pages — Privacy & Terms are not optional once
  the site takes payments and stores personal data (UK GDPR).
- SEO/OG metadata, accessibility/contrast pass, mobile QA.
- Point the `scaexplained` domain at Vercel.
