"use client";

export function VideoEmbed({ src, title }: { src: string; title: string }) {
  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 12, overflow: "hidden", background: "rgba(51,51,51,0.08)" }}
    >
      <iframe
        src={src}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-presentation"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
