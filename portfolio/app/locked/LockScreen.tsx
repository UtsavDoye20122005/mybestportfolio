"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Full-screen lock. The blurred page behind it is a made-up skeleton,
 * not the real site, so nothing private is sent to the browser.
 */
function FakeSite() {
  const bar = "rounded-sm bg-[var(--fg)]";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-8 opacity-90" style={{ filter: "blur(9px)" }}>
        <div className="flex items-center justify-between">
          <div className="h-9 w-9 border border-[var(--fg)]" />
          <div className="flex gap-8">
            {[48, 70, 56, 64, 48, 60].map((w, i) => (
              <div key={i} className={`h-2 ${bar} opacity-60`} style={{ width: w }} />
            ))}
          </div>
        </div>
        <div className="mt-28 space-y-5">
          <div className="h-3 w-40 rounded-sm bg-[var(--accent)]" />
          <div className={`h-16 w-[70%] ${bar}`} />
          <div className={`h-16 w-[55%] ${bar}`} />
          <div className={`mt-6 h-3 w-[45%] ${bar} opacity-50`} />
          <div className={`h-3 w-[38%] ${bar} opacity-50`} />
        </div>
        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-56 border border-[var(--fg)]/40 p-6">
              <div className={`h-2 w-24 ${bar} opacity-50`} />
              <div className={`mt-4 h-6 w-48 ${bar}`} />
              <div className={`mt-6 h-2 w-full ${bar} opacity-40`} />
              <div className={`mt-3 h-2 w-4/5 ${bar} opacity-40`} />
              <div className="mt-8 flex gap-3">
                <div className="h-8 w-24 border border-[var(--accent)]" />
                <div className="h-8 w-20 border border-[var(--fg)]/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-[var(--bg)]/30" />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 35%, var(--bg) 100%)" }}
      />
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="28" height="32" viewBox="0 0 28 32" fill="none" aria-hidden>
      <rect x="1.5" y="13.5" width="25" height="17" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 13.5V9a7 7 0 0114 0v4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="21" r="2" fill="currentColor" />
      <path d="M14 23v3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function LockScreen() {
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "wrong" | "open">("idle");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (!password || state === "checking") return;
    setState("checking");
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error("wrong");
      setState("open");
      // Reload the page they asked for, now with the unlock cookie.
      window.setTimeout(() => window.location.reload(), 450);
    } catch {
      setState("wrong");
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
      setPassword("");
      inputRef.current?.focus();
    }
  }

  const open = state === "open";

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-[var(--bg)] px-4" style={{ cursor: "auto" }}>
      <FakeSite />

      <div
        className={`relative w-full max-w-[420px] border border-[var(--rule)] bg-[var(--bg)]/80 p-8 shadow-2xl backdrop-blur-md transition-all duration-500 ${
          open ? "scale-95 opacity-0" : "opacity-100"
        } ${shake ? "lock-shake" : ""}`}
      >
        <div className={`transition-colors ${open ? "text-[var(--accent)]" : "text-[var(--fg)]"}`}>
          <LockIcon />
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">Utsav Doye</p>
        <h1 className="mt-3 font-sans text-3xl tracking-[-0.02em] text-[var(--fg)]">This portfolio is private for now.</h1>
        <p className="mt-3 font-mono text-sm leading-7 text-[var(--muted)]">
          It&apos;s being updated. If you have the password, enter it below.
        </p>

        <form onSubmit={unlock} className="mt-6">
          <label htmlFor="site-password" className="sr-only">
            Password
          </label>
          <div className="flex border border-[var(--rule)] focus-within:border-[var(--accent)] transition-colors">
            <input
              ref={inputRef}
              id="site-password"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (state === "wrong") setState("idle");
              }}
              placeholder="Password"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 font-mono text-sm text-[var(--fg)] placeholder:text-[var(--muted)] outline-none"
              style={{ cursor: "text" }}
            />
            <button
              type="submit"
              disabled={!password || state === "checking"}
              className="border-l border-[var(--rule)] px-5 font-mono text-xs uppercase tracking-[0.24em] text-[var(--fg)] transition-colors hover:text-[var(--accent)] disabled:opacity-40"
              style={{ cursor: "pointer" }}
            >
              {state === "checking" ? "…" : "Unlock"}
            </button>
          </div>
          <p className="mt-3 h-5 font-mono text-xs text-[#ff6b6b]" role="alert">
            {state === "wrong" ? "Wrong password. Try again." : ""}
          </p>
        </form>

        <div className="mt-4 border-t border-[var(--rule)] pt-5 font-mono text-xs leading-6 text-[var(--muted)]">
          Want to talk?{" "}
          <a
            href="mailto:utsavdoye07@gmail.com"
            className="text-[var(--fg)] underline decoration-[var(--rule)] underline-offset-4 hover:decoration-[var(--accent)]"
            style={{ cursor: "pointer" }}
          >
            utsavdoye07@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
