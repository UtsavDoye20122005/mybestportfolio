import { NextResponse } from "next/server";
import { GITHUB_USERNAME } from "../../../../data/profile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ApiDay = { date: string; count: number; level: number };
type ApiWeek = { contributionDays: ApiDay[] };
type ApiResponse = {
  totalLast12Months: number;
  totalAllTime: number;
  contributions: ApiWeek[];
};

type GraphQlDay = {
  date: string;
  contributionCount: number;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
};

type GraphQlWeek = { contributionDays: GraphQlDay[] };

const levelMap: Record<GraphQlDay["contributionLevel"], number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

async function fetchCreatedAt(username: string, token?: string): Promise<string> {
  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "User-Agent": "portfolio-app",
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`github user lookup failed (${res.status}): ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  const createdAt = String(json?.created_at ?? "");
  if (!createdAt) throw new Error("github user created_at missing");
  return createdAt;
}

async function fetchFromGitHub(username: string, token: string): Promise<ApiResponse> {
  const createdAt = await fetchCreatedAt(username);

  const query = `
    query($login: String!, $fromAllTime: DateTime!) {
      user(login: $login) {
        allTime: contributionsCollection(from: $fromAllTime) {
          totalContributions
        }
        lastYear: contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "portfolio-app",
    },
    body: JSON.stringify({
      query,
      variables: { login: username, fromAllTime: createdAt },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`github graphQL failed (${res.status}): ${text.slice(0, 200)}`);
  }
  const json = await res.json();

  if (!json?.data?.user) throw new Error("github user not found");

  const weeks = (json.data.user.lastYear?.contributionCalendar?.weeks ?? []) as GraphQlWeek[];
  const totalLast12Months = weeks.reduce(
    (sum, w) => sum + w.contributionDays.reduce((s, d) => s + d.contributionCount, 0),
    0
  );
  const totalAllTime = Number(json.data.user.allTime?.totalContributions ?? totalLast12Months);

  return {
    totalLast12Months,
    totalAllTime,
    contributions: weeks.map((w) => ({
      contributionDays: w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: levelMap[d.contributionLevel] ?? 0,
      })),
    })),
  };
}

function parseContributionCount(label: string) {
  if (/No contributions/i.test(label)) return 0;

  const match = label.match(/([\d,]+)\s+contributions?/i);
  return match ? Number(match[1].replaceAll(",", "")) : 0;
}

function buildWeeks(days: ApiDay[]) {
  if (!days.length) return [];

  const byDate = new Map(days.map((day) => [day.date, day]));
  const sortedDates = days
    .map((day) => day.date)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const start = new Date(`${sortedDates[0]}T00:00:00Z`);
  const end = new Date(`${sortedDates[sortedDates.length - 1]}T00:00:00Z`);
  const weeks: ApiWeek[] = [];

  for (let cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 7)) {
    const contributionDays: ApiDay[] = [];

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const current = new Date(cursor);
      current.setUTCDate(cursor.getUTCDate() + dayOffset);
      const isoDate = current.toISOString().slice(0, 10);

      contributionDays.push(
        byDate.get(isoDate) ?? {
          date: isoDate,
          count: 0,
          level: 0,
        }
      );
    }

    weeks.push({ contributionDays });
  }

  return weeks;
}

function parseContributionTotal(html: string) {
  const match = html.match(/>\s*([\d,]+)\s*contributions?\s*in(?:\s+the last year|\s+\d{4})\s*</i);
  return match ? Number(match[1].replaceAll(",", "")) : 0;
}

async function fetchContributionPage(username: string, from?: string, to?: string) {
  const params =
    from && to
      ? `?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
      : "";
  const url = `https://github.com/users/${username}/contributions${params}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "portfolio-app",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`public contributions page failed (${res.status}): ${text.slice(0, 200)}`);
  }

  return res.text();
}

async function fetchFromPublicPage(username: string): Promise<ApiResponse> {
  const createdAt = await fetchCreatedAt(username);
  const createdYear = new Date(createdAt).getUTCFullYear();
  const currentYear = new Date().getUTCFullYear();

  const lastYearHtml = await fetchContributionPage(username);
  const totalLast12Months = parseContributionTotal(lastYearHtml);

  const dayMatches = [
    ...lastYearHtml.matchAll(
      /<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"[^>]*><\/td>\s*<tool-tip[^>]*>([^<]*)<\/tool-tip>/g
    ),
  ];

  const days: ApiDay[] = dayMatches.map((match) => ({
    date: match[1],
    level: Number(match[2]) || 0,
    count: parseContributionCount(match[3]),
  }));

  const contributions = buildWeeks(days);
  const yearlyTotals = await Promise.all(
    Array.from({ length: currentYear - createdYear + 1 }, (_, index) => createdYear + index).map(
      async (year) => {
        const yearHtml = await fetchContributionPage(
          username,
          `${year}-01-01`,
          `${year}-12-31`
        );
        return parseContributionTotal(yearHtml);
      }
    )
  );
  const totalAllTime = yearlyTotals.reduce((sum, total) => sum + total, 0);

  return {
    totalLast12Months,
    totalAllTime,
    contributions,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || process.env.GITHUB_USERNAME || GITHUB_USERNAME;
  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  const debug = process.env.NODE_ENV !== "production";
  const errors: string[] = [];
  const debugInfo = debug
    ? {
        username,
        hasToken: Boolean(token),
      }
    : undefined;

  try {
    if (token) {
      const data = await fetchFromGitHub(username, token);
      return NextResponse.json(
        debug ? { ...data, source: "github", debug: debugInfo } : data,
        { status: 200 }
      );
    }
  } catch (e) {
    errors.push(`github:failed:${(e as Error)?.message ?? "unknown"}`);
    // fall back
  }

  try {
    const data = await fetchFromPublicPage(username);
    return NextResponse.json(
      debug ? { ...data, source: "public", errors, debug: debugInfo } : data,
      { status: 200 }
    );
  } catch (e) {
    errors.push(`public:failed:${(e as Error)?.message ?? "unknown"}`);
    return NextResponse.json(
      debug
        ? {
            totalLast12Months: 0,
            totalAllTime: 0,
            contributions: [],
            source: "none",
            errors,
            debug: debugInfo,
          }
        : { totalLast12Months: 0, totalAllTime: 0, contributions: [] },
      { status: 200 }
    );
  }
}
