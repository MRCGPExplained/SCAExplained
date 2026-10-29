// Logging for the live recording flows (study room + betatest) — a full,
// timestamped picture of a session (status transitions, timings, errors)
// without needing to reproduce anything or guess where time went.
//
// It used to be console only. On 28 Oct a consultation lost one of its two
// tracks and every line that could have explained it — did the recorder
// start, did the upload begin, did it throw — was in a browser console that
// was closed before anyone looked. The console output is still the first
// thing to read while something is happening; what is new is that the lines
// that matter also outlive the tab.

/**
 * What gets kept, and what stays in the console.
 *
 * Every error and every timing, because those are the evidence. Statuses are
 * filtered: the room emits them constantly and storing all of them would bury
 * the ones worth finding. A prefix test rather than an exact list, so a new
 * event about recording or uploading is captured by default instead of being
 * silently dropped by a whitelist nobody remembered to update.
 */
function worthKeeping(level: "status" | "error" | "duration", event: string): boolean {
  if (level !== "status") return true;
  const e = event.toLowerCase();
  return (
    e.startsWith("recording") ||
    e.startsWith("upload") ||
    e.startsWith("cancel") ||
    e.startsWith("broadcast recording") ||
    e.startsWith("phase →") ||
    e.includes("recording-start") ||
    e.includes("mic") ||
    // Whether the take ended cleanly is part of the chain. "host stopping
    // recording" and "12-minute host cutoff fired" matched none of the
    // prefixes above and were being dropped as routine — and a take whose
    // stop never fired looks identical, from the stored lines, to one whose
    // upload failed.
    e.includes("stop") ||
    e.includes("cutoff")
  );
}

export interface RecordingLogContext {
  recordingId?: string | null;
  roomId?: string | null;
  role?: string | null;
}

export function createRecordingLogger(tag: string) {
  const sessionStart = Date.now();
  let ctx: RecordingLogContext = {};

  function elapsed(): string {
    return `+${((Date.now() - sessionStart) / 1000).toFixed(1)}s`;
  }

  function keep(level: "status" | "error" | "duration", event: string, data?: unknown) {
    if (typeof window === "undefined") return;
    if (!worthKeeping(level, event)) return;
    try {
      void fetch("/api/recordings/log", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...ctx, level, event, data: data ?? null }),
        /*
          The whole reason this is useful. An upload failing because the tab
          is closing is exactly the case we could not diagnose, and an
          ordinary fetch is cancelled when the page goes away — losing the
          one line that would have explained it. keepalive lets the browser
          finish the request after the document is gone.
        */
        keepalive: true,
      }).catch(() => {});
    } catch {
      // A logger must never be the reason something fails.
    }
  }

  return {
    /** Attach the ids once they are known, so later lines can be grouped. */
    setContext(next: RecordingLogContext) {
      ctx = { ...ctx, ...next };
    },

    /** A status/lifecycle transition — e.g. phase changes, join/leave, upload start. */
    logStatus(event: string, data?: Record<string, unknown>) {
      console.log(`[${tag} ${elapsed()}] ${event}`, data ?? "");
      keep("status", event, data);
    },

    /** Something failed — always includes the real error object, never swallowed silently. */
    logError(event: string, error: unknown, data?: Record<string, unknown>) {
      console.error(`[${tag} ${elapsed()}] ERROR — ${event}`, error, data ?? "");
      keep("error", event, {
        ...data,
        // Error does not survive JSON.stringify — without this the stored
        // line would say something failed and not what.
        error:
          error instanceof Error
            ? { name: error.name, message: error.message, stack: error.stack?.slice(0, 1200) }
            : String(error),
      });
    },

    /** Call with the Date.now() from when a step started; logs how long it took. */
    logDuration(event: string, startedAtMs: number) {
      const ms = Date.now() - startedAtMs;
      console.log(`[${tag} ${elapsed()}] ${event} took ${(ms / 1000).toFixed(1)}s`);
      keep("duration", event, { ms });
    },
  };
}
