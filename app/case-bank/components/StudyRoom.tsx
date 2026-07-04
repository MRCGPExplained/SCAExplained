"use client";

import { useState, useEffect, useRef, useCallback, type MutableRefObject } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import {
  createStudyRoomAction,
  joinStudyRoomAction,
  leaveStudyRoomAction,
  transferHostAction,
  claimHostAction,
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
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [hostStation, setHostStation] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; userId: string; displayName: string } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  // Always-current host user ID so stale channel callbacks read the right value
  const currentHostIdRef = useRef<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  const iAmHost = room ? room.host_user_id === userId : false;

  // Ref so channel callbacks always read the latest stationNumber without
  // needing the channel effect to re-run (App Router updates props in place)
  const stationNumberRef = useRef(stationNumber);
  useEffect(() => {
    stationNumberRef.current = stationNumber;
  }, [stationNumber]);

  // Close context menu when clicking anywhere outside it
  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [contextMenu]);

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

    // Always read from ref — never from a potentially stale closure over `room`
    const hostId = currentHostIdRef.current;

    const plist: Participant[] = data.map((p) => {
      const prof = profileMap.get(p.user_id);
      return {
        userId: p.user_id,
        displayName: prof?.display_name ?? "Unknown",
        initials: prof?.initials ?? "?",
        isHost: hostId ? p.user_id === hostId : false,
        isSelf: p.user_id === userId,
        muted: p.muted,
        joinedAt: p.joined_at,
      };
    });

    // Order: host first, then others, self last
    plist.sort((a, b) => {
      if (a.isHost !== b.isHost) return a.isHost ? -1 : 1;
      if (a.isSelf !== b.isSelf) return a.isSelf ? 1 : -1;
      return 0;
    });

    setParticipants(plist);
    setHostNameState(plist.find((p) => p.isHost)?.displayName ?? null);
  }, [supabase, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleTransferHost(targetUserId: string) {
    if (!room) return;
    setContextMenu(null);
    const result = await transferHostAction(room.id, targetUserId);
    if (result.error) return;
    // Update ref first so refreshParticipants reads the new host immediately
    currentHostIdRef.current = targetUserId;
    setRoom((prev) => prev ? { ...prev, host_user_id: targetUserId } : prev);
    channelRef.current?.send({
      type: "broadcast",
      event: "host-change",
      payload: { newHostUserId: targetUserId },
    });
    refreshParticipants(room.id);
  }

  // On join/rejoin: seed hostStation, currentHostIdRef, and redirect guest if needed.
  // Timer is NOT restored from DB — it resets to PREREAD on every station change,
  // and live sync happens via broadcast only.
  useEffect(() => {
    if (!room) return;
    currentHostIdRef.current = room.host_user_id;
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
        // Keep ref in sync with DB truth; refresh participants immediately on host change
        if (updated.host_user_id && updated.host_user_id !== currentHostIdRef.current) {
          currentHostIdRef.current = updated.host_user_id;
          refreshParticipants(room.id);
        }
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

    // Presence sync fires whenever anyone joins or leaves — refresh participant list immediately
    channel.on("presence", { event: "sync" }, () => {
      refreshParticipants(room.id);
    });

    // Host re-announces station + timer whenever a new guest joins the channel
    channel.on("presence", { event: "join" }, () => {
      if (!iAmHost) return;
      channel.send({ type: "broadcast", event: "navigate", payload: { stationNumber: stationNumberRef.current } });
      if (timerStateRef?.current) {
        channel.send({ type: "broadcast", event: "timer", payload: timerStateRef.current });
      }
    });

    // Host transfer — update ref immediately so refreshParticipants reads the new host
    channel.on("broadcast", { event: "host-change" }, ({ payload }) => {
      const { newHostUserId } = payload as { newHostUserId: string };
      currentHostIdRef.current = newHostUserId;
      setRoom((prev) => prev ? { ...prev, host_user_id: newHostUserId } : prev);
      refreshParticipants(room.id);
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

  // When host role transfers to/from this user, wire or clear broadcastTimerRef
  useEffect(() => {
    if (!broadcastTimerRef) return;
    if (iAmHost && channelRef.current) {
      const ch = channelRef.current;
      broadcastTimerRef.current = (phase, timeLeft, running) => {
        ch.send({ type: "broadcast", event: "timer", payload: { phase, timeLeft, running } });
      };
    } else if (!iAmHost) {
      broadcastTimerRef.current = null;
    }
  }, [iAmHost]); // eslint-disable-line react-hooks/exhaustive-deps

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

  async function handleClaimHost() {
    if (!room) return;
    setShowClaimModal(false);
    const result = await claimHostAction(room.id);
    if (result.error) return;
    currentHostIdRef.current = userId;
    setRoom((prev) => prev ? { ...prev, host_user_id: userId } : prev);
    channelRef.current?.send({
      type: "broadcast",
      event: "host-change",
      payload: { newHostUserId: userId },
    });
    refreshParticipants(room.id);
    // Post system message so everyone sees the change
    const systemText = `${displayName} has taken over as host.`;
    const { data } = await supabase
      .from("room_messages")
      .insert({ room_id: room.id, user_id: userId, display_name: "System", message: systemText })
      .select("id, created_at")
      .single();
    if (data) {
      setMessages((prev) => [
        ...prev,
        {
          id: data.id,
          from: "System",
          fromSelf: false,
          text: systemText,
          time: new Date(data.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }

  async function handleLeave() {
    if (!room) return;
    // If we're the host and others are present, hand off before leaving
    if (iAmHost) {
      const others = participants.filter(p => !p.isSelf);
      if (others.length > 0) {
        const newHost = others[Math.floor(Math.random() * others.length)];
        const result = await transferHostAction(room.id, newHost.userId);
        if (!result.error) {
          channelRef.current?.send({
            type: "broadcast",
            event: "host-change",
            payload: { newHostUserId: newHost.userId },
          });
        }
      }
    }
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
    <>
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
            style={{
              background: p.isHost
                ? "rgba(246,212,75,0.15)"
                : p.isSelf
                ? "rgba(59,130,246,0.08)"
                : "transparent",
              cursor: iAmHost && !p.isSelf ? "context-menu" : "default",
            }}
            onContextMenu={iAmHost && !p.isSelf ? (e) => {
              e.preventDefault();
              setContextMenu({ x: e.clientX, y: e.clientY, userId: p.userId, displayName: p.displayName });
            } : undefined}
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
          {messages.map((msg) =>
            msg.from === "System" ? (
              <div key={msg.id} className="text-center py-0.5">
                <span className="text-[10.5px] italic" style={{ color: "rgba(26,27,82,0.38)" }}>
                  {msg.text}
                </span>
              </div>
            ) : (
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
            )
          )}
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

    {/* Claim Host — guests only, sits below the room panel */}
    {!iAmHost && (
      <div className="flex justify-center pt-2">
        <button
          onClick={() => setShowClaimModal(true)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 10,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "rgba(26,27,82,0.28)",
            fontFamily: "inherit",
            fontWeight: 600,
            padding: 0,
          }}
        >
          Claim Host
        </button>
      </div>
    )}

    {/* Claim Host modal */}
    {showClaimModal && (
      <div
        className="fixed inset-0 flex items-center justify-center z-50 px-6"
        style={{ background: "rgba(26,27,82,0.5)" }}
        onClick={(e) => e.target === e.currentTarget && setShowClaimModal(false)}
      >
        <div
          className="w-full max-w-[380px] rounded-2xl p-6"
          style={{ background: "white", boxShadow: "0 20px 60px rgba(26,27,82,0.25)" }}
        >
          <h2 className="font-display font-bold text-[15px] mb-2" style={{ color: NAVY }}>
            Claim Host
          </h2>
          <p className="text-[13.5px] leading-[1.7] mb-5" style={{ color: "rgba(26,27,82,0.65)" }}>
            <strong style={{ color: NAVY }}>{hostName}</strong> is the current host. Would you like to assume the role?
          </p>
          <div className="flex gap-2.5">
            <button
              onClick={() => setShowClaimModal(false)}
              className="flex-1 rounded-lg py-2.5 text-[13px] font-semibold"
              style={{ background: LIGHT_BG, border: "none", color: NAVY, cursor: "pointer" }}
            >
              Go Back
            </button>
            <button
              onClick={handleClaimHost}
              className="flex-1 rounded-lg py-2.5 text-[13px] font-bold"
              style={{ background: NAVY, border: "none", color: "white", cursor: "pointer" }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Right-click context menu for host transfer */}
    {contextMenu && (
      <div
        style={{
          position: "fixed",
          top: contextMenu.y,
          left: contextMenu.x,
          zIndex: 1000,
          background: "white",
          border: "1px solid rgba(26,27,82,0.12)",
          borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          padding: 4,
          minWidth: 160,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => handleTransferHost(contextMenu.userId)}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "7px 12px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            color: NAVY,
            borderRadius: 6,
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(26,27,82,0.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          Make {contextMenu.displayName} host
        </button>
      </div>
    )}
    </>
  );
}
