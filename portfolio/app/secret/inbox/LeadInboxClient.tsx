"use client";

import { useCallback, useDeferredValue, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ContactSubmission, LeadBucket, LeadPriority } from "@/lib/contact/types";

type DashboardResponse = {
  admin: {
    username: string;
  };
  summary: {
    total: number;
    byBucket: Record<LeadBucket, number>;
    byPriority: Record<LeadPriority, number>;
    topTags: Array<{ tag: string; count: number }>;
  };
  submissions: ContactSubmission[];
};

type BucketFilter = LeadBucket | "all";
type PriorityFilter = LeadPriority | "all";

const bucketOrder: LeadBucket[] = ["hire", "freelance", "collaboration", "general"];

const bucketMeta: Record<
  LeadBucket,
  {
    label: string;
    tone: string;
    empty: string;
  }
> = {
  hire: {
    label: "Hire Leads",
    tone: "text-[#e8ff00]",
    empty: "No hire leads match the current filters.",
  },
  freelance: {
    label: "Freelance Leads",
    tone: "text-[#7dd3fc]",
    empty: "No freelance leads match the current filters.",
  },
  collaboration: {
    label: "Collaboration Leads",
    tone: "text-[#fca5a5]",
    empty: "No collaboration leads match the current filters.",
  },
  general: {
    label: "General Messages",
    tone: "text-[#c4b5fd]",
    empty: "No general messages match the current filters.",
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-[var(--rule)] bg-black/20 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">{label}</p>
      <p className="mt-3 font-sans text-3xl tracking-[-0.04em]">{value}</p>
    </div>
  );
}

export default function LeadInboxClient({ adminUsername }: { adminUsername: string }) {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [bucket, setBucket] = useState<BucketFilter>("all");
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const [loggingOut, setLoggingOut] = useState(false);

  const deferredSearch = useDeferredValue(search);

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/contact/submissions", {
        credentials: "include",
      });

      const json = (await response.json()) as DashboardResponse & { error?: string };
      if (response.status === 401) {
        router.replace("/secret/inbox/login");
        return;
      }

      if (!response.ok) {
        throw new Error(json.error || "Could not load submissions");
      }

      setDashboard(json);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load submissions");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadSubmissions();
  }, [loadSubmissions]);

  const visibleSubmissions = (dashboard?.submissions || []).filter((submission) => {
    const matchesBucket = bucket === "all" || submission.segmentation.bucket === bucket;
    const matchesPriority = priority === "all" || submission.segmentation.priority === priority;
    const haystack = [
      submission.name,
      submission.email,
      submission.company,
      submission.summary,
      submission.segmentation.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase();
    const matchesSearch = !deferredSearch.trim() || haystack.includes(deferredSearch.toLowerCase());
    return matchesBucket && matchesPriority && matchesSearch;
  });

  const groupedSubmissions = bucketOrder.map((currentBucket) => ({
    bucket: currentBucket,
    items: visibleSubmissions.filter((submission) => submission.segmentation.bucket === currentBucket),
  }));

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } finally {
      router.replace("/secret/inbox/login");
      router.refresh();
    }
  }

  return (
    <div className="grid gap-8">
      <section className="rounded-md border border-[var(--rule)] bg-black/20 p-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
              Lead Vault
            </p>
            <h2 className="mt-3 font-sans text-3xl tracking-[-0.03em] sm:text-4xl">
              Review every submission in one place.
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[var(--muted)]">
              Signed in as {adminUsername}. This dashboard reads your backend store, groups leads,
              and shows any GitHub enrichment captured during submission.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void loadSubmissions()}
              disabled={loading}
              className="border border-[var(--accent)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Loading" : "Refresh"}
            </button>
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              className="border border-[var(--rule)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--muted)] transition-colors hover:border-[#ff6b6b] hover:text-[#ff6b6b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loggingOut ? "Signing out" : "Logout"}
            </button>
          </div>
        </div>
      </section>

      {error ? (
        <section className="rounded-md border border-[#ff6b6b]/40 bg-[#2a1010] px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ff9d9d]">{error}</p>
        </section>
      ) : null}

      {dashboard ? (
        <>
          <section className="grid gap-4 md:grid-cols-4">
            <StatCard label="Total" value={dashboard.summary.total} />
            <StatCard label="High Priority" value={dashboard.summary.byPriority.high} />
            <StatCard label="Hire Leads" value={dashboard.summary.byBucket.hire} />
            <StatCard label="Freelance Leads" value={dashboard.summary.byBucket.freelance} />
          </section>

          <section className="grid gap-4 rounded-md border border-[var(--rule)] bg-black/20 p-5 md:grid-cols-[minmax(0,1fr)_180px_180px]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="border border-[var(--rule)] bg-transparent px-4 py-3 font-mono text-sm outline-none focus:border-[var(--accent)]"
              placeholder="Search by name, email, company, note, tag"
            />
            <select
              value={bucket}
              onChange={(event) => setBucket(event.target.value as BucketFilter)}
              className="border border-[var(--rule)] bg-[var(--bg)] px-4 py-3 font-mono text-sm outline-none focus:border-[var(--accent)]"
            >
              <option value="all">All buckets</option>
              <option value="hire">Hire</option>
              <option value="freelance">Freelance</option>
              <option value="collaboration">Collaboration</option>
              <option value="general">General</option>
            </select>
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value as PriorityFilter)}
              className="border border-[var(--rule)] bg-[var(--bg)] px-4 py-3 font-mono text-sm outline-none focus:border-[var(--accent)]"
            >
              <option value="all">All priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </section>

          <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
            <div className="grid gap-6">
              {groupedSubmissions.map(({ bucket: currentBucket, items }) => (
                <section
                  key={currentBucket}
                  className="rounded-md border border-[var(--rule)] bg-black/20 p-5"
                >
                  <div className="flex flex-col gap-2 border-b border-[var(--rule)] pb-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p
                        className={`font-mono text-[10px] uppercase tracking-[0.24em] ${bucketMeta[currentBucket].tone}`}
                      >
                        {bucketMeta[currentBucket].label}
                      </p>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        {items.length} {items.length === 1 ? "submission" : "submissions"}
                      </p>
                    </div>
                  </div>

                  {items.length ? (
                    <div className="mt-4 grid gap-4">
                      {items.map((submission) => (
                        <article
                          key={submission.id}
                          className="rounded-md border border-[var(--rule)] bg-black/10 p-5"
                        >
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
                                {submission.typeLabel} / {submission.segmentation.priority}
                              </p>
                              <h3 className="mt-2 font-sans text-2xl tracking-[-0.03em]">
                                {submission.name}
                              </h3>
                              <p className="mt-2 text-sm text-[var(--muted)]">
                                {submission.email}
                                {submission.company ? ` • ${submission.company}` : ""}
                              </p>
                            </div>

                            <div className="text-left md:text-right">
                              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--accent)]">
                                score {submission.segmentation.score}
                              </p>
                              <p className="mt-2 text-sm text-[var(--muted)]">
                                {formatDate(submission.receivedAt)}
                              </p>
                            </div>
                          </div>

                          <p className="mt-5 text-sm leading-7 text-[var(--fg)]/88">
                            {submission.noteEnglish || submission.noteOriginal || "No note shared."}
                          </p>

                          <div className="mt-5 flex flex-wrap gap-2">
                            {submission.segmentation.tags.map((tag) => (
                              <span
                                key={`${submission.id}-${tag}`}
                                className="border border-[var(--rule)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="mt-5 grid gap-3 text-sm text-[var(--muted)] md:grid-cols-2">
                            <p>Bucket: {submission.segmentation.bucket}</p>
                            <p>Budget: {submission.budget || "Not provided"}</p>
                            <p>GitHub: {submission.githubUsername || "Not provided"}</p>
                            <p>Website: {submission.enrichment.websiteHost || "Not provided"}</p>
                          </div>

                          {submission.enrichment.githubProfile ? (
                            <div className="mt-5 rounded-md border border-[var(--rule)] bg-black/10 p-4">
                              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--accent)]">
                                GitHub enrichment
                              </p>
                              <p className="mt-3 text-sm text-[var(--muted)]">
                                {submission.enrichment.githubProfile.publicRepos ?? 0} repos •{" "}
                                {submission.enrichment.githubProfile.followers ?? 0} followers
                              </p>
                              {submission.enrichment.githubProfile.bio ? (
                                <p className="mt-2 text-sm text-[var(--fg)]/82">
                                  {submission.enrichment.githubProfile.bio}
                                </p>
                              ) : null}
                            </div>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-md border border-dashed border-[var(--rule)] px-5 py-8 text-center">
                      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
                        {bucketMeta[currentBucket].empty}
                      </p>
                    </div>
                  )}
                </section>
              ))}
            </div>

            <aside className="rounded-md border border-[var(--rule)] bg-black/20 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
                Top tags
              </p>
              <div className="mt-4 grid gap-3">
                {dashboard.summary.topTags.map((item) => (
                  <div key={item.tag} className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg)]">
                      {item.tag}
                    </span>
                    <span className="text-sm text-[var(--muted)]">{item.count}</span>
                  </div>
                ))}
              </div>
            </aside>
          </section>
        </>
      ) : (
        <section className="rounded-md border border-[var(--rule)] bg-black/20 px-5 py-10 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]">
            {loading ? "Loading inbox..." : "No submissions available yet."}
          </p>
        </section>
      )}
    </div>
  );
}
