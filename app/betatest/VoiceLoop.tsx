"use client";

import { useState, useRef, useCallback } from "react";

const DARK = "#333333";
const YELLOW = "#F6D44B";

type Phase = "idle" | "recording" | "processing" | "playing";
type Latency = { stt: number; llm: number; tts: number } | null;

export default function VoiceLoop() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [latency, setLatency] = useState<Latency>(null);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const sendToExchange = useCallback(async (blob: Blob) => {
    try {
      const fd = new FormData();
      fd.append("audio", blob, "audio.webm");

      const res = await fetch("/api/betatest/exchange", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error ?? res.statusText);
      }

      setTranscript(data.transcript);
      setResponse(data.response_text);
      setLatency({ stt: data.stt_ms, llm: data.llm_ms, tts: data.tts_ms });

      setPhase("playing");
      const audioBytes = Uint8Array.from(atob(data.audio_b64), (c) => c.charCodeAt(0));

      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") await ctx.resume();

      const decoded = await ctx.decodeAudioData(audioBytes.buffer);
      const source = ctx.createBufferSource();
      source.buffer = decoded;
      source.connect(ctx.destination);
      source.onended = () => setPhase("idle");
      sourceRef.current = source;
      source.start();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setPhase("idle");
    }
  }, []);

  const startRecording = useCallback(async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const mr = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        sendToExchange(blob);
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setPhase("recording");
    } catch {
      setError("Microphone access denied. Please allow mic access and try again.");
    }
  }, [sendToExchange]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setPhase("processing");
  }, []);

  const handleMicClick = () => {
    if (phase === "idle") startRecording();
    else if (phase === "recording") stopRecording();
    else if (phase === "playing") {
      sourceRef.current?.stop();
      setPhase("idle");
    }
  };

  const total = latency ? latency.stt + latency.llm + latency.tts : 0;

  const micLabel =
    phase === "idle" ? "Tap to speak" :
    phase === "recording" ? "Tap to stop" :
    phase === "processing" ? "Processing…" :
    "Playing… (tap to stop)";

  const micBg =
    phase === "recording" ? "#E53E3E" :
    phase === "processing" ? "rgba(51,51,51,0.3)" :
    phase === "playing" ? YELLOW :
    DARK;

  const micColor =
    phase === "playing" ? DARK : "white";

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "2rem 1rem", fontFamily: "system-ui, sans-serif" }}>
      <div className="mb-2" style={{ color: "rgba(51,51,51,0.5)", fontSize: 13 }}>
        Station 1 · Rachel Pemberton · Bleeding in Pregnancy
      </div>

      {/* Mic button */}
      <div className="flex flex-col items-center gap-4 py-10">
        <button
          onClick={handleMicClick}
          disabled={phase === "processing"}
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: micBg,
            color: micColor,
            border: "none",
            cursor: phase === "processing" ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
            boxShadow: phase === "recording"
              ? "0 0 0 8px rgba(229,62,62,0.2)"
              : "0 4px 20px rgba(0,0,0,0.15)",
          }}
          aria-label={micLabel}
        >
          {phase === "processing" ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" opacity="0.3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
              </path>
            </svg>
          ) : phase === "playing" ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="6" y="5" width="4" height="14" rx="1" fill={micColor}/>
              <rect x="14" y="5" width="4" height="14" rx="1" fill={micColor}/>
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="2" width="6" height="13" rx="3" fill="white"/>
              <path d="M5 11a7 7 0 0 0 14 0" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="18" x2="12" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8" y1="22" x2="16" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
        <p style={{ color: "rgba(51,51,51,0.5)", fontSize: 14, margin: 0 }}>{micLabel}</p>
      </div>

      {error && (
        <div className="rounded-lg px-4 py-3 mb-4 text-[13px]" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#B91C1C" }}>
          {error}
        </div>
      )}

      {/* Transcript & response */}
      {(transcript || response) && (
        <div className="flex flex-col gap-3 mb-6">
          {transcript && (
            <div className="rounded-xl p-4" style={{ background: "rgba(51,51,51,0.04)", border: "1px solid rgba(51,51,51,0.08)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(51,51,51,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>You said</p>
              <p style={{ fontSize: 14, color: DARK, margin: 0 }}>{transcript}</p>
            </div>
          )}
          {response && (
            <div className="rounded-xl p-4" style={{ background: "#FFF9E6", border: `1px solid ${YELLOW}` }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(51,51,51,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Rachel</p>
              <p style={{ fontSize: 14, color: DARK, margin: 0 }}>{response}</p>
            </div>
          )}
        </div>
      )}

      {/* Latency */}
      {latency && (
        <div className="rounded-xl p-4" style={{ background: "rgba(51,51,51,0.03)", border: "1px solid rgba(51,51,51,0.07)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(51,51,51,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Latency</p>
          <div className="flex gap-4 flex-wrap">
            {[
              { label: "STT", value: latency.stt },
              { label: "LLM", value: latency.llm },
              { label: "TTS", value: latency.tts },
              { label: "Total", value: total },
            ].map(({ label, value }) => (
              <div key={label} style={{ minWidth: 80 }}>
                <p style={{ fontSize: 11, color: "rgba(51,51,51,0.45)", margin: "0 0 2px" }}>{label}</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: label === "Total" ? DARK : "rgba(51,51,51,0.7)", margin: 0, fontVariantNumeric: "tabular-nums" }}>
                  {value}
                  <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 2 }}>ms</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
