"use client";

import { useEffect, useState } from "react";

const TARGET_TEXT = "I BUILD SYSTEMS THAT JUST WORK";

export function HeroHeading() {
  const [displayText, setDisplayText] = useState<string>(TARGET_TEXT);
  const [resolved, setResolved] = useState(true);

  useEffect(() => {
    let animationFrame = 0;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const start = performance.now();
    const durationMs = 1500;
    const chars = TARGET_TEXT.split("");
    const perCharCycles = chars.map((ch) => (ch === " " ? 0 : 2 + Math.floor(Math.random() * 2)));

    const pickLetter = (index: number, cycle: number) => {
      const x = Math.sin((index + 1) * 999 + (cycle + 1) * 97) * 10000;
      const idx = Math.floor((x - Math.floor(x)) * letters.length);
      return letters[Math.max(0, Math.min(letters.length - 1, idx))];
    };

    const tick = (now: number) => {
      const elapsed = Math.min(durationMs, now - start);
      const nextText = chars
        .map((targetCh, i, arr) => {
          if (targetCh === " ") return " ";
          const settleAt = durationMs * (0.25 + 0.65 * (i / Math.max(1, arr.length - 1)));
          if (elapsed >= settleAt) return targetCh;
          const cyclePeriod = Math.max(1, settleAt / (perCharCycles[i] + 1));
          const cycle = Math.min(perCharCycles[i] - 1, Math.floor(elapsed / cyclePeriod));
          return pickLetter(i, cycle);
        })
        .join("");

      setDisplayText(nextText);

      if (elapsed < durationMs) {
        animationFrame = requestAnimationFrame(tick);
      } else {
        setDisplayText(TARGET_TEXT);
        setResolved(true);
      }
    };

    setResolved(false);
    animationFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <h1
      data-reveal
      className="mt-5 font-sans text-4xl leading-[0.95] tracking-[-0.025em] text-[var(--fg)] sm:text-5xl md:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] 2xl:text-[7rem] sm:origin-left"
      style={{ maxWidth: "100%" }}
    >
      <span className="block max-w-full break-words" aria-label={TARGET_TEXT}>
        {displayText}
      </span>
      <span className="text-[var(--accent)]">{resolved ? "" : "|"}</span>
    </h1>
  );
}
