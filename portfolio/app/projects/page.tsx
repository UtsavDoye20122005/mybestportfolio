"use client";

import Link from "next/link";
import { projects } from "../../data/projects";

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <article className="border border-[var(--rule)] bg-[#080808] p-6 transition hover:border-[var(--accent)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
            {project.issueNumber}
          </p>
          <h2 className="mt-3 font-sans text-2xl tracking-[-0.02em] text-[var(--fg)]">
            <Link href={`/projects/${project.slug}`} className="underline decoration-transparent underline-offset-4 hover:decoration-[var(--accent)] transition-colors">
              {project.title}
            </Link>
          </h2>
        </div>
        <div className="text-right">
          {project.liveUrl ? (
            <Link href={project.liveUrl} target="_blank" rel="noreferrer" className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--accent)] hover:text-[var(--fg)]">
              LIVE
            </Link>
          ) : (
            <span className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Coming soon</span>
          )}
        </div>
      </div>

      <p className="mt-4 font-mono text-sm leading-7 text-[var(--muted)]">
        {project.oneLiner}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span key={tech} className="inline-flex items-center rounded-full border border-[var(--rule)] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[var(--fg)]">
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center border border-[var(--rule)] px-4 py-2 font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)] hover:text-[var(--accent)] transition-colors">
          GitHub
        </Link>
        <Link href={`/projects/${project.slug}`} className="inline-flex items-center justify-center border border-[var(--rule)] px-4 py-2 font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)] hover:text-[var(--accent)] transition-colors">
          Read more
        </Link>
      </div>
    </article>
  );
}

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
              A small archive of builds, experiments, and shipped systems.
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

      <div className="border-x border-[var(--rule)] px-4 pb-10 md:px-10">
        <div className="grid gap-6 py-10 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

