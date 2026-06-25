"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import Link from "next/link";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a"
];

export function Konami() {
  const [showModal, setShowModal] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let sequence: string[] = [];
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      sequence.push(e.key === "B" || e.key === "A" ? e.key.toLowerCase() : e.key);
      if (sequence.length > KONAMI_CODE.length) {
        sequence.shift();
      }

      if (sequence.join(",") === KONAMI_CODE.join(",")) {
        sequence = [];
        triggerEasterEgg();
      }

      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  const triggerEasterEgg = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
    setShowModal(true);

    const colors = ["#e8ff00", "#ffffff", "#1a1a1a"];
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.1 },
      colors
    });
  };

  return (
    <>
      {flash && (
        <div className="fixed inset-0 z-[99998] bg-[#e8ff00] opacity-20 pointer-events-none transition-opacity duration-300" />
      )}
      {showModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[var(--bg)]/80 backdrop-blur-md p-4" onClick={() => setShowModal(false)}>
          <div className="border border-[var(--rule)] bg-[var(--bg)] p-10 max-w-lg w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 font-mono text-[10px] uppercase border border-[var(--rule)] px-2 py-1 hover:text-[var(--accent)] hover:border-[var(--accent)]">ESC</button>
            <h2 className="font-sans italic text-5xl mb-2 text-[var(--fg)]">YOU FOUND IT.</h2>
            <p className="font-mono text-sm text-[var(--muted)] mb-8">not many do.</p>
            
            <p className="font-mono text-sm text-[var(--fg)] leading-7 mb-8">
              Seriously though — if you took the time to try the Konami code on a portfolio site, we should talk.<br /><br />
              You're exactly the kind of person I want to work with.
            </p>

            <Link href="/contact" onClick={() => setShowModal(false)} className="inline-flex items-center gap-4 bg-[var(--accent)] text-[#1a1a1a] px-6 py-4 font-mono text-sm uppercase font-bold tracking-[0.1em] hover:bg-white transition-colors">
              LET'S TALK <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
