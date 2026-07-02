import { NextResponse } from "next/server";

// Spotify integration disabled — return a safe, empty payload.
export async function GET() {
  return NextResponse.json({ isPlaying: false, name: "", artist: "" }, { status: 200 });
}

