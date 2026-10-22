export type Project = {
  slug: string;
  title: string;
  issueNumber: string;
  category: "Product" | "Campus tool" | "Experiment" | "Early build";
  problem: string;
  solution: string;
  result: string;
  stack: string[];
  /** Empty string when there is no public live link. */
  liveUrl: string;
  /** Empty string when there is no public repo. */
  githubUrl: string;
  /** Private projects never show links. */
  isPrivate?: boolean;
  /** Short note shown when a public project has no live link or repo yet. */
  note?: string;
  oneLiner: string;
};

export const PRIVATE_NOTE =
  "This project is private, so I can't share the GitHub or live link.";

const GH = "https://github.com/UtsavDoye20122005";

export const projects: Project[] = [
  {
    slug: "estatedesk",
    title: "EstateDesk",
    issueNumber: "#001",
    category: "Product",
    oneLiner:
      "A 15,000-line sales CRM built for a real estate firm, in daily use by its agents.",
    problem:
      "Leads came in from 99acres, MagicBricks, Housing.com, ads and the website, and buyers waited while agents sorted out who should call them. Call notes and follow-ups lived in people's heads.",
    solution:
      "Pulls leads from every source within seconds, merges duplicates and gives each new lead to the agent with the fewest open leads. After a call, agents speak a voice note in Hindi or English and AI fills in the outcome, budget, next call and site visit. Buyers get home shortlists on WhatsApp, with alerts when they open them.",
    result:
      "In daily use at TrustArc Estates and still growing. Also tracks inventory, deals and commission.",
    stack: ["Next.js", "TypeScript", "Supabase", "Gemini API", "WhatsApp", "Vercel"],
    liveUrl: "",
    githubUrl: "",
    isPrivate: true,
  },
  {
    slug: "jiffythat",
    title: "JiffyThat (FormAgent)",
    issueNumber: "#002",
    category: "Product",
    oneLiner:
      "Say what you need to collect, get back a shareable form. Works with voice, text and Hinglish, and shows answers as charts.",
    problem:
      "A teacher at my college needed a registration form and didn't want to spend twenty minutes dragging fields around in Google Forms.",
    solution:
      "You talk or type, and it writes the questions, picks the right input for each one, sets deadlines from speech, and gives you a link. Multi-page forms, saved half-finished answers, and Postgres rules that refuse late or flooded submissions.",
    result:
      "Live, with Google and email sign-in, private per-user data, workspaces, analytics and Google Sheets export. Tested with 60 people submitting at the same time.",
    stack: ["Next.js", "Supabase", "Claude API", "Google Sheets API", "Vercel"],
    liveUrl: "https://formagent-web.vercel.app",
    githubUrl: `${GH}/formagent`,
  },
  {
    slug: "room-board",
    title: "Campus Room Board",
    issueNumber: "#003",
    category: "Campus tool",
    oneLiner:
      "Classroom and exam room booking for my college campus. Teachers book a room, nobody can double-book it, and students see where to go.",
    problem:
      "Rooms on campus were booked by word of mouth, so two classes could land in the same room and students didn't know where their exam was.",
    solution:
      "Built a day board (hours by rooms) where teachers book free slots, with capacity warnings and one-click room changes that email the affected batches. Double booking is blocked with Firestore transactions on per-slot lock documents.",
    result:
      "One place for teachers to book and students to check their next class, with double bookings impossible by design.",
    stack: ["Next.js", "Firebase Auth", "Firestore", "Tailwind CSS"],
    liveUrl: "https://nst-room-board.vercel.app",
    githubUrl: `${GH}/nst-room-board`,
  },
  {
    slug: "hall-shuffle",
    title: "Hall Shuffle",
    issueNumber: "#004",
    category: "Campus tool",
    oneLiner:
      "Reseats a 368-seat exam hall in one click so no two students from the same year sit together.",
    problem: "Teachers at my college were seating and reshuffling students for every exam by hand.",
    solution:
      "Seating rules are written as constraints (bench pattern, column order, year mix), so one click gives a valid new layout. Student data is passcode-locked, and plans export as PDF or CSV.",
    result: "A job that took teachers hours now takes one click.",
    stack: ["JavaScript", "Constraint logic", "PDF/CSV export"],
    liveUrl: "",
    githubUrl: "",
    isPrivate: true,
  },
  {
    slug: "hazri",
    title: "Hazri",
    issueNumber: "#005",
    category: "Product",
    oneLiner:
      "Face-recognition attendance: one class photo marks everyone present, a second photo flags who left early.",
    problem: "Calling out 60 names takes a chunk of every class, and proxy attendance is easy.",
    solution:
      "The teacher takes one photo of the class. The app finds and matches every face against the class list. A second photo later flags students who left early.",
    result: "Attendance for a class of 60 from a single photo.",
    stack: ["Python", "FastAPI", "React Native", "Face recognition"],
    liveUrl: "",
    githubUrl: "",
    isPrivate: true,
  },
  {
    slug: "hostel-pulse",
    title: "Hostel Pulse",
    issueNumber: "#006",
    category: "Campus tool",
    oneLiner: "A web app for hostel life on my college campus.",
    problem:
      "Hostel updates and issues on campus were scattered across chats and notice boards.",
    solution:
      "Built a web app that gives the hostel one place for students to see what is going on.",
    result: "Deployed on Vercel.",
    stack: ["Next.js", "TypeScript", "Vercel"],
    liveUrl: "",
    githubUrl: "",
    isPrivate: true,
  },
  {
    slug: "pocket-terminal",
    title: "Pocket Terminal",
    issueNumber: "#007",
    category: "Experiment",
    oneLiner:
      "My Mac's terminal on my phone, from any network, even with the lid closed, while using as little battery as possible.",
    problem:
      "I wanted to run commands on my laptop from my phone without leaving it awake all day and draining the battery.",
    solution:
      "The phone and the Mac both connect out to a small relay server, so they work on any Wi-Fi or mobile data. The Mac sleeps on battery, wakes every few minutes to run queued commands, and stops waking below 10% battery.",
    result:
      "A real terminal in the browser with saved commands, a job queue and notifications, that updates itself from GitHub.",
    stack: ["Node.js", "JavaScript", "Oracle Cloud", "macOS"],
    liveUrl: "",
    githubUrl: `${GH}/pocket-terminal`,
    note: "Runs on your own server, so there is no public live link.",
  },
  {
    slug: "reflect-slack-bot",
    title: "Reflect (Slack bot)",
    issueNumber: "#008",
    category: "Product",
    oneLiner:
      "A Slack bot that turns a teacher's two-minute voice note into their written class reflection, using only what they said.",
    problem:
      "Teachers have to write a reflection after every class, which eats time they don't have.",
    solution:
      "Send a short voice note in Slack and the bot writes the reflection from it, without adding anything the teacher didn't say.",
    result: "Lives fully inside Slack. The web link is only a status page.",
    stack: ["Next.js", "TypeScript", "Slack API"],
    liveUrl: "https://reflectbot-slack-ochre.vercel.app",
    githubUrl: `${GH}/reflectbot-slack`,
  },
  {
    slug: "rural-telehealth-connect",
    title: "Rural Telehealth Connect",
    issueNumber: "#009",
    category: "Product",
    oneLiner:
      "AI-powered telemedicine for rural healthcare — symptom triage, offline prescriptions and low-bandwidth consultations. Built at Smart India Hackathon 2025.",
    problem:
      "Rural communities lack reliable digital healthcare and need a system that works on low bandwidth and offline.",
    solution:
      "Designed a hybrid telehealth system with a patient app, an AI health assistant for triage, and a verified doctor network.",
    result:
      "A platform design that makes rural telemedicine more accessible and trustworthy.",
    stack: ["Python", "AI/ML", "Telemedicine"],
    liveUrl: "",
    githubUrl: "",
    isPrivate: true,
  },
  {
    slug: "internship-agent",
    title: "Internship Opportunity Agent",
    issueNumber: "#010",
    category: "Experiment",
    oneLiner:
      "An AI agent that scans internship listings and ranks them against my skills so I only apply to the best fits.",
    problem:
      "Finding internships is slow and repetitive, with dozens of listings to filter by skills and eligibility.",
    solution:
      "An AI screening workflow that checks listings against my profile and puts the best opportunities first.",
    result: "In progress.",
    stack: ["AI", "Automation", "JavaScript"],
    liveUrl: "",
    githubUrl: "",
    note: "Work in progress. The code goes public once it is ready.",
  },
  {
    slug: "adult-customer-filter-system",
    title: "Customer Filter System",
    issueNumber: "#011",
    category: "Early build",
    oneLiner:
      "A Python tool that filters customer data to find target segments by age and other demographics.",
    problem:
      "Customer data was scattered and slow to analyse, so finding the right segment took too long.",
    solution:
      "Built a modular filter that applies conditional rules to demographics and outputs the target segments.",
    result: "Faster segmentation with code that is easy to extend.",
    stack: ["Python"],
    liveUrl: "",
    githubUrl: "",
    isPrivate: true,
  },
];

const FEATURED = [
  "estatedesk",
  "jiffythat",
  "hall-shuffle",
  "hazri",
  "room-board",
  "pocket-terminal",
  "reflect-slack-bot",
]

/** Projects shown in the home-page card deck. */
export const featuredProjects = FEATURED.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}
