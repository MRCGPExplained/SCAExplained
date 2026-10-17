// This layout reads no session of its own any more, but the pages beneath it
// do, so nothing here can be prerendered either way. Kept explicit rather than
// relying on a cookies() call to opt out.
export const dynamic = "force-dynamic";

export default function CaseBankLayout({ children }: { children: React.ReactNode }) {
  // The study room used to be mounted here, because a layout survives
  // navigation within its own subtree. That was one subtree too few: leaving
  // /case-bank at all — for a report, the dashboard, an account page — tore the
  // whole session down. It now lives in the root layout instead, so the only
  // thing that ends a session is the Leave button.
  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8", fontFamily: "Inter, system-ui, sans-serif" }}>
      {children}
    </div>
  );
}
