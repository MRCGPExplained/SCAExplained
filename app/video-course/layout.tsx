export const dynamic = "force-dynamic";

export default function VideoCourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8", fontFamily: "Inter, system-ui, sans-serif" }}>
      {children}
    </div>
  );
}
