"use client";

import { useEffect, useRef } from "react";

const titles = [
  "Utsav Doye — Full Stack Dev",
  "Utsav Doye — Available for Hire",
  "Utsav Doye — Building Daily",
  "Utsav Doye — Open to Opportunities",
  "Utsav Doye — Let's Build Something",
];

const awayTitle = "👋 come back — utsav.dev";

export function TabTitleCycle() {
  const currentIndex = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const cycleMap = () => {
      if (document.visibilityState === "hidden") {
        document.title = awayTitle;
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        document.title = titles[currentIndex.current];
        intervalRef.current = setInterval(() => {
          currentIndex.current = (currentIndex.current + 1) % titles.length;
          document.title = titles[currentIndex.current];
        }, 3000);
      }
    };

    // Initial start
    cycleMap();

    document.addEventListener("visibilitychange", cycleMap);

    return () => {
      document.removeEventListener("visibilitychange", cycleMap);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return null;
}
