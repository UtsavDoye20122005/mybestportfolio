import { createHmac, timingSafeEqual } from "node:crypto";
import type { ContactSubmission } from "./types";

export const ADMIN_SESSION_COOKIE_NAME = "lead_vault_session";

type AdminSession = {
  username: string;
  expiresAt: number;
};

const adminSessionDurationMs = 1000 * 60 * 60 * 24 * 7;

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function signSessionPayload(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function parseCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) {
    return new Map<string, string>();
  }

  return new Map(
    cookieHeader
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separator = part.indexOf("=");
        if (separator === -1) {
          return [part, ""];
        }

        return [part.slice(0, separator), decodeURIComponent(part.slice(separator + 1))];
      })
  );
}

export function getAdminSessionFromCookieValue(rawValue?: string | null) {
  if (!rawValue) {
    return null;
  }

  const [encodedPayload, signature] = rawValue.split(".");
  const secret = getSessionSecret();

  if (!encodedPayload || !signature || !secret) {
    return null;
  }

  const expectedSignature = signSessionPayload(encodedPayload);
  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as AdminSession;
    if (!parsed.username || !parsed.expiresAt || parsed.expiresAt < Date.now()) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getAdminSessionFromCookieHeader(cookieHeader: string | null) {
  const cookies = parseCookieHeader(cookieHeader);
  return getAdminSessionFromCookieValue(cookies.get(ADMIN_SESSION_COOKIE_NAME));
}

export function validateAdminCredentials(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME || "";
  const expectedPassword = process.env.ADMIN_PASSWORD || "";
  const sessionSecret = getSessionSecret();

  if (!expectedUsername || !expectedPassword || !sessionSecret) {
    return { ok: false as const, status: 500, error: "Admin auth is not fully configured" };
  }

  if (!safeCompare(username.trim(), expectedUsername) || !safeCompare(password, expectedPassword)) {
    return { ok: false as const, status: 401, error: "Invalid username or password" };
  }

  return { ok: true as const, username: expectedUsername };
}

export function createAdminSessionCookie(username: string) {
  const expiresAt = Date.now() + adminSessionDurationMs;
  const payload = Buffer.from(
    JSON.stringify({
      username,
      expiresAt,
    }),
    "utf8"
  ).toString("base64url");
  const signature = signSessionPayload(payload);

  return {
    name: ADMIN_SESSION_COOKIE_NAME,
    value: `${payload}.${signature}`,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(expiresAt),
    },
  };
}

export function clearAdminSessionCookie() {
  return {
    name: ADMIN_SESSION_COOKIE_NAME,
    value: "",
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(0),
    },
  };
}

export function authorizeDashboardRequest(request: Request) {
  const session = getAdminSessionFromCookieHeader(request.headers.get("cookie"));
  if (!session) {
    return { ok: false as const, status: 401, error: "Unauthorized" };
  }

  return { ok: true as const, session };
}

export function buildDashboardSummary(submissions: ContactSubmission[]) {
  const byBucket = {
    hire: 0,
    freelance: 0,
    collaboration: 0,
    general: 0,
  };

  const byPriority = {
    high: 0,
    medium: 0,
    low: 0,
  };

  const topTags = new Map<string, number>();

  for (const submission of submissions) {
    byBucket[submission.segmentation.bucket] += 1;
    byPriority[submission.segmentation.priority] += 1;

    for (const tag of submission.segmentation.tags) {
      topTags.set(tag, (topTags.get(tag) || 0) + 1);
    }
  }

  return {
    total: submissions.length,
    byBucket,
    byPriority,
    topTags: Array.from(topTags.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag, count]) => ({ tag, count })),
  };
}
