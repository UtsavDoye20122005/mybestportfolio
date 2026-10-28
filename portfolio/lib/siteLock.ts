/**
 * Private mode.
 *
 * Turn it on in Vercel: Settings → Environment Variables
 *   SITE_PRIVATE  = true            (false or missing = public)
 *   SITE_PASSWORD = <your password> (lets you and anyone you trust get in)
 * then Redeploy.
 */

export const UNLOCK_COOKIE = "site_unlock";
export const UNLOCK_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function isSitePrivate() {
  return (process.env.SITE_PRIVATE ?? "").trim().toLowerCase() === "true";
}

export function sitePassword() {
  return process.env.SITE_PASSWORD ?? "";
}

/** The cookie holds a hash of the password, so changing the password logs everyone out. */
export async function unlockToken(password: string) {
  const data = new TextEncoder().encode(`portfolio-unlock:v1:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
