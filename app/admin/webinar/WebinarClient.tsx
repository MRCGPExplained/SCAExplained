"use client";

import { useState } from "react";
import { LiveSessionsClient } from "../live-sessions/LiveSessionsClient";
import WebinarCodesClient, { type WebinarCode } from "../webinar-codes/WebinarCodesClient";

type Session = { id: string; zoom_url: string; scheduled_at: string; is_free: boolean };

const NAVY = "#333333";
const YELLOW = "#F6D44B";

export function WebinarClient({ sessions, codes }: { sessions: Session[]; codes: WebinarCode[] }) {
  const [tab, setTab] = useState<"dates" | "codes">("dates");

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-[26px] text-navy">Webinar</h1>
        <p className="text-[13px] text-navy/50 mt-0.5">Manage upcoming webinar dates and the codes attendees use to redeem recording credits.</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 mb-8 p-1 rounded-xl w-fit" style={{ background: "rgba(51,51,51,0.07)" }}>
        {(["dates", "codes"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2 rounded-lg text-[13px] font-semibold transition-all"
            style={{
              background: tab === t ? NAVY : "transparent",
              color: tab === t ? YELLOW : "rgba(51,51,51,0.5)",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {t === "dates" ? "Dates" : "Codes"}
          </button>
        ))}
      </div>

      {tab === "dates" && <LiveSessionsClient sessions={sessions} />}
      {tab === "codes" && <WebinarCodesClient codes={codes} />}
    </div>
  );
}
