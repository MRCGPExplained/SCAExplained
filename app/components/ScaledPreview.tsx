"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders children at full natural size then visually scales the whole
 * block down, collapsing the wrapper to match — a CSS transform alone
 * leaves the original (pre-scale) empty space behind since transforms
 * don't affect layout, so the collapsed height is measured and applied
 * explicitly instead.
 */
export function ScaledPreview({ scale, children }: { scale: number; children: ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const update = () => setHeight(el.offsetHeight * scale);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [scale]);

  return (
    <div style={{ overflow: "hidden", height: height ?? undefined }}>
      <div
        ref={innerRef}
        style={{ width: `${100 / scale}%`, transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {children}
      </div>
    </div>
  );
}
