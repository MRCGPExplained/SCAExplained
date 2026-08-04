"use client";

import { useState, useEffect } from "react";
import SoloRecordingTest from "./SoloRecordingTest";
import GroupRecordingTest from "./GroupRecordingTest";
import VoiceLoop from "./VoiceLoop";

type Station = { id: string; number: number; title: string; subject: string };

const TABS = [
  { id: "solo", label: "Recording Test (Solo)" },
  { id: "group", label: "Recording Test (Group)" },
  { id: "roleplay", label: "AI Patient Roleplay" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const TAB_STORAGE_KEY = "betatestActiveTab";

function isTabId(value: string | null): value is TabId {
  return TABS.some((t) => t.id === value);
}

export default function BetatestTabs({ stations }: { stations: Station[] }) {
  const [active, setActive] = useState<TabId>("solo");

  // Restore the last-used tab on refresh — mid-test navigation shouldn't
  // bounce testers back to Solo every time.
  useEffect(() => {
    const saved = sessionStorage.getItem(TAB_STORAGE_KEY);
    if (isTabId(saved)) setActive(saved);
  }, []);

  function selectTab(id: TabId) {
    setActive(id);
    sessionStorage.setItem(TAB_STORAGE_KEY, id);
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "rgba(51,51,51,0.06)", display: "inline-flex" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => selectTab(tab.id)}
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
      {active === "solo" && <SoloRecordingTest stations={stations} />}
      {active === "group" && <GroupRecordingTest stations={stations} />}
      {active === "roleplay" && <VoiceLoop />}
    </div>
  );
}
