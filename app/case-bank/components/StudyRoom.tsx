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
  onRoomStatusChange?: (inRoom: boolean, iAmHost: boolean, roomId: string | null, hostName: string | null) => void;
  /** Ref the parent fills so it can call broadcastTimer(phase, timeLeft, running) */
  broadcastTimerRef?: MutableRefObject<((phase: TimerPhase, timeLeft: number, running: boolean) => void) | null>;
  /** Read-only ref the panel reads to re-announce timer state to late-joining guests */
  timerStateRef?: MutableRefObject<{ phase: TimerPhase; timeLeft: number; running: boolean }>;
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
  broadcastTimerRef,
  timerStateRef,
}: StudyRoomProps) {
  const [room, setRoom] = useState<StudyRoom | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hostNameState, setHostNameState] = useState<string | null>(null);
  const [hostStation, setHostStation] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabase = createSupabaseBrowserClient();

  const iAmHost = room ? room.host_user_id === userId : false;

  // Ref so channel callbacks always read the latest stationNumber without
  // needing the channel effect to re-run (App Router updates props in place)
  const stationNumberRef = useRef(stationNumber);
  useEffect(() => {
    stationNumberRef.current = stationNumber;
  }, [stationNumber]);

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
        muted: p.muted,
        joinedAt: p.joined_at,
      };
    });
    setParticipants(plist);
    setHostNameState(plist.find((p) => p.isHost)?.displayName ?? null);
  }, [supabase, userId, room]); // eslint-disable-line react-hooks/exhaustive-deps

  // On join/rejoin: seed hostStation and redirect guest if needed.
  // Timer is NOT restored from DB — it resets to PREREAD on every station change,
  // and live sync happens via broadcast only.
  useEffect(() => {
    if (!room) return;
    if (room.current_station_number) setHostStation(room.current_station_number);
    if (!iAmHost && room.current_station_number && room.current_station_number !== stationNumberRef.current) {
      onStationChange?.(room.current_station_number);
    }
  }, [room?.id]); // eslint-disable-line react-hooks/exhaustive-deps

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

        // Station: guests follow host
        const isGuest = updated.host_user_id !== userId;
        if (isGuest && updated.current_station_number && updated.current_station_number !== stationNumberRef.current) {
          onStationChange?.(updated.current_station_number);
        }
      }
    );

    // Participant changes
    channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table: "room_participants", filter: `room_id=eq.${room.id}` },
      () => { refreshParticipants(room.id); }
    );

    // Chat — new messages from other participants via postgres realtime
    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "room_messages", filter: `room_id=eq.${room.id}` },
      (payload) => {
        const m = payload.new as { id: string; user_id: string; display_name: string; message: string; created_at: string };
        if (m.user_id === userId) return; // sender already added optimistically
        setMessages((prev) => [
          ...prev,
          {
            id: m.id,
            from: m.display_name,
            fromSelf: false,
            text: m.message,
            time: new Date(m.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    );

    // Guest receives timer state from host broadcasts
    channel.on("broadcast", { event: "timer" }, ({ payload }) => {
      const { phase, timeLeft, running } = payload as { phase: TimerPhase; timeLeft: number; running: boolean };
      if (!iAmHost) {
        onTimerSync?.(phase, timeLeft, running);
      }
    });

    // Host re-announces station + timer whenever a new guest joins the channel
    channel.on("presence", { event: "join" }, () => {
      if (!iAmHost) return;
      channel.send({ type: "broadcast", event: "navigate", payload: { stationNumber: stationNumberRef.current } });
      if (timerStateRef?.current) {
        channel.send({ type: "broadcast", event: "timer", payload: timerStateRef.current });
      }
    });

    // Guest listens for host station changes
    channel.on("broadcast", { event: "navigate" }, ({ payload }) => {
      const { stationNumber: target } = payload as { stationNumber: number };
      if (target) setHostStation(target);
      if (!iAmHost && target && target !== stationNumberRef.current) {
        onStationChange?.(target);
      }
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ userId, displayName, initials });
        refreshParticipants(room.id);
        if (iAmHost) {
          channel.send({
            type: "broadcast",
            event: "navigate",
            payload: { stationNumber: stationNumberRef.current },
          });
          // Fill the ref so the parent can trigger timer broadcasts
          if (broadcastTimerRef) {
            broadcastTimerRef.current = (phase, timeLeft, running) => {
              channel.send({ type: "broadcast", event: "timer", payload: { phase, timeLeft, running } });
            };
          }
          // Announce current timer state (covers auto-start and late-joining guests)
          if (timerStateRef?.current) {
            channel.send({ type: "broadcast", event: "timer", payload: timerStateRef.current });
          }
        }
      }
    });

    return () => {
      if (broadcastTimerRef) broadcastTimerRef.current = null;
      channelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [room?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Notify parent when room / host status changes
  useEffect(() => {
    onRoomStatusChange?.(!!room, iAmHost, room?.id ?? null, hostNameState);
  }, [room?.id, iAmHost, hostNameState]); // eslint-disable-line react-hooks/exhaustive-deps

  // Host: write current station to DB whenever room loads or station changes.
  // Guests receive it via the postgres_changes UPDATE subscription below.
  useEffect(() => {
    if (!room || !iAmHost) return;
    supabase
      .from("study_rooms")
      .update({ current_station_number: stationNumber })
      .eq("id", room.id);
  }, [room?.id, stationNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  // Host: broadcast station change via the existing channel whenever stationNumber changes.
  // This handles App Router navigation which updates props in-place without remounting
  // the component, so the channel subscription effect (which only fires on room?.id
  // change) won't re-run. The SUBSCRIBED callback covers the initial broadcast on join.
  useEffect(() => {
    if (!room || !iAmHost || !channelRef.current) return;
    channelRef.current.send({
      type: "broadcast",
      event: "navigate",
      payload: { stationNumber },
    });
  }, [stationNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load persisted messages when room is joined
  useEffect(() => {
    if (!room) return;
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    supabase
      .from("room_messages")
      .select("id, user_id, display_name, message, created_at")
      .eq("room_id", room.id)
      .gt("created_at", cutoff)
      .order("created_at", { ascending: true })
      .limit(200)
      .then(({ data }) => {
        if (!data) return;
        setMessages(
          data.map((m) => ({
            id: m.id,
            from: m.display_name,
            fromSelf: m.user_id === userId,
            text: m.message,
            time: new Date(m.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
          }))
        );
      });
  }, [room?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-rejoin saved room on mount (survives navigation and panel toggle)
  useEffect(() => {
    const savedId = sessionStorage.getItem("studyRoomId");
    if (!savedId || room) return;
    supabase
      .from("study_rooms")
      .select("*")
      .eq("id", savedId)
      .single<StudyRoom>()
      .then(({ data }) => {
        if (data) setRoom(data);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCreate() {
    setLoading(true);
    const result = await createStudyRoomAction();
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
    if (data) {
      sessionStorage.setItem("studyRoomId", data.id);
      setRoom(data);
    }
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
    if (data) {
      sessionStorage.setItem("studyRoomId", data.id);
      setRoom(data);
    }
    setLoading(false);
  }

  async function handleLeave() {
    if (!room) return;
    await leaveStudyRoomAction(room.id);
    sessionStorage.removeItem("studyRoomId");
    setRoom(null);
    setParticipants([]);
    setMessages([]);
  }

  async function sendChat() {
    if (!chatInput.trim() || !room) return;
    const text = chatInput.trim();
    setChatInput("");
    const { data } = await supabase
      .from("room_messages")
      .insert({ room_id: room.id, user_id: userId, display_name: displayName, message: text })
      .select("id, created_at")
      .single();
    if (data) {
      setMessages((prev) => [
        ...prev,
        {
          id: data.id,
          from: displayName,
          fromSelf: true,
          text,
          time: new Date(data.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
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
          <div className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "white" }}>
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

          <div className="flex gap-1.5">
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="Room code"
              maxLength={8}
              className="flex-1 rounded-md px-2.5 py-1.5 text-[12px]"
              style={{ border: "1px solid rgba(31,41,55,0.15)", color: NAVY, background: LIGHT_BG, outline: "none", fontFamily: "monospace" }}
            />
            <button
              onClick={handleJoin}
              disabled={loading || !joinCode.trim()}
              className="rounded-md px-3 py-1.5 text-[12px] font-bold"
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
          <div className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: "white" }}>
            Study Room
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            {iAmHost ? "You are navigating" : `${hostName} is navigating`}
          </div>
        </div>
        <div className="flex items-center gap-2">
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
            style={{ background: p.isSelf ? "rgba(246,212,75,0.06)" : "transparent" }}
          >
            <div className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: NAVY }}>
              {p.isSelf ? "You" : p.displayName}
              {p.isHost && (
                <span className="text-[9px] px-1 py-0.5 rounded" style={{ background: "rgba(31,41,55,0.12)", color: "rgba(31,41,55,0.5)", fontWeight: 600 }}>
                  HOST
                </span>
              )}
            </div>
          </div>
        ))}
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

      {/* Failsafe: guest is out of sync with host */}
      {!iAmHost && hostStation && hostStation !== stationNumber && (
        <div className="px-3.5 py-2" style={{ background: "rgba(246,212,75,0.10)", borderTop: "1px solid rgba(246,212,75,0.25)" }}>
          <button
            onClick={() => onStationChange?.(hostStation)}
            className="w-full text-[11px] font-semibold uppercase tracking-[0.06em] py-1.5 rounded-lg"
            style={{ background: "rgba(246,212,75,0.25)", border: "none", color: NAVY, cursor: "pointer" }}
          >
            go to current station
          </button>
        </div>
      )}

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
