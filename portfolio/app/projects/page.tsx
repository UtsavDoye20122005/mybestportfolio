"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { projects, type Project } from "../../data/projects";
import { PrivateBadge, ProjectLinks } from "../components/ProjectLinks";

const FILTERS = ["All", "Product", "Campus tool", "Experiment", "Early build"] as const;
type Filter = (typeof FILTERS)[number];

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex h-full flex-col border border-[var(--rule)] bg-[var(--card-bg)] p-6 transition-colors duration-300 hover:border-[var(--accent)]">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
          {project.issueNumber} · {project.category}
        </p>
        {project.isPrivate && <PrivateBadge />}
      </div>

      <h2 className="mt-3 font-sans text-2xl tracking-[-0.02em] text-[var(--fg)]">
        <Link
          href={`/projects/${project.slug}`}
          className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-[var(--accent)]"
        >
          {project.title}
        </Link>
      </h2>

      <p className="mt-4 font-mono text-sm leading-7 text-[var(--muted)]">{project.oneLiner}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center rounded-full border border-[var(--rule)] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[var(--fg)]"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <ProjectLinks project={project} />
        <Link
          href={`/projects/${project.slug}`}
          className="mt-4 inline-flex font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
        >
          Read case study <span className="ml-2 text-[var(--accent)]">→</span>
        </Link>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
      <header className="relative border-x border-[var(--rule)] px-4 pt-10 pb-8 md:px-10" data-reveal-stagger>
        <div className="flex items-start justify-between gap-6">
          <div data-reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">Selected work</p>
            <h1 className="mt-4 font-sans text-4xl tracking-[-0.02em] sm:text-5xl md:text-6xl">Projects</h1>
            <p className="mt-4 max-w-2xl font-mono text-sm leading-7 text-[var(--muted)]">
              Products, campus tools and experiments. Private projects say so instead of showing links.
            </p>
          </div>

          <div className="shrink-0 text-right" data-reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--muted)]">
              {String(projects.length).padStart(2, "0")} PROJECTS
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-t border-[var(--rule)] pt-6" aria-label="Filter projects">
          {FILTERS.map((f) => {
            const count = f === "All" ? projects.length : projects.filter((p) => p.category === f).length;
            const active = f === filter;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f)}
                className={`border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.24em] transition-colors ${
                  active
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-[var(--rule)] text-[var(--muted)] hover:text-[var(--fg)]"
                }`}
              >
                {f} <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      </header>

      <div className="border-x border-[var(--rule)] px-4 pb-10 md:px-10">
        <div className="grid gap-6 py-10 md:grid-cols-2">
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
