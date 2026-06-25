import Link from "next/link";
import { getProjectBySlug, projects } from "../../../data/projects";
import { ProjectClientWrapper } from "./ProjectClientWrapper";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default function ProjectCaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return (
      <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
        <div className="border-x border-[var(--rule)] px-4 pt-10 pb-10 md:px-10" data-reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
            Not found
          </p>
          <h1 className="mt-4 font-sans text-4xl tracking-[-0.02em] sm:text-5xl md:text-6xl">
            Project not found.
          </h1>
          <div className="mt-8 border-t border-[var(--rule)] pt-6" />
          <Link
            href="/projects"
            className="mt-6 inline-flex font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)]"
          >
            <span className="text-[var(--accent)]">←</span>&nbsp;Back to projects
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
      <header className="border-x border-[var(--rule)] px-4 pt-10 pb-8 md:px-10" data-reveal-stagger>
        <div className="flex items-start justify-between gap-6">
          <div data-reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
              Case study
            </p>
            <h1 className="mt-4 font-sans text-5xl tracking-[-0.02em] sm:text-6xl md:text-7xl">
              <span className="font-sans">{project.title}</span>
            </h1>
          </div>

          <div className="shrink-0 text-right" data-reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--muted)]">
              {project.issueNumber}
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--rule)] pt-6" />
      </header>

      <ProjectClientWrapper>
        <div className="grid grid-cols-1 gap-0 divide-y divide-[var(--rule)] border border-[var(--rule)] md:grid-cols-2 md:divide-x md:divide-y-0">
          <div className="p-5 md:p-6">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              PROBLEM
            </p>
          </div>
          <div className="p-5 md:p-6">
            <p className="font-mono text-sm leading-7 text-[var(--fg)]/85">{project.problem}</p>
          </div>

          <div className="p-5 md:p-6 border-t border-[var(--rule)] md:border-t-0">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              SOLUTION
            </p>
          </div>
          <div className="p-5 md:p-6 border-t border-[var(--rule)] md:border-t-0">
            <p className="font-mono text-sm leading-7 text-[var(--fg)]/85">{project.solution}</p>
          </div>

          <div className="p-5 md:p-6 border-t border-[var(--rule)] md:border-t-0">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              RESULT
            </p>
          </div>
          <div className="p-5 md:p-6 border-t border-[var(--rule)] md:border-t-0">
            <p className="font-mono text-sm leading-7 text-[var(--fg)]/85">{project.result}</p>
          </div>

          <div className="p-5 md:p-6 border-t border-[var(--rule)] md:border-t-0">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              STACK
            </p>
          </div>
          <div className="p-5 md:p-6 border-t border-[var(--rule)] md:border-t-0">
            <div className="flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center border border-[var(--rule)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--fg)]/85"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-[var(--rule)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/projects"
            className="inline-flex font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)]"
          >
            <span className="text-[var(--accent)]">←</span>&nbsp;BACK TO PROJECTS
          </Link>

          <div className="flex items-center gap-6">
            <a
              href={project.githubUrl}
              className="inline-flex font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)]/85 hover:text-[var(--fg)]"
              target="_blank"
              rel="noreferrer"
            >
              GITHUB ↑
            </a>
            <a
              href={project.liveUrl}
              className="inline-flex font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)]"
              target="_blank"
              rel="noreferrer"
            >
              VIEW LIVE <span className="text-[var(--accent)]">↑</span>
            </a>
          </div>
        </div>
      </ProjectClientWrapper>
    </section>
  );
}

