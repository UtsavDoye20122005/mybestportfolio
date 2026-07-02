"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Line = { id: number; kind: "prompt" | "output"; text: string };

const EMAIL = "utsavdoye07@gmail.com";

function formatSkillsTree() {
  return [
    "skills",
    "├─ lang",
    "│  ├─ TypeScript",
    "│  ├─ JavaScript",
    "│  ├─ Python",
    "│  └─ SQL",
    "├─ frontend",
    "│  ├─ Next.js",
    "│  ├─ React",
    "│  └─ Tailwind",
    "├─ backend",
    "│  ├─ Node.js",
    "│  ├─ Express",
    "│  └─ REST APIs",
    "└─ tools",
    "   ├─ Git",
    "   ├─ Docker",
    "   └─ Postman",
  ];
}

function formatProjectsList() {
  return [
    "projects",
    "1) signal-lab — low-latency alerts + analytics dashboard",
    "2) ops-console — internal tooling for triage and automation",
    "3) quant-notes — research tracker for strategies + backtests",
  ];
}

function nowPlayingFake() {
  return [
    "♪ good taste detected.",
    "now playing: 'Midnight Circuit' — UTSAV FM (00:42 / 03:12)",
  ];
}

export function TerminalSection() {
  const outputRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [welcomeDone, setWelcomeDone] = useState(false);

  const helpLines = useMemo(
    () => [
      "help",
      "available commands:",
      "  whoami",
      "  skills",
      "  projects",
      "  contact",
      "  available",
      "  clear",
      "  cmd+k (clear)",
      "  help",
      "  hire me",
      "  play",
    ],
    []
  );

  useEffect(() => {
    // Auto-type welcome message on load.
    const msg = "Welcome to utsav.dev — type 'help' to see available commands.";
    let i = 0;
    let timer: number | null = null;
    const nextId = { v: 1 };
    const tick = () => {
      i++;
      setLines([{ id: nextId.v++, kind: "output", text: msg.slice(0, i) }]);
      if (i >= msg.length) {
        setWelcomeDone(true);
        return;
      }
      timer = window.setTimeout(tick, 18);
    };

    // start
    setLines([{ id: nextId.v++, kind: "output", text: "" }]);
    timer = window.setTimeout(tick, 18);
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const nextId = useRef(1000);

  useEffect(() => {
    // Keep output scrolled to bottom.
    const el = outputRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines]);

  const run = (raw: string) => {
    const input = raw.trim();
    const lower = input.toLowerCase();
    const [cmd] = lower.split(/\s+/);

    const push = (next: Omit<Line, "id">[]) =>
      setLines((prev) => [
        ...prev,
        ...next.map((n) => ({ id: ++nextId.current, ...n })),
      ]);

    if (!input) return;

    push([{ kind: "prompt", text: input }]);

    if (cmd === "clear") {
      setLines([]);
      return;
    }

    if (lower === "help") {
      push(helpLines.map((t) => ({ kind: "output" as const, text: t })));
      return;
    }

    if (lower === "whoami") {
      push([
        {
          kind: "output",
          text: "Utsav Doye. Full stack developer. Builder of reliable systems.",
        },
      ]);
      return;
    }

    if (lower === "skills") {
      push(formatSkillsTree().map((t) => ({ kind: "output" as const, text: t })));
      return;
    }

    if (lower === "projects") {
      push(formatProjectsList().map((t) => ({ kind: "output" as const, text: t })));
      return;
    }

    if (lower === "contact") {
      push([
        { kind: "output", text: "contact" },
        { kind: "output", text: `email: ${EMAIL}` },
        { kind: "output", text: "github: https://github.com/UtsavDoye20122005" },
        { kind: "output", text: "linkedin: https://www.linkedin.com/in/utsav-doye/" },
        { kind: "output", text: "twitter: https://x.com/utsavdoye07" },
      ]);
      return;
    }

    if (lower === "available") {
      push([
        { kind: "output", text: "available" },
        { kind: "output", text: "status: AVAILABLE FOR OPPORTUNITIES" },
        { kind: "output", text: "response: ~24hr" },
      ]);
      return;
    }

    if (lower === "hire me") {
      push([
        { kind: "output", text: "Smart move. Head to /contact or email " + EMAIL },
      ]);
      return;
    }

    if (lower === "play") {
      push(nowPlayingFake().map((t) => ({ kind: "output" as const, text: t })));
      return;
    }

    const cliReplies: Record<string, string[]> = {
      cd: [
        "teleporting... please keep limbs inside the terminal at all times.",
        "current directory: ~/vibes-only",
      ],
      ls: [
        "listing files:",
        "1) secrets.txt (totally safe)",
        "2) goals.md (bold)",
        "3) dreams/ (still compiling)",
      ],
      pwd: ["you are here: /home/utsav/this-is-fine"],
      chmod: ["permission granted. power must be used responsibly."],
      chown: ["ownership transferred to: you, the chosen one."],
      touch: ["touched. it blushed."],
      mkdir: ["directory created. it grows up so fast."],
      rm: ["deleting... emotional support file removed."],
      rmdir: ["removed directory. it was a good folder."],
      cat: ["meow. (also: file displayed)"],
      head: ["top of file: looks good from here."],
      tail: ["tailing... wag wag."],
      grep: ["searching... found 0 bugs, 12 feelings."],
      find: ["found: your motivation. it was in /lost+found."],
      echo: ["echo... echo... (yep, still you)"],
      man: ["manual opened. step 1: don't panic."],
      sudo: ["nice try. you already have root energy."],
      kill: ["process terminated. no witnesses."],
    };

    if (cmd && cliReplies[cmd]) {
      push(cliReplies[cmd].map((t) => ({ kind: "output" as const, text: t })));
      return;
    }

    push([
      {
        kind: "output",
        text: `command not found: ${input}. try 'help'.`,
      },
    ]);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 md:px-6">
      <div
        className="terminal border-x border-[var(--rule)] px-4 md:px-10"
        data-reveal-stagger
      >
        <div
          className="terminal__window"
          role="region"
          aria-label="Interactive terminal"
          tabIndex={0}
          onMouseDown={() => inputRef.current?.focus()}
          onKeyDown={() => inputRef.current?.focus()}
          data-reveal
        >
          <div className="terminal__topbar">
            <div className="terminal__dots" aria-hidden="true">
              <span className="terminal__dot terminal__dot--red" />
              <span className="terminal__dot terminal__dot--yellow" />
              <span className="terminal__dot terminal__dot--green" />
            </div>
            <div className="terminal__title">utsav@portfolio ~ </div>
          </div>

          <div ref={outputRef} className="terminal__output" aria-live="polite">
            {lines.map((l) => (
              <div
                key={l.id}
                className={l.kind === "prompt" ? "terminal__line terminal__line--prompt" : "terminal__line"}
              >
                {l.kind === "prompt" ? <span className="terminal__prompt">→ </span> : null}
                <span className="terminal__text">{l.text}</span>
              </div>
            ))}
          </div>

          <form
            className="terminal__inputRow"
            onSubmit={(e) => {
              e.preventDefault();
              run(value);
              setValue("");
              inputRef.current?.focus();
            }}
          >
            <span className="terminal__prompt" aria-hidden="true">
              →{" "}
            </span>
            <input
              ref={inputRef}
              className="terminal__input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                  e.preventDefault();
                  setLines([]);
                  setValue("");
                }
              }}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Terminal command input"
              placeholder={welcomeDone ? "type a command…" : ""}
            />
            <span className="terminal__cursor" aria-hidden="true" />
          </form>
        </div>
      </div>
    </section>
  );
}
