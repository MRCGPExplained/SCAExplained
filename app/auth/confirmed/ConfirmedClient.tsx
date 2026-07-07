"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DARK = "#333333";
const YELLOW = "#F6D44B";

export default function ConfirmedClient({ isBeta }: { isBeta: boolean }) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(3);
  const destination = isBeta ? "/dashboard" : "/checkout";

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          router.push(destination);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router, destination]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#FAFAF8" }}>
      <div className="w-full max-w-[400px] text-center">

        <Link href="/" className="inline-block no-underline mb-8">
          <span className="font-display font-extrabold text-[22px]" style={{ color: DARK }}>
            SCA <span style={{ color: YELLOW }}>Explained</span>
          </span>
        </Link>

        <div
          className="rounded-2xl p-8 mt-2"
          style={{ background: "white", border: "1px solid rgba(51,51,51,0.10)", boxShadow: "0 4px 24px rgba(51,51,51,0.07)" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: isBeta ? "rgba(246,212,75,0.20)" : "rgba(51,51,51,0.06)" }}
          >
            {isBeta ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 2l2.4 6.4H20l-5.4 4 2 6.4L11 15l-5.6 3.8 2-6.4L2 8.4h6.6L11 2z" stroke={DARK} strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 11.5l5 5 9-9" stroke={DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>

          {isBeta ? (
            <>
              <h1 className="font-display font-bold text-[20px] mb-2" style={{ color: DARK }}>
                You are a website tester.
              </h1>
              <p className="text-[13.5px] leading-[1.6] mb-6" style={{ color: "rgba(51,51,51,0.55)" }}>
                Free access granted. Welcome, and thanks for helping us build this.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display font-bold text-[20px] mb-2" style={{ color: DARK }}>
                Email confirmed
              </h1>
              <p className="text-[13.5px] leading-[1.6] mb-6" style={{ color: "rgba(51,51,51,0.55)" }}>
                Your account is verified.
              </p>
            </>
          )}

          <p className="text-[12px] mb-5" style={{ color: "rgba(51,51,51,0.35)" }}>
            Redirecting in {seconds}…
          </p>

          <Link
            href={destination}
            className="inline-block w-full rounded-lg py-3 font-display font-bold text-[14px] no-underline text-center transition-opacity hover:opacity-90"
            style={{ background: isBeta ? YELLOW : DARK, color: isBeta ? DARK : "white" }}
          >
            {isBeta ? "Go to dashboard" : "Get access"}
          </Link>
        </div>

      </div>
    </div>
  );
}
