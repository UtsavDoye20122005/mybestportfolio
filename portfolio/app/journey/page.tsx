import type { Metadata } from "next";
import { JourneyRoad } from "../components/JourneyRoad";

export const metadata: Metadata = {
  title: "Journey · Utsav Doye",
  description: "From browser games in 2020 to software people use every day — and what comes next.",
};

export default function JourneyPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
      <header className="border-x border-[var(--rule)] px-4 pt-10 pb-8 md:px-10" data-reveal-stagger>
        <div data-reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">Journey</p>
          <h1 className="mt-4 font-sans text-4xl tracking-[-0.02em] sm:text-5xl md:text-6xl">How I got here.</h1>
          <p className="mt-5 max-w-2xl font-mono text-sm leading-7 text-[var(--muted)]">
            From tiny browser games to software people use every day — and where I&apos;m heading next.
          </p>
        </div>
        <div className="mt-8 border-t border-[var(--rule)] pt-6" />
      </header>

      <div className="border-x border-[var(--rule)] px-4 pb-10 md:px-10">
        <JourneyRoad />
      </div>
    </section>
  );
}
