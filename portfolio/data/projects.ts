export type Project = {
  slug: string;
  title: string;
  issueNumber: string;
  category: "Product" | "Campus tool" | "Client site" | "Experiment" | "Early build";
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
    slug: "realty-crm",
    title: "Realty CRM",
    issueNumber: "#001",
    category: "Product",
    oneLiner:
      "A lead-management CRM for real-estate agents, built around the daily problems of a working agent.",
    problem:
      "Real-estate agents track leads, site visits and property inventory across notebooks, WhatsApp and spreadsheets. Leads go cold because nobody remembers to follow up.",
    solution:
      "Built a CRM that keeps every lead, follow-up and property in one place, and pulls inventory straight from a live Google Sheet link that stays in sync.",
    result:
      "Deployed and being shaped with a real agent's office. Next step: daily use there, then selling it to other agents.",
    stack: ["Next.js", "TypeScript", "Google Sheets sync", "Vercel"],
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
      "Live, with accounts and charts, and built to hold up when a whole class submits at once on one Wi-Fi.",
    stack: ["Next.js", "Supabase", "Postgres", "Groq", "Vercel"],
    liveUrl: "https://formagent-web.vercel.app",
    githubUrl: `${GH}/formagent`,
  },
  {
    slug: "nst-room-board",
    title: "NST Room Board",
    issueNumber: "#003",
    category: "Campus tool",
    oneLiner:
      "Classroom and exam room booking for the NST campus. Teachers book a room, nobody can double-book it, and students see where to go.",
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
    slug: "nst-exam-seating",
    title: "NST Exam Seating",
    issueNumber: "#004",
    category: "Campus tool",
    oneLiner:
      "Reshuffles exam seating in one click while following the college's bench rules, and exports the plan as a PDF.",
    problem:
      "Teachers at my college were seating and reshuffling students for every exam by hand.",
    solution:
      "Load the hall layout, press Shuffle, and it reseats everyone following the junior-senior bench rules. Highlight by year, edit seats, and download the plan as a PDF. Real seating is locked behind a passcode.",
    result:
      "Turns a slow manual job into a few clicks, without putting student data on the open web.",
    stack: ["JavaScript", "PDF export", "Vercel"],
    liveUrl: "",
    githubUrl: "",
    isPrivate: true,
  },
  {
    slug: "nst-hostel-pulse",
    title: "NST Hostel Pulse",
    issueNumber: "#005",
    category: "Campus tool",
    oneLiner: "A web app for hostel life on the NST campus.",
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
    issueNumber: "#006",
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
    issueNumber: "#007",
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
    slug: "gulmohar-kitchen",
    title: "Gulmohar Kitchen",
    issueNumber: "#008",
    category: "Client site",
    oneLiner:
      "Restaurant website for a North Indian and Continental dining room in Nashik, with menu and table reservations.",
    problem:
      "Small restaurants need a fast site with the menu, hours and a booking form, not a slow template.",
    solution:
      "Built a reusable site where all text, prices and images live in typed content files, so it can be rebranded for a new client without touching the code.",
    result: "A proof-of-work site for restaurant clients.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Zod"],
    liveUrl: "https://gulmohar-kitchen.vercel.app",
    githubUrl: `${GH}/gulmohar-kitchen`,
  },
  {
    slug: "sushrut-dental",
    title: "Sushrut Dental",
    issueNumber: "#009",
    category: "Client site",
    oneLiner:
      "Website for a specialist dental clinic in Indore, with treatments, doctors and appointment booking.",
    problem: "Clinics lose patients when their site is slow or makes booking hard.",
    solution:
      "Built a clean clinic site with a validated booking form and all content in typed files, ready to swap in a real clinic.",
    result: "A proof-of-work site for healthcare clients.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Zod"],
    liveUrl: "https://sushrut-dental.vercel.app",
    githubUrl: `${GH}/sushrut-dental`,
  },
  {
    slug: "pragati-classes",
    title: "Pragati Classes",
    issueNumber: "#010",
    category: "Client site",
    oneLiner:
      "Website for a JEE, NEET and Foundation coaching institute in Patna, with courses, fees, faculty and results.",
    problem:
      "Parents compare coaching institutes online and need courses, fees and results in one clear place.",
    solution:
      "Built a site with course comparison, syllabus, batch dates and an enquiry form, all driven from content files.",
    result: "A proof-of-work site for coaching-institute clients.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Zod"],
    liveUrl: "https://pragati-classes.vercel.app",
    githubUrl: `${GH}/pragati-classes`,
  },
  {
    slug: "aadhar-realty",
    title: "Aadhar Realty",
    issueNumber: "#011",
    category: "Client site",
    oneLiner:
      "Website for a real-estate agency in Lucknow that shows homes along with their paperwork.",
    problem: "Home buyers don't trust listings that hide the legal details.",
    solution:
      "Built a listings site that puts the documents next to each property, with all content in typed files.",
    result: "A proof-of-work site for real-estate clients.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://aadhar-realty.vercel.app",
    githubUrl: `${GH}/aadhar-realty`,
  },
  {
    slug: "ironhouse-jaipur",
    title: "Ironhouse Strength Co.",
    issueNumber: "#012",
    category: "Client site",
    oneLiner: "Website for a strength-training gym in Vaishali Nagar, Jaipur.",
    problem: "Local gyms need a site that shows coaching, plans and location quickly.",
    solution:
      "Built a bold gym site with plans, coaches and a map, with all content in typed files so it can be rebranded.",
    result: "A proof-of-work site for fitness clients.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://ironhouse-jaipur.vercel.app",
    githubUrl: `${GH}/ironhouse-jaipur`,
  },
  {
    slug: "nebula-gallery",
    title: "Nebula Gallery",
    issueNumber: "#013",
    category: "Experiment",
    oneLiner:
      "An infinite cosmic canvas built with vanilla HTML/CSS/JS — mood-filtered artwork, auto-tour mode, generative ambience, and visitor submissions.",
    problem:
      "Static grid galleries felt stale. The goal was a free-form space that feels like exploring a digital nebula instead of clicking through cards.",
    solution:
      "Built an explorable pan-and-zoom canvas, mood-based filtering, ambient generative soundscapes, and a submission flow so visitors can add their own artwork.",
    result:
      "A unique gallery experience with no framework overhead and discovery through motion, mood and sound.",
    stack: ["HTML5", "CSS3", "Vanilla JavaScript"],
    liveUrl: "https://art-gallery-phi-beryl.vercel.app",
    githubUrl: `${GH}/Art-gallery`,
  },
  {
    slug: "prime-ledger",
    title: "Prime Ledger",
    issueNumber: "#014",
    category: "Experiment",
    oneLiner:
      "A React + Vite case-study site that presents business results in a clean dark-mode interface.",
    problem:
      "Business success stories were hard to scan and had no clear structure for decision-makers.",
    solution:
      "Built a Tailwind React/Vite app with a case-study layout, consistent dark UI, and component-based pages for fast loads.",
    result: "A clean, easy-to-scan site that keeps visitors focused on impact.",
    stack: ["React", "Vite", "Tailwind CSS", "JavaScript"],
    liveUrl: "https://prime-ledger-2-t2cb.vercel.app",
    githubUrl: `${GH}/Prime-ledger-2`,
  },
  {
    slug: "senparis",
    title: "Senparis",
    issueNumber: "#015",
    category: "Experiment",
    oneLiner:
      "A luxury fashion brand site taken from Figma to production with React, TypeScript and Vite.",
    problem:
      "High-end brand designs need pixel-perfect translation and code that stays easy to maintain.",
    solution:
      "Turned a detailed Figma design into a type-safe React codebase with refined typography and reusable components.",
    result: "A production-ready fashion site that stays true to the design.",
    stack: ["React", "TypeScript", "Vite", "CSS"],
    liveUrl: "https://senparis-seven.vercel.app",
    githubUrl: `${GH}/senparis`,
  },
  {
    slug: "rural-telehealth-connect",
    title: "Rural Telehealth Connect",
    issueNumber: "#016",
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
    issueNumber: "#017",
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
    issueNumber: "#018",
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
  {
    slug: "phantom-strike",
    title: "Phantom Strike",
    issueNumber: "#019",
    category: "Early build",
    oneLiner:
      "My first-semester project: a multi-page landing site for a tactical FPS game, with agents, stats and a store.",
    problem: "First-semester brief: build a complete multi-page website with plain HTML and CSS.",
    solution:
      "Built five linked pages (home, agents, stats, store, contact) with a game-style visual theme.",
    result: "My first fully deployed multi-page site.",
    stack: ["HTML5", "CSS3"],
    liveUrl: "https://first-semester-project-navy.vercel.app",
    githubUrl: `${GH}/First-semester-project-`,
  },
  {
    slug: "tip-calculator",
    title: "Tip Calculator",
    issueNumber: "#020",
    category: "Early build",
    oneLiner: "A small tip and bill-split calculator in vanilla JavaScript.",
    problem: "Working out the tip and each person's share quickly at the table.",
    solution: "Enter the bill, tip percent and number of people; it shows the tip and the amount per person.",
    result: "A simple, fast utility and an early JavaScript practice project.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    liveUrl: "https://tip-calculator-hazel-iota.vercel.app",
    githubUrl: `${GH}/Tip-calculator`,
  },
];

const FEATURED = [
  "realty-crm",
  "jiffythat",
  "nst-room-board",
  "nst-exam-seating",
  "pocket-terminal",
  "reflect-slack-bot",
  "gulmohar-kitchen",
  "nebula-gallery",
];

/** Projects shown in the home-page card deck. */
export const featuredProjects = FEATURED.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}
