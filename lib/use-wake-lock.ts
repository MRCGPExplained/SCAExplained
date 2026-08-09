"use client";

import { useEffect, useRef } from "react";

interface WakeLockSentinelLike {
  release: () => Promise<void>;
  addEventListener?: (type: string, cb: () => void) => void;
}
interface WakeLockApi {
  request: (type: "screen") => Promise<WakeLockSentinelLike>;
}

/**
 * Holds a Screen Wake Lock while `active` is true, so the device screen doesn't
 * dim/sleep from inactivity during a consultation. Best-effort and
 * feature-detected: unsupported browsers (Firefox Android, iOS < 16.4) simply
 * no-op. The browser auto-releases the lock when the tab is backgrounded, so we
 * re-acquire it whenever the page becomes visible again.
 */
export function useWakeLock(active: boolean) {
  const lockRef = useRef<WakeLockSentinelLike | null>(null);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    const api = (navigator as Navigator & { wakeLock?: WakeLockApi }).wakeLock;
    if (!api) return; // unsupported — no-op

    async function acquire() {
      if (lockRef.current || cancelled) return;
      try {
        const lock = await api!.request("screen");
        if (cancelled) {
          lock.release().catch(() => {});
          return;
        }
        lockRef.current = lock;
        // The browser releases the lock on background; clear our ref so we
        // re-acquire when the page is visible again.
        lock.addEventListener?.("release", () => {
          lockRef.current = null;
        });
      } catch {
        // best-effort — e.g. denied because the document isn't active
      }
    }

    acquire();
    const onVisible = () => {
      if (document.visibilityState === "visible") acquire();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      lockRef.current?.release().catch(() => {});
      lockRef.current = null;
    };
  }, [active]);
}
