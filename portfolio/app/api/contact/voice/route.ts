import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type VoicePayload = {
  transcription?: string;
  email?: string;
  timestamp?: string;
};

export async function POST(request: Request) {
  const contactEmail = process.env.CONTACT_EMAIL;
  const smtpUrl = process.env.SMTP_URL;
  const smtpHost = process.env.SMTP_HOST;

  if (!contactEmail) {
    return NextResponse.json({ error: "CONTACT_EMAIL not configured" }, { status: 500 });
  }

  if (!smtpUrl && !smtpHost) {
    return NextResponse.json({ error: "SMTP configuration missing" }, { status: 500 });
  }

  let payload: VoicePayload = {};
  try {
    payload = (await request.json()) as VoicePayload;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const transporter = smtpUrl
    ? nodemailer.createTransport(smtpUrl)
    : nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465,
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              }
            : undefined,
      });

  const fromAddress = process.env.SMTP_FROM || contactEmail;
  const subject = "New voice note";
  const lines = [
    `Time: ${payload.timestamp || new Date().toISOString()}`,
    `Email: ${payload.email || "(not provided)"}`,
    "",
    "Transcription:",
    payload.transcription || "(empty)",
  ];

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: contactEmail,
      subject,
      text: lines.join("\n"),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
