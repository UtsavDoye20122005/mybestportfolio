"use client";

import { useEffect, useRef } from "react";

export function CursorSpotlight() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Detect touch
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) {
      el.style.display = "none";
      return;
    }

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener("mousemove", onMove);

    let rafId: number;
    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      el.style.background = `radial-gradient(
        600px circle at ${currentX}px ${currentY}px,
        rgba(232, 255, 0, 0.03),
        rgba(0, 0, 0, 0.15) 40%,
        transparent 70%
      )`;

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      aria-hidden="true"
    />
  );
}
