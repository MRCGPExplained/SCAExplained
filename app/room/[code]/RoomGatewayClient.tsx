"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { guestJoinRoomAction } from "@/app/case-bank/actions";

const DARK = "#333333";
const YELLOW = "#F6D44B";

export function RoomGatewayClient({ roomCode }: { roomCode: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"choose" | "guest">("choose");
  const [name, setName] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  async function joinAsGuest() {
    if (!name.trim()) return;
    setJoining(true);
    setError("");
    const result = await guestJoinRoomAction(roomCode, name);
    if (result.error) {
      setError(result.error);
      setJoining(false);
      return;
    }
    // joinRoom tells the station page to auto-open the study room panel
    // already synced to this room (station, timer, other participants) —
    // only meaningful once there's an actual station to land on.
    const joinParam = result.roomId ? `?joinRoom=${result.roomId}` : "";
    router.push(result.stationNumber ? `/case-bank/${result.stationNumber}${joinParam}` : "/case-bank");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[380px]">
        <div className="mb-8 text-center">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-navy/40 mb-1" style={{ color: "rgba(51,51,51,0.4)" }}>
            SCA Focus
          </p>
          <h1 className="font-display font-extrabold text-[26px]" style={{ color: DARK }}>
            Join Study Room
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "rgba(51,51,51,0.55)" }}>
            Code: <span className="font-mono font-bold">{roomCode}</span>
          </p>
        </div>

        {mode === "choose" && (
          <div className="flex flex-col gap-3">
            <Link
              href={`/login?next=${encodeURIComponent(`/room/${roomCode}`)}`}
              className="block text-center bg-navy text-white text-[14px] font-bold py-3 rounded-xl no-underline transition-opacity hover:opacity-90"
              style={{ background: DARK }}
            >
              Log In
            </Link>
            <button
              type="button"
              onClick={() => setMode("guest")}
              className="text-[14px] font-bold py-3 rounded-xl transition-opacity hover:opacity-90"
              style={{ background: YELLOW, color: DARK, border: "none", cursor: "pointer" }}
            >
              Continue as Guest
            </button>
            <p className="text-[11.5px] text-center mt-2" style={{ color: "rgba(51,51,51,0.4)" }}>
              Guests join as the patient only — no account needed, access lasts 24 hours.
            </p>
          </div>
        )}

        {mode === "guest" && (
          <div className="flex flex-col gap-3">
            {error && (
              <p className="text-[13px] rounded-lg px-3 py-2.5" style={{ background: "rgba(239,68,68,0.07)", color: "#B91C1C" }}>
                {error}
              </p>
            )}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5" style={{ color: "rgba(51,51,51,0.5)" }}>
                Your Name
              </label>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && joinAsGuest()}
                placeholder="e.g. Sam"
                className="w-full rounded-lg px-3.5 py-3 text-sm outline-none"
                style={{ border: "1px solid rgba(51,51,51,0.15)", color: DARK }}
              />
            </div>
            <button
              type="button"
              onClick={joinAsGuest}
              disabled={joining || !name.trim()}
              className="text-[14px] font-bold py-3 rounded-xl transition-opacity disabled:opacity-50"
              style={{ background: DARK, color: "white", border: "none", cursor: joining ? "not-allowed" : "pointer" }}
            >
              {joining ? "Joining…" : "Join Room"}
            </button>
            <button
              type="button"
              onClick={() => { setMode("choose"); setError(""); }}
              disabled={joining}
              className="text-[12.5px]"
              style={{ background: "none", border: "none", color: "rgba(51,51,51,0.45)", cursor: "pointer" }}
            >
              ← Back
            </button>
          </div>
        )}

        <Link
          href="/"
          className="block mt-8 text-center text-[12px] no-underline hover:text-navy/60"
          style={{ color: "rgba(51,51,51,0.35)" }}
        >
          ← Back to site
        </Link>
      </div>
    </main>
  );
}
