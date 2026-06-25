"use client";

import { JourneyRoadmap } from "../components/JourneyRoadmap";

export default function JourneyPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
      <header className="border-x border-[var(--rule)] px-4 pt-10 pb-8 md:px-10" data-reveal-stagger>
        <div data-reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
            JOURNEY
          </p>
          <h1 className="mt-4 font-sans text-4xl tracking-[-0.02em] sm:text-5xl md:text-6xl">
            Roadmap
          </h1>
          <p className="mt-5 font-sans italic text-xl text-[var(--muted)]">
            The road isn&apos;t straight. That&apos;s what makes it worth it.
          </p>
        </div>
        <div className="mt-8 border-t border-[var(--rule)] pt-6" />
      </header>

      <div className="border-x border-[var(--rule)] px-4 pb-10 md:px-10" data-reveal>
        <JourneyRoadmap />
      </div>
    </section>
  );
}

