"use client";

import { useState, useEffect } from "react";

const INITIAL_SPEED = 720;
const MIN_SPEED = 240;
const SPEED_STEP = 45;

const COMMENTS = [
  { threshold: 0, text: "System stable. Awaiting manual testing..." },
  { threshold: 1, text: "First bug fixed. Only 99 left in the backlog." },
  { threshold: 4, text: "You're getting good at this. QA material right here." },
  { threshold: 8, text: "Wow, so fast. But did you write tests for these?" },
  { threshold: 12, text: "Wait, are you supposed to be working right now?" },
  { threshold: 18, text: "Careful, if you fix too many, they'll make you a Tech Lead." },
  { threshold: 25, text: "Wait, the feature was supposed to be a bug... you deleted a feature!" },
  { threshold: 35, text: "Okay, 10x developer. Save some bugs for the interns." },
  { threshold: 50, text: "Seriously? The codebase is flawless. (Just kidding.)" },
  { threshold: 75, text: "Stop clicking! Your mouse is going to break!" },
  { threshold: 100, text: "Achievement unlocked: NO LIFE. Just pure bug smashing." }
];

function getRandomPosition() {
  return {
    top: Math.floor(Math.random() * 80) + 10,
    left: Math.floor(Math.random() * 80) + 10,
  };
}

export function InteractiveGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ top: 50, left: 50 });
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isPageVisible, setIsPageVisible] = useState(true);

  const currentComment = [...COMMENTS].reverse().find((c) => score >= c.threshold)?.text || "";

  useEffect(() => {
    const syncVisibility = () => {
      const visible = document.visibilityState === "visible";
      setIsPageVisible(visible);

      if (visible) {
        setIsPlaying(false);
        setScore(0);
        setSpeed(INITIAL_SPEED);
        setPosition({ top: 50, left: 50 });
      }
    };

    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    window.addEventListener("focus", syncVisibility);

    return () => {
      document.removeEventListener("visibilitychange", syncVisibility);
      window.removeEventListener("focus", syncVisibility);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || !isPageVisible) return;

    const moveBug = () => {
      setPosition(getRandomPosition());
    };

    moveBug();
    const interval = setInterval(moveBug, speed);
    return () => clearInterval(interval);
  }, [isPlaying, isPageVisible, speed]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setPosition(getRandomPosition());
  };

  const catchBug = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScore((prev) => prev + 1);
    setSpeed((prev) => Math.max(MIN_SPEED, prev - SPEED_STEP));
    
    // Jump away immediately when caught
    setPosition(getRandomPosition());
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
      <div className="border-x border-[var(--rule)] px-4 pb-10 md:px-10" data-reveal>
        <div className="pt-2 flex justify-between items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
              INTERACTIVE BREAK
            </p>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--fg)]">
            BUGS CAUGHT: <span className="text-[var(--accent)]">{score.toString().padStart(3, "0")}</span>
          </div>
        </div>
        <div className="mt-4 border-t border-[var(--rule)] pt-6" />

        <div 
          className="relative mt-2 w-full bg-[var(--bg)] border border-[var(--rule)] flex flex-col items-center justify-center p-6 min-h-[400px] overflow-hidden group"
          style={{
            backgroundImage: "radial-gradient(circle at center, var(--rule) 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        >
          {/* Game Area */}
          <div 
            className={`absolute inset-0 ${isPlaying ? 'cursor-crosshair' : ''}`}
            onClick={(e) => {
              // Miss penalty could go here, but maybe a visual miss flash is better
            }}
          >
            {isPlaying && (
              <button
                type="button"
                onClick={catchBug}
                style={{
                  top: `${position.top}%`,
                  left: `${position.left}%`,
                  transition: `top ${Math.max(150, speed * 0.58)}ms ease-out, left ${Math.max(150, speed * 0.58)}ms ease-out, transform 120ms ease-out`,
                }}
                className="absolute flex items-center justify-center text-3xl md:text-4xl hover:scale-110 focus:outline-none z-10 -translate-x-1/2 -translate-y-1/2 drop-shadow-lg"
                aria-label="Catch bug"
              >
                🐛
              </button>
            )}
          </div>

          {/* Overlay UI when not playing */}
          {!isPlaying && (
            <div className="z-20 flex flex-col items-center select-none text-center bg-[var(--bg)]/80 p-8 border border-[var(--rule)] backdrop-blur-sm">
              <div className="text-4xl mb-4 animate-bounce">🐛</div>
              <h3 className="font-sans text-2xl tracking-[-0.02em] text-[var(--fg)] mb-2">
                Debug Mode
              </h3>
              <p className="font-mono text-xs leading-5 text-[var(--muted)] mb-6 max-w-xs">
                Production is stable, but there's always one more bug. Catch as many as you can before you get dizzy.
              </p>
              <button
                onClick={startGame}
                className="trace-btn inline-flex items-center justify-between gap-4 border border-[var(--rule)] bg-transparent px-5 py-3 font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)] hover:text-[var(--accent)] transition-colors"
              >
                <span>START SQUASHING</span>
              </button>
            </div>
          )}

          {/* Comment Stream */}
          {isPlaying && (
            <div className="pointer-events-none absolute bottom-6 left-0 right-0 flex justify-center px-4">
              <div 
                key={score} 
                className="bg-[var(--bg)]/90 backdrop-blur-sm border border-[var(--rule)] px-5 py-3 font-mono text-xs uppercase tracking-[0.1em] text-[var(--muted)] text-center max-w-[90%] md:max-w-[70%] shadow-lg transition-all duration-300"
              >
                <span className="text-[var(--accent)] mr-2">&gt;</span> 
                {currentComment}
                <span className="animate-pulse text-[var(--fg)] ml-1">_</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
