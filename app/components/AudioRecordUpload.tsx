"use client";

import { useRef, useState } from "react";

const NAVY = "#1a1b52";

type Phase = "idle" | "recording" | "review" | "uploading" | "deleting";

export function AudioRecordUpload({
  currentUrl,
  onUpload,
  onDelete,
}: {
  currentUrl: string | null;
  onUpload: (file: File) => Promise<{ url?: string; error?: string }>;
  onDelete: () => Promise<{ error?: string }>;
}) {
  const [savedUrl, setSavedUrl] = useState(currentUrl);
  const [phase, setPhase] = useState<Phase>("idle");
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  async function upload(file: File) {
    setPhase("uploading");
    setError("");
    const result = await onUpload(file);
    if (result.error) {
      setError(result.error);
      setPhase(blobUrl ? "review" : "idle");
      return;
    }
    setSavedUrl(result.url ?? null);
    if (blobUrl) { URL.revokeObjectURL(blobUrl); setBlobUrl(null); }
    setPhase("idle");
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function startRecording() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setBlobUrl(URL.createObjectURL(blob));
        setPhase("review");
      };
      recorder.start();
      recorderRef.current = recorder;
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
      setPhase("recording");
    } catch {
      setError("Microphone access denied.");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
  }

  function discardRecording() {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl(null);
    setPhase("idle");
  }

  async function saveRecording() {
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    await upload(new File([blob], "recording.webm", { type: "audio/webm" }));
  }

  async function handleDelete() {
    setPhase("deleting");
    setError("");
    const result = await onDelete();
    if (result.error) { setError(result.error); setPhase("idle"); return; }
    setSavedUrl(null);
    setPhase("idle");
  }

  const btnBase = "px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-opacity";
  const neutralBtn = { background: "rgba(26,27,82,0.08)", color: "rgba(26,27,82,0.7)", border: "none" };
  const dangerBtn = { background: "rgba(239,68,68,0.08)", color: "#B91C1C", border: "none" };

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-[12px] text-red-600 m-0">{error}</p>}

      {savedUrl && phase !== "recording" && phase !== "review" && (
        <audio controls src={savedUrl} className="w-full" style={{ borderRadius: 8, outline: "none" }} />
      )}

      {phase === "recording" && (
        <div className="flex items-center gap-3">
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", display: "inline-block", animation: "pulse 1s infinite" }} />
          <span className="text-[13px] font-mono font-bold" style={{ color: "#B91C1C" }}>{fmtTime(seconds)}</span>
          <span className="text-[12px]" style={{ color: "rgba(51,51,51,0.45)" }}>Recording…</span>
          <button type="button" onClick={stopRecording} className={btnBase} style={{ background: "#B91C1C", color: "white", border: "none" }}>
            Stop
          </button>
        </div>
      )}

      {phase === "review" && blobUrl && (
        <div className="flex flex-col gap-2">
          <audio controls src={blobUrl} className="w-full" style={{ borderRadius: 8, outline: "none" }} />
          <div className="flex items-center gap-2">
            <button type="button" onClick={saveRecording} className={btnBase} style={{ background: NAVY, color: "white", border: "none" }}>
              Save recording
            </button>
            <button type="button" onClick={discardRecording} className={btnBase} style={{ background: "none", border: "1px solid rgba(51,51,51,0.15)", color: "rgba(51,51,51,0.5)" }}>
              Discard
            </button>
          </div>
        </div>
      )}

      {(phase === "idle" || phase === "uploading" || phase === "deleting") && (
        <div className="flex items-center gap-3 flex-wrap">
          <input type="file" accept="audio/*" ref={fileRef} style={{ display: "none" }} onChange={handleFileSelect} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={phase !== "idle"}
            className={btnBase}
            style={{ ...neutralBtn, cursor: phase !== "idle" ? "not-allowed" : "pointer", opacity: phase !== "idle" ? 0.6 : 1 }}
          >
            {phase === "uploading" ? "Uploading…" : savedUrl ? "Replace with file" : "Upload file"}
          </button>
          <button
            type="button"
            onClick={startRecording}
            disabled={phase !== "idle"}
            className={btnBase}
            style={{ background: "rgba(239,68,68,0.1)", color: "#B91C1C", border: "none", cursor: phase !== "idle" ? "not-allowed" : "pointer", opacity: phase !== "idle" ? 0.6 : 1 }}
          >
            ⏺ {savedUrl ? "Re-record" : "Record"}
          </button>
          {savedUrl && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={phase !== "idle"}
              className={btnBase}
              style={{ ...dangerBtn, cursor: phase !== "idle" ? "not-allowed" : "pointer", opacity: phase === "deleting" ? 0.6 : 1 }}
            >
              {phase === "deleting" ? "Removing…" : "Remove"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
