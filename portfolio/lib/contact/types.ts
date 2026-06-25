export type ContactPayload = {
  name?: string;
  email?: string;
  type?: string;
  phone?: string;
  company?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  budget?: string;
  noteEnglish?: string;
  noteOriginal?: string;
  language?: string;
};

export type LeadBucket = "hire" | "freelance" | "collaboration" | "general";

export type LeadPriority = "high" | "medium" | "low";

export type ContactSubmission = {
  id: string;
  receivedAt: string;
  type: string;
  typeLabel: string;
  name: string;
  email: string;
  emailDomain: string;
  phone: string;
  company: string;
  github: string;
  githubUsername: string;
  linkedin: string;
  website: string;
  budget: string;
  noteEnglish: string;
  noteOriginal: string;
  language: string;
  summary: string;
  segmentation: {
    bucket: LeadBucket;
    priority: LeadPriority;
    score: number;
    completeness: number;
    tags: string[];
  };
  enrichment: {
    websiteHost: string;
    githubProfile: GithubProfile | null;
  };
  meta: {
    ip: string;
    userAgent: string;
    referrer: string;
    origin: string;
  };
};

export type GithubProfile = {
  username: string;
  profileUrl: string;
  publicRepos: number | null;
  followers: number | null;
  following: number | null;
  company: string;
  location: string;
  bio: string;
  blog: string;
};
