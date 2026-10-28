import { NextResponse } from "next/server";
import { UNLOCK_COOKIE, UNLOCK_MAX_AGE, isSitePrivate, safeEqual, sitePassword, unlockToken } from "@/lib/siteLock";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSitePrivate()) return NextResponse.json({ ok: true });

  const expected = sitePassword();
  let given = "";
  try {
    given = String(((await request.json()) as { password?: unknown })?.password ?? "");
  } catch {
    // fall through to wrong-password reply
  }

  if (!expected || !safeEqual(await unlockToken(given), await unlockToken(expected))) {
    // Slow down guessing a little.
    await new Promise((r) => setTimeout(r, 700));
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(UNLOCK_COOKIE, await unlockToken(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: UNLOCK_MAX_AGE,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(UNLOCK_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
