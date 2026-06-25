"use client";

import { ReactNode } from "react";

export function ProjectClientWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="border-x border-[var(--rule)] px-4 pb-10 md:px-10" data-reveal>
      {children}
    </div>
  );
}
