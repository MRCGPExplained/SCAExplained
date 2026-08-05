import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getCaseBankAccess } from "@/lib/case-bank-access";
import { PurchaseButton } from "./PurchaseButton";

export const dynamic = "force-dynamic";

const DARK = "#333333";

export default async function CaseBankUpgradePage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/case-bank/login?next=/case-bank/upgrade");

  const access = await getCaseBankAccess(supabase, user.id);
  if (access.hasAccess) redirect("/case-bank");

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[440px] rounded-2xl p-8 text-center" style={{ background: "white", border: "1px solid rgba(51,51,51,0.1)", boxShadow: "0 4px 24px rgba(51,51,51,0.07)" }}>
        <h1 className="font-display font-extrabold text-[22px] mb-2" style={{ color: DARK }}>
          Unlock the Case Bank
        </h1>
        <p className="text-[14px] leading-[1.65] mb-6" style={{ color: "rgba(51,51,51,0.6)" }}>
          The Complete SCA Programme gives you access to 250+ cases, unlimited AI review, and
          20 GP reviews — valid for 4 months.
        </p>
        <PurchaseButton />
        <p className="text-[12px] mt-6" style={{ color: "rgba(51,51,51,0.4)" }}>
          <Link href="/" className="font-semibold no-underline" style={{ color: DARK }}>← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
