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
        .select("id, current_station_number")
        .eq("room_code", roomCode)
        .maybeSingle<{ id: string; current_station_number: number | null }>()
    : { data: null };

  if (!room) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6" style={{ background: "#FAFAF8" }}>
        <div className="text-center max-w-[380px]">
          <h1 className="font-display font-extrabold text-[22px] mb-2" style={{ color: "#333333" }}>
            Room not found
          </h1>
          <p className="text-[14px]" style={{ color: "rgba(51,51,51,0.6)" }}>
            This link doesn&apos;t match an active study room. Double-check it with whoever shared it.
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
      const { count: total } = await supabase
        .from("room_participants")
        .select("user_id", { count: "exact", head: true })
        .eq("room_id", room.id);
      if ((total ?? 0) < 4) {
        await supabase.from("room_participants").upsert(
          { room_id: room.id, user_id: user.id },
          { onConflict: "room_id,user_id" }
        );
      }
    }

    redirect(room.current_station_number ? `/case-bank/${room.current_station_number}` : "/case-bank");
  }

  return <RoomGatewayClient roomCode={roomCode} />;
}
