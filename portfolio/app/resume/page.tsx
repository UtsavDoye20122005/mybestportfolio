import type { ReactNode } from "react";

type ContactItem = {
  label: string;
  value: string;
  href?: string;
};

type SkillGroup = {
  label: string;
  value: string;
};

type ProjectItem = {
  title: string;
  stack: string;
  bullets: string[];
};

type AchievementItem = {
  title: string;
  detail: string;
};

type InterestItem = {
  label: string;
  value: string;
};

const contactItems: ContactItem[] = [
  {
    label: "Email",
    value: "utsavdoye07@gmail.com",
    href: "mailto:utsavdoye07@gmail.com",
  },
  {
    label: "Phone",
    value: "+91-7222990015",
    href: "tel:+917222990015",
  },
  { label: "Base", value: "Bangalore, India" },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/utsav-doye",
    href: "https://www.linkedin.com/in/utsav-doye/",
  },
  {
    label: "GitHub",
    value: "github.com/utsavdoye",
    href: "https://github.com/UtsavDoye20122005",
  },
];

const educationHighlights = [
  { label: "Class 12 (CBSE)", value: "76.6%" },
  { label: "Class 11", value: "96.4%" },
  { label: "Class 10 (CBSE)", value: "91.5%" },
];

const skillGroups: SkillGroup[] = [
  { label: "Programming Languages", value: "Python, HTML, CSS, JavaScript, TypeScript" },
  { label: "Frontend", value: "Next.js, ReactJS, Tailwind CSS" },
  {
    label: "Tools and Technologies",
    value: "Docker, Git, Responsive Design, Code Optimization",
  },
  {
    label: "Core Competencies",
    value: "Algorithm Design, Data Processing, Web Development, Problem Solving",
  },
];

const projects: ProjectItem[] = [
  {
    title: "Smart Billing System",
    stack: "Python",
    bullets: [
      "Engineered an automated billing solution to calculate product totals with dynamic pricing logic",
      "Implemented robust input validation and error handling for enhanced user experience",
      "Optimized calculation algorithms for scalability with multiple product categories",
    ],
  },
  {
    title: "Adult Customer Filter System",
    stack: "Python",
    bullets: [
      "Developed data filtering application to process customer demographics and identify target segments",
      "Applied conditional logic and list comprehensions for efficient data manipulation",
      "Designed modular code structure for easy maintenance and future enhancements",
    ],
  },
  {
    title: "Personal Portfolio Website",
    stack: "HTML5, CSS3",
    bullets: [
      "Created responsive portfolio website showcasing technical projects and professional profile",
      "Implemented modern UI/UX principles with clean layout and intuitive navigation",
      "Utilized CSS3 features including flexbox and grid for cross-device compatibility",
    ],
  },
];

const hackathonBullets = [
  "Developed AI-powered telemedicine solution Rural Telehealth Connector bridging healthcare gap in rural areas",
  "Implemented AI Triage system with offline prescription storage and low-bandwidth video capabilities",
  "Built hybrid ecosystem integrating patient app, AI health assistant, and verified doctor network for rural-urban healthcare connectivity",
];

const achievements: AchievementItem[] = [
  {
    title: "Academic Excellence",
    detail:
      "Achieved 96.4% in Class 11, demonstrating consistent high performance",
  },
  {
    title: "Top Performer",
    detail: "Scored 91.5% in Class 10 CBSE Board Examinations",
  },
  {
    title: "Global Exposure",
    detail:
      "Selected for international educational trip to China to study innovation ecosystems and learn from leading global technology companies",
  },
];

const interests: InterestItem[] = [
  {
    label: "Technical",
    value:
      "Physics problem-solving, exploring emerging technologies, startup ecosystems",
  },
  {
    label: "Professional Development",
    value: "Networking events, tech meetups, industry conferences",
  },
  {
    label: "Personal",
    value:
      "International travel, cross-cultural learning experiences, innovation research",
  },
];

function ResumeSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      className="border border-[var(--rule)] bg-white/[0.02] p-5 sm:p-6"
      data-reveal
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--accent)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-sans text-2xl tracking-[-0.02em] text-[var(--fg)] sm:text-3xl">
        {title}
      </h2>
      <div className="mt-5 border-t border-[var(--rule)] pt-5">{children}</div>
    </section>
  );
}

export default function ResumePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
      <header
        className="border-x border-[var(--rule)] px-4 pt-10 pb-8 md:px-10"
        data-reveal-stagger
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div data-reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
              Est. 2026
            </p>
            <h1 className="mt-6 font-mono text-4xl uppercase tracking-[0.28em] text-[var(--fg)] sm:text-5xl md:text-6xl">
              Resume
            </h1>
            
          </div>

          <div className="flex flex-col gap-3 sm:flex-row" data-reveal>
            <a
              href="/resume.pdf"
              className="trace-btn inline-flex items-center justify-center gap-3 border border-[var(--rule)] bg-transparent px-5 py-3 font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)]"
              download="Utsav-Doye-Resume.pdf"
            >
              <span>Download PDF</span>
              <span aria-hidden="true">↓</span>
              <svg
                className="trace-btn__svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <rect x="1" y="1" width="98" height="98" rx="0" ry="0" pathLength="1" />
              </svg>
            </a>

            <a
              href="/contact"
              className="trace-btn inline-flex items-center justify-center gap-3 border border-[var(--rule)] bg-transparent px-5 py-3 font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)]"
            >
              <span>Get in touch</span>
              <span className="text-[var(--accent)]" aria-hidden="true">
                →
              </span>
              <svg
                className="trace-btn__svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <rect x="1" y="1" width="98" height="98" rx="0" ry="0" pathLength="1" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--rule)] pt-6" />
      </header>

      <div className="border-x border-[var(--rule)] px-4 pb-10 md:px-10">
        <section
          className="grid gap-6 border-b border-[var(--rule)] py-8 lg:grid-cols-[1.2fr_0.8fr]"
          data-reveal-stagger
        >
          <div data-reveal>
            
            <h2 className="mt-4 max-w-2xl font-sans text-4xl leading-none tracking-[-0.03em] text-[var(--fg)] sm:text-5xl">
              First-year BTech student building clean, practical software.
            </h2>
            <p className="mt-6 max-w-3xl font-mono text-sm leading-7 text-[var(--muted)]">
              Motivated first-year BTech student with strong analytical skills and
              passion for leveraging technology to solve real-world problems.
              Proficient in Python, HTML, JavaScript, CSS, Tailwind CSS and ReactJS with hands-on experience in
              building functional applications. Demonstrated ability to learn
              rapidly, collaborate effectively, and deliver results in dynamic
              environments.
            </p>
          </div>

          <div
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
            data-reveal
          >
            {contactItems.map((item) => (
              <div
                key={item.label}
                className="border border-[var(--rule)] bg-white/[0.02] px-4 py-4"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    className="mt-2 block break-all font-mono text-sm leading-6 text-[var(--fg)] hover:text-[var(--accent)] transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 font-mono text-sm leading-6 text-[var(--fg)]">
                    {item.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 py-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <ResumeSection eyebrow="01" title="Education">
              <div className="space-y-5">
                <div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-sans text-2xl tracking-[-0.02em] text-[var(--fg)]">
                        Newton School of Technology
                      </h3>
                      <p className="mt-1 font-mono text-sm uppercase tracking-[0.18em] text-[var(--muted)]">
                        Bachelor of Technology (BTech)
                      </p>
                    </div>

                    <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)] sm:text-right">
                      <p>Expected Graduation: 2029</p>
                      <p className="mt-1 text-[var(--fg)]">Bangalore, India</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent)]">
                    Academic Highlights
                  </p>
                  <div className="space-y-3">
                    {educationHighlights.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between gap-4 border-b border-[var(--rule)] pb-3 last:border-b-0 last:pb-0"
                      >
                        <span className="font-mono text-sm leading-6 text-[var(--muted)]">
                          {item.label}
                        </span>
                        <span className="font-mono text-sm leading-6 text-[var(--fg)]">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ResumeSection>

            <ResumeSection eyebrow="02" title="Achievements & Recognition">
              <div className="space-y-4">
                {achievements.map((item) => (
                  <div key={item.title} className="border-l border-[var(--accent)] pl-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg)]">
                      {item.title}
                    </p>
                    <p className="mt-2 font-mono text-sm leading-7 text-[var(--muted)]">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </ResumeSection>

            <ResumeSection eyebrow="03" title="Interests & Activities">
              <div className="space-y-4">
                {interests.map((item) => (
                  <div key={item.label} className="grid gap-2 sm:grid-cols-[170px_1fr]">
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--fg)]">
                      {item.label}
                    </p>
                    <p className="font-mono text-sm leading-7 text-[var(--muted)]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </ResumeSection>
          </div>

          <div className="space-y-6">
            <ResumeSection eyebrow="04" title="Technical Skills">
              <div className="space-y-4">
                {skillGroups.map((item) => (
                  <div key={item.label} className="grid gap-2 sm:grid-cols-[200px_1fr]">
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--fg)]">
                      {item.label}
                    </p>
                    <p className="font-mono text-sm leading-7 text-[var(--muted)]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </ResumeSection>

            <ResumeSection eyebrow="05" title="Projects">
              <div className="space-y-6">
                {projects.map((project) => (
                  <article key={project.title} className="border border-[var(--rule)] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-sans text-2xl tracking-[-0.02em] text-[var(--fg)]">
                          {project.title}
                        </h3>
                        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent)]">
                          {project.stack}
                        </p>
                      </div>
                    </div>

                    <ul className="mt-4 space-y-3">
                      {project.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-3 font-mono text-sm leading-7 text-[var(--muted)]"
                        >
                          <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </ResumeSection>

            <ResumeSection eyebrow="06" title="Competitions & Hackathons">
              <div className="border border-[var(--rule)] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-sans text-2xl tracking-[-0.02em] text-[var(--fg)]">
                      Smart India Hackathon 2025
                    </h3>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent)]">
                      Selected at university level
                    </p>
                  </div>
                </div>

                <ul className="mt-4 space-y-3">
                  {hackathonBullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 font-mono text-sm leading-7 text-[var(--muted)]"
                    >
                      <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ResumeSection>
          </div>
        </div>
      </div>
    </section>
  );
}
