import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function lookupName(params: {
  b?: string;
  session_id?: string;
}): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const query = supabase.from("bookings").select("customer_name").limit(1);
  if (params.b) query.eq("id", params.b);
  else if (params.session_id)
    query.eq("stripe_checkout_session_id", params.session_id);
  else return null;
  const { data } = await query.single<{ customer_name: string }>();
  return data?.customer_name ?? null;
}

export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ b?: string; session_id?: string }>;
}) {
  const sp = await searchParams;
  const name = await lookupName(sp);
  const paid = !!sp.session_id;

  return (
    <main className="bg-cream min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-[480px] text-center">
        <div className="w-14 h-14 rounded-full bg-yellow mx-auto mb-6 flex items-center justify-center text-[26px]">
          ✓
        </div>
        <h1 className="font-display font-extrabold text-[30px] leading-[1.15] text-navy mb-3">
          {name ? `You're booked in, ${name}.` : "You're booked in."}
        </h1>
        <p className="text-[15px] leading-[1.65] text-navy/65 mb-2">
          {paid
            ? "Your payment was received and your place is confirmed."
            : "Your free place is confirmed."}
        </p>
        <p className="text-[15px] leading-[1.65] text-navy/65 mb-8">
          We&apos;ve emailed your confirmation and joining link. If it doesn&apos;t
          arrive within a few minutes, check your spam folder.
        </p>
        <Link
          href="/"
          className="inline-flex items-center rounded-lg bg-navy text-white font-semibold px-6 py-3 text-sm no-underline hover:-translate-y-0.5 transition-transform"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
