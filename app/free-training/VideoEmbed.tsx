"use client";

export function VideoEmbed({ src }: { src: string }) {
  const NAVY = "#1A1B52";
  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: NAVY,
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <iframe
        src={src}
        title="How To Get A Clear Pass"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-presentation"
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      {/* Cover the YouTube title bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60px", background: NAVY, pointerEvents: "none" }} />
    </div>
  );
}
