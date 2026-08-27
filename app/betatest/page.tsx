import Link from "next/link";
import BetatestTabs from "./BetatestTabs";
import { getBetatestAccess } from "./access";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";

export const dynamic = "force-dynamic";

const DARK = "#333333";
const YELLOW = "#F6D44B";

type StationRow = { id: string; number: number; title: string; subject: string };

export default async function BetatestPage() {
  const { allowed, loggedIn } = await getBetatestAccess();

  let stations: StationRow[] = [];
  if (allowed) {
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
              SCA <span style={{ color: YELLOW }}>Focus</span>
            </span>
          </Link>
          <span className="text-[11px] font-bold px-2 py-1 rounded-full" style={{ background: YELLOW, color: DARK }}>
            Beta
          </span>

        </div>
      </div>

      <div className="max-w-[680px] mx-auto px-6 pt-8">
        {allowed ? (
          <BetatestTabs stations={stations} />
        ) : (
          <div className="flex flex-col items-center justify-center pt-20">
            <div
              className="w-full max-w-[380px] rounded-2xl p-8 bg-white text-center"
              style={{ border: "1px solid rgba(51,51,51,0.10)", boxShadow: "0 4px 24px rgba(51,51,51,0.07)" }}
            >
              <h1 className="font-display font-bold text-[20px] mb-2" style={{ color: DARK }}>
                Beta tools
              </h1>
              <p className="text-[13px] leading-[1.6] mb-6" style={{ color: "rgba(51,51,51,0.55)" }}>
                {loggedIn
                  ? "This account doesn't have beta access. Ask an admin to switch it on for you."
                  : "Log in with an account that has beta access to continue."}
              </p>
              {!loggedIn && (
                <Link
                  href="/login?next=/betatest"
                  className="inline-block no-underline rounded-lg px-5 py-2.5 font-display font-bold text-[14px]"
                  style={{ background: DARK, color: "white" }}
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
