export type ChangelogEntry = {
  version: string;
  date: string; // e.g. "Mar 2026"
  description: string;
};

export const changelog: ChangelogEntry[] = [
  { version: "v1.2", date: "Mar 2026", description: "added terminal easter egg" },
  { version: "v1.1", date: "Mar 2026", description: "launched projects section" },
  { version: "v1.0", date: "Mar 2026", description: "shipped portfolio v1" },
];

