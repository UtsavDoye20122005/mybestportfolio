"use client";

import { useEffect, useState, useRef } from "react";

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [displayedCount, setDisplayedCount] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    // fetch will be triggered once the component becomes visible to the user
    // (see IntersectionObserver effect below). This avoids doing network
    // requests during initial client render when not visible.
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();

          if (didFetch.current) return;
          didFetch.current = true;

          fetch("/api/visitor", { method: "POST" })
            .then((r) => {
              if (!r.ok) throw new Error("Failed");
              return r.json();
            })
            .then((d) => {
              setCount(typeof d.value === "number" ? d.value : null);
            })
            .catch(() => setError(true));
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && count !== null) {
      const start = performance.now();
      const duration = 1200;
      const from = 0;
      const to = count;

      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      let rafId = 0;
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const next = Math.round(from + (to - from) * eased);
        setDisplayedCount(next);
        if (progress < 1) rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafId);
    }
  }, [isVisible, count]);

  if (error) return null;

  return (
    <div ref={ref} className="mx-auto max-w-6xl px-4 py-20 mt-10 text-center flex flex-col items-center">
      <div className="w-full max-w-md border-t border-[var(--rule)] mb-8" />
      <div className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)] mb-4">
        YOU ARE VISITOR #
      </div>
      <div className="font-mono text-6xl md:text-8xl text-[var(--accent)] mb-4">
        {count === null || displayedCount === null ? "---" : displayedCount}
      </div>
      <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
        AMONG DEVELOPERS, RECRUITERS & CURIOUS HUMANS
      </div>
      <div className="w-full max-w-md border-t border-[var(--rule)] mt-8" />
    </div>
  );
}
