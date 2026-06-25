"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SecretPage() {
  const fullText = `Most people never look past the surface.
You did.

This page isn't indexed. It's not linked anywhere.
You either got lucky, read the source, or you're 
the kind of person who just tries things.

I like that.

If you're a recruiter or developer who found this — 
let's talk. Seriously.
utsavdoye07@gmail.com

— Utsav`;

  const [text, setText] = useState("");
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index + 1));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col items-center justify-center p-6 relative z-10">
      <div className="max-w-xl w-full">
        <h1 className="font-sans italic text-5xl md:text-7xl mb-12 tracking-[-0.02em]">
          YOU FOUND THIS.
        </h1>
        
        <div className="font-mono text-sm leading-8 whitespace-pre-wrap text-[var(--muted)] min-h-[350px]">
          {text}
        </div>
        
        <div className="mt-16 animate-fade-in" style={{ animationDelay: "5s" }}>
          <div className="flex flex-wrap gap-6">
            <Link
              href="/secret/inbox"
              className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)] transition-colors hover:text-[var(--fg)]"
            >
              open lead vault →
            </Link>
            <Link
              href="/"
              className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)] transition-colors hover:text-[var(--fg)]"
            >
              ← GO BACK
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
