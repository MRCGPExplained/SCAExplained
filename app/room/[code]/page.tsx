import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-case-bank";
import { RoomGatewayClient } from "./RoomGatewayClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function RoomGatewayPage({ params }: PageProps) {
  const { code } = await params;
  const roomCode = code.toUpperCase();

  const admin = getSupabaseAdmin();
  const { data: room } = admin
    ? await admin
        .from("study_rooms")
        .select("id, current_station_number, host_user_id")
        .eq("room_code", roomCode)
        .maybeSingle<{ id: string; current_station_number: number | null; host_user_id: string }>()
    : { data: null };

  if (!room) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6" style={{ background: "#FAFAF8" }}>
        <div className="text-center max-w-[380px]">
          <h1 className="font-display font-extrabold text-[22px] mb-2" style={{ color: "#333333" }}>
            Room not found
          </h1>
          <p className="text-[14px]" style={{ color: "rgba(51,51,51,0.6)" }}>
            This link doesn&apos;t match an active study group. Double-check it with whoever shared it.
          </p>
        </div>
      </main>
    );
  }

  // Already signed in (real account or an unexpired guest session) — join
  // straight in, no need to show the choice screen again.
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { count } = await supabase
      .from("room_participants")
      .select("user_id", { count: "exact", head: true })
      .eq("room_id", room.id)
      .eq("user_id", user.id);

    if (!count) {
      // Stops a stale/abandoned room link being used once its owner has
      // left — only the host themselves can "revive" their own room.
      if (user.id !== room.host_user_id) {
        const { count: hostPresent } = await admin!
          .from("room_participants")
          .select("user_id", { count: "exact", head: true })
          .eq("room_id", room.id)
          .eq("user_id", room.host_user_id);

        if (!hostPresent) {
          return (
            <main className="min-h-screen flex items-center justify-center px-6" style={{ background: "#FAFAF8" }}>
              <div className="text-center max-w-[380px]">
                <h1 className="font-display font-extrabold text-[22px] mb-2" style={{ color: "#333333" }}>
                  Room no longer active
                </h1>
                <p className="text-[14px]" style={{ color: "rgba(51,51,51,0.6)" }}>
                  This room&apos;s host isn&apos;t in it anymore. Ask them to start a new session and share the new link.
                </p>
              </div>
            </main>
          );
        }
      }

      const { count: total } = await supabase
        .from("room_participants")
        .select("user_id", { count: "exact", head: true })
        .eq("room_id", room.id);

      // Joining has to succeed before the redirect, not alongside it. Being in
      // a room is a row in this table: without one you still get the panel —
      // the provider only needs to be able to read the room — but nobody can
      // see you in the participant list, and every action that checks
      // membership refuses you, including assigning roles. Silently redirecting
      // a full room's fifth person, or a failed insert, produced exactly that:
      // someone sitting in a room they were not actually in.
      const { error: joinErr } =
        (total ?? 0) < 4
          ? await supabase.from("room_participants").upsert(
              { room_id: room.id, user_id: user.id },
              { onConflict: "room_id,user_id" }
            )
          : { error: { message: "full" } };

      if (joinErr) {
        return (
          <main className="min-h-screen flex items-center justify-center px-6" style={{ background: "#FAFAF8" }}>
            <div className="text-center max-w-[380px]">
              <h1 className="font-display font-extrabold text-[22px] mb-2" style={{ color: "#333333" }}>
                {joinErr.message === "full" ? "Study group is full" : "Could not join"}
              </h1>
              <p className="text-[14px]" style={{ color: "rgba(51,51,51,0.6)" }}>
                {joinErr.message === "full"
                  ? "This study group already has four people in it: one doctor, one patient and two observers."
                  : "Something went wrong joining this study group. Ask the host to share the link again."}
              </p>
            </div>
          </main>
        );
      }
    }

    // joinRoom tells the station page to auto-open the study room panel
    // already synced to this room (station, timer, other participants).
    redirect(
      room.current_station_number
        ? `/case-bank/${room.current_station_number}?joinRoom=${room.id}`
        : "/case-bank"
    );
  }

  return <RoomGatewayClient roomCode={roomCode} />;
}
