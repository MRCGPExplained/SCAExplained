import { redirect, notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getCaseBankAccess } from "@/lib/case-bank-access";
import { isAdmin } from "@/lib/admin-auth";
import type { Station } from "@/lib/case-bank-types";
import { toCandidateStation } from "@/lib/case-bank-types";
import { getCurrentUser } from "@/lib/current-user";
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

  // Shared with the root layout and with isAdmin() below — all three used to
  // verify the same JWT separately on the way to rendering this one page.
  const user = await getCurrentUser();
  if (!user) redirect("/case-bank/login");

  // Together, not one after the other. Neither needs the other's answer, and
  // each is a round trip to a database in Ireland from a function in
  // Washington, which measured at 150-300ms a time — the admin lookup itself
  // runs in a tenth of a millisecond, so what it costs is the distance, not
  // the query. The station fetch below genuinely cannot join them: it picks
  // both its client and its filter out of `admin`.
  //
  // Guests (anonymous auth, joined via a room invite) never had anything to
  // buy — they can't be doctor so they never touch AI grading or GP review,
  // the whole reason the paywall exists. Let them browse freely.
  const [access, admin] = await Promise.all([
    user.is_anonymous ? null : getCaseBankAccess(supabase, user.id),
    isAdmin(),
  ]);
  if (access && !access.hasAccess) redirect("/case-bank/upgrade");

  // Fetch station. Admins can view hidden (unpublished) stations directly so
  // they can find their way back to the publish toggle after hiding one.
  //
  // That needs the service-role client, not a dropped filter. The only SELECT
  // policy on `stations` is `published = true AND auth.uid() IS NOT NULL` with
  // no admin bypass, so on the user's client Postgres re-applies the filter
  // whatever the query says — which made hiding a case 404 it for the person
  // who hid it, and made a newly authored case impossible to preview at all.
  // isAdmin() has already been checked on the server by this point.
  const stationReader = admin ? (getSupabaseAdmin() ?? supabase) : supabase;
  let stationQuery = stationReader.from("stations").select("*").eq("number", num);
  if (!admin) stationQuery = stationQuery.eq("published", true);
  const { data: station } = await stationQuery.single<Station>();

  if (!station) notFound();

  // Everything left is independent of everything else, so it goes in one
  // round trip rather than four. Only the star lookup needed the station at
  // all, and that is already in hand.
  //
  // The user's display name and initials are not among them — the case-bank
  // layout loads those once for the study-room session that outlives this page.
  const [{ data: prevStation }, { data: nextStation }, { count: totalCount }, { data: star }] = await Promise.all([
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
    supabase
      .from("stations")
      .select("id", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("station_stars")
      .select("id")
      .eq("user_id", user.id)
      .eq("station_id", station.id)
      .single<{ id: string }>(),
  ]);

  return (
    <StationPageClient
      // Stripped on the way out, not merely left unrendered: everything handed
      // to a client component is serialised into the page the browser
      // receives, so the marking notes were travelling to every candidate
      // inside the source of the case they were about to be graded on.
      station={toCandidateStation(station)}
      totalStations={totalCount ?? 246}
      prevStationNumber={prevStation?.number ?? null}
      nextStationNumber={nextStation?.number ?? null}
      initialStarred={!!star}
      isAdmin={admin}
    />
  );
}
