import { NextResponse, type NextRequest } from "next/server";
import { UNLOCK_COOKIE, isSitePrivate, safeEqual, sitePassword, unlockToken } from "./lib/siteLock";

const LOCK_PAGE = "/locked";

// Paths that must work while the site is locked.
function isAlwaysAllowed(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname === LOCK_PAGE ||
    pathname === "/api/unlock" ||
    pathname === "/favicon.ico" ||
    pathname === "/icon"
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isSitePrivate()) {
    // Public: nobody should land on the lock page.
    if (pathname === LOCK_PAGE) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  if (pathname === "/robots.txt") {
    return new NextResponse("User-agent: *\nDisallow: /\n", {
      headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
    });
  }

  if (isAlwaysAllowed(pathname)) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  const password = sitePassword();
  const cookie = request.cookies.get(UNLOCK_COOKIE)?.value ?? "";
  if (password && cookie && safeEqual(cookie, await unlockToken(password))) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "This site is private right now." }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = LOCK_PAGE;
  url.search = "";
  const res = NextResponse.rewrite(url, { status: 401 });
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = {
  // Everything, including /resume.pdf and /profile.jpg.
  matcher: "/:path*",
};
