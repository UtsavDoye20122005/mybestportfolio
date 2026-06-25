"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export function PageAnimatePresence({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`loading-${pathname}`}
          initial={{ width: "0%", opacity: 1 }}
          animate={{ width: "100%", opacity: [1, 1, 0] }}
          transition={{ duration: 0.55, ease: "easeInOut", times: [0, 0.82, 1] }}
          className="fixed top-0 left-0 h-[2px] bg-[var(--accent)] z-[99999]"
        />
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <div key={pathname} className="w-full">
          {children}
        </div>
      </AnimatePresence>
    </>
  );
}
