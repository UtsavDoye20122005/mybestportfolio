"use client";

const capabilities = [
  {
    title: "Full-stack web apps",
    detail: "Next.js, TypeScript, Supabase and Postgres, from database rules to the UI.",
    proof: "EstateDesk · JiffyThat · Room Board",
  },
  {
    title: "AI features & agents",
    detail: "Claude, OpenAI and Gemini APIs wired into real workflows, like voice notes that fill a CRM.",
    proof: "EstateDesk · JiffyThat · Reflect",
  },
  {
    title: "Data & backend logic",
    detail: "Row-level security, transactions that block double-booking, and constraint-based scheduling.",
    proof: "Hall Shuffle · Room Board · Review Intelligence",
  },
  {
    title: "Mobile & computer vision",
    detail: "React Native app with a FastAPI backend that matches every face in a class photo.",
    proof: "Hazri",
  },
  {
    title: "Integrations",
    detail: "WhatsApp, Google Sheets, Slack and lead portals like 99acres and MagicBricks.",
    proof: "EstateDesk · JiffyThat · Reflect",
  },
  {
    title: "Shipping to real users",
    detail: "Building with the people who use it, then testing under real load.",
    proof: "CRM in daily use · 368-seat hall · 60 people at once",
  },
] as const;

export function TechRadar() {
  return (
    <section aria-label="Capabilities" className="mt-16" data-reveal>
      <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--fg)]">Capabilities</h2>
      <div className="mt-4 grid grid-cols-1 border-l border-t border-[var(--rule)]">
        {capabilities.map((c, i) => (
          <div
            key={c.title}
            className="border-r border-b border-[var(--rule)] px-4 py-4 transition-colors hover:bg-[var(--subtle-bg)]"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-mono text-sm text-[var(--fg)]">{c.title}</h3>
            </div>
            <p className="mt-2 font-mono text-[13px] leading-6 text-[var(--muted)]">{c.detail}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Seen in: <span className="text-[var(--fg)]">{c.proof}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
