import { PRIVATE_NOTE, type Project } from "../../data/projects";

const btn =
  "inline-flex items-center justify-center border border-[var(--rule)] px-4 py-2 font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors pointer-events-auto";

export function PrivateBadge() {
  return (
    <span className="inline-flex items-center gap-1 border border-[var(--rule)] px-2 py-[2px] font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]">
      <svg aria-hidden width="9" height="10" viewBox="0 0 9 10" fill="none">
        <rect x="0.5" y="4.5" width="8" height="5" stroke="currentColor" />
        <path d="M2 4.5V3a2.5 2.5 0 015 0v1.5" stroke="currentColor" />
      </svg>
      Private
    </span>
  );
}

export function ProjectLinks({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  if (project.isPrivate) {
    return (
      <p className={`font-mono text-xs leading-6 text-[var(--muted)] ${className}`}>
        {PRIVATE_NOTE}
      </p>
    );
  }

  const hasGithub = Boolean(project.githubUrl);
  const hasLive = Boolean(project.liveUrl);

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {(hasGithub || hasLive) && (
        <div className="flex flex-wrap gap-3">
          {hasGithub && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className={btn} draggable={false}>
              GitHub <span className="ml-2 text-[var(--accent)]">↗</span>
            </a>
          )}
          {hasLive && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className={btn} draggable={false}>
              Live <span className="ml-2 text-[var(--accent)]">↗</span>
            </a>
          )}
        </div>
      )}
      {project.note && (
        <p className="font-mono text-xs leading-6 text-[var(--muted)]">{project.note}</p>
      )}
    </div>
  );
}
