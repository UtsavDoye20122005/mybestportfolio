"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Link from "next/link";
import { projects } from "../../data/projects";

// The 3D tilt effect for the top card
function ProjectCard({ project, isTop, dragHandlers }: any) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isTop) return;
    const card = cardRef.current;
    if (!card) return;

    // Disable tilt on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 24;
    const rotateX = -(y - 0.5) * 16;

    card.style.transition = "transform 0.1s ease";
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.boxShadow = `${-rotateY}px ${rotateX}px 20px rgba(0,0,0,0.6), inset ${-rotateY * 0.5}px ${rotateX * 0.5}px 15px rgba(232,255,0,0.03)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = "transform 0.6s ease, box-shadow 0.6s ease";
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    card.style.boxShadow = "none";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex h-full w-full flex-col justify-between border border-[var(--rule)] bg-[#0a0a0a] p-6 shadow-2xl overflow-hidden ${isTop ? 'cursor-grab active:cursor-grabbing' : ''}`}
      style={{ transformStyle: "preserve-3d", willChange: "transform", backfaceVisibility: "hidden" }}
      {...(isTop ? dragHandlers : {})}
    >
      <header className="relative z-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
          {project.issueNumber}
        </p>
        <h2 className="mt-3 font-sans text-2xl tracking-[-0.02em] sm:text-3xl text-[var(--fg)]">
          <Link
            href={`/projects/${project.slug}`}
            className="underline decoration-transparent underline-offset-4 hover:decoration-[var(--accent)] transition-[text-decoration-color] duration-300 pointer-events-auto"
            draggable={false}
          >
            {project.title}
          </Link>
        </h2>
        <p className="mt-4 font-mono text-sm leading-7 text-[var(--muted)] line-clamp-2">
          {project.oneLiner}
        </p>
      </header>

      <footer className="mt-6 flex flex-col gap-4 relative z-10 pointer-events-auto">
        <div className="flex flex-wrap gap-1">
          {project.stack.map((t: string) => (
            <span
              key={t}
              className="inline-flex box-border items-center border border-[var(--rule)] px-[10px] py-[4px] font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--fg)]/85"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-between border border-[var(--rule)] px-4 py-2 font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)] hover:text-[var(--accent)] transition-colors"
            draggable={false}
          >
            GitHub
          </Link>
          {project.liveUrl ? (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-between border border-[var(--rule)] px-4 py-2 font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)] hover:text-[var(--accent)] transition-colors"
              draggable={false}
            >
              Live
            </Link>
          ) : (
            <span className="inline-flex items-center justify-between border border-[var(--rule)] px-4 py-2 font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)] opacity-40 cursor-default">
              Soon
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}

export function ProjectDeck() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(t);
  }, [index]);

  const goNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % projects.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x < -80) {
      goNext();
    } else if (info.offset.x > 80) {
      goPrev();
    }
  };

  const visibleCards = [];
  for (let i = 0; i < 3; i++) {
    const idx = (index + i) % projects.length;
    visibleCards.push({ project: projects[idx], order: i, actualIndex: idx });
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 600 : -600,
      opacity: 0,
      scale: 1,
      y: 0,
    }),
    center: (order: number) => ({
      x: 0,
      y: 0,
      scale: 1 - order * 0.05,
      opacity: order === 0 ? 1 : 0,
      zIndex: 3 - order,
      transition: { type: "spring" as const, stiffness: 300, damping: 30 },
    }),
    exit: (direction: number) => ({
      x: direction < 0 ? 600 : -600,
      opacity: 0,
      rotate: direction > 0 ? -5 : 5,
      transition: { duration: 0.3 },
    }),
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="relative w-full max-w-[600px] h-[380px] overflow-hidden">
        <div className="absolute top-[-30px] right-0 font-mono text-[10px] tracking-[0.2em] text-[var(--muted)]">
          {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </div>

        <AnimatePresence initial={false} custom={direction}>
          {visibleCards.map((c, i) => (
            <motion.div
              key={c.project.slug}
              custom={direction}
              variants={variants}
              initial={i === 0 ? "enter" : "center"}
              animate="center"
              exit="exit"
              drag={i === 0 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={i === 0 ? handleDragEnd : undefined}
              className="absolute inset-x-0 mx-auto w-full h-full max-w-[600px]"
              style={{ originY: 0 }}
            >
              <ProjectCard project={c.project} isTop={i === 0} />
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-[-30px] left-0 font-mono text-[10px] tracking-[0.2em] text-[var(--muted)] pointer-events-none"
            >
              ← swipe →
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-20 flex gap-8 items-center font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)]">
        <button onClick={goPrev} className="hover:text-[var(--accent)] transition-colors py-2 px-4 border border-transparent hover:border-[var(--rule)]">
          ← PREV
        </button>
        <button onClick={goNext} className="hover:text-[var(--accent)] transition-colors py-2 px-4 border border-transparent hover:border-[var(--rule)]">
          NEXT →
        </button>
      </div>
    </div>
  );
}
