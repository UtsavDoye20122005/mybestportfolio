"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // For responsive offset (mobile)
  // Since we typically run this on client, we can approximate offset via window size,
  // or use Framer Motion variants that take custom props.
  // A simpler strategy: let Framer Motion handle an initial value via rem/px
  // But standard is standard, x: 60 on desktop, x: 30 on mobile.
  
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, x: typeof window !== "undefined" && window.innerWidth < 768 ? 30 : 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: typeof window !== "undefined" && window.innerWidth < 768 ? -30 : -60 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
      className="relative w-full"
    >
      {children}
    </motion.div>
  );
}
