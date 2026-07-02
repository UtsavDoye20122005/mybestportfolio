"use client";

import Image from "next/image";
import { StaggerList, StaggerItem } from "../components/StaggerList";
import dynamic from "next/dynamic";
import { GITHUB_USERNAME } from "../../data/profile";

const GithubHeatmap = dynamic(
  () => import("../components/GithubHeatmap").then((m) => m.GithubHeatmap),
  { ssr: false }
);

const TechRadar = dynamic(
  () => import("../components/TechRadar").then((m) => m.TechRadar),
  { ssr: false }
);

const stackRows = [
  {
    label: "Programming Languages",
    value: "Python, HTML, CSS, JavaScript, TypeScript",
  },
  {
    label: "Frontend",
    value: "Next.js, React.js, Tailwind CSS",
  },
  {
    label: "Tools & DevOps",
    value: "Docker, Git",
  },
  {
    label: "Core Competencies",
    value: "Algorithm Design, Data Processing, Web Development, Problem Solving",
  },
] as const;

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
      <header
        className="border-x border-[var(--rule)] px-4 pt-10 pb-8 md:px-10"
        data-reveal-stagger
      >
        <p
          data-reveal
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]"
        >
          About
        </p>
        <h1
          data-reveal
          className="mt-4 font-sans text-4xl tracking-[-0.02em] sm:text-5xl md:text-6xl"
        >
          A little context.
        </h1>
        <div className="mt-8 border-t border-[var(--rule)] pt-6" />
      </header>

      <div className="grid grid-cols-1 gap-8 border-x border-[var(--rule)] px-4 pb-10 md:grid-cols-2 md:px-10">
        <aside className="pt-8 md:pt-10 flex flex-col gap-8" data-reveal-stagger>
          <div data-reveal>
            <blockquote className="font-sans text-3xl italic leading-[1.05] tracking-[-0.02em] sm:text-4xl md:text-5xl">
              “I like building systems that read clearly — like a front page: bold
              intent, quiet craft.”
            </blockquote>
            <p className="mt-6 font-mono text-sm leading-7 text-[var(--muted)]">
              — A philosophy on software.
            </p>
          </div>

          <div
            data-reveal
            className="relative aspect-[3/4] w-full max-w-sm border border-[var(--rule)] p-2 bg-[var(--bg)]/50"
          >
            <Image
              src="/profile.jpg"
              alt="Utsav Doye"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </aside>

        <article className="pt-8 md:pt-10" data-reveal-stagger>
          <div className="space-y-4">
            <p data-reveal className="font-mono text-sm leading-7 text-[var(--muted)]">
              Hi, I'm <span className="text-[var(--fg)]">Utsav.</span> I'm a full-stack developer based in [your city], currently studying [your degree/field] while building real systems on the side. I care about software that reads clearly — backends that don't break, interfaces that don't make you think.
            </p>

            <p data-reveal className="font-mono text-sm leading-7 text-[var(--muted)]">
              Outside code I'm usually in the markets, building automation workflows, or deep in a playlist I refuse to skip. I started this portfolio in March 2025 to have somewhere to put everything I'm learning.
            </p>
          </div>

          <section aria-label="Tech stack" className="mt-10" data-reveal>
            <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)]">
              Stack
            </h2>
            <div className="mt-4 overflow-hidden border border-[var(--rule)]">
              <StaggerList className="divide-y divide-[var(--rule)] flex flex-col w-full">
                {stackRows.map((r) => (
                  <StaggerItem
                    key={r.label}
                    className="grid grid-cols-1 gap-2 px-4 py-4 sm:grid-cols-[160px_1fr] hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
                      {r.label}
                    </div>
                    <div className="font-mono text-sm leading-6 text-[var(--fg)]/90">
                      {r.value}
                    </div>
                  </StaggerItem>
                ))}
              </StaggerList>
            </div>
          </section>

          <GithubHeatmap username={GITHUB_USERNAME} />
          <TechRadar />

          <section aria-label="Currently" className="mt-10" data-reveal>
            <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)]">
              Currently
            </h2>
            <ul className="mt-4 space-y-3 border border-[var(--rule)] p-4">
              <li className="font-mono text-sm leading-7 text-[var(--muted)]">
                → Learning: <span className="text-[var(--fg)]">Advanced System Design, Web3 basics</span>
              </li>
              <li className="font-mono text-sm leading-7 text-[var(--muted)]">
                → Building: <span className="text-[var(--fg)]">[name your actual current project here]</span>
              </li>
              <li className="font-mono text-sm leading-7 text-[var(--muted)]">
                → Reading: <span className="text-[var(--fg)]">[actual book or doc you're reading right now]</span>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </section>
  );
}
