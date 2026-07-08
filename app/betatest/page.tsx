import { cookies } from "next/headers";
import Link from "next/link";
import VoiceLoop from "./VoiceLoop";
import PasswordForm from "./PasswordForm";

export const dynamic = "force-dynamic";

const DARK = "#333333";
const YELLOW = "#F6D44B";

export default async function BetatestPage() {
  const cookieStore = await cookies();
  const unlocked = cookieStore.get("betatest_unlocked")?.value === "1";

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
      <div className="px-6 pt-8 pb-4 border-b" style={{ borderColor: "rgba(51,51,51,0.08)" }}>
        <div className="max-w-[560px] mx-auto flex items-center justify-between">
          <Link href="/" className="no-underline">
            <span className="font-display font-extrabold text-[18px]" style={{ color: DARK }}>
              SCA <span style={{ color: YELLOW }}>Explained</span>
            </span>
          </Link>
          <span className="text-[11px] font-bold px-2 py-1 rounded-full" style={{ background: YELLOW, color: DARK }}>
            AI Roleplay · Beta
          </span>
        </div>
      </div>

      <div className="max-w-[560px] mx-auto px-6 pt-8">
        {unlocked ? (
          <VoiceLoop />
        ) : (
          <PasswordForm />
        )}
      </div>
    </div>
  );
}
