"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function RouteLoadingBar() {
  const pathname = usePathname();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Trigger a CSS animation on route change.
    setTick((t) => t + 1);
  }, [pathname]);

  return <div key={tick} className="route-loading-bar" aria-hidden="true" />;
}

