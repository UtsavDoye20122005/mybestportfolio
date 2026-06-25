import { NextResponse } from "next/server";

export const dynamic = "force-static"; // For static HTML export required
export const revalidate = 60; // Regenerate every 60 seconds (useful only on a server environment, but avoids Next throwing the exact error we received for output: "export". wait, we shouldn't use revalidate for static export. we should just use force-static without any API route. Let's see)

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

function must(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

async function getAccessToken() {
  const clientId = must("SPOTIFY_CLIENT_ID");
  const clientSecret = must("SPOTIFY_CLIENT_SECRET");
  const refreshToken = must("SPOTIFY_REFRESH_TOKEN");

  // How to get SPOTIFY_REFRESH_TOKEN:
  // 1) Create a Spotify App in the Spotify Developer Dashboard and set Redirect URI (e.g. http://localhost:3000/api/spotify/callback)
  // 2) Run an OAuth Authorization Code flow (scopes: user-read-currently-playing user-read-recently-played)
  // 3) Exchange the returned `code` for tokens; the response includes a `refresh_token`
  // 4) Save that `refresh_token` as SPOTIFY_REFRESH_TOKEN in your environment

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  if (!res.ok) throw new Error("spotify token failed");
  return (await res.json()) as TokenResponse;
}

async function fetchJson(url: string, token: string) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return { ok: res.ok, status: res.status, json: res.ok ? await res.json() : null };
}

function pickTrack(payload: any) {
  const item = payload?.item;
  if (!item) return null;
  return {
    isPlaying: Boolean(payload?.is_playing),
    name: String(item?.name ?? ""),
    artist: String(item?.artists?.[0]?.name ?? ""),
  };
}

export async function GET() {
  try {
    const token = await getAccessToken();

    const now = await fetchJson(
      "https://api.spotify.com/v1/me/player/currently-playing",
      token.access_token
    );
    const nowTrack = now.json ? pickTrack(now.json) : null;
    if (nowTrack?.name) {
      return NextResponse.json(nowTrack, { status: 200 });
    }

    const recent = await fetchJson(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      token.access_token
    );
    const recentItem = recent.json?.items?.[0]?.track;
    if (recentItem?.name) {
      return NextResponse.json(
        {
          isPlaying: false,
          name: String(recentItem.name),
          artist: String(recentItem.artists?.[0]?.name ?? ""),
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ isPlaying: false, name: "", artist: "" }, { status: 200 });
  } catch {
    return NextResponse.json({ isPlaying: false, name: "", artist: "" }, { status: 200 });
  }
}

