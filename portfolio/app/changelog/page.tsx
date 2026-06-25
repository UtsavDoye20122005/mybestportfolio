"use client";

import Link from "next/link";
import { changelog } from "../../data/changelog";
import { StaggerList, StaggerItem } from "../components/StaggerList";

export default function ChangelogPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
      <header className="border-x border-[var(--rule)] px-4 pt-10 pb-8 md:px-10" data-reveal-stagger>
        <div data-reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
            CHANGELOG
          </p>
          <h1 className="mt-4 font-sans text-4xl tracking-[-0.02em] sm:text-5xl md:text-6xl">
            Changelog
          </h1>
          <p className="mt-4 font-sans italic text-lg text-[var(--muted)]">
            Every update, every fix, every ship.
          </p>
        </div>
        <div className="mt-8 border-t border-[var(--rule)] pt-6" />
      </header>

      <div className="border-x border-[var(--rule)] px-4 pb-10 md:px-10" data-reveal>
        <div className="changelog">
          <div className="changelog__rule" aria-hidden="true">
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </div>
          <StaggerList className="w-full">
            {changelog.map((e) => (
              <StaggerItem key={e.version} className="changelog__row w-full">
                <span className="changelog__ver">{e.version}</span>
                <span className="changelog__date">{e.date}</span>
                <span className="changelog__arrow">→</span>
                <span className="changelog__desc">{e.description}</span>
              </StaggerItem>
            ))}
          </StaggerList>
          <div className="changelog__rule" aria-hidden="true">
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </div>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)]"
        >
          <span className="text-[var(--accent)]">←</span>&nbsp;Back home
        </Link>
      </div>
    </section>
  );
}

