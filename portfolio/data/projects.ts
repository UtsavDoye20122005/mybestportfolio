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
    slug: "nebula-gallery",
    title: "Nebula Gallery",
    issueNumber: "#001",
    oneLiner:
      "An infinite cosmic canvas built with vanilla HTML/CSS/JS — mood-filtered artwork, auto-tour mode, generative ambience, and visitor submissions.",
    problem:
      "Static grid galleries felt stale. The goal was a free-form spatial experience that feels like exploring a digital nebula instead of clicking through cards.",
    solution:
      "Built an explorable pan-and-zoom canvas, mood-based filtering, ambient generative soundscapes, and a submission flow so visitors can add their own artwork.",
    result:
      "Delivered a unique art-gallery experience with minimal framework overhead and immersive discovery through motion, mood, and sound.",
    stack: ["HTML5", "CSS3", "Vanilla JavaScript"],
    liveUrl: "https://art-gallery-phi-beryl.vercel.app/",
    githubUrl: "https://github.com/UtsavDoye20122005/Art-gallery",
  },
  {
    slug: "prime-ledger",
    title: "Prime Ledger",
    issueNumber: "#002",
    oneLiner:
      "A React + Vite case-study platform that presents measurable business outcomes in a polished dark-mode interface.",
    problem:
      "Business success stories were hard to scan and lacked a structured format for decision-makers. The site needed clarity, speed, and a modern feel.",
    solution:
      "Built a Tailwind-powered React/Vite app with a case-study driven layout, consistent dark-mode UI, and component-based pages for fast load times.",
    result:
      "Created a clean, easy-to-scan experience that highlights real results and keeps visitors focused on impact.",
    stack: ["React", "Vite", "Tailwind CSS", "JavaScript", "ESLint"],
    liveUrl: "https://prime-ledger-2-t2cb.vercel.app/",
    githubUrl: "https://github.com/UtsavDoye20122005/Prime-ledger-2",
  },
  {
    slug: "senparis",
    title: "Senparis",
    issueNumber: "#003",
    oneLiner:
      "A luxury fashion brand experience built from Figma to production with React, TypeScript, and Vite.",
    problem:
      "High-end brand designs require pixel-perfect translation and scalable code. The challenge was preserving editorial elegance in a maintainable front-end build.",
    solution:
      "Translated a complex Figma system into a type-safe React codebase with clean layout, refined typography, and scalable visual components.",
    result:
      "Delivered a luxe, production-ready fashion site with strong visual fidelity and modern tooling.",
    stack: ["React", "TypeScript", "Vite", "CSS"],
    liveUrl: "https://senparis-seven.vercel.app/",
    githubUrl: "https://github.com/UtsavDoye20122005/senparis",
  },
  {
    slug: "rural-telehealth-connect",
    title: "Rural Telehealth Connect",
    issueNumber: "WORKING",
    oneLiner:
      "AI-powered telemedicine for rural healthcare — symptom triage, offline prescriptions, and low-bandwidth consultations.",
    problem:
      "Rural communities lacked reliable digital healthcare access and needed a system that worked on low bandwidth with offline-ready workflows.",
    solution:
      "Built a hybrid telehealth ecosystem with a patient app, AI health assistant, and verified doctor network to bridge rural and urban care.",
    result:
      "Designed a platform that supports rural telemedicine with better accessibility, continuity, and trust.",
    stack: ["Python", "AI/ML", "Telemedicine"],
    liveUrl: "",
    githubUrl: "https://github.com/UtsavDoye20122005",
  },
  {
    slug: "adult-customer-filter-system",
    title: "Adult Customer Filter System",
    issueNumber: "WORKING",
    oneLiner:
      "A data filter system that identifies customer segments and target demographics with efficient, modular Python logic.",
    problem:
      "Customer data was scattered and slow to analyze, making it difficult to find high-value segments and insights.",
    solution:
      "Built a modular filtering app to process demographics, apply conditional rules, and surface target segments for rapid decision-making.",
    result:
      "Enabled smarter customer segmentation with a maintainable system for future enhancements.",
    stack: ["Python"],
    liveUrl: "",
    githubUrl: "https://github.com/UtsavDoye20122005",
  },
  {
    slug: "internship-agent",
    title: "Internship Opportunity Agent",
    issueNumber: "#006",
    oneLiner:
      "An AI agent that scans internship listings, matches them to your skills, and applies automatically to the best fits.",
    problem:
      "Finding internships is time-consuming and repetitive, with dozens of listings to filter by skills, interests, and eligibility.",
    solution:
      "Built an AI-powered screening workflow that evaluates listings against your profile, prioritizes the best opportunities, and automates applications.",
    result:
      "Saved hours of manual search and improved the quality of internship submissions with data-driven matching.",
    stack: ["AI", "Automation", "JavaScript"],
    liveUrl: "",
    githubUrl: "https://github.com/UtsavDoye20122005",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

