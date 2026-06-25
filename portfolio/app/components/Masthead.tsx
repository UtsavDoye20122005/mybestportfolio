export function Masthead() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-[72px] z-40 bg-[var(--bg)]/90"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="relative flex items-center gap-4 border-t border-[var(--rule)] py-3">
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]">
            EST.2025
          </span>
          <span className="h-px w-full bg-[var(--rule)]" />
        </div>
      </div>
    </div>
  );
}

