"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StaggerList, StaggerItem } from "./StaggerList";

export function Shortcuts() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let gPressed = false;
    let gTimeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if (e.key === "?") {
        setShowModal(true);
        return;
      }

      if (e.key === "Escape" && showModal) {
        setShowModal(false);
        return;
      }

      if (e.key.toLowerCase() === "t") {
        const saved = localStorage.getItem("theme");
        const isPaper = document.documentElement.getAttribute("data-theme") === "paper";
        const next = isPaper ? "night" : "paper";
        localStorage.setItem("theme", next);
        if (next === "paper") {
          document.documentElement.setAttribute("data-theme", "paper");
        } else {
          document.documentElement.removeAttribute("data-theme");
        }
        window.dispatchEvent(new Event("storage"));
        return;
      }

      if (e.key.toLowerCase() === "g") {
        gPressed = true;
        clearTimeout(gTimeout);
        gTimeout = setTimeout(() => {
          gPressed = false;
        }, 500);
        return;
      }

      if (gPressed) {
        gPressed = false;
        switch (e.key.toLowerCase()) {
          case "h": router.push("/"); break;
          case "p": router.push("/projects"); break;
          case "a": router.push("/about"); break;
          case "c": router.push("/contact"); break;
          case "j": router.push("/journey"); break;
          case "m": router.push("/music"); break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(gTimeout);
    };
  }, [router, showModal]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[var(--bg)]/80 backdrop-blur-md p-4" onClick={() => setShowModal(false)}>
      <div className="border border-[var(--rule)] bg-[var(--bg)] p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-mono text-xl uppercase tracking-[0.1em] text-[var(--accent)]">KEYBOARD SHORTCUTS</h2>
          <button onClick={() => setShowModal(false)} className="font-mono text-[10px] uppercase border border-[var(--rule)] px-2 py-1 hover:text-[var(--accent)] hover:border-[var(--accent)]">ESC</button>
        </div>
        
        <StaggerList className="space-y-4 font-mono text-sm text-[var(--fg)]">
          <StaggerItem className="grid grid-cols-[100px_1fr] gap-4 items-center">
            <div><kbd className="border border-[var(--rule)] px-2 py-1">G</kbd> <kbd className="border border-[var(--rule)] px-2 py-1">H</kbd></div>
            <div className="text-[var(--muted)]">Go Home</div>
          </StaggerItem>
          <StaggerItem className="grid grid-cols-[100px_1fr] gap-4 items-center">
            <div><kbd className="border border-[var(--rule)] px-2 py-1">G</kbd> <kbd className="border border-[var(--rule)] px-2 py-1">P</kbd></div>
            <div className="text-[var(--muted)]">Projects</div>
          </StaggerItem>
          <StaggerItem className="grid grid-cols-[100px_1fr] gap-4 items-center">
            <div><kbd className="border border-[var(--rule)] px-2 py-1">G</kbd> <kbd className="border border-[var(--rule)] px-2 py-1">A</kbd></div>
            <div className="text-[var(--muted)]">About</div>
          </StaggerItem>
          <StaggerItem className="grid grid-cols-[100px_1fr] gap-4 items-center">
            <div><kbd className="border border-[var(--rule)] px-2 py-1">G</kbd> <kbd className="border border-[var(--rule)] px-2 py-1">C</kbd></div>
            <div className="text-[var(--muted)]">Contact</div>
          </StaggerItem>
          <StaggerItem className="grid grid-cols-[100px_1fr] gap-4 items-center">
            <div><kbd className="border border-[var(--rule)] px-2 py-1">G</kbd> <kbd className="border border-[var(--rule)] px-2 py-1">J</kbd></div>
            <div className="text-[var(--muted)]">Journey</div>
          </StaggerItem>
          <StaggerItem className="grid grid-cols-[100px_1fr] gap-4 items-center">
            <div><kbd className="border border-[var(--rule)] px-2 py-1">G</kbd> <kbd className="border border-[var(--rule)] px-2 py-1">M</kbd></div>
            <div className="text-[var(--muted)]">Music</div>
          </StaggerItem>
          <StaggerItem className="grid grid-cols-[100px_1fr] gap-4 items-center">
            <div><kbd className="border border-[var(--rule)] px-2 py-1">T</kbd></div>
            <div className="text-[var(--muted)]">Toggle Theme</div>
          </StaggerItem>
          <StaggerItem className="grid grid-cols-[100px_1fr] gap-4 items-center">
            <div><kbd className="border border-[var(--rule)] px-2 py-1">?</kbd></div>
            <div className="text-[var(--muted)]">This menu</div>
          </StaggerItem>
        </StaggerList>

        <div className="mt-8 pt-6 border-t border-[var(--rule)] text-center">
          <p className="font-sans italic text-[13px] text-[var(--muted)]">for power users</p>
        </div>
      </div>
    </div>
  );
}
