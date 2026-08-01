"use client";

import { useState } from "react";
import SoloRecordingTest from "./SoloRecordingTest";
import VoiceLoop from "./VoiceLoop";

type Station = { id: string; number: number; title: string; subject: string };

const TABS = [
  { id: "recording", label: "Recording Test" },
  { id: "roleplay", label: "AI Patient Roleplay" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function BetatestTabs({ stations }: { stations: Station[] }) {
  const [active, setActive] = useState<TabId>("recording");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "rgba(51,51,51,0.06)", display: "inline-flex" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold transition"
            style={{
              background: active === tab.id ? "white" : "transparent",
              color: active === tab.id ? "#333333" : "rgba(51,51,51,0.45)",
              boxShadow: active === tab.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {active === "recording" && <SoloRecordingTest stations={stations} />}
      {active === "roleplay" && <VoiceLoop />}
    </div>
  );
}
