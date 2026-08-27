"use client";

import { useEffect, useRef } from "react";

/**
 * TEMPORARY — Step 0 of the study-room persistence refactor.
 *
 * Verifies the load-bearing assumption before 3000 lines are restructured:
 * that a client component rendered by app/case-bank/layout.tsx genuinely
 * survives navigation between stations, and that it sees an updated userId
 * after login without remounting. Delete once confirmed.
 */
export function LayoutProbe({ userId }: { userId: string | null }) {
  const idRef = useRef(Math.random().toString(36).slice(2, 7));

  useEffect(() => {
    const id = idRef.current;
    console.log(`[probe] MOUNT ${id} @ ${location.pathname}`);
    return () => console.log(`[probe] UNMOUNT ${id}`);
  }, []);

  console.log(`[probe] render ${idRef.current} userId=${userId ?? "null"} @ ${typeof window !== "undefined" ? location.pathname : "ssr"}`);

  return null;
}
