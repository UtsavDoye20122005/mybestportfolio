"use client";

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

type Node = {
  id: string;
  year: string;
  icon: string;
  title: string;
  desc: string;
  x: number; // percentage 0..100 relative to SVG viewBox
  y: number; // percentage 0..100 relative to SVG viewBox
  style?: "start" | "now" | "future";
};

type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type CardLayout = {
  left: number;
  top: number;
  enterX: number;
  enterY: number;
};

const CARD_WIDTH = 260;
const CARD_HEIGHT = 144;
const NODE_SIZE = 52;
const NODE_HALF = NODE_SIZE / 2;
const CARD_GAP = 14;
const SIDE_GAP = 18;
const CANVAS_PADDING = 18;
const CARD_CLEARANCE = 18;
const NODE_CLEARANCE = 12;

function expandRect(rect: Rect, padding: number): Rect {
  return {
    left: rect.left - padding,
    top: rect.top - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  };
}

function intersects(a: Rect, b: Rect): boolean {
  return (
    a.left < b.left + b.width &&
    a.left + a.width > b.left &&
    a.top < b.top + b.height &&
    a.top + a.height > b.top
  );
}

function intersectionArea(a: Rect, b: Rect): number {
  const overlapWidth = Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left);
  const overlapHeight = Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top);

  if (overlapWidth <= 0 || overlapHeight <= 0) return 0;
  return overlapWidth * overlapHeight;
}

export function JourneyRoadmap() {
  const svgRef = useRef<SVGPathElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0); // 0..1
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const nodes = useMemo<Node[]>(
    () => [
      {
        id: "start",
        year: "2025",
        icon: "💡",
        title: "The Beginning",
        desc: "Wrote my first line of code. Had no idea. Still learning.",
        x: 20,
        y: 8,
        style: "start",
      },
      {
        id: "college",
        year: "2025",
        icon: "🎓",
        title: "College & Code",
        desc: "Balancing lectures and late night builds.",
        x: 82,
        y: 26,
      },
      {
        id: "client",
        year: "2026",
        icon: "💼",
        title: "First Client",
        desc: "Someone paid me. That changed everything.",
        x: 18,
        y: 40,
      },
      {
        id: "finance",
        year: "2025",
        icon: "📈",
        title: "Finance + Code",
        desc: "Started trading. Saw patterns everywhere.",
        x: 84,
        y: 54,
      },
      {
        id: "ai",
        year: "2026",
        icon: "🤖",
        title: "AI & Automation",
        desc: "Building workflows that work while I sleep.",
        x: 20,
        y: 68,
      },
      {
        id: "now",
        year: "NOW",
        icon: "⚡",
        title: "Present",
        desc: "Calm, focused, building daily.",
        x: 86,
        y: 82,
        style: "now",
      },
      {
        id: "future",
        year: "FUTURE",
        icon: "🏁",
        title: "The Goal",
        desc: "Big. Happy. Useful.",
        x: 18,
        y: 92,
        style: "future",
      },
    ],
    []
  );

  useEffect(() => {
    const path = svgRef.current;
    const wrap = wrapRef.current;
    if (!path || !wrap) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          // Animate from 0->1 while section is in view.
          const onScroll = () => {
            const rect = wrap.getBoundingClientRect();
            const vh = window.innerHeight || 1;
            const start = vh * 0.15;
            const end = vh * 0.85;
            const t = (start - rect.top) / (end - start);
            const clamped = Math.max(0, Math.min(1, t));
            setProgress(clamped);
            path.style.strokeDashoffset = String(length * (1 - clamped));
          };

          onScroll();
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll);
          return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
          };
        }
      },
      { threshold: 0.1 }
    );

    io.observe(wrap);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const syncSize = () => {
      const rect = canvas.getBoundingClientRect();
      setCanvasSize({ width: rect.width, height: rect.height });
    };

    syncSize();

    if (typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);

    return () => ro.disconnect();
  }, []);

  const cardLayouts = useMemo<CardLayout[]>(
    () => {
      const nodeRects = nodes.map((node) => {
        const centerX = (node.x / 100) * canvasSize.width;
        const centerY = (node.y / 100) * canvasSize.height;

        return {
          left: centerX - NODE_HALF,
          top: centerY - NODE_HALF,
          width: NODE_SIZE,
          height: NODE_SIZE,
        };
      });

      const fallbackLayout = (node: Node, index: number): CardLayout => {
        const preferBelow = node.y < 20 || (node.y <= 80 && index % 2 === 1);
        return {
          left: NODE_HALF - CARD_WIDTH / 2,
          top: preferBelow ? NODE_SIZE + CARD_GAP : -(CARD_HEIGHT + CARD_GAP),
          enterX: 0,
          enterY: preferBelow ? 10 : -10,
        };
      };

      if (!canvasSize.width || !canvasSize.height) {
        return nodes.map(fallbackLayout);
      }

      const placedRects: Rect[] = [];

      return nodes.map((node, index) => {
        const centerX = (node.x / 100) * canvasSize.width;
        const centerY = (node.y / 100) * canvasSize.height;

        const primaryVertical = node.y < 20 ? "below" : node.y > 80 ? "above" : index % 2 === 0 ? "above" : "below";
        const secondaryVertical = primaryVertical === "above" ? "below" : "above";
        const primarySide = node.x < 50 ? "right" : "left";
        const secondarySide = primarySide === "right" ? "left" : "right";

        const candidates = [
          primaryVertical === "above"
            ? {
                rect: {
                  left: centerX - CARD_WIDTH / 2,
                  top: centerY - NODE_HALF - CARD_GAP - CARD_HEIGHT,
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                },
                layout: {
                  left: NODE_HALF - CARD_WIDTH / 2,
                  top: -(CARD_HEIGHT + CARD_GAP),
                  enterX: 0,
                  enterY: -10,
                },
              }
            : {
                rect: {
                  left: centerX - CARD_WIDTH / 2,
                  top: centerY + NODE_HALF + CARD_GAP,
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                },
                layout: {
                  left: NODE_HALF - CARD_WIDTH / 2,
                  top: NODE_SIZE + CARD_GAP,
                  enterX: 0,
                  enterY: 10,
                },
              },
          primarySide === "right"
            ? {
                rect: {
                  left: centerX + NODE_HALF + SIDE_GAP,
                  top: centerY - CARD_HEIGHT / 2,
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                },
                layout: {
                  left: NODE_SIZE + SIDE_GAP,
                  top: NODE_HALF - CARD_HEIGHT / 2,
                  enterX: 10,
                  enterY: 0,
                },
              }
            : {
                rect: {
                  left: centerX - NODE_HALF - SIDE_GAP - CARD_WIDTH,
                  top: centerY - CARD_HEIGHT / 2,
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                },
                layout: {
                  left: -(CARD_WIDTH + SIDE_GAP),
                  top: NODE_HALF - CARD_HEIGHT / 2,
                  enterX: -10,
                  enterY: 0,
                },
              },
          secondaryVertical === "above"
            ? {
                rect: {
                  left: centerX - CARD_WIDTH / 2,
                  top: centerY - NODE_HALF - CARD_GAP - CARD_HEIGHT,
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                },
                layout: {
                  left: NODE_HALF - CARD_WIDTH / 2,
                  top: -(CARD_HEIGHT + CARD_GAP),
                  enterX: 0,
                  enterY: -10,
                },
              }
            : {
                rect: {
                  left: centerX - CARD_WIDTH / 2,
                  top: centerY + NODE_HALF + CARD_GAP,
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                },
                layout: {
                  left: NODE_HALF - CARD_WIDTH / 2,
                  top: NODE_SIZE + CARD_GAP,
                  enterX: 0,
                  enterY: 10,
                },
              },
          secondarySide === "right"
            ? {
                rect: {
                  left: centerX + NODE_HALF + SIDE_GAP,
                  top: centerY - CARD_HEIGHT / 2,
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                },
                layout: {
                  left: NODE_SIZE + SIDE_GAP,
                  top: NODE_HALF - CARD_HEIGHT / 2,
                  enterX: 10,
                  enterY: 0,
                },
              }
            : {
                rect: {
                  left: centerX - NODE_HALF - SIDE_GAP - CARD_WIDTH,
                  top: centerY - CARD_HEIGHT / 2,
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                },
                layout: {
                  left: -(CARD_WIDTH + SIDE_GAP),
                  top: NODE_HALF - CARD_HEIGHT / 2,
                  enterX: -10,
                  enterY: 0,
                },
              },
        ];

        const chosen =
          candidates.find(({ rect }) => {
            const withinCanvas =
              rect.left >= CANVAS_PADDING &&
              rect.top >= CANVAS_PADDING &&
              rect.left + rect.width <= canvasSize.width - CANVAS_PADDING &&
              rect.top + rect.height <= canvasSize.height - CANVAS_PADDING;

            if (!withinCanvas) return false;

            const paddedRect = expandRect(rect, CARD_CLEARANCE);
            const overlapsCard = placedRects.some((placedRect) => intersects(paddedRect, expandRect(placedRect, CARD_CLEARANCE)));
            const overlapsNode = nodeRects.some(
              (otherNodeRect, nodeIndex) => nodeIndex !== index && intersects(paddedRect, expandRect(otherNodeRect, NODE_CLEARANCE))
            );

            return !overlapsCard && !overlapsNode;
          }) ??
          candidates
            .map(({ rect, layout }) => {
              const overflowPenalty =
                Math.max(0, CANVAS_PADDING - rect.left) +
                Math.max(0, CANVAS_PADDING - rect.top) +
                Math.max(0, rect.left + rect.width - (canvasSize.width - CANVAS_PADDING)) +
                Math.max(0, rect.top + rect.height - (canvasSize.height - CANVAS_PADDING));

              const collisionPenalty =
                placedRects.reduce(
                  (total, placedRect) => total + intersectionArea(expandRect(rect, CARD_CLEARANCE), expandRect(placedRect, CARD_CLEARANCE)),
                  0
                ) +
                nodeRects.reduce(
                  (total, otherNodeRect, nodeIndex) =>
                    nodeIndex === index
                      ? total
                      : total + intersectionArea(expandRect(rect, NODE_CLEARANCE), expandRect(otherNodeRect, NODE_CLEARANCE)),
                  0
                );

              return {
                rect,
                layout,
                score: overflowPenalty * 1000 + collisionPenalty,
              };
            })
            .sort((a, b) => a.score - b.score)[0];

        placedRects.push(chosen.rect);
        return chosen.layout;
      });
    },
    [canvasSize.height, canvasSize.width, nodes]
  );

  return (
    <div className="journey" ref={wrapRef}>
      <div className="journey__grid" aria-hidden="true" />

      <div className="journey__desktop">
        <div className="journey__canvas" ref={canvasRef}>
          <svg
            className="journey__svg"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Road edge (dashed markings) */}
            <path
              d="M 80 120 C 280 80, 420 160, 520 240 C 640 340, 820 320, 920 260
                 C 980 220, 980 420, 900 480 C 760 590, 520 520, 420 580
                 C 300 650, 220 740, 120 780 C 60 805, 70 900, 160 920
                 C 360 965, 560 860, 760 900 C 860 920, 920 940, 940 960"
              className="journey__path journey__path--edge"
            />
            <path
              ref={svgRef}
              d="M 80 120 C 280 80, 420 160, 520 240 C 640 340, 820 320, 920 260
                 C 980 220, 980 420, 900 480 C 760 590, 520 520, 420 580
                 C 300 650, 220 740, 120 780 C 60 805, 70 900, 160 920
                 C 360 965, 560 860, 760 900 C 860 920, 920 940, 940 960"
              className="journey__path journey__path--main"
            />

            {/* Direction arrows */}
            <path
              d="M 320 165 l 14 8 l -14 8 z M 700 300 l 14 8 l -14 8 z
                 M 520 540 l 14 8 l -14 8 z M 220 790 l 14 8 l -14 8 z
                 M 720 905 l 14 8 l -14 8 z"
              className="journey__chevrons"
            />
          </svg>

          {nodes.map((n, i) => {
            const reached = progress >= n.y / 100;
            const layout = cardLayouts[i];
            const cardStyle = {
              left: layout.left,
              top: layout.top,
              "--card-enter-x": `${layout.enterX}px`,
              "--card-enter-y": `${layout.enterY}px`,
            } as CSSProperties;
            return (
              <div
                key={n.id}
                className={[
                  "journey__node",
                  reached ? "is-reached" : "",
                  n.style ? `journey__node--${n.style}` : "",
                ].join(" ")}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <div className="journey__circle" aria-hidden="true">
                  {n.icon}
                </div>
                <div className="journey__card" style={cardStyle}>
                  <div className="journey__year">{n.style === "start" ? `① START · ${n.year}` : n.year}</div>
                  <div className="journey__title">{n.title}</div>
                  <div className="journey__desc">{n.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile fallback timeline */}
      <div className="journey__mobile" data-reveal-stagger>
        <div className="journey__timeline">
          {nodes.map((n) => (
            <div key={n.id} className="journey__trow" data-reveal>
              <div className={["journey__ticon", n.style ? `journey__ticon--${n.style}` : ""].join(" ")}>
                {n.icon}
              </div>
              <div className="journey__tcard">
                <div className="journey__year">{n.style === "start" ? `① START · ${n.year}` : n.year}</div>
                <div className="journey__title">{n.title}</div>
                <div className="journey__desc">{n.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
