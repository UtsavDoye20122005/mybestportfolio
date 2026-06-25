"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState("night");

  useEffect(() => {
    const checkTheme = () => {
      const isPaper = document.documentElement.getAttribute("data-theme") === "paper";
      setTheme(isPaper ? "paper" : "night");
    };
    checkTheme();
    window.addEventListener("storage", checkTheme);
    return () => window.removeEventListener("storage", checkTheme);
  }, []);

  const toggle = () => {
    const next = theme === "night" ? "paper" : "night";
    setTheme(next);
    localStorage.setItem("theme", next);
    if (next === "paper") {
      document.documentElement.setAttribute("data-theme", "paper");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    // Storage event doesn't fire in the same window, so we must manually dispatch
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <button
      onClick={toggle}
      className="font-mono text-[11px] tracking-[0.2em] uppercase flex items-center gap-2 transition-colors ml-2 sm:ml-4"
    >
      <span className={theme === "night" ? "text-[var(--accent)]" : "text-[var(--muted)]"}>NIGHT</span>
      <span className="text-[var(--muted)]">/</span>
      <span className={theme === "paper" ? "text-[var(--accent)]" : "text-[var(--muted)]"}>PAPER</span>
    </button>
  );
}
