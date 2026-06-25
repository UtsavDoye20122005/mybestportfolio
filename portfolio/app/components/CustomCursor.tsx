"use client";

import { useEffect, useRef, useState } from "react";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const interactive = t.closest("a,button,[role='button'],[data-cursor='active']");
      if (interactive) setIsActive(true);
    };

    const onOut = (e: MouseEvent) => {
      const from = e.target;
      const to = e.relatedTarget;
      if (!(from instanceof Element)) return;

      const fromInteractive = from.closest("a,button,[role='button'],[data-cursor='active']");
      const toInteractive = to instanceof Element
        ? to.closest("a,button,[role='button'],[data-cursor='active']")
        : null;
      if (fromInteractive && !toInteractive) setIsActive(false);
    };

    const tick = () => {
      // The third parameter (0.35 below) controls the interpolation speed. 
      // 1.0 is instant, closer to 0 is slower/heavier.
      current.current.x = lerp(current.current.x, target.current.x, 0.35);
      current.current.y = lerp(current.current.y, target.current.y, 0.35);

      // Center ring on pointer.
      const x = current.current.x;
      const y = current.current.y;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0)`;

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={["custom-cursor", isActive ? "custom-cursor--active" : ""].join(" ")}
      aria-hidden="true"
    />
  );
}
