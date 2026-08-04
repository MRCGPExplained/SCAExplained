// Lightweight console logging for the betatest flows — gives a full,
// timestamped picture of a test session (status transitions, timings,
// errors) without needing to reproduce anything or guess where time went.

const sessionStart = Date.now();

function elapsed(): string {
  return `+${((Date.now() - sessionStart) / 1000).toFixed(1)}s`;
}

/** A status/lifecycle transition — e.g. phase changes, join/leave, upload start. */
export function logStatus(event: string, data?: Record<string, unknown>) {
  console.log(`[betatest ${elapsed()}] ${event}`, data ?? "");
}

/** Something failed — always includes the real error object, never swallowed silently. */
export function logError(event: string, error: unknown, data?: Record<string, unknown>) {
  console.error(`[betatest ${elapsed()}] ERROR — ${event}`, error, data ?? "");
}

/** Call with the Date.now() from when a step started; logs how long it took. */
export function logDuration(event: string, startedAtMs: number) {
  const seconds = ((Date.now() - startedAtMs) / 1000).toFixed(1);
  console.log(`[betatest ${elapsed()}] ${event} took ${seconds}s`);
}
