import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import type { StationListRow } from "@/lib/case-bank-types";
import { StationListClient } from "./components/StationListClient";

export const dynamic = "force-dynamic";

export default async function CaseBankPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/case-bank/login");

  // Check active access
  const { data: access } = await supabase
    .from("user_access")
    .select("expires_at")
    .eq("user_id", user.id)
    .eq("has_programme", true)
    .gt("expires_at", new Date().toISOString())
    .single<{ expires_at: string }>();

  if (!access) redirect("/programme");

  // Fetch all published stations
  const { data: stations } = await supabase
    .from("stations")
    .select("id,number,title,subject,consultation_type,published")
    .eq("published", true)
    .order("number", { ascending: true })
    .returns<StationListRow[]>();

  const { data: stars } = await supabase
    .from("station_stars")
    .select("station_id")
    .eq("user_id", user.id);

  const starredIds = new Set((stars ?? []).map((s: { station_id: string }) => s.station_id));

  return (
    <StationListClient
      stations={stations ?? []}
      starredIds={[...starredIds]}
    />
  );
}
