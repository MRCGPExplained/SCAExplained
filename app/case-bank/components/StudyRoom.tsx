"use client";

import { useState, useEffect, useRef, useCallback, type MutableRefObject } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import {
  createStudyRoomAction,
  joinStudyRoomAction,
  leaveStudyRoomAction,
} from "../actions";
import type { StudyRoom, ChatMessage, TimerPhase } from "@/lib/case-bank-types";
import { PHASE_DURATIONS } from "@/lib/case-bank-types";

const NAVY = "#1F2937";
const YELLOW = "#F6D44B";
const LIGHT_BG = "#F3F2FB";

interface Participant {
  userId: string;
  displayName: string;
  initials: string;
  isHost: boolean;
  isSelf: boolean;
  muted: boolean;
  joinedAt: string;
}

interface StudyRoomProps {
  stationId: string;
  stationNumber: number;
  userId: string;
  displayName: string;
  initials: string;
  onTimerSync?: (phase: TimerPhase, timeLeft: number, running: boolean) => void;
  onStationChange?: (stationNumber: number) => void;
  onRoomStatusChange?: (inRoom: boolean, iAmHost: boolean, roomId: string | null) => void;
}

export function StudyRoomPanel({
  stationId,
  stationNumber,
  userId,
  displayName,
  initials,
  onTimerSync,
  onStationChange,
  onRoomStatusChange,
}: StudyRoomProps) {
  const [room, setRoom] = useState<StudyRoom | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [selfMuted, setSelfMuted] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const prevStationRef = useRef<number | null>(null);
  const supabase = createSupabaseBrowserClient();

  const iAmHost = room ? room.host_user_id === userId : false;

  const refreshParticipants = useCallback(async (roomId: string) => {
    const { data } = await supabase
      .from("room_participants")
      .select("user_id,joined_at,muted")
      .eq("room_id", roomId)
      .returns<{ user_id: string; joined_at: string; muted: boolean }[]>();

    if (!data) return;

    const profileIds = data.map((p) => p.user_id);
    const { data: profiles } = await supabase
      .from("user_profiles")
      .select("id,display_name,initials")
      .in("id", profileIds)
      .returns<{ id: string; display_name: string; initials: string }[]>();

    const profileMap = new Map(
      (profiles ?? []).map((p) => [p.id, p])
    );

    const plist: Participant[] = data.map((p) => {
      const prof = profileMap.get(p.user_id);
      return {
        userId: p.user_id,
        displayName: prof?.display_name ?? "Unknown",
        initials: prof?.initials ?? "?",
        isHost: room ? p.user_id === room.host_user_id : false,
        isSelf: p.user_id === userId,
        muted: p.user_id === userId ? selfMuted : p.muted,
        joinedAt: p.joined_at,
      };
    });
    setParticipants(plist);
  }, [supabase, userId, room, selfMuted]);

  useEffect(() => {
    if (!room) return;

    const channel = supabase.channel(`room:${room.id}`, {
      config: {
        broadcast: { ack: false },
        presence: { key: userId },
      },
    });
    channelRef.current = channel;

    // Room state changes (timer sync + navigate sync for guests)
    channel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "study_rooms", filter: `id=eq.${room.id}` },
      (payload) => {
        const updated = payload.new as StudyRoom;
        setRoom(updated);

        if (onTimerSync) {
          const phase = updated.timer_phase as TimerPhase;
          let timeLeft: number;
          let running: boolean;

          if (updated.timer_paused_at && updated.timer_paused_remaining !== null) {
            timeLeft = updated.timer_paused_remaining;
            running = false;
          } else if (updated.timer_started_at && !updated.timer_paused_at) {
            const elapsed = Math.floor(
              (Date.now() - new Date(updated.timer_started_at).getTime()) / 1000
            );
            timeLeft = Math.max(0, PHASE_DURATIONS[phase] - elapsed);
            running = true;
          } else {
            timeLeft = PHASE_DURATIONS[phase];
            running = false;
          }

          onTimerSync(phase, timeLeft, running);
        }
      }
    );

    // Participant changes
    channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table: "room_participants", filter: `room_id=eq.${room.id}` },
      () => { refreshParticipants(room.id); }
    );

    // Chat
    channel.on("broadcast", { event: "chat" }, ({ payload }) => {
      setMessages((m) => [...m, payload as ChatMessage]);
    });

    // Navigation sync — guests follow host
    channel.on("broadcast", { event: "navigate" }, ({ payload }) => {
      const num = (payload as { stationNumber: number }).stationNumber;
      if (num && onStationChange) onStationChange(num);
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ userId, displayName, initials });
        refreshParticipants(room.id);
      }
    });

    return () => {
      channelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [room?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Notify parent when room / host status changes
  useEffect(() => {
    onRoomStatusChange?.(!!room, iAmHost, room?.id ?? null);
  }, [room?.id, iAmHost]); // eslint-disable-line react-hooks/exhaustive-deps

  // Host broadcasts navigation when stationNumber prop changes
  useEffect(() => {
    if (!room || !iAmHost) {
      prevStationRef.current = stationNumber;
      return;
    }
    if (prevStationRef.current !== null && prevStationRef.current !== stationNumber) {
      channelRef.current?.send({
        type: "broadcast",
        event: "navigate",
        payload: { stationNumber },
      });
    }
    prevStationRef.current = stationNumber;
  }, [stationNumber, iAmHost, room?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleCreate() {
    setLoading(true);
    const result = await createStudyRoomAction();
    if (result.error) {
      setJoinError(result.error);
      setLoading(false);
      return;
    }
    // Fetch full room data
    const { data } = await supabase
      .from("study_rooms")
      .select("*")
      .eq("id", result.roomId!)
      .single<StudyRoom>();
    if (data) setRoom(data);
    setLoading(false);
  }

  async function handleJoin() {
    if (!joinCode.trim()) return;
    setLoading(true);
    setJoinError("");
    const result = await joinStudyRoomAction(joinCode.trim());
    if (result.error) {
      setJoinError(result.error);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("study_rooms")
      .select("*")
      .eq("id", result.roomId!)
      .single<StudyRoom>();
    if (data) setRoom(data);
    setLoading(false);
  }

  async function handleLeave() {
    if (!room) return;
    await leaveStudyRoomAction(room.id);
    setRoom(null);
    setParticipants([]);
    setMessages([]);
  }

  function sendChat() {
    if (!chatInput.trim() || !room) return;
    const msg: ChatMessage = {
      id: `${Date.now()}`,
      from: displayName,
      fromSelf: true,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    };
    const channel = supabase.channel(`room:${room.id}`);
    channel.send({ type: "broadcast", event: "chat", payload: msg });
    setMessages((m) => [...m, msg]);
    setChatInput("");
  }

  const hostName = participants.find((p) => p.isHost)?.displayName ?? "host";

  // ── Not in a room ──────────────────────────────────────────────────────────
  if (!room) {
    return (
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "white", border: "1px solid rgba(26,27,82,0.10)" }}
      >
        <div className="px-4 py-3" style={{ background: NAVY }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: YELLOW }}>
            Study Room
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            Practice with friends in real time
          </div>
        </div>

        <div className="p-4 flex flex-col gap-3">
          {joinError && (
            <div className="text-[12px] px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.07)", color: "#B91C1C" }}>
              {joinError}
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full rounded-lg py-2.5 text-[13px] font-bold"
            style={{ background: NAVY, border: "none", color: "white", cursor: "pointer", opacity: loading ? 0.6 : 1 }}
          >
            Create Room
          </button>

          <div className="flex gap-2">
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="Room code"
              maxLength={8}
              className="flex-1 rounded-lg px-3 py-2 text-[13px] font-mono"
              style={{ border: "1px solid rgba(26,27,82,0.15)", color: NAVY, background: LIGHT_BG, outline: "none", fontFamily: "monospace" }}
            />
            <button
              onClick={handleJoin}
              disabled={loading || !joinCode.trim()}
              className="rounded-lg px-3 py-2 text-[13px] font-bold"
              style={{ background: YELLOW, border: "none", color: NAVY, cursor: "pointer", opacity: loading ? 0.6 : 1 }}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── In a room ──────────────────────────────────────────────────────────────
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(26,27,82,0.10)" }}>
      {/* Header */}
      <div
        className="px-3.5 py-3 flex items-center justify-between"
        style={{ background: NAVY }}
      >
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: YELLOW }}>
            Study Room
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            {iAmHost ? "You are navigating" : `${hostName} is navigating`}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22C55E" }} />
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>Live</span>
          </div>
          <button
            onClick={handleLeave}
            className="text-[10px] px-2 py-1 rounded"
            style={{ background: "rgba(239,68,68,0.15)", color: "#FCA5A5", border: "none", cursor: "pointer" }}
          >
            Leave
          </button>
        </div>
      </div>

      {/* Participants */}
      <div className="py-1.5 px-1.5" style={{ background: "white", borderBottom: "1px solid rgba(26,27,82,0.07)" }}>
        {participants.map((p) => (
          <div
            key={p.userId}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
            style={{ background: p.isSelf ? "rgba(246,212,75,0.08)" : "transparent" }}
          >
            <div className="relative shrink-0">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{
                  background: p.isSelf ? YELLOW : "rgba(26,27,82,0.1)",
                  color: p.isSelf ? NAVY : "rgba(26,27,82,0.55)",
                  border: `2px solid ${p.isHost ? YELLOW : "transparent"}`,
                }}
              >
                {p.initials}
              </div>
              {p.muted && (
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full flex items-center justify-center text-[5px]"
                  style={{ background: "#EF4444", border: "1.5px solid white", color: "white" }}
                >
                  ✕
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: NAVY }}>
                {p.isSelf ? "You" : p.displayName}
                {p.isHost && (
                  <span className="text-[9px] px-1 py-0.5 rounded" style={{ background: YELLOW, color: NAVY, fontWeight: 700 }}>
                    HOST
                  </span>
                )}
              </div>
              <div className="text-[10px]" style={{ color: p.muted ? "#EF4444" : "#22C55E" }}>
                {p.muted ? "Muted" : "Live"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invite */}
      <div className="px-2.5 py-2" style={{ background: "white", borderBottom: "1px solid rgba(26,27,82,0.07)" }}>
        <button
          onClick={() => setShowInvite((v) => !v)}
          className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-[12px] font-semibold"
          style={{ background: LIGHT_BG, border: "1px solid rgba(26,27,82,0.10)", color: NAVY, cursor: "pointer" }}
        >
          <span>+ Invite a Friend</span>
          <span className="text-[10px]" style={{ color: "rgba(26,27,82,0.4)" }}>
            Share code: {room.room_code}
          </span>
        </button>

        {showInvite && (
          <div className="mt-2 p-3 rounded-lg text-[12px]" style={{ background: LIGHT_BG }}>
            <p className="mb-1" style={{ color: "rgba(26,27,82,0.55)" }}>
              Share this code with friends:
            </p>
            <div
              className="font-mono font-bold text-[15px] text-center py-2 rounded-lg"
              style={{ background: "white", color: NAVY, letterSpacing: "0.1em", border: "1px solid rgba(26,27,82,0.12)" }}
            >
              {room.room_code}
            </div>
          </div>
        )}
      </div>

      {/* Mute */}
      <div className="px-2.5 py-2" style={{ background: "white", borderBottom: "1px solid rgba(26,27,82,0.07)" }}>
        <button
          onClick={() => setSelfMuted((m) => !m)}
          className="w-full rounded-lg py-2 text-[12px] font-semibold"
          style={{
            background: selfMuted ? "rgba(239,68,68,0.07)" : LIGHT_BG,
            border: `1.5px solid ${selfMuted ? "#EF4444" : "rgba(26,27,82,0.10)"}`,
            color: selfMuted ? "#EF4444" : NAVY,
            cursor: "pointer",
          }}
        >
          {selfMuted ? "🔇 Unmute Yourself" : "🎙️ Mute Yourself"}
        </button>
      </div>

      {/* Chat */}
      <div className="p-3" style={{ background: LIGHT_BG }}>
        <div className="text-[10px] font-bold uppercase tracking-[0.08em] mb-2" style={{ color: "rgba(26,27,82,0.4)" }}>
          Chat
        </div>
        <div className="max-h-[130px] overflow-y-auto flex flex-col gap-2 mb-2.5">
          {messages.map((msg) => (
            <div key={msg.id}>
              <div className="text-[10px] mb-0.5" style={{ color: "rgba(26,27,82,0.4)" }}>
                <strong style={{ color: msg.fromSelf ? NAVY : "rgba(26,27,82,0.7)" }}>
                  {msg.fromSelf ? "You" : msg.from}
                </strong>{" "}
                · {msg.time}
              </div>
              <div className="text-[12px] leading-snug break-words" style={{ color: "rgba(26,27,82,0.8)" }}>
                {msg.text.startsWith("http") ? (
                  <a href={msg.text} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#2563EB", wordBreak: "break-all" }}>
                    {msg.text}
                  </a>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="flex gap-1.5">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendChat()}
            placeholder="Message or paste a link…"
            className="flex-1 rounded-lg px-3 py-1.5 text-[12px]"
            style={{ border: "1px solid rgba(26,27,82,0.15)", color: NAVY, background: "white", outline: "none", fontFamily: "inherit" }}
          />
          <button
            onClick={sendChat}
            className="rounded-lg px-3 py-1.5 text-[12px] font-bold"
            style={{ background: NAVY, border: "none", color: "white", cursor: "pointer" }}
          >
            →
          </button>
        </div>
      </div>

      {/* Room code */}
      <div
        className="flex items-center justify-between px-3.5 py-2.5"
        style={{ background: "white", borderTop: "1px solid rgba(26,27,82,0.07)" }}
      >
        <span className="text-[11px]" style={{ color: "rgba(26,27,82,0.4)" }}>Room code</span>
        <span className="font-mono font-bold text-[12px] tracking-[0.08em]" style={{ color: NAVY }}>
          {room.room_code}
        </span>
      </div>
    </div>
  );
}
