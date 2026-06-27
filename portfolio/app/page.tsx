"use client";

import Link from "next/link";
import { AvailabilityBadge } from "./components/AvailabilityBadge";
import { InteractiveGame } from "./components/InteractiveGame";
import { ByTheNumbers } from "./components/ByTheNumbers";
import { VisitorCounter } from "./components/VisitorCounter";
import { changelog } from "../data/changelog";
import { HeroHeading } from "./components/HeroHeading";
import { HeroTypewriter } from "./components/HeroTypewriter";
import { StaggerList, StaggerItem } from "./components/StaggerList";
import { TerminalSection } from "./components/TerminalSection";

function formatDateline(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function Home() {
  const dateline = formatDateline(new Date());

  return (
    <>
      <section className="mx-auto flex min-h-[calc(100svh-160px)] max-w-6xl items-stretch px-4 md:px-6">
        <div className="relative flex w-full flex-col justify-center border-x border-[var(--rule)] px-4 py-12 md:px-10">
          <div className="max-w-4xl" data-reveal-stagger>
            <div data-reveal>
              <AvailabilityBadge available={true} />
            </div>
            <p
              data-reveal
              className="mt-3 font-mono text-sm uppercase tracking-[0.18em] text-[var(--muted)] sm:text-[15px] sm:tracking-[0.22em]"
            >
              DEVELOPER · PHYSICS · FINANCE · STRATEGY
            </p>

            <HeroHeading />

            <HeroTypewriter />

            <div data-reveal className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/projects"
                className="trace-btn inline-flex items-center justify-between gap-4 border border-[var(--rule)] bg-transparent px-5 py-3 font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)]"
              >
                <span>See my work</span>
                <span className="text-[var(--accent)]">→</span>
                <svg
                  className="trace-btn__svg"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <rect x="1" y="1" width="98" height="98" rx="0" ry="0" pathLength="1" />
                </svg>
              </Link>

              <Link
                href="/about"
                className="trace-btn inline-flex items-center justify-between gap-4 border border-[var(--rule)] bg-transparent px-5 py-3 font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)]"
              >
                <span>About me</span>
                <span className="text-[var(--accent)]">→</span>
                <svg
                  className="trace-btn__svg"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <rect x="1" y="1" width="98" height="98" rx="0" ry="0" pathLength="1" />
                </svg>
              </Link>
            </div>
          </div>

          <div
            className="pointer-events-none absolute bottom-6 left-6 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]"
            data-reveal
          >
            {dateline}
          </div>
        </div>
      </section>

      <TerminalSection />
      <InteractiveGame />
      
      <ByTheNumbers />

      <section className="mx-auto max-w-6xl px-4 pb-10 md:px-6">
        <div className="border-x border-[var(--rule)] px-4 md:px-10" data-reveal>
          <div className="ticker" aria-label="Interests ticker">
            <div className="ticker__track" aria-hidden="true">
              <span className="ticker__chunk">
                FULL STACK DEVELOPER <span className="ticker__dot">·</span> PHYSICS{" "}
                <span className="ticker__dot">·</span> FINANCE{" "}
                <span className="ticker__dot">·</span> AI AUTOMATION{" "}
                <span className="ticker__dot">·</span> MARKETS{" "}
                <span className="ticker__dot">·</span> SYSTEMS THINKER{" "}
                <span className="ticker__dot">·</span>{" "}
              </span>
              <span className="ticker__chunk">
                FULL STACK DEVELOPER <span className="ticker__dot">·</span> PHYSICS{" "}
                <span className="ticker__dot">·</span> FINANCE{" "}
                <span className="ticker__dot">·</span> AI AUTOMATION{" "}
                <span className="ticker__dot">·</span> MARKETS{" "}
                <span className="ticker__dot">·</span> SYSTEMS THINKER{" "}
                <span className="ticker__dot">·</span>{" "}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
        <div className="border-x border-[var(--rule)] px-4 pb-10 md:px-10" data-reveal>
          <div className="mt-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
              CHANGELOG
            </p>
            <div className="mt-4 border-t border-[var(--rule)] pt-6" />
            <StaggerList className="changelog">
              {changelog.slice(0, 3).map((e) => (
                <StaggerItem key={e.version} className="changelog__row">
                  <span className="changelog__ver">{e.version}</span>
                  <span className="changelog__date">{e.date}</span>
                  <span className="changelog__arrow">→</span>
                  <span className="changelog__desc">{e.description}</span>
                </StaggerItem>
              ))}
            </StaggerList>

            <Link
              href="/changelog"
              className="mt-6 inline-flex font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)]"
            >
              VIEW FULL CHANGELOG <span className="text-[var(--accent)]">→</span>
            </Link>
          </div>
        </div>
      </section>
      
      <VisitorCounter />
    </>
  );
}
