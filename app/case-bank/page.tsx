import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getCaseBankAccess } from "@/lib/case-bank-access";
import type { StationListRow } from "@/lib/case-bank-types";
import { StationListClient } from "./components/StationListClient";

export const dynamic = "force-dynamic";

export default async function CaseBankPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/case-bank/login");

  // Guests (anonymous auth, joined via a room invite) never had anything to
  // buy — they can't be doctor so they never touch AI grading or GP review,
  // the whole reason the paywall exists. Let them browse freely.
  if (!user.is_anonymous) {
    const access = await getCaseBankAccess(supabase, user.id);
    if (!access.hasAccess) redirect("/case-bank/upgrade");
  }

  // Fetch all published stations
  const { data: stations } = await supabase
    .from("stations")
    .select("id,number,title,subject,consultation_type,published,archived")
    .eq("published", true)
    .order("number", { ascending: true })
    .returns<StationListRow[]>();

  const [{ data: stars }, { data: profile }] = await Promise.all([
    supabase.from("station_stars").select("station_id").eq("user_id", user.id),
    supabase.from("user_profiles").select("last_station_number").eq("id", user.id).single<{ last_station_number: number | null }>(),
  ]);

  const starredIds = new Set((stars ?? []).map((s: { station_id: string }) => s.station_id));

  return (
    <StationListClient
      stations={stations ?? []}
      starredIds={[...starredIds]}
      lastStation={profile?.last_station_number ?? null}
    />
  );
}
