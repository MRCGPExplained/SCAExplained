import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import Link from "next/link";
import { RedeemLoggedIn } from "./RedeemLoggedIn";
import { RedeemGuest } from "./RedeemGuest";

const DARK = "#333333";
const YELLOW = "#F6D44B";

export default async function RedeemPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block no-underline">
            <span className="font-display font-extrabold text-[22px]" style={{ color: DARK }}>
              SCA <span style={{ color: YELLOW }}>Explained</span>
            </span>
          </Link>
        </div>

        {user ? <RedeemLoggedIn /> : <RedeemGuest />}
      </div>
    </div>
  );
}
