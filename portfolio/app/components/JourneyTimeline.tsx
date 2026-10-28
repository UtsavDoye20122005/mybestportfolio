"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { KIND_LABELS, journey, type MilestoneKind, type Phase } from "../../data/journey";
import { projects } from "../../data/projects";

type Filter = "all" | MilestoneKind;
const FILTERS: Filter[] = ["all", "build", "learn", "lead", "win"];
const projectSlugs = new Set(projects.map((p) => p.slug));

function StatusBadge({ status }: { status: Phase["status"] }) {
  if (status === "now") {
    return (
      <span className="inline-flex items-center gap-2 border border-[var(--accent)] px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--accent)]">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
        </span>
        In progress
      </span>
    );
  }
  return (
    <span
      className={`inline-flex border px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.24em] ${
        status === "next"
          ? "border-dashed border-[var(--rule)] text-[var(--muted)]"
          : "border-[var(--rule)] text-[var(--muted)]"
      }`}
    >
      {status === "next" ? "Planned" : "Done"}
    </span>
  );
}

function Dot({ status, highlight }: { status: Phase["status"]; highlight?: boolean }) {
  const base = "absolute left-0 top-[22px] -translate-x-1/2 rounded-full";
  if (status === "next") {
    return <span className={`${base} h-3 w-3 border border-dashed border-[var(--muted)] bg-[var(--bg)]`} />;
  }
  if (status === "now") {
    return (
      <span className={`${base} flex h-3 w-3 items-center justify-center`}>
        <span className="absolute h-3 w-3 animate-ping rounded-full bg-[var(--accent)] opacity-40" />
        <span className="h-3 w-3 rounded-full bg-[var(--accent)]" />
      </span>
    );
  }
  return (
    <span
      className={`${base} h-3 w-3 border border-[var(--accent)] ${highlight ? "bg-[var(--accent)]" : "bg-[var(--bg)]"}`}
    />
  );
}

export function JourneyTimeline() {
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");
  const [activePhase, setActivePhase] = useState(journey[0].id);
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const all = journey.flatMap((p) => p.milestones);
    const c: Record<Filter, number> = { all: all.length, build: 0, learn: 0, lead: 0, win: 0 };
    all.forEach((m) => (c[m.kind] += 1));
    return c;
  }, []);

  const phases = useMemo(
    () =>
      journey
        .map((p) => ({
          ...p,
          milestones: filter === "all" ? p.milestones : p.milestones.filter((m) => m.kind === filter),
        }))
        .filter((p) => p.milestones.length > 0),
    [filter]
  );

  const nextStop = useMemo(
    () => journey.find((p) => p.status === "next")?.milestones.find((m) => m.highlight),
    []
  );

  // Progress line that fills as you scroll. One listener, cleaned up properly.
  useEffect(() => {
    const rail = railRef.current;
    const fill = fillRef.current;
    if (!rail || !fill) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = rail.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const t = (vh * 0.55 - rect.top) / Math.max(rect.height, 1);
      fill.style.transform = `scaleY(${Math.max(0, Math.min(1, t))})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [phases]);

  // Highlight the phase you're reading in the side nav.
  useEffect(() => {
    const els = phases
      .map((p) => document.getElementById(`phase-${p.id}`))
      .filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActivePhase(visible[0].target.id.replace("phase-", ""));
      },
      { rootMargin: "-30% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [phases]);

  const jumpTo = (id: string) => {
    document.getElementById(`phase-${id}`)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  const firstYear = journey[0].years;

  return (
    <div className="py-10">
      {/* At a glance */}
      <div className="grid grid-cols-2 border-l border-t border-[var(--rule)] md:grid-cols-4">
        {[
          { k: "Started", v: firstYear, s: "first line of code" },
          { k: "Built", v: String(projects.length), s: "projects so far" },
          { k: "Milestones", v: String(counts.all), s: "on this page" },
          { k: "Next stop", v: nextStop?.date ?? "—", s: nextStop ? nextStop.title.split(",")[0] : "" },
        ].map((x) => (
          <div key={x.k} className="border-b border-r border-[var(--rule)] px-4 py-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]">{x.k}</p>
            <p className="mt-2 font-mono text-2xl text-[var(--accent)] sm:text-3xl">{x.v}</p>
            <p className="mt-1 font-mono text-[11px] text-[var(--muted)]">{x.s}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap gap-2" aria-label="Filter milestones">
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className={`border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.24em] transition-colors ${
                active ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--rule)] text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
            >
              {f === "all" ? "All" : KIND_LABELS[f]} <span className="opacity-60">{counts[f]}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-[170px_1fr]">
        {/* Phase nav */}
        <nav aria-label="Journey phases" className="hidden md:block">
          <ol className="sticky top-32 space-y-1 border-l border-[var(--rule)]">
            {phases.map((p) => {
              const active = p.id === activePhase;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => jumpTo(p.id)}
                    className={`-ml-px block w-full border-l py-2 pl-4 text-left transition-colors ${
                      active ? "border-[var(--accent)] text-[var(--fg)]" : "border-transparent text-[var(--muted)] hover:text-[var(--fg)]"
                    }`}
                  >
                    <span className="block font-mono text-[10px] uppercase tracking-[0.22em] opacity-70">{p.years}</span>
                    <span className="mt-1 block font-mono text-xs">{p.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Timeline */}
        <div ref={railRef} className="relative pl-8 sm:pl-10">
          <div className="absolute left-0 top-0 h-full w-px bg-[var(--rule)]" aria-hidden />
          <div
            ref={fillRef}
            className="absolute left-0 top-0 h-full w-px origin-top bg-[var(--accent)]"
            style={{ transform: "scaleY(0)" }}
            aria-hidden
          />

          {phases.map((phase) => (
            <section key={phase.id} id={`phase-${phase.id}`} className="scroll-mt-32 pb-12 last:pb-0">
              <header className="relative">
                <span
                  className={`absolute -left-8 top-1 -translate-x-1/2 sm:-left-10 h-5 w-5 border ${
                    phase.status === "next" ? "border-dashed border-[var(--muted)]" : "border-[var(--accent)]"
                  } bg-[var(--bg)]`}
                  aria-hidden
                />
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">{phase.years}</p>
                  <StatusBadge status={phase.status} />
                </div>
                <h2 className="mt-3 font-sans text-3xl tracking-[-0.02em] text-[var(--fg)] sm:text-4xl">{phase.label}</h2>
                <p className="mt-2 max-w-xl font-mono text-sm leading-7 text-[var(--muted)]">{phase.summary}</p>
              </header>

              <ol className="mt-6 space-y-3">
                {phase.milestones.map((m, i) => {
                  const hasProject = m.project && projectSlugs.has(m.project);
                  return (
                    <motion.li
                      key={`${phase.id}-${m.title}`}
                      className="relative -ml-8 pl-8 sm:-ml-10 sm:pl-10"
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.25) }}
                    >
                      <Dot status={phase.status} highlight={m.highlight} />
                      <article
                        className={`border p-4 transition-colors sm:p-5 ${
                          m.highlight
                            ? "border-[var(--accent)] bg-[var(--subtle-bg)]"
                            : phase.status === "next"
                              ? "border-dashed border-[var(--rule)]"
                              : "border-[var(--rule)] hover:border-[var(--muted)]"
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg)]">{m.date}</span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--accent)]">
                            {KIND_LABELS[m.kind]}
                          </span>
                        </div>
                        <h3 className="mt-2 font-sans text-xl tracking-[-0.01em] text-[var(--fg)]">{m.title}</h3>
                        <p className="mt-2 font-mono text-[13px] leading-6 text-[var(--muted)]">{m.detail}</p>
                        {hasProject && (
                          <Link
                            href={`/projects/${m.project}`}
                            className="mt-3 inline-flex font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
                          >
                            See the project <span className="ml-2 text-[var(--accent)]">→</span>
                          </Link>
                        )}
                      </article>
                    </motion.li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="mt-14 flex flex-col gap-4 border border-[var(--rule)] p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-sm leading-7 text-[var(--muted)]">
          Hiring interns for <span className="text-[var(--fg)]">July – December 2027</span>? I&apos;d like to hear about it.
        </p>
        <Link
          href="/contact"
          className="inline-flex shrink-0 items-center justify-center border border-[var(--accent)] px-5 py-3 font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)] transition-colors hover:bg-[var(--accent)] hover:text-black"
        >
          Get in touch <span className="ml-2">→</span>
        </Link>
      </div>
    </div>
  );
}
