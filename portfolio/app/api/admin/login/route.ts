import { NextResponse } from "next/server";
import { createAdminSessionCookie, validateAdminCredentials } from "@/lib/contact/admin";

export const runtime = "nodejs";

type LoginPayload = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  let payload: LoginPayload = {};

  try {
    payload = (await request.json()) as LoginPayload;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const username = payload.username?.trim() || "";
  const password = payload.password || "";
  const validation = validateAdminCredentials(username, password);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: validation.status });
  }

  const response = NextResponse.json({ ok: true, username: validation.username });
  response.cookies.set(createAdminSessionCookie(validation.username));
  return response;
}
