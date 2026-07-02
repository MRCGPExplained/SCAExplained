import { redirect, notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import type { Station } from "@/lib/case-bank-types";
import { StationPageClient } from "../components/StationPageClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ station_number: string }>;
}

export default async function StationPage({ params }: PageProps) {
  const { station_number } = await params;
  const num = parseInt(station_number, 10);
  if (isNaN(num)) notFound();

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

  // Fetch station
  const { data: station } = await supabase
    .from("stations")
    .select("*")
    .eq("number", num)
    .eq("published", true)
    .single<Station>();

  if (!station) notFound();

  // Fetch prev/next station numbers
  const [{ data: prevStation }, { data: nextStation }] = await Promise.all([
    supabase
      .from("stations")
      .select("number")
      .eq("published", true)
      .lt("number", num)
      .order("number", { ascending: false })
      .limit(1)
      .single<{ number: number }>(),
    supabase
      .from("stations")
      .select("number")
      .eq("published", true)
      .gt("number", num)
      .order("number", { ascending: true })
      .limit(1)
      .single<{ number: number }>(),
  ]);

  // Fetch total station count
  const { count: totalCount } = await supabase
    .from("stations")
    .select("id", { count: "exact", head: true })
    .eq("published", true);

  const [{ data: star }, { data: profile }] =
    await Promise.all([
      supabase
        .from("station_stars")
        .select("id")
        .eq("user_id", user.id)
        .eq("station_id", station.id)
        .single<{ id: string }>(),
      supabase
        .from("user_profiles")
        .select("display_name,initials")
        .eq("id", user.id)
        .single<{ display_name: string; initials: string }>(),
    ]);

  return (
    <StationPageClient
      station={station}
      userId={user.id}
      totalStations={totalCount ?? 246}
      prevStationNumber={prevStation?.number ?? null}
      nextStationNumber={nextStation?.number ?? null}
      initialStarred={!!star}
      userDisplayName={profile?.display_name ?? user.email ?? ""}
      userInitials={profile?.initials ?? "?"}
    />
  );
}
