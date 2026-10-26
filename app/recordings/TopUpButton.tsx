"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TOPUPS, AI_TOPUPS, GP_TOPUPS, topUpPrice, type TopUpKey } from "@/lib/topups";

const DARK = "#333333";

/**
 * Top-ups, behind a button rather than spread across the page.
 *
 * The packs used to sit open on /recordings under a yellow panel, which meant
 * a price list was the second thing anyone saw on the page they go to in
 * order to read their feedback. Nobody arrives here to shop. They arrive
 * having been told a balance is empty, and the one moment the prices matter
 * is the moment they go looking for them.
 *
 * `autoOpen` covers that moment: the dialogs that say "none left" link here
 * with ?topup=1 so the packs are already in front of the person who was sent
 * to find them.
 */
export function TopUpButton({
  autoOpen = false,
  variant = "button",
  label = "Top up",
}: {
  autoOpen?: boolean;
  /** "link" for places that are already inside a dialog, where a second solid
   *  button would compete with the choice being made. */
  variant?: "button" | "link";
  label?: string;
}) {
  const [open, setOpen] = useState(autoOpen);
  const [busy, setBusy] = useState<TopUpKey | null>(null);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Escape closes, and the page behind does not scroll while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && busy === null) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, busy]);

  async function buy(key: TopUpKey) {
    setBusy(key);
    setError("");
    try {
      const res = await fetch("/api/topup/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topup: key }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setBusy(null);
    }
  }

  const card = (key: TopUpKey) => {
    const t = TOPUPS[key];
    return (
      <button
        key={key}
        type="button"
        onClick={() => buy(key)}
        disabled={busy !== null}
        className="topup-card rounded-xl px-4 py-3.5 text-left"
        style={{
          border: "1px solid rgba(51,51,51,0.12)",
          cursor: busy ? "default" : "pointer",
          opacity: busy && busy !== key ? 0.5 : 1,
        }}
      >
        <span className="block font-display font-extrabold text-[20px] leading-none mb-1" style={{ color: DARK }}>
          {busy === key ? "…" : topUpPrice(t)}
        </span>
        <span className="block text-[12.5px] font-semibold" style={{ color: DARK }}>{t.label}</span>
        <span className="block text-[11.5px]" style={{ color: "rgba(51,51,51,0.45)" }}>{t.detail}</span>
      </button>
    );
  };

  return (
    <>
      {variant === "link" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-semibold underline text-[12px]"
          style={{ background: "none", border: "none", padding: 0, color: DARK, cursor: "pointer" }}
        >
          {label}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl px-3.5 py-2 text-[13px] font-bold shrink-0"
          style={{ background: DARK, color: "white", border: "none", cursor: "pointer" }}
        >
          {label}
        </button>
      )}

      {mounted && open &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center z-[60] px-6"
            style={{ background: "rgba(51,51,51,0.6)" }}
            onClick={() => busy === null && setOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="topup-heading"
              className="w-full max-w-[560px] rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
              style={{ background: "white", boxShadow: "0 20px 60px rgba(51,51,51,0.3)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Hover in CSS rather than React state: five identical cards
                  and a :hover rule costs nothing, where tracking a hovered
                  key would be state for a colour. The background lives here
                  and not in the inline style below, because an inline
                  background wins against a class and the wash would never
                  show. */}
              <style>{`
                .topup-card {
                  background: #ffffff;
                  transition: background-color 0.15s ease-out;
                }
                .topup-card:hover:not(:disabled) { background: #FDFAEF; }
                @media (prefers-reduced-motion: reduce) {
                  .topup-card { transition: none; }
                }
              `}</style>

              <h2 id="topup-heading" className="font-display font-extrabold text-[17px] mb-4" style={{ color: DARK }}>
                Top up
              </h2>

              <p className="text-[11px] font-bold uppercase tracking-[0.06em] mb-2" style={{ color: "rgba(51,51,51,0.45)" }}>
                AI reviews
              </p>
              <div className="grid grid-cols-2 gap-2.5 mb-5">{AI_TOPUPS.map(card)}</div>

              <p className="text-[11px] font-bold uppercase tracking-[0.06em] mb-2" style={{ color: "rgba(51,51,51,0.45)" }}>
                GP reviews
              </p>
              <div className="grid grid-cols-2 gap-2.5">{GP_TOPUPS.map(card)}</div>

              {error && <p className="text-[12px] mt-3" style={{ color: "#B91C1C" }}>{error}</p>}

              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={busy !== null}
                className="w-full text-[12px] mt-5"
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(51,51,51,0.5)",
                  cursor: busy ? "default" : "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
