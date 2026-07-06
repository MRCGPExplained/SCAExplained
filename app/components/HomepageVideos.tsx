"use client";

import { useState } from "react";

type HomepageVideo = {
  id: string;
  title: string;
  description: string | null;
  embed_url: string;
  thumbnail_url: string | null;
};

function PlayIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="18" fill="rgba(0,0,0,0.40)" />
      <path d="M15 11.5L25.5 18L15 24.5V11.5Z" fill="white" />
    </svg>
  );
}

export function HomepageVideos({ videos }: { videos: HomepageVideo[] }) {
  const [active, setActive] = useState<HomepageVideo | null>(null);

  if (videos.length === 0) return null;

  return (
    <>
      <div className="flex flex-col gap-4">
        {videos.map((v) => (
          <button
            key={v.id}
            onClick={() => setActive(v)}
            className="text-left w-full rounded-2xl overflow-hidden cursor-pointer group transition-all hover:shadow-lg hover:-translate-y-0.5 flex flex-col sm:flex-row sm:h-[108px]"
            style={{
              background: "white",
              border: "1px solid rgba(51,51,51,0.10)",
              boxShadow: "0 2px 10px rgba(51,51,51,0.06)",
              padding: 0,
            }}
          >
            {/* Thumbnail */}
            <div className="relative overflow-hidden shrink-0 w-full sm:w-[38%] h-[200px] sm:h-full">
              {v.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={v.thumbnail_url}
                  alt={v.title}
                  className="w-full h-full object-cover"
                  style={{ display: "block" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(51,51,51,0.08)" }}>
                  <span className="text-[13px] font-semibold px-4 text-center" style={{ color: "rgba(51,51,51,0.30)" }}>{v.title}</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayIcon />
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center px-6 py-4 flex-1">
              <p className="font-display font-bold text-[15px] leading-snug mb-1" style={{ color: "#333333" }}>{v.title}</p>
              {v.description && (
                <p className="text-[13.5px] leading-[1.6]" style={{ color: "rgba(51,51,51,0.55)" }}>{v.description}</p>
              )}
              <p className="text-[12px] font-semibold mt-2 flex items-center gap-1.5" style={{ color: "rgba(51,51,51,0.35)" }}>
                <span>▶</span> Watch
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={() => setActive(null)}
        >
          <div
            className="relative w-full max-w-[860px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActive(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-[13px] font-semibold transition-colors"
            >
              ✕ Close
            </button>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 12, overflow: "hidden", background: "#111" }}>
              <iframe
                src={active.embed_url}
                title={active.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              />
            </div>
            <p className="text-white font-display font-bold text-[16px] mt-4">{active.title}</p>
          </div>
        </div>
      )}
    </>
  );
}
