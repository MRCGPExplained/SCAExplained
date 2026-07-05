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
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.45)" />
      <path d="M20 16L34 24L20 32V16Z" fill="white" />
    </svg>
  );
}

export function HomepageVideos({ videos }: { videos: HomepageVideo[] }) {
  const [active, setActive] = useState<HomepageVideo | null>(null);

  if (videos.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
        {videos.map((v) => (
          <button
            key={v.id}
            onClick={() => setActive(v)}
            className="text-left rounded-2xl overflow-hidden cursor-pointer group transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              aspectRatio: "1 / 1",
              background: "white",
              border: "1px solid rgba(51,51,51,0.10)",
              boxShadow: "0 2px 10px rgba(51,51,51,0.06)",
              display: "flex",
              flexDirection: "column",
              padding: 0,
            }}
          >
            {/* Thumbnail */}
            <div className="relative overflow-hidden" style={{ flex: "0 0 62%" }}>
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
                  <span className="text-[13px] font-semibold" style={{ color: "rgba(51,51,51,0.30)" }}>{v.title}</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayIcon />
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center px-5 py-4" style={{ flex: "1 1 0" }}>
              <p className="font-display font-bold text-[15px] leading-snug" style={{ color: "#333333" }}>{v.title}</p>
              {v.description && (
                <p className="text-[12.5px] mt-1 leading-[1.5] line-clamp-2" style={{ color: "rgba(51,51,51,0.55)" }}>{v.description}</p>
              )}
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
