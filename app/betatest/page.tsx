import { cookies } from "next/headers";
import Link from "next/link";
import VoiceLoop from "./VoiceLoop";
import PasswordForm from "./PasswordForm";
import SoloRecordingTest from "./SoloRecordingTest";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

export const dynamic = "force-dynamic";

const DARK = "#333333";
const YELLOW = "#F6D44B";

type StationRow = { id: string; number: number; title: string; subject: string };

export default async function BetatestPage() {
  const cookieStore = await cookies();
  const unlocked = cookieStore.get("betatest_unlocked")?.value === "1";

  let stations: StationRow[] = [];
  if (unlocked) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("stations")
      .select("id, number, title, subject")
      .eq("published", true)
      .order("number", { ascending: true })
      .returns<StationRow[]>();
    stations = data ?? [];
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
      <div className="px-6 pt-8 pb-4 border-b" style={{ borderColor: "rgba(51,51,51,0.08)" }}>
        <div className="max-w-[680px] mx-auto flex items-center justify-between">
          <Link href="/" className="no-underline">
            <span className="font-display font-extrabold text-[18px]" style={{ color: DARK }}>
              SCA <span style={{ color: YELLOW }}>Explained</span>
            </span>
          </Link>
          <span className="text-[11px] font-bold px-2 py-1 rounded-full" style={{ background: YELLOW, color: DARK }}>
            Beta
          </span>
        </div>
      </div>

      <div className="max-w-[680px] mx-auto px-6 pt-8">
        {unlocked ? (
          <div className="flex flex-col gap-12">
            <SoloRecordingTest stations={stations} />
            <div style={{ borderTop: "1px solid rgba(51,51,51,0.08)", paddingTop: "2rem" }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] mb-6" style={{ color: "rgba(51,51,51,0.35)" }}>AI Roleplay (voice loop)</p>
              <VoiceLoop />
            </div>
          </div>
        ) : (
          <PasswordForm />
        )}
      </div>
    </div>
  );
}
