"use client";

import ContactNotePanel from "./ContactNotePanel";

const socials = [
  { label: "GITHUB", href: "https://github.com/UtsavDoye20122005" },
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/utsav-doye/" },
  { label: "TWITTER", href: "https://x.com/utsavdoye07" },
] as const;

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
      <header className="border-x border-[var(--rule)] px-4 pt-10 pb-8 md:px-10" data-reveal-stagger>
        <p data-reveal className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
          Contact
        </p>
        <h1 data-reveal className="mt-4 font-sans text-4xl tracking-[-0.02em] sm:text-5xl md:text-6xl">
          Say hello.
        </h1>
        <div className="mt-8 border-t border-[var(--rule)] pt-6" />
      </header>

      <div className="border-x border-[var(--rule)] px-4 pb-10 md:px-10">
        <div className="grid gap-10 pt-10 md:grid-cols-[minmax(0,1fr)_480px] md:items-start" data-reveal-stagger>
          <div>
            <a
              data-reveal
              className="inline-flex w-full items-baseline justify-between gap-6 border border-[var(--rule)] px-6 py-8 font-sans text-2xl tracking-[-0.02em] hover:border-[var(--accent)] sm:text-3xl md:text-4xl"
              href="mailto:utsavdoye07@gmail.com"
            >
              <span>utsavdoye07@gmail.com</span>
              <span className="font-mono text-sm uppercase tracking-[0.28em] text-[var(--accent)]">
                →
              </span>
            </a>

            <div className="mt-8" data-reveal>
              <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)]">
                Elsewhere
              </h2>

              <ul className="mt-4 divide-y divide-[var(--rule)] border border-[var(--rule)]">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      className="flex items-center justify-between gap-6 px-4 py-4 font-mono text-sm uppercase tracking-[0.22em] text-[var(--fg)] hover:text-[var(--accent)]"
                    >
                      <span>{s.label}</span>
                      <span aria-hidden="true">→</span>
                    </a>
                  </li>
                ))}
              </ul>

              
            </div>
          </div>

          <div className="md:justify-self-end" data-reveal>
            <ContactNotePanel />
          </div>
        </div>
      </div>
    </section>
  );
}
