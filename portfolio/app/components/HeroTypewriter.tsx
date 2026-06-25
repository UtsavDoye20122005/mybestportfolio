"use client";

import { useEffect, useRef, useState } from "react";

const SENTENCES = [
  "I turn complex problems into boring, reliable systems.",
  "I build the whole thing, quietly.",
  "Full stack. Front to back. Clean all the way through.",
  "Software that works. Quietly, completely, every time.",
  "end-to-end. no noise, no shortcuts.",
];

const TYPE_SPEED_MS = 74;
const HOLD_DURATION_MS = 4500;
const DELETE_SPEED_MS = 20;
const WAIT_BETWEEN_SENTENCES_MS = 700;

export function HeroTypewriter() {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting" | "waiting">("typing");

  const sentenceIndex = useRef(0);
  const charIndex = useRef(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const tick = () => {
      const currentSentence = SENTENCES[sentenceIndex.current];

      switch (phase) {
        case "typing":
          if (charIndex.current < currentSentence.length) {
            setText(currentSentence.substring(0, charIndex.current + 1));
            charIndex.current++;
            timeout = setTimeout(tick, TYPE_SPEED_MS);
          } else {
            setPhase("holding");
            timeout = setTimeout(tick, HOLD_DURATION_MS);
          }
          break;
        case "holding":
          setPhase("deleting");
          timeout = setTimeout(tick, DELETE_SPEED_MS);
          break;
        case "deleting":
          if (charIndex.current > 0) {
            setText(currentSentence.substring(0, charIndex.current - 1));
            charIndex.current--;
            timeout = setTimeout(tick, DELETE_SPEED_MS);
          } else {
            setPhase("waiting");
            timeout = setTimeout(tick, WAIT_BETWEEN_SENTENCES_MS);
          }
          break;
        case "waiting":
          sentenceIndex.current = (sentenceIndex.current + 1) % SENTENCES.length;
          setPhase("typing");
          timeout = setTimeout(tick, TYPE_SPEED_MS);
          break;
      }
    };

    timeout = setTimeout(tick, TYPE_SPEED_MS);

    return () => clearTimeout(timeout);
  }, [phase]);

  // The cursor blinks normally, except when preparing to delete or mid-delete
  const isSolidCursor = phase === "deleting";

  return (
    <p
      data-reveal
      className="mt-8 max-w-3xl font-mono text-base leading-8 tracking-[0.015em] text-[var(--muted)] sm:text-lg sm:leading-9 min-h-[64px] sm:min-h-[72px]"
    >
      {text}
      <span
        style={{ color: "var(--accent)" }}
        className={isSolidCursor ? "" : "animate-[cursorBlink_530ms_steps(1,end)_infinite]"}
      >
        |
      </span>
    </p>
  );
}
