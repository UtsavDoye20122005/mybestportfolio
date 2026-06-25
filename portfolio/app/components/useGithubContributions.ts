"use client";

import { useEffect, useState } from "react";

export type GithubContributionDay = { date: string; count: number; level: number };
export type GithubContributionWeek = { contributionDays: GithubContributionDay[] };
export type GithubContributionsResponse = {
  totalLast12Months: number;
  totalAllTime: number;
  contributions: GithubContributionWeek[];
};

const REFRESH_INTERVAL_MS = 30 * 60 * 1000;
const PERSISTED_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY_PREFIX = "github-contributions:";

const cache = new Map<string, { data: GithubContributionsResponse; fetchedAt: number }>();
const inflight = new Map<string, Promise<GithubContributionsResponse>>();

type PersistedCacheEntry = {
  data: GithubContributionsResponse;
  fetchedAt: number;
};

function getStorageKey(username: string) {
  return `${STORAGE_KEY_PREFIX}${username}`;
}

function readPersistedCache(username: string) {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(getStorageKey(username));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedCacheEntry;
    if (!parsed?.data || typeof parsed?.fetchedAt !== "number") return null;
    if (Date.now() - parsed.fetchedAt > PERSISTED_CACHE_TTL_MS) return null;

    cache.set(username, parsed);
    return parsed.data;
  } catch {
    return null;
  }
}

function persistCache(username: string, data: GithubContributionsResponse) {
  if (typeof window === "undefined") return;

  const entry: PersistedCacheEntry = {
    data,
    fetchedAt: Date.now(),
  };

  try {
    window.localStorage.setItem(getStorageKey(username), JSON.stringify(entry));
  } catch {
    // ignore storage write failures
  }
}

async function fetchGithubContributions(username: string) {
  const url = `/api/github/contributions?username=${encodeURIComponent(username)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`github contributions request failed: ${res.status}`);
  }

  const json = (await res.json()) as GithubContributionsResponse;
  cache.set(username, { data: json, fetchedAt: Date.now() });
  persistCache(username, json);
  return json;
}

function getFreshCachedValue(username: string) {
  const cached = cache.get(username);
  if (!cached) return null;
  if (Date.now() - cached.fetchedAt > REFRESH_INTERVAL_MS) return null;
  return cached.data;
}

function loadGithubContributions(username: string) {
  const fresh = getFreshCachedValue(username);
  if (fresh) return Promise.resolve(fresh);

  const pending = inflight.get(username);
  if (pending) return pending;

  const request = fetchGithubContributions(username).finally(() => {
    inflight.delete(username);
  });

  inflight.set(username, request);
  return request;
}

export function useGithubContributions(username: string) {
  const [data, setData] = useState<GithubContributionsResponse | null>(() => {
    return cache.get(username)?.data ?? readPersistedCache(username);
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const sync = async () => {
      try {
        const next = await loadGithubContributions(username);
        if (!cancelled) {
          setData(next);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    };

    sync();

    const intervalId = window.setInterval(sync, REFRESH_INTERVAL_MS);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        sync();
      }
    };

    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [username]);

  return { data, error };
}
