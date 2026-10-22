import { NextResponse } from "next/server";
import { createMailTransport, resolveMailFromAddress } from "@/lib/contact/mail";
import { buildContactEmailLines, buildContactSubmission, validateContactPayload } from "@/lib/contact/service";
import { appendContactSubmission } from "@/lib/contact/storage";
import type { ContactPayload } from "@/lib/contact/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const contactEmail = process.env.CONTACT_EMAIL;

  let payload: ContactPayload = {};
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const validation = validateContactPayload(payload);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const submission = await buildContactSubmission(payload, request);

  let stored = true;
  try {
    await appendContactSubmission(submission);
  } catch {
    // On Vercel the filesystem is read-only, so without DATABASE_URL this fails.
    stored = false;
  }

  const transporter = createMailTransport();
  let emailDelivered = false;

  try {
    if (contactEmail && transporter) {
      await transporter.sendMail({
        from: resolveMailFromAddress(contactEmail),
        to: contactEmail,
        subject: `[${submission.typeLabel}] from ${submission.name} - portfolio`,
        text: buildContactEmailLines(submission).join("\n"),
      });
      emailDelivered = true;
    }
  } catch {
    emailDelivered = false;
  }

  if (!stored && !emailDelivered) {
    return NextResponse.json(
      { error: "Couldn't send right now. Please email utsavdoye07@gmail.com directly." },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    id: submission.id,
    emailDelivered,
    priority: submission.segmentation.priority,
    bucket: submission.segmentation.bucket,
  });
}
