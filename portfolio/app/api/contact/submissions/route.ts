import { NextResponse } from "next/server";
import { authorizeDashboardRequest, buildDashboardSummary } from "@/lib/contact/admin";
import { readContactSubmissions } from "@/lib/contact/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = authorizeDashboardRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const submissions = await readContactSubmissions();

  return NextResponse.json({
    admin: {
      username: auth.session.username,
    },
    summary: buildDashboardSummary(submissions),
    submissions,
  });
}
