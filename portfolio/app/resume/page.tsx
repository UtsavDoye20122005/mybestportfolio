import type { ReactNode } from "react";

type ContactItem = { label: string; value: string; href?: string };
type SkillGroup = { label: string; value: string };
type ProjectItem = { title: string; meta: string; stack?: string; bullets: string[] };
type RoleItem = { title: string; org: string; meta: string; bullets: string[] };
type AchievementItem = { title: string; detail: string };

const contactItems: ContactItem[] = [
  { label: "Email", value: "utsavdoye07@gmail.com", href: "mailto:utsavdoye07@gmail.com" },
  { label: "Phone", value: "+91 72229 90015", href: "tel:+917222990015" },
  { label: "Base", value: "Bengaluru, India" },
  { label: "LinkedIn", value: "linkedin.com/in/utsav-doye", href: "https://www.linkedin.com/in/utsav-doye/" },
  { label: "GitHub", value: "github.com/UtsavDoye20122005", href: "https://github.com/UtsavDoye20122005" },
];

const skillGroups: SkillGroup[] = [
  { label: "Languages", value: "Python, JavaScript, TypeScript, SQL, HTML/CSS" },
  { label: "Web", value: "React, Next.js, React Native, Node.js, FastAPI, Tailwind CSS, REST APIs" },
  { label: "AI and Data", value: "Claude, OpenAI and Gemini APIs, AI agents, face recognition, NumPy, pandas" },
  { label: "Databases", value: "PostgreSQL, Supabase, Firebase" },
  { label: "Tools", value: "Git, GitHub, Vercel, Figma, Claude Code" },
  { label: "Core CS", value: "Data structures and algorithms, OOP, DBMS" },
];

const projects: ProjectItem[] = [
  {
    title: "EstateDesk — Sales CRM for a Real Estate Firm",
    meta: "2026 · In daily use, still growing",
    stack: "Next.js, TypeScript, Supabase (PostgreSQL), Gemini API, WhatsApp, Vercel",
    bullets: [
      "Built a 15,000-line sales CRM for TrustArc Estates around the problems its agents face every day.",
      "Pulls leads from 99acres, MagicBricks, Housing.com, Meta/Google ads and the website within seconds, merges duplicates, and assigns each new lead to the agent with the fewest open leads so no buyer waits for a reply.",
      "After a call, agents record a voice note in Hindi or English and AI fills in the outcome, budget, next call and site visit.",
      "Sends buyers home shortlists on WhatsApp with open and visit alerts; tracks inventory, deals and commission.",
    ],
  },
  {
    title: "Hall Shuffle — Exam Seating Engine",
    meta: "2026 · Live, passcode-locked",
    bullets: [
      "Reseats a 368-seat exam hall in one click so no two students from the same year sit together — a job teachers used to do by hand.",
      "Seating rules written as constraints (bench pattern, column order, year mix); student data is passcode-locked; PDF and CSV export.",
    ],
  },
  {
    title: "JiffyThat (FormAgent) — Speak-to-Form Builder",
    meta: "2026 · Live",
    stack: "Next.js, Supabase, Claude API, Google Sheets API, Vercel",
    bullets: [
      "Turns spoken or typed instructions, including Hindi typed in English letters, into a working form with a share link.",
      "Google and email sign-in with private per-user data (row-level security), workspaces, saved half-filled answers, response analytics and Google Sheets export; tested with 60 people submitting at the same time.",
    ],
  },
  {
    title: "Hazri — Face-Recognition Attendance",
    meta: "2026",
    stack: "Python, FastAPI, React Native, face recognition",
    bullets: [
      "One class photo finds and matches every face in a class of 60; a second photo flags students who left early.",
    ],
  },
];

const moreWork = [
  "Campus Room Board (Next.js, Firebase) — room booking for classes and exam halls with no double-booking.",
  "Review Intelligence (Python, pandas) — analysed 123,000 app reviews to find the most common complaints.",
  "The Daily Token — an AI news site that updates itself every morning.",
  "Finance Tracker — turns bank statement PDFs into spending data.",
  "Rural Telehealth Connect (Python, AI) — health-check tool for rural patients, built for Smart India Hackathon 2025.",
];

const roles: RoleItem[] = [
  {
    title: "Team Leader, Outgoing Exchange (Management Board)",
    org: "AIESEC in Bengaluru",
    meta: "2026 – Present",
    bullets: [
      "Lead a team handling outreach, onboarding and sales for international exchange programmes.",
      "Run sales calls for the Global Talent programme, taking students from first contact to sign-up and tracking every lead through the pipeline.",
      "Plan and deliver onboarding sessions and presentations (“Beyond Borders”) for new members.",
    ],
  },
  {
    title: "Corporate Social Responsibility Manager",
    org: "AIESEC United States East",
    meta: "2026 · Remote, six months",
    bullets: [
      "Selected for a US support team; run its social responsibility work remotely across time zones with little supervision.",
    ],
  },
];

const achievements: AchievementItem[] = [
  {
    title: "HPAIR Asia Conference 2026",
    detail: "Delegate at the Harvard Project for Asian and International Relations Asia Conference in Hanoi, Vietnam.",
  },
  {
    title: "Apple Developer Academy Indonesia",
    detail: "Cohort 2027 — cleared document screening and invited to the entry test.",
  },
];

function ResumeSection({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="border border-[var(--rule)] bg-[var(--subtle-bg)] p-5 sm:p-6" data-reveal>
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--accent)]">{eyebrow}</p>
      <h2 className="mt-3 font-sans text-2xl tracking-[-0.02em] text-[var(--fg)] sm:text-3xl">{title}</h2>
      <div className="mt-5 border-t border-[var(--rule)] pt-5">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((b) => (
        <li key={b} className="flex gap-3 font-mono text-sm leading-7 text-[var(--muted)]">
          <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

function TraceButton({ href, children, download }: { href: string; children: ReactNode; download?: string }) {
  return (
    <a
      href={href}
      download={download}
      className="trace-btn inline-flex items-center justify-center gap-3 border border-[var(--rule)] bg-transparent px-5 py-3 font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)]"
    >
      {children}
      <svg className="trace-btn__svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <rect x="1" y="1" width="98" height="98" rx="0" ry="0" pathLength="1" />
      </svg>
    </a>
  );
}

export default function ResumePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
      <header className="border-x border-[var(--rule)] px-4 pt-10 pb-8 md:px-10" data-reveal-stagger>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div data-reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">Utsav Doye</p>
            <h1 className="mt-6 font-mono text-4xl uppercase tracking-[0.28em] text-[var(--fg)] sm:text-5xl md:text-6xl">
              Resume
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row" data-reveal>
            <TraceButton href="/resume.pdf" download="Utsav-Doye-Resume.pdf">
              <span>Download PDF</span>
              <span aria-hidden="true">↓</span>
            </TraceButton>
            <TraceButton href="/contact">
              <span>Get in touch</span>
              <span className="text-[var(--accent)]" aria-hidden="true">→</span>
            </TraceButton>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--rule)] pt-6" />
      </header>

      <div className="border-x border-[var(--rule)] px-4 pb-10 md:px-10">
        <section className="grid gap-6 border-b border-[var(--rule)] py-8 lg:grid-cols-[1.2fr_0.8fr]" data-reveal-stagger>
          <div data-reveal>
            <h2 className="mt-4 max-w-2xl font-sans text-4xl leading-none tracking-[-0.03em] text-[var(--fg)] sm:text-5xl">
              I learn by building, and I ship to real users.
            </h2>
            <div className="mt-6 max-w-3xl space-y-4 font-mono text-sm leading-7 text-[var(--muted)]">
              <p>
                Second-year B.Tech student in Computer Science (AI/ML) at Newton School of Technology, Bengaluru. I
                find a real problem, build a working product and put it in the hands of the people who need it — from
                a 15,000-line sales CRM a real estate firm uses every day, to campus tools for exam seating, attendance
                and room booking.
              </p>
              <p>
                I work across the stack with Next.js, TypeScript, Python and PostgreSQL, and build AI features with the
                Claude, OpenAI and Gemini APIs. I&apos;m drawn to startups, and to how good products grow into lasting
                businesses.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1" data-reveal>
            {contactItems.map((item) => (
              <div key={item.label} className="border border-[var(--rule)] bg-[var(--subtle-bg)] px-4 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]">{item.label}</p>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    className="mt-2 block break-all font-mono text-sm leading-6 text-[var(--fg)] transition-colors hover:text-[var(--accent)]"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 font-mono text-sm leading-6 text-[var(--fg)]">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 py-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <ResumeSection eyebrow="01" title="Education">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-sans text-2xl tracking-[-0.02em] text-[var(--fg)]">
                    Newton School of Technology (S-VYASA)
                  </h3>
                  <p className="mt-2 font-mono text-sm leading-6 text-[var(--muted)]">
                    B.Tech in Computer Science and Engineering, specialisation in AI and Machine Learning
                  </p>
                </div>
                <div className="shrink-0 font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)] sm:text-right">
                  <p>2025 – 2029</p>
                  <p className="mt-1">(expected)</p>
                  <p className="mt-1 text-[var(--fg)]">Bengaluru</p>
                </div>
              </div>
            </ResumeSection>

            <ResumeSection eyebrow="02" title="Technical Skills">
              <div className="space-y-4">
                {skillGroups.map((item) => (
                  <div key={item.label} className="grid gap-2 sm:grid-cols-[130px_1fr]">
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--fg)]">{item.label}</p>
                    <p className="font-mono text-sm leading-7 text-[var(--muted)]">{item.value}</p>
                  </div>
                ))}
              </div>
            </ResumeSection>

            <ResumeSection eyebrow="03" title="Leadership">
              <div className="space-y-6">
                {roles.map((r) => (
                  <article key={r.title}>
                    <h3 className="font-sans text-xl tracking-[-0.02em] text-[var(--fg)]">{r.title}</h3>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)]">
                      {r.org} · {r.meta}
                    </p>
                    <Bullets items={r.bullets} />
                  </article>
                ))}
              </div>
            </ResumeSection>

            <ResumeSection eyebrow="04" title="Achievements">
              <div className="space-y-4">
                {achievements.map((item) => (
                  <div key={item.title} className="border-l border-[var(--accent)] pl-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg)]">{item.title}</p>
                    <p className="mt-2 font-mono text-sm leading-7 text-[var(--muted)]">{item.detail}</p>
                  </div>
                ))}
              </div>
            </ResumeSection>
          </div>

          <div className="space-y-6">
            <ResumeSection eyebrow="05" title="Projects">
              <div className="space-y-6">
                {projects.map((project) => (
                  <article key={project.title} className="border border-[var(--rule)] p-4">
                    <h3 className="font-sans text-2xl tracking-[-0.02em] text-[var(--fg)]">{project.title}</h3>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">
                      {project.meta}
                    </p>
                    {project.stack && (
                      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
                        {project.stack}
                      </p>
                    )}
                    <Bullets items={project.bullets} />
                  </article>
                ))}
              </div>
            </ResumeSection>

            <ResumeSection eyebrow="06" title="More Work">
              <Bullets items={moreWork} />
            </ResumeSection>
          </div>
        </div>
      </div>
    </section>
  );
}
