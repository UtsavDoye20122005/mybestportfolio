"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GITHUB_USERNAME } from "../../data/profile";
import { useGithubContributions } from "./useGithubContributions";

const stats = [
  { value: "2", suffix: "", label: "years of building" },
  { value: "8", suffix: "", label: "projects shipped" },
  { value: "340", suffix: "", label: "bugs fixed" },
  { value: "420", suffix: "", label: "GitHub contributions" },
];

function StatItem({ stat, isVisible, delay }: { stat: typeof stats[0], isVisible: boolean, delay: number }) {
  const [displayValue, setDisplayValue] = useState(isNaN(Number(stat.value)) ? "" : "0");
  const isNumeric = !isNaN(Number(stat.value));

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1200; // 1.2s
    let frameId = 0;
    let cancelled = false;

    const timeout = setTimeout(() => {
      const startTime = performance.now();

      if (isNumeric) {
        const target = Number(stat.value);
        const animate = (time: number) => {
          if (cancelled) return;

          const elapsed = time - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // ease-out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          setDisplayValue(Math.floor(easeProgress * target).toString());

          if (progress < 1) {
            frameId = requestAnimationFrame(animate);
          } else {
            setDisplayValue(stat.value);
          }
        };
        frameId = requestAnimationFrame(animate);
      } else {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const animate = (time: number) => {
          if (cancelled) return;

          const elapsed = time - startTime;
          const progress = Math.min(elapsed / duration, 1);

          if (progress < 1) {
            setDisplayValue(
              stat.value.split("").map(() => letters[Math.floor(Math.random() * letters.length)]).join("")
            );
            frameId = requestAnimationFrame(animate);
          } else {
            setDisplayValue(stat.value);
          }
        };
        frameId = requestAnimationFrame(animate);
      }
    }, delay * 1000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      cancelAnimationFrame(frameId);
    };
  }, [isVisible, stat.value, delay, isNumeric]);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center h-full">
      <div className="font-mono text-4xl sm:text-5xl md:text-6xl text-[var(--accent)] mb-2">
        {displayValue || "0"}{stat.suffix}
      </div>
      <div className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted)]">
        {stat.label}
      </div>
    </div>
  );
}

export function ByTheNumbers() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { data } = useGithubContributions(GITHUB_USERNAME);
  const statsState = useMemo(() => {
    const total = data?.totalAllTime;
    if (typeof total !== "number") return stats;

    return stats.map((stat) =>
      stat.label === "GitHub contributions"
        ? { ...stat, value: String(total) }
        : stat
    );
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-4 md:px-6" ref={ref}>
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="h-px bg-[var(--rule)] flex-1 max-w-[100px]" />
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--fg)]">BY THE NUMBERS</h2>
        <div className="h-px bg-[var(--rule)] flex-1 max-w-[100px]" />
      </div>
      
      <div className="mx-auto grid max-w-5xl grid-cols-1 border-l border-t border-[var(--rule)] sm:grid-cols-2 lg:grid-cols-4">
        {statsState.map((s, i) => (
          <div key={`${s.label}-${s.value}`} className="border-r border-b border-[var(--rule)]">
            <StatItem stat={s} isVisible={isVisible} delay={i * 0.15} />
          </div>
        ))}
      </div>

      <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
        Hardcoded stats with GitHub contributions synced from <span className="text-[var(--fg)]">@{GITHUB_USERNAME}</span> · TODO: fix live API fallback
      </p>
    </section>
  );
}
