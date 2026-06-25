"use client";

import { useEffect } from "react";

export function ConsoleGreeting() {
  useEffect(() => {
    console.log(
      "%c hey, console explorer 👀",
      "color: #e8ff00; font-size: 16px; font-family: monospace"
    );
    console.log(
      "%c if you're reading this, check out /secret",  
      "color: #666; font-size: 12px; font-family: monospace"
    );
  }, []);
  
  return null;
}
