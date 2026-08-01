import { getSupabaseAdmin } from "@/lib/supabase";
import { updateSettingAction } from "./actions";

export const dynamic = "force-dynamic";

const SETTINGS = [
  {
    key: "resend_enabled",
    label: "Resend Emails",
    description: "When off, all outbound emails are silently skipped. Useful during testing to avoid burning Resend quota.",
    defaultValue: "true",
  },
  {
    key: "deepgram_enabled",
    label: "Deepgram Transcription",
    description: "When off, recordings skip the AI pipeline and go straight to the examiner queue without a transcript or pre-assessment.",
    defaultValue: "false",
  },
  {
    key: "vercel_plan",
    label: "Vercel Plan",
    description: "Set to 'pro' to enable long-running pipeline functions. 'hobby' forces the pipeline to skip Deepgram.",
    defaultValue: "pro",
    isText: true,
  },
] as const;

export default async function AdminSettingsPage() {
  const admin = getSupabaseAdmin();
  const { data: rows } = admin
    ? await admin.from("site_settings").select("key, value")
    : { data: [] };

  const map = new Map(((rows ?? []) as { key: string; value: string }[]).map((r) => [r.key, r.value]));

  return (
    <div>
      <h1 className="text-[20px] font-bold mb-6" style={{ color: "#333333" }}>Settings</h1>
      <div className="flex flex-col gap-4 max-w-[600px]">
        {SETTINGS.map((s) => {
          const current = map.get(s.key) ?? s.defaultValue;
          const isOn = current !== "false";

          if ("isText" in s && s.isText) {
            return (
              <div key={s.key} className="bg-white rounded-2xl p-5" style={{ border: "1px solid rgba(51,51,51,0.08)" }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[14px] font-bold mb-1" style={{ color: "#333333" }}>{s.label}</p>
                    <p className="text-[12.5px]" style={{ color: "rgba(51,51,51,0.5)" }}>{s.description}</p>
                  </div>
                  <form
                    action={async (fd: FormData) => {
                      "use server";
                      const val = String(fd.get("value") ?? "").trim();
                      if (val) await updateSettingAction(s.key, val);
                    }}
                    className="flex items-center gap-2 shrink-0"
                  >
                    <input
                      name="value"
                      defaultValue={current}
                      className="border rounded-lg px-3 py-1.5 text-[13px] w-24"
                      style={{ borderColor: "rgba(51,51,51,0.15)", color: "#333333" }}
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg text-[12px] font-bold"
                      style={{ background: "#333333", color: "white", border: "none", cursor: "pointer" }}
                    >
                      Save
                    </button>
                  </form>
                </div>
              </div>
            );
          }

          return (
            <div key={s.key} className="bg-white rounded-2xl p-5" style={{ border: "1px solid rgba(51,51,51,0.08)" }}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[14px] font-bold mb-1" style={{ color: "#333333" }}>{s.label}</p>
                  <p className="text-[12.5px]" style={{ color: "rgba(51,51,51,0.5)" }}>{s.description}</p>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await updateSettingAction(s.key, isOn ? "false" : "true");
                  }}
                >
                  <button
                    type="submit"
                    className="relative shrink-0 rounded-full transition-colors"
                    style={{
                      width: 44,
                      height: 24,
                      background: isOn ? "#333333" : "rgba(51,51,51,0.15)",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                    title={isOn ? "Click to disable" : "Click to enable"}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 3,
                        left: isOn ? 23 : 3,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "white",
                        transition: "left 0.15s",
                        display: "block",
                      }}
                    />
                  </button>
                </form>
              </div>
              <div className="mt-2">
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                  style={{
                    background: isOn ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    color: isOn ? "#166534" : "#B91C1C",
                  }}
                >
                  {isOn ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
