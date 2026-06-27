"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", label: "HOME" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/resume", label: "RESUME" },
  { href: "/journey", label: "JOURNEY" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
] as const;

export function SiteNav() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[var(--bg)]/90 backdrop-blur-[2px]">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6"
      >
        <Link
          href="/"
          onClick={(e) => {
            if (pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="group inline-flex items-center gap-3"
          aria-label="Utsav Doye home"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center border border-[var(--rule)] bg-[var(--bg)] font-mono text-xs tracking-[0.2em] text-[var(--fg)] hover:text-[var(--accent)] transition-colors">
            UD
          </span>
          <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)] sm:inline group-hover:text-[var(--fg)] transition-colors">
            UTSAV DOYE
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="nav-menu-btn font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--fg)]"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            MENU
          </button>
        </div>

        <div className="hidden items-center gap-3 sm:flex sm:gap-5">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "nav-link relative font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--fg)]",
                  "opacity-85 hover:opacity-100",
                  "px-2 py-3",
                  active ? "is-active" : "",
                ].join(" ")}
              >
                {l.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={["mobile-nav", open ? "mobile-nav--open" : ""].join(" ")}
      >
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="border-t border-[var(--rule)] py-3">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "mobile-nav__link font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)]",
                    active ? "mobile-nav__link--active" : "",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}

