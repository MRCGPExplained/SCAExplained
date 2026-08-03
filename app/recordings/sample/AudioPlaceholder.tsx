"use client";

import { useState } from "react";
import Link from "next/link";

const NAVY = "#333333";

export function AudioPlaceholder() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Fake player */}
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{ background: "rgba(51,51,51,0.05)", border: "1px solid rgba(51,51,51,0.09)", cursor: "pointer" }}
        aria-label="Play audio"
      >
        {/* Play icon */}
        <span
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(51,51,51,0.12)" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 1.5L10.5 6L2.5 10.5V1.5Z" fill={NAVY} fillOpacity="0.5" />
          </svg>
        </span>

        {/* Scrubber */}
        <div className="flex-1 flex flex-col gap-1.5">
          <div style={{ background: "rgba(51,51,51,0.10)", borderRadius: 99, height: 5 }}>
            <div style={{ width: "0%", height: "100%", background: "rgba(51,51,51,0.25)", borderRadius: 99 }} />
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] font-mono" style={{ color: "rgba(51,51,51,0.3)" }}>0:00</span>
            <span className="text-[10px] font-mono" style={{ color: "rgba(51,51,51,0.3)" }}>—:——</span>
          </div>
        </div>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="rounded-2xl p-7 max-w-[340px] w-full text-center"
            style={{ background: "white", boxShadow: "0 12px 40px rgba(0,0,0,0.18)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(246,212,75,0.18)" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4v6M10 14v.5" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="10" cy="10" r="8.5" stroke={NAVY} strokeWidth="1.4"/>
              </svg>
            </div>
            <h2 className="font-display font-bold text-[17px] mb-2" style={{ color: NAVY }}>
              Audio available after sign up
            </h2>
            <p className="text-[13px] mb-6" style={{ color: "rgba(51,51,51,0.55)" }}>
              Create a free account to access consultation recordings and examiner voice notes.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="w-full font-bold text-[14px] py-2.5 rounded-xl"
              style={{ background: NAVY, color: "white", border: "none", cursor: "pointer" }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
