/**
 * Logger for the economics dashboard. Errors are ALWAYS logged so failures are
 * visible in the console (server logs or browser); verbose info/warn logging is
 * gated behind the debug toggle at the top of the panel (?debug=1). Usable from
 * both server components and client components.
 */
export interface EconLogger {
  debug: boolean;
  log: (scope: string, message: string, data?: unknown) => void;
  warn: (scope: string, message: string, data?: unknown) => void;
  error: (scope: string, err: unknown, data?: unknown) => void;
}

export function createEconLogger(debug: boolean): EconLogger {
  return {
    debug,
    log: (scope, message, data) => {
      if (debug) console.log(`[economics:${scope}] ${message}`, data ?? "");
    },
    warn: (scope, message, data) => {
      if (debug) console.warn(`[economics:${scope}] ${message}`, data ?? "");
    },
    // Always logged, regardless of the toggle — so we can always see failures.
    error: (scope, err, data) => {
      console.error(`[economics:${scope}] ERROR`, err, data ?? "");
    },
  };
}
