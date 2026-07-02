"use client";

export function VideoEmbed({ src }: { src: string }) {
  const NAVY = "#1A1B52";
  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: "relative",
        width: "100vw",
        left: "50%",
        transform: "translateX(-50%)",
        paddingBottom: "56.25%",
        height: 0,
        background: NAVY,
        overflow: "hidden",
        boxShadow: "0 8px 40px rgba(26,27,82,0.22)",
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
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
