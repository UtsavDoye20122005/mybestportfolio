"use client";

import Link from "next/link";
import { projects } from "../../data/projects";
import { ProjectDeck } from "../components/ProjectDeck";

export default function ProjectsPage() {
  const year = new Date().getFullYear();

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
      <header className="relative border-x border-[var(--rule)] px-4 pt-10 pb-8 md:px-10" data-reveal-stagger>
        <div className="flex items-start justify-between gap-6">
          <div data-reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
              Selected work
            </p>
            <h1 className="mt-4 font-sans text-4xl tracking-[-0.02em] sm:text-5xl md:text-6xl">
              Projects
            </h1>
            <p className="mt-4 max-w-2xl font-mono text-sm leading-7 text-[var(--muted)]">
              [SHORT_PROJECTS_INTRO] — a small archive of builds, experiments, and
              shipped systems.
            </p>
          </div>

          <div className="shrink-0 text-right" data-reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--muted)]">
              ISSUE NO. {year}
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--rule)] pt-6" />
      </header>

      <div className="border-x border-[var(--rule)] px-4 pb-10 md:px-10 overflow-hidden min-h-[500px]">
        <ProjectDeck />
      </div>
    </section>
  );
}

