// Lightweight console logging for the live recording flows (study room +
// betatest) — gives a full, timestamped picture of a session (status
// transitions, timings, errors) without needing to reproduce anything or
// guess where time went.

export function createRecordingLogger(tag: string) {
  const sessionStart = Date.now();

  function elapsed(): string {
    return `+${((Date.now() - sessionStart) / 1000).toFixed(1)}s`;
  }

  return {
    /** A status/lifecycle transition — e.g. phase changes, join/leave, upload start. */
    logStatus(event: string, data?: Record<string, unknown>) {
      console.log(`[${tag} ${elapsed()}] ${event}`, data ?? "");
    },

    /** Something failed — always includes the real error object, never swallowed silently. */
    logError(event: string, error: unknown, data?: Record<string, unknown>) {
      console.error(`[${tag} ${elapsed()}] ERROR — ${event}`, error, data ?? "");
    },

    /** Call with the Date.now() from when a step started; logs how long it took. */
    logDuration(event: string, startedAtMs: number) {
      const seconds = ((Date.now() - startedAtMs) / 1000).toFixed(1);
      console.log(`[${tag} ${elapsed()}] ${event} took ${seconds}s`);
    },
  };
}
