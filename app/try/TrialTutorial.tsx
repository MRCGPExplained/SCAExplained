"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createTrialRoomAction,
  joinTrialRoomAction,
  setTrialNameAction,
  trialRoomStatusAction,
} from "./actions";

const DARK = "#333333";
const YELLOW = "#F6D44B";
const WASH = "#F9F3D9";

/** How often the waiting panel asks whether the other person has arrived. */
const POLL_MS = 2000;

type Stage = "choose" | "invite" | "join" | "name";

/**
 * Which of the three steps a stage belongs to.
 *
 * invite and join are the same step seen from the two ends of it — one
 * person reads a code out and the other types it in — so they share a
 * number. Three total, which is worth showing: somebody deciding whether to
 * start wants to know how far it is to the case.
 */
const STEP_OF: Record<Stage, number> = { choose: 1, invite: 2, join: 2, name: 3 };
const TOTAL_STEPS = 3;

export function TrialTutorial() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("choose");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [roomId, setRoomId] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [name, setName] = useState("");
  const [named, setNamed] = useState(false);
  const [hostName, setHostName] = useState("");
  const [guestName, setGuestName] = useState("");

  const isHost = stage === "invite" || (stage === "name" && !!roomCode);
  const navigated = useRef(false);

  // Polls only while there is a room and somebody still to arrive.
  const poll = useCallback(async () => {
    if (!roomId || navigated.current) return;
    const status = await trialRoomStatusAction(roomId);
    if (status.gone) { setError("That room has closed. Start again."); setRoomId(""); return; }
    setHostName(status.hostName ?? "");
    setGuestName(status.guestName ?? "");
    if (status.roomCode) setRoomCode(status.roomCode);
    if (status.ready) {
      navigated.current = true;
      router.push(`/case-bank/3?joinRoom=${roomId}`);
    }
  }, [roomId, router]);

  useEffect(() => {
    if (!roomId) return;
    // The first check is scheduled rather than called here. poll() only sets
    // state after an await, but the lint rule reads a call in an effect body
    // as a synchronous setState and cannot see that; a 0ms timeout says what
    // is actually meant and costs nothing.
    const first = window.setTimeout(poll, 0);
    const t = window.setInterval(poll, POLL_MS);
    return () => { window.clearTimeout(first); window.clearInterval(t); };
  }, [roomId, poll]);

  async function invite() {
    setBusy(true); setError("");
    const r = await createTrialRoomAction();
    setBusy(false);
    if (r.error || !r.roomId) { setError(r.error ?? "Could not start."); return; }
    setRoomId(r.roomId);
    setRoomCode(r.roomCode ?? "");
    setStage("invite");
  }

  async function join() {
    setBusy(true); setError("");
    const r = await joinTrialRoomAction(codeInput);
    setBusy(false);
    if (r.error || !r.roomId) { setError(r.error ?? "Could not join."); return; }
    setRoomId(r.roomId);
    setStage("name");
  }

  async function submitName() {
    setBusy(true); setError("");
    const r = await setTrialNameAction(name);
    setBusy(false);
    if (r.error) { setError(r.error); return; }
    setNamed(true);
    poll();
  }

  const step = STEP_OF[stage];

  return (
    <div className="max-w-[460px] mx-auto">
      <div className="flex items-center gap-1.5 mb-3" aria-hidden="true">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{ background: i < step ? YELLOW : "rgba(51,51,51,0.12)" }}
          />
        ))}
      </div>
      <p className="text-[11px] font-bold uppercase tracking-[0.07em] mb-5" style={{ color: "rgba(51,51,51,0.45)" }}>
        Step {step} of {TOTAL_STEPS}
      </p>

      {stage === "choose" && (
        <>
          <h1 className="font-display font-extrabold text-[26px] mb-6" style={{ color: DARK }}>
            Try a case free
          </h1>
          <div className="flex gap-3">
            <button
              type="button" onClick={invite} disabled={busy}
              className="flex-1 font-bold text-[15px] px-5 py-3.5 rounded-xl disabled:opacity-60"
              style={{ background: YELLOW, color: DARK }}
            >
              Invite Friend
            </button>
            <button
              type="button" onClick={() => { setStage("join"); setError(""); }} disabled={busy}
              className="flex-1 font-bold text-[15px] px-5 py-3.5 rounded-xl disabled:opacity-60"
              style={{ background: "transparent", color: DARK, border: `2px solid ${DARK}` }}
            >
              Join Friend
            </button>
          </div>
        </>
      )}

      {stage === "invite" && (
        <>
          <h1 className="font-display font-extrabold text-[26px] mb-5" style={{ color: DARK }}>
            Your room code
          </h1>
          <div
            className="rounded-xl px-5 py-5 text-center mb-3"
            style={{ background: WASH }}
          >
            <div className="font-display font-extrabold text-[34px] tracking-[0.18em]" style={{ color: DARK }}>
              {roomCode}
            </div>
          </div>
          <p className="text-[14px] leading-[1.6] mb-6" style={{ color: "rgba(51,51,51,0.65)" }}>
            Share this with your friend and ask them to use Join Friend.
          </p>
          <button
            type="button" onClick={() => setStage("name")}
            className="font-bold text-[15px] px-7 py-3.5 rounded-xl"
            style={{ background: YELLOW, color: DARK }}
          >
            Next
          </button>
        </>
      )}

      {stage === "join" && (
        <>
          <h1 className="font-display font-extrabold text-[26px] mb-5" style={{ color: DARK }}>
            Enter the code
          </h1>
          <input
            value={codeInput}
            onChange={(e) => { setCodeInput(e.target.value.toUpperCase()); setError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter" && !busy) join(); }}
            maxLength={6}
            autoFocus
            aria-label="Room code"
            className="w-full rounded-xl px-4 py-3.5 text-[22px] font-bold tracking-[0.18em] text-center uppercase outline-none mb-4"
            style={{ border: `1.5px solid rgba(51,51,51,0.2)`, color: DARK }}
          />
          {error && <p className="text-[13.5px] mb-4" style={{ color: "#B91C1C" }}>{error}</p>}
          <div className="flex gap-3">
            <button
              type="button" onClick={() => { setStage("choose"); setError(""); }}
              className="font-bold text-[14px] px-5 py-3 rounded-xl"
              style={{ background: "transparent", color: "rgba(51,51,51,0.6)" }}
            >
              Back
            </button>
            <button
              type="button" onClick={join} disabled={busy || codeInput.length !== 6}
              className="font-bold text-[15px] px-7 py-3.5 rounded-xl disabled:opacity-50"
              style={{ background: YELLOW, color: DARK }}
            >
              {busy ? "Checking…" : "Join"}
            </button>
          </div>
        </>
      )}

      {stage === "name" && (
        <>
          <h1 className="font-display font-extrabold text-[26px] mb-5" style={{ color: DARK }}>
            What would you like your name to be?
          </h1>

          {!named && (
            <>
              <input
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                onKeyDown={(e) => { if (e.key === "Enter" && !busy) submitName(); }}
                maxLength={60}
                autoFocus
                aria-label="Your name"
                className="w-full rounded-xl px-4 py-3 text-[15px] outline-none mb-4"
                style={{ border: `1.5px solid rgba(51,51,51,0.2)`, color: DARK }}
              />
              <button
                type="button" onClick={submitName} disabled={busy || !name.trim()}
                className="font-bold text-[15px] px-7 py-3.5 rounded-xl mb-6 disabled:opacity-50"
                style={{ background: YELLOW, color: DARK }}
              >
                {busy ? "Saving…" : "Done"}
              </button>
            </>
          )}

          <div className="rounded-xl overflow-hidden" style={{ border: `1.5px solid rgba(51,51,51,0.12)` }}>
            {([
              ["Host", hostName],
              ["Guest", guestName],
            ] as const).map(([label, who], i) => (
              <div
                key={label}
                className="flex items-center justify-between px-4 py-3"
                style={{
                  background: who ? WASH : "white",
                  borderTop: i ? `1px solid rgba(51,51,51,0.1)` : undefined,
                }}
              >
                <span className="text-[12px] font-bold uppercase tracking-[0.06em]" style={{ color: "rgba(51,51,51,0.5)" }}>
                  {label}
                </span>
                <span className="text-[14px] font-semibold" style={{ color: who ? DARK : "rgba(51,51,51,0.4)" }}>
                  {who || "Waiting"}
                </span>
              </div>
            ))}
          </div>

          {isHost && roomCode && (
            <p className="text-[13px] mt-4 mb-0" style={{ color: "rgba(51,51,51,0.55)" }}>
              Room code <strong style={{ color: DARK, letterSpacing: "0.12em" }}>{roomCode}</strong>
            </p>
          )}
        </>
      )}

      {error && stage !== "join" && (
        <p className="text-[13.5px] mt-5 mb-0" style={{ color: "#B91C1C" }}>{error}</p>
      )}

      {stage === "choose" && (
        <p className="text-[12.5px] mt-7 mb-0" style={{ color: "rgba(51,51,51,0.45)" }}>
          Already have an account?{" "}
          <Link href="/login" className="underline" style={{ color: "rgba(51,51,51,0.6)" }}>Sign in</Link>
        </p>
      )}
    </div>
  );
}
