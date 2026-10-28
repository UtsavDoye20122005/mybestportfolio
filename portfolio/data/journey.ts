/**
 * The Journey page reads everything from here.
 * Add a milestone = add an object. Order inside a phase = order on the page.
 * `project` links the card to /projects/<slug> (must match data/projects.ts).
 */

export type MilestoneKind = "build" | "learn" | "lead" | "win";

export type Milestone = {
  date: string; // shown as-is, e.g. "Sep 2026"
  kind: MilestoneKind;
  title: string;
  detail: string;
  project?: string;
  highlight?: boolean;
};

export type Phase = {
  id: string;
  label: string;
  years: string;
  summary: string;
  status: "done" | "now" | "next";
  milestones: Milestone[];
};

export const KIND_LABELS: Record<MilestoneKind, string> = {
  build: "Build",
  learn: "Learn",
  lead: "Lead",
  win: "Win",
};

export const journey: Phase[] = [
  {
    id: "spark",
    label: "The spark",
    years: "2020",
    summary: "Small browser games. The first time code did what I told it to.",
    status: "done",
    milestones: [
      {
        date: "Sep 2020",
        kind: "learn",
        title: "First lines of code",
        detail:
          "Made a GitHub account and built tiny JavaScript games: a T-Rex runner, Ping Pong and a collision-detection demo.",
      },
    ],
  },
  {
    id: "foundations",
    label: "Foundations",
    years: "2025 – early 2026",
    summary: "Started a CS degree and learned how the web works, one page at a time.",
    status: "done",
    milestones: [
      {
        date: "2025",
        kind: "learn",
        title: "Started B.Tech in CS (AI/ML)",
        detail: "Four-year Computer Science degree in Bengaluru, specialising in AI and Machine Learning.",
      },
      {
        date: "2025",
        kind: "win",
        title: "Smart India Hackathon 2025",
        detail:
          "Selected at university level with Rural Telehealth Connect, an AI health-check tool for patients in villages with weak internet.",
        project: "rural-telehealth-connect",
      },
      {
        date: "Feb 2026",
        kind: "build",
        title: "First real websites",
        detail: "Went from plain HTML and CSS to React, Vite and Tailwind, and turned a Figma design into code.",
      },
      {
        date: "Mar 2026",
        kind: "build",
        title: "Portfolio v1",
        detail: "Put everything I was learning in one place. Rebuilt it in Next.js by June.",
      },
    ],
  },
  {
    id: "shipping",
    label: "Shipping to real users",
    years: "2026",
    summary: "Stopped making demos. Started fixing problems people around me actually had.",
    status: "done",
    milestones: [
      {
        date: "2026",
        kind: "lead",
        title: "Team Leader, AIESEC in Bengaluru",
        detail:
          "Lead a team handling outreach, onboarding and sales for international exchange programmes. Also run CSR remotely for AIESEC United States East.",
      },
      {
        date: "2026",
        kind: "win",
        title: "HPAIR Asia Conference, Hanoi",
        detail: "Selected as a delegate to the Harvard Project for Asian and International Relations conference.",
      },
      {
        date: "Sep 2026",
        kind: "build",
        title: "Campus Room Board",
        detail: "Room booking for classes and exams where double-booking is impossible by design.",
        project: "room-board",
      },
      {
        date: "Sep 2026",
        kind: "build",
        title: "JiffyThat",
        detail: "Say what you need, get a shareable form. Tested with 60 people submitting at the same time.",
        project: "jiffythat",
      },
      {
        date: "Sep 2026",
        kind: "build",
        title: "Hall Shuffle",
        detail: "Reseats a 368-seat exam hall in one click — a job teachers used to do by hand.",
        project: "hall-shuffle",
      },
      {
        date: "Sep 2026",
        kind: "build",
        title: "Hazri",
        detail: "One class photo marks attendance for 60 students using face recognition.",
        project: "hazri",
      },
      {
        date: "Sep 2026",
        kind: "win",
        title: "Apple Developer Academy",
        detail: "Cleared document screening for the Indonesia Cohort 2027 and was invited to the entry test.",
      },
      {
        date: "Oct 2026",
        kind: "build",
        title: "EstateDesk goes live",
        detail:
          "A 15,000-line sales CRM a real estate firm's agents now use every day: leads from every portal, AI call notes, WhatsApp shortlists.",
        project: "estatedesk",
        highlight: true,
      },
    ],
  },
  {
    id: "now",
    label: "Right now",
    years: "Late 2026",
    summary: "Going deeper instead of wider.",
    status: "now",
    milestones: [
      {
        date: "Now",
        kind: "build",
        title: "Growing EstateDesk",
        detail: "Shipping new features as the sales team uses it, and getting it ready for other agencies.",
        project: "estatedesk",
      },
      {
        date: "Now",
        kind: "learn",
        title: "ML fundamentals and DSA, daily",
        detail: "Machine learning properly, plus data structures and algorithms every morning.",
      },
    ],
  },
  {
    id: "next",
    label: "What's next",
    years: "2027 →",
    summary: "The plan. Dates are targets, not promises.",
    status: "next",
    milestones: [
      {
        date: "Jan 2027",
        kind: "learn",
        title: "Train my own model",
        detail: "Fine-tune a small open model on one task and compare it fairly with GPT and Claude.",
      },
      {
        date: "Mar 2027",
        kind: "build",
        title: "Open-source contributions",
        detail: "Get code merged into a well-known AI open-source project.",
      },
      {
        date: "Jul 2027",
        kind: "win",
        title: "Internship, July – December",
        detail: "Looking for a full-time internship at a strong product or AI company. Open to India and abroad.",
        highlight: true,
      },
      {
        date: "Later",
        kind: "build",
        title: "Build a company",
        detail: "Turn the things I build into a business that lasts.",
      },
    ],
  },
];
