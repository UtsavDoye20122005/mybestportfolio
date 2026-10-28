"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  KIND_ICONS,
  KIND_LABELS,
  journey,
  type Milestone,
  type MilestoneKind,
  type Phase,
} from "../../data/journey";
import { projects } from "../../data/projects";

type Filter = "all" | MilestoneKind;
const FILTERS: Filter[] = ["all", "build", "learn", "lead", "win"];
const projectSlugs = new Set(projects.map((p) => p.slug));

type Row =
  | { type: "phase"; key: string; phase: Phase }
  | { type: "stop"; key: string; phase: Phase; m: Milestone; side: "left" | "right" };

type Pt = { x: number; y: number; key: string };

/** Smooth curve that passes through every point (Catmull-Rom → cubic Bézier). */
function curveThrough(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function StatusTag({ status }: { status: Phase["status"] }) {
  if (status === "now")
    return (
      <span className="inline-flex items-center gap-2 border border-[var(--accent)] px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--accent)]">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
        In progress
      </span>
    );
  return (
    <span
      className={`inline-flex border px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)] ${
        status === "next" ? "border-dashed border-[var(--rule)]" : "border-[var(--rule)]"
      }`}
    >
      {status === "next" ? "Planned" : "Done"}
    </span>
  );
}

export function JourneyRoad() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const samples = useRef<{ len: number; y: number }[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [pts, setPts] = useState<Pt[]>([]);
  const [arrows, setArrows] = useState<{ x: number; y: number; a: number }[]>([]);
  const [reachedY, setReachedY] = useState(-1);

  const counts = useMemo(() => {
    const all = journey.flatMap((p) => p.milestones);
    const c: Record<Filter, number> = { all: all.length, build: 0, learn: 0, lead: 0, win: 0 };
    all.forEach((m) => (c[m.kind] += 1));
    return c;
  }, []);

  const rows = useMemo<Row[]>(() => {
    const out: Row[] = [];
    let n = 0;
    for (const phase of journey) {
      const ms = filter === "all" ? phase.milestones : phase.milestones.filter((m) => m.kind === filter);
      if (!ms.length) continue;
      out.push({ type: "phase", key: `p-${phase.id}`, phase });
      for (const m of ms) {
        out.push({ type: "stop", key: `m-${phase.id}-${m.title}`, phase, m, side: n % 2 === 0 ? "left" : "right" });
        n++;
      }
    }
    return out;
  }, [filter]);

  const nextStop = useMemo(
    () => journey.find((p) => p.status === "next")?.milestones.find((m) => m.highlight),
    []
  );

  // Measure where every stop actually is, then draw the road through them.
  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const box = wrap.getBoundingClientRect();
    const found: Pt[] = [];
    wrap.querySelectorAll<HTMLElement>("[data-stop]").forEach((el) => {
      const r = el.getBoundingClientRect();
      found.push({ x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2, key: el.dataset.stop! });
    });
    setSize({ w: box.width, h: box.height });
    setPts(found);
  }, []);

  useLayoutEffect(() => {
    measure();
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [measure, rows]);

  const roadPoints = useMemo(() => {
    if (pts.length < 2) return pts;
    const first = pts[0];
    const last = pts[pts.length - 1];
    const mid = size.w / 2;
    const isMobile = size.w < 768;
    return [
      { x: isMobile ? first.x : mid, y: Math.max(0, first.y - 70) },
      ...pts,
      { x: isMobile ? last.x : mid + (last.x < mid ? 1 : -1) * 40, y: last.y + 80 },
    ];
  }, [pts, size.w]);

  const d = useMemo(() => curveThrough(roadPoints), [roadPoints]);

  // Sample the road once so scroll → "how far along" is cheap, and place arrows.
  useEffect(() => {
    const road = roadRef.current;
    if (!road || !d) return;
    const total = road.getTotalLength();
    const s: { len: number; y: number }[] = [];
    for (let l = 0; l <= total; l += 6) s.push({ len: l, y: road.getPointAtLength(l).y });
    s.push({ len: total, y: road.getPointAtLength(total).y });
    samples.current = s;

    const a: { x: number; y: number; a: number }[] = [];
    const step = 260;
    for (let l = step / 2; l < total - 40; l += step) {
      const p = road.getPointAtLength(l);
      const q = road.getPointAtLength(Math.min(total, l + 2));
      a.push({ x: p.x, y: p.y, a: (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI });
    }
    // Measured from the DOM, so set on the next frame.
    const raf = requestAnimationFrame(() => setArrows(a));

    const prog = progressRef.current;
    if (prog) {
      prog.style.strokeDasharray = `${total}`;
      prog.style.strokeDashoffset = `${total}`;
    }
    return () => cancelAnimationFrame(raf);
  }, [d]);

  // Draw the yellow line as you scroll and light up the stops you've passed.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const wrap = wrapRef.current;
      const prog = progressRef.current;
      const s = samples.current;
      if (!wrap || !prog || s.length < 2) return;
      const lineY = window.innerHeight * 0.6 - wrap.getBoundingClientRect().top;
      let len = 0;
      for (const p of s) {
        if (p.y <= lineY) len = Math.max(len, p.len);
      }
      const total = s[s.length - 1].len;
      prog.style.strokeDashoffset = `${Math.max(0, total - len)}`;
      setReachedY(lineY);
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
  }, [d]);

  const reached = (key: string) => {
    const p = pts.find((x) => x.key === key);
    return p ? p.y <= reachedY : false;
  };

  return (
    <div className="py-10">
      {/* At a glance */}
      <div className="grid grid-cols-2 border-l border-t border-[var(--rule)] md:grid-cols-4">
        {[
          { k: "Started", v: journey[0].years, s: "first line of code" },
          { k: "Built", v: String(projects.length), s: "projects so far" },
          { k: "Milestones", v: String(counts.all), s: "on this road" },
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

      {/* The road */}
      <div ref={wrapRef} className="journey-road relative mt-10 pb-24 pt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(var(--rule) 1px, transparent 1px), linear-gradient(90deg, var(--rule) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
          }}
        />

        {size.w > 0 && d && (
          <svg
            aria-hidden
            className="pointer-events-none absolute left-0 top-0"
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
          >
            <path
              ref={roadRef}
              d={d}
              fill="none"
              strokeWidth={2.5}
              strokeDasharray="10 9"
              strokeLinecap="round"
              style={{ stroke: "var(--muted)", strokeOpacity: 0.45 }}
            />
            <path
              ref={progressRef}
              d={d}
              fill="none"
              strokeWidth={3}
              strokeLinecap="round"
              style={{ stroke: "var(--accent)", filter: "drop-shadow(0 0 6px color-mix(in srgb, var(--accent) 55%, transparent))" }}
            />
            {arrows.map((a, i) => (
              <path
                key={i}
                d="M -6 -6 L 7 0 L -6 6 Z"
                style={{ fill: "var(--muted)", fillOpacity: 0.6 }}
                transform={`translate(${a.x} ${a.y}) rotate(${a.a})`}
              />
            ))}
          </svg>
        )}

        <ol className="relative">
          {rows.map((row) => {
            if (row.type === "phase") {
              const { phase } = row;
              const on = reached(row.key);
              return (
                <li
                  key={row.key}
                  id={`phase-${phase.id}`}
                  className="grid grid-cols-[72px_1fr] items-center gap-y-2 py-10 md:grid-cols-[1fr_300px_1fr] md:gap-x-6"
                >
                  <div className="col-start-2 row-start-1 md:col-start-1 md:text-right">
                    <div className="flex flex-wrap items-center gap-3 md:justify-end">
                      <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">{phase.years}</span>
                      <StatusTag status={phase.status} />
                    </div>
                    <h2 className="mt-2 font-sans text-3xl tracking-[-0.02em] text-[var(--fg)] md:text-4xl">{phase.label}</h2>
                  </div>
                  <div className="col-start-1 row-start-1 row-span-2 flex justify-center md:col-start-2 md:row-span-1">
                    <span
                      data-stop={row.key}
                      className={`relative z-10 flex h-7 w-7 rotate-45 items-center justify-center border-2 bg-[var(--bg)] transition-colors duration-500 ${
                        phase.status === "next"
                          ? "border-dashed border-[var(--muted)]"
                          : on
                            ? "border-[var(--accent)] bg-[var(--accent)]"
                            : "border-[var(--accent)]"
                      }`}
                      aria-hidden
                    />
                  </div>
                  <p className="col-start-2 font-mono text-sm leading-7 text-[var(--muted)] md:col-start-3 md:row-start-1">
                    {phase.summary}
                  </p>
                </li>
              );
            }

            const { m, phase, side } = row;
            const on = reached(row.key);
            const future = phase.status === "next";
            const now = phase.status === "now";
            const hasProject = m.project && projectSlugs.has(m.project);
            const icon = m.icon ?? KIND_ICONS[m.kind];

            const card = (
              <article
                className={`w-full max-w-[400px] border bg-[var(--bg)] p-4 transition-all duration-500 sm:p-5 ${
                  m.highlight
                    ? "border-[var(--accent)]"
                    : future
                      ? "border-dashed border-[var(--rule)]"
                      : "border-[var(--rule)] hover:border-[var(--muted)]"
                } ${on || future ? "opacity-100" : "opacity-60"}`}
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg)]">{m.date}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--accent)]">{KIND_LABELS[m.kind]}</span>
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
            );

            return (
              <li key={row.key} className="grid grid-cols-[72px_1fr] items-center py-4 md:grid-cols-[1fr_300px_1fr] md:gap-x-6">
                {/* Desktop: card sits on its side of the road */}
                <div className={`hidden md:flex ${side === "left" ? "justify-end" : "invisible"}`}>{side === "left" && card}</div>

                <div className={`flex ${side === "left" ? "justify-start pl-1 md:pl-2" : "justify-end pr-1 md:pr-2"}`}>
                  <span
                    data-stop={row.key}
                    className={`relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full text-[22px] transition-all duration-500 ${
                      future
                        ? "border-2 border-dashed border-[var(--muted)] bg-[var(--bg)] opacity-80"
                        : on
                          ? m.highlight
                            ? "scale-110 border-2 border-[var(--accent)] bg-[var(--accent)] shadow-[0_0_24px_color-mix(in_srgb,var(--accent)_60%,transparent)]"
                            : now
                            ? "scale-110 border-2 border-[var(--accent)] bg-[var(--bg)] shadow-[0_0_24px_color-mix(in_srgb,var(--accent)_60%,transparent)]"
                            : "border-2 border-[var(--accent)] bg-[var(--bg)] shadow-[0_0_16px_color-mix(in_srgb,var(--accent)_35%,transparent)]"
                          : "border-2 border-[var(--rule)] bg-[var(--bg)]"
                    }`}
                    aria-hidden
                  >
                    {now && on && (
                      <span className="absolute inset-0 animate-ping rounded-full border-2 border-[var(--accent)] opacity-50" />
                    )}
                    {icon}
                  </span>
                </div>

                <div className={`md:flex ${side === "right" ? "" : "md:invisible"}`}>
                  {/* Mobile always shows the card here; desktop only for right-side stops */}
                  <div className={side === "right" ? "" : "md:hidden"}>{card}</div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Finish line label */}
        <p className="absolute bottom-4 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
          The road keeps going
        </p>
      </div>

      {/* Call to action */}
      <div className="mt-6 flex flex-col gap-4 border border-[var(--rule)] p-6 sm:flex-row sm:items-center sm:justify-between">
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
