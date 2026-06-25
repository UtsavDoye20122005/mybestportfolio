import { randomUUID } from "node:crypto";
import type { ContactPayload, ContactSubmission, GithubProfile, LeadBucket, LeadPriority } from "./types";

const typeLabels: Record<string, string> = {
  "HIRE ME": "Hire Me",
  FREELANCE: "Freelance",
  COLLAB: "Collaboration",
  "JUST SAYING HI": "Just Saying Hi",
};

function clean(value?: string) {
  return value?.trim() || "";
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(value);
}

function buildSummary(noteEnglish: string, noteOriginal: string, typeLabel: string) {
  const source = noteEnglish || noteOriginal || typeLabel;
  if (source.length <= 160) {
    return source;
  }

  return `${source.slice(0, 157)}...`;
}

function getEmailDomain(email: string) {
  const [, domain = ""] = email.split("@");
  return domain.toLowerCase();
}

function getWebsiteHost(rawWebsite: string) {
  if (!rawWebsite) {
    return "";
  }

  const candidate = rawWebsite.startsWith("http://") || rawWebsite.startsWith("https://")
    ? rawWebsite
    : `https://${rawWebsite}`;

  try {
    return new URL(candidate).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function getGithubUsername(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const direct = trimmed.replace(/^@/, "");
  if (!direct.includes("/")) {
    return direct;
  }

  const match = direct.match(/github\.com\/([^/?#]+)/i);
  return match?.[1] || "";
}

function getBucket(type: string): LeadBucket {
  if (type === "HIRE ME") return "hire";
  if (type === "FREELANCE") return "freelance";
  if (type === "COLLAB") return "collaboration";
  return "general";
}

function getBaseScore(type: string) {
  if (type === "HIRE ME") return 48;
  if (type === "FREELANCE") return 40;
  if (type === "COLLAB") return 28;
  return 16;
}

function getBudgetScore(budget: string) {
  if (budget === "1L+") return 16;
  if (budget === "₹50K-1L") return 12;
  if (budget === "₹10K-50K") return 8;
  if (budget === "< ₹10K") return 4;
  if (budget === "LET'S TALK") return 6;
  return 0;
}

function getPriority(score: number): LeadPriority {
  if (score >= 65) return "high";
  if (score >= 38) return "medium";
  return "low";
}

function buildSegmentation(input: {
  type: string;
  budget: string;
  company: string;
  github: string;
  linkedin: string;
  website: string;
  noteEnglish: string;
  noteOriginal: string;
  language: string;
  emailDomain: string;
}) {
  const tags = new Set<string>();
  const bucket = getBucket(input.type);

  tags.add(bucket);

  if (input.company) {
    tags.add(/college|university|school|institute/i.test(input.company) ? "student" : "organization");
  }

  if (input.github) {
    tags.add("github-shared");
  }

  if (input.linkedin) {
    tags.add("linkedin-shared");
  }

  if (input.website) {
    tags.add("website-shared");
  }

  if (input.language && !input.language.startsWith("English")) {
    tags.add("translated-note");
  }

  if (input.noteOriginal && input.noteEnglish && input.noteOriginal !== input.noteEnglish) {
    tags.add("voice-or-translated-note");
  }

  if (!input.noteEnglish && !input.noteOriginal) {
    tags.add("no-note");
  }

  if (input.emailDomain && !/(gmail|outlook|hotmail|yahoo|icloud)\./i.test(input.emailDomain)) {
    tags.add("work-email");
  }

  if (input.budget) {
    tags.add(`budget:${input.budget}`);
  }

  let score = getBaseScore(input.type);
  score += getBudgetScore(input.budget);
  score += input.company ? 8 : 0;
  score += input.website ? 7 : 0;
  score += input.github ? 6 : 0;
  score += input.linkedin ? 5 : 0;
  score += input.noteEnglish.length >= 80 ? 8 : input.noteEnglish.length >= 25 ? 4 : 0;
  score += input.noteOriginal.length >= 80 ? 4 : 0;
  score += input.emailDomain && tags.has("work-email") ? 6 : 0;

  const completeness = [
    input.company,
    input.github,
    input.linkedin,
    input.website,
    input.budget,
    input.noteEnglish || input.noteOriginal,
  ].filter(Boolean).length;

  return {
    bucket,
    priority: getPriority(score),
    score,
    completeness,
    tags: Array.from(tags),
  };
}

async function enrichGithubProfile(username: string) {
  if (!username) {
    return null;
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "utsav-portfolio-contact-backend",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      html_url?: string;
      public_repos?: number;
      followers?: number;
      following?: number;
      company?: string;
      location?: string;
      bio?: string;
      blog?: string;
      login?: string;
    };

    const profile: GithubProfile = {
      username: payload.login || username,
      profileUrl: payload.html_url || `https://github.com/${username}`,
      publicRepos: payload.public_repos ?? null,
      followers: payload.followers ?? null,
      following: payload.following ?? null,
      company: payload.company || "",
      location: payload.location || "",
      bio: payload.bio || "",
      blog: payload.blog || "",
    };

    return profile;
  } catch {
    return null;
  }
}

export function validateContactPayload(payload: ContactPayload) {
  const name = clean(payload.name);
  const email = clean(payload.email);
  const type = clean(payload.type);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name) {
    return { ok: false as const, error: "Name is required" };
  }

  if (!emailValid) {
    return { ok: false as const, error: "Valid email is required" };
  }

  if (!type) {
    return { ok: false as const, error: "Contact type is required" };
  }

  return { ok: true as const };
}

export async function buildContactSubmission(payload: ContactPayload, request: Request) {
  const type = clean(payload.type) || "GENERAL";
  const typeLabel = typeLabels[type] || type;
  const email = clean(payload.email);
  const emailDomain = getEmailDomain(email);
  const github = clean(payload.github);
  const website = clean(payload.website);
  const githubUsername = getGithubUsername(github);

  const noteEnglish = clean(payload.noteEnglish);
  const noteOriginal = clean(payload.noteOriginal);

  const segmentation = buildSegmentation({
    type,
    budget: clean(payload.budget),
    company: clean(payload.company),
    github,
    linkedin: clean(payload.linkedin),
    website,
    noteEnglish,
    noteOriginal,
    language: clean(payload.language),
    emailDomain,
  });

  const submission: ContactSubmission = {
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    type,
    typeLabel,
    name: clean(payload.name),
    email,
    emailDomain,
    phone: clean(payload.phone),
    company: clean(payload.company),
    github,
    githubUsername,
    linkedin: clean(payload.linkedin),
    website,
    budget: clean(payload.budget),
    noteEnglish,
    noteOriginal,
    language: clean(payload.language),
    summary: buildSummary(noteEnglish, noteOriginal, typeLabel),
    segmentation,
    enrichment: {
      websiteHost: getWebsiteHost(website),
      githubProfile: await enrichGithubProfile(githubUsername),
    },
    meta: {
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "",
      userAgent: request.headers.get("user-agent") || "",
      referrer: request.headers.get("referer") || "",
      origin: request.headers.get("origin") || "",
    },
  };

  return submission;
}

export function buildContactEmailLines(submission: ContactSubmission) {
  const lines = [
    "-----------------------------",
    "NEW MESSAGE - UTSAV.DEV",
    "-----------------------------",
    `TYPE:      ${submission.typeLabel}`,
    `PRIORITY:  ${submission.segmentation.priority.toUpperCase()}`,
    `SEGMENT:   ${submission.segmentation.bucket}`,
    `SCORE:     ${submission.segmentation.score}`,
    `NAME:      ${submission.name}`,
    `EMAIL:     ${submission.email}`,
  ];

  if (submission.phone) lines.push(`PHONE:     ${submission.phone}`);
  if (submission.company) lines.push(`COMPANY:   ${submission.company}`);
  if (submission.github) lines.push(`GITHUB:    ${submission.github}`);
  if (submission.linkedin) lines.push(`LINKEDIN:  ${submission.linkedin}`);
  if (submission.website) lines.push(`WEBSITE:   ${submission.website}`);
  if (submission.budget) lines.push(`BUDGET:    ${submission.budget}`);
  if (submission.segmentation.tags.length) {
    lines.push(`TAGS:      ${submission.segmentation.tags.join(", ")}`);
  }

  lines.push("");
  lines.push("NOTE (ENGLISH):");
  lines.push(submission.noteEnglish || "(none)");
  lines.push("");
  lines.push("NOTE (ORIGINAL):");
  lines.push(submission.noteOriginal || "(none)");

  if (submission.language) {
    lines.push("");
    lines.push(`LANGUAGE:  ${submission.language}`);
  }

  if (submission.enrichment.githubProfile) {
    lines.push("");
    lines.push("GITHUB ENRICHMENT:");
    lines.push(`PROFILE:   ${submission.enrichment.githubProfile.profileUrl}`);
    lines.push(
      `STATS:     ${submission.enrichment.githubProfile.publicRepos ?? "?"} repos / ${submission.enrichment.githubProfile.followers ?? "?"} followers`
    );
    if (submission.enrichment.githubProfile.bio) {
      lines.push(`BIO:       ${submission.enrichment.githubProfile.bio}`);
    }
  }

  lines.push("");
  lines.push(`RECEIVED:  ${formatDate(new Date(submission.receivedAt))} IST`);
  lines.push(`RECORD ID: ${submission.id}`);
  lines.push("-----------------------------");

  return lines;
}
