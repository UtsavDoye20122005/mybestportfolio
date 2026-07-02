export type Project = {
  slug: string;
  title: string;
  issueNumber: string;
  problem: string;
  solution: string;
  result: string;
  stack: string[];
  liveUrl: string;
  githubUrl: string;
  oneLiner: string;
};

export const projects: Project[] = [
  {
    slug: "signal-lab",
    title: "Signal Lab",
    issueNumber: "#001",
    oneLiner: "An alert system I built to cut through noisy sensor data — real-time dashboard with configurable thresholds and PostgreSQL-backed history.",
    problem:
      "Teams needed signals fast, but alerts were noisy, delayed, and hard to trust. There was no single place to validate anomalies end-to-end.",
    solution:
      "Built an ingestion pipeline, rules engine, and a minimal dashboard to investigate events. Added typed contracts, retries, and a clean audit trail for every alert.",
    result:
      "Cut time-to-detect from minutes to seconds, reduced false positives, and made incidents reproducible with an event log.",
    stack: ["NEXT.JS", "TYPESCRIPT", "NODE", "POSTGRES"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example",
  },
  {
    slug: "ops-console",
    title: "Ops Console",
    issueNumber: "#002",
    oneLiner: "Internal dashboard for managing incidents and runbooks — reduced manual triage steps by wiring alerts directly into action flows.",
    problem:
      "Manual ops workflows created bottlenecks: too many tabs, inconsistent runbooks, and slow handoffs during incidents.",
    solution:
      "Built a single console for triage with runbook shortcuts, safe automations, and permissioned actions. Optimized UX for speed and clarity under pressure.",
    result:
      "Shortened incident response loops and standardized workflows across the team.",
    stack: ["REACT", "NODE", "EXPRESS", "DOCKER"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example",
  },
  {
    slug: "quant-notes",
    title: "Quant Notes",
    issueNumber: "#003",
    oneLiner: "A personal research tracker for logging trading strategies, backtest results, and market observations — built because spreadsheets weren't cutting it.",
    problem:
      "Research artifacts were scattered across notebooks and docs, making it hard to compare experiments or reuse results.",
    solution:
      "Built a structured research log with tagging, versioned experiments, and exportable summaries. Designed for fast capture and later retrieval.",
    result:
      "Improved reuse of past research and kept experiments consistent across iterations.",
    stack: ["NEXT.JS", "TAILWIND", "PYTHON", "SQL"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

