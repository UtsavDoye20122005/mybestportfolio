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
  await appendContactSubmission(submission);

  const transporter = createMailTransport();
  let emailDelivered = false;

  try {
    if (contactEmail && transporter) {
      await transporter.sendMail({
        from: resolveMailFromAddress(contactEmail),
        to: contactEmail,
        subject: `[${submission.typeLabel}] from ${submission.name} - utsav.dev`,
        text: buildContactEmailLines(submission).join("\n"),
      });
      emailDelivered = true;
    }
  } catch {
    emailDelivered = false;
  }

  return NextResponse.json({
    ok: true,
    id: submission.id,
    emailDelivered,
    priority: submission.segmentation.priority,
    bucket: submission.segmentation.bucket,
  });
}
