"use client";

import { useEffect } from "react";
import { REPORT_READ_EVENT } from "@/lib/inbox";

/**
 * Renders nothing. Tells the navbar that this report has just been read.
 *
 * The envelope lives in the root layout. Opening a report is a client-side
 * navigation, and Next refetches only the segment that changed: shared
 * layouts are not refetched on every navigation. So the count the navbar was
 * given when the tab last loaded is the count it keeps, however many reports
 * are opened underneath it. Opening one from the envelope already worked,
 * because the panel could drop its own badge on the way out; opening the same
 * report from the list had nothing to say so.
 *
 * Mounted only when the page's write to candidate_viewed_at actually
 * succeeded, so the badge cannot drop for a read that did not happen.
 */
export function ReportRead({ recordingId }: { recordingId: string }) {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(REPORT_READ_EVENT, { detail: recordingId }));
  }, [recordingId]);

  return null;
}
