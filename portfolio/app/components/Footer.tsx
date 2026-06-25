"use client";

import Link from "next/link";
import { NowPlaying } from "./NowPlaying";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--rule)]">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <NowPlaying />
            <Link
              href="/changelog"
              className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)] hover:text-[var(--fg)]"
            >
              Changelog
            </Link>
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }))}
              className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)] hover:text-[var(--accent)]"
            >
              [?] shortcuts
            </button>
          </div>
          <p className="text-center font-mono text-[11px] tracking-[0.1em] text-[var(--muted)] sm:text-right">
            Built by UTSAV DOYE · {year}.
          </p>
        </div>
      </div>
    </footer>
  );
}

