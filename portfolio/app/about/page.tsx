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
  { label: "Languages", value: "Python, JavaScript, TypeScript, SQL, HTML/CSS" },
  { label: "Web", value: "React, Next.js, React Native, Node.js, FastAPI, Tailwind CSS, REST APIs" },
  { label: "AI & Data", value: "Claude, OpenAI and Gemini APIs, AI agents, face recognition, NumPy, pandas" },
  { label: "Databases", value: "PostgreSQL, Supabase, Firebase" },
  { label: "Tools", value: "Git, GitHub, Vercel, Figma, Claude Code" },
  { label: "Core CS", value: "Data structures and algorithms, OOP, DBMS" },
] as const;

const currently = [
  { label: "Building", value: "EstateDesk — new features as the sales team uses it every day" },
  { label: "Learning", value: "Machine learning in depth, and DSA every morning" },
  { label: "Next up", value: "Fine-tuning a small open model on one task and comparing it with GPT and Claude" },
  { label: "Leading", value: "The Outgoing Exchange team at AIESEC in Bengaluru" },
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
              Hi, I&apos;m <span className="text-[var(--fg)]">Utsav</span>, a second-year Computer Science (AI/ML)
              student in Bengaluru. I learn by building: I find a real problem, ship a working product and put it in
              front of the people who use it.
            </p>

            <p data-reveal className="font-mono text-sm leading-7 text-[var(--muted)]">
              Right now that means EstateDesk, a sales CRM a real estate firm uses every day, plus small tools for my
              college like exam seating and room booking. I&apos;m drawn to startups and to how good products grow into
              lasting businesses. Outside code, I follow the markets and lead a team at AIESEC.
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
                    className="grid grid-cols-1 gap-2 px-4 py-4 sm:grid-cols-[120px_1fr] hover:bg-[var(--subtle-bg)] transition-colors"
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
                      {r.label}
                    </div>
                    <div className="font-mono text-sm leading-6 text-[var(--fg)]">
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
              {currently.map((c) => (
                <li key={c.label} className="font-mono text-sm leading-7 text-[var(--muted)]">
                  → {c.label}: <span className="text-[var(--fg)]">{c.value}</span>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </div>
    </section>
  );
}
