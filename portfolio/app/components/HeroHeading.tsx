"use client";

import { useEffect, useRef, useMemo, useState } from "react";

export function HeroHeading() {
  const targetName = "UTSAV DOYE";
  const [scrambledName, setScrambledName] = useState<string>(() => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return targetName
      .split("")
      .map((ch) => (ch === " " ? " " : letters[Math.floor(Math.random() * letters.length)]))
      .join("");
  });
  const [nameResolved, setNameResolved] = useState(false);
  const perCharCycles = useMemo(() => {
    return targetName.split("").map((ch) => (ch === " " ? 0 : 3 + Math.floor(Math.random() * 2)));
  }, [targetName]);

  const h1Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const durationMs = 1000;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const start = performance.now();

    const pickLetter = (i: number, cycle: number) => {
      const x = Math.sin((i + 1) * 999 + (cycle + 1) * 97) * 10000;
      const idx = Math.floor((x - Math.floor(x)) * letters.length);
      return letters[Math.max(0, Math.min(letters.length - 1, idx))];
    };

    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(durationMs, now - start);
      const next = targetName
        .split("")
        .map((targetCh, i, arr) => {
          if (targetCh === " ") return " ";
          const cycles = perCharCycles[i] ?? 3;
          const denom = Math.max(1, arr.length - 1);
          const settleAt = durationMs * (0.35 + 0.65 * (i / denom));

          if (t >= settleAt) return targetCh;

          const cyclePeriod = settleAt / (cycles + 1);
          const cycle = Math.min(cycles - 1, Math.floor(t / Math.max(1, cyclePeriod)));
          return pickLetter(i, cycle);
        })
        .join("");

      setScrambledName(next);

      if (t >= durationMs) {
        setScrambledName(targetName);
        setNameResolved(true);
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [perCharCycles, targetName]);

  return (
    <h1
      data-reveal
      className="mt-5 font-sans text-4xl leading-[0.94] tracking-[-0.025em] text-[var(--fg)] sm:text-5xl md:text-6xl lg:text-[6.5rem] xl:text-[7.5rem] sm:origin-left"
    >
      <span className="whitespace-nowrap">{scrambledName}</span>
      {nameResolved ? (
        <span className="cursor-blink" aria-hidden="true">
          |
        </span>
      ) : null}
    </h1>
  );
}
