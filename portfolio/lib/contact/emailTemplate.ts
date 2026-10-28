import type { ContactSubmission } from "./types";

const COLORS = {
  page: "#f4f4f2",
  card: "#ffffff",
  ink: "#111111",
  muted: "#6b6b6b",
  rule: "#e6e6e3",
  accent: "#c8dc00",
  high: "#d6f5d6",
  highInk: "#1d6b1d",
  medium: "#fff3c4",
  mediumInk: "#7a5a00",
  low: "#ececec",
  lowInk: "#555555",
};

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO = "'SFMono-Regular', Menlo, Consolas, monospace";

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function withProtocol(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(value);
}

function link(href: string, text: string) {
  return `<a href="${esc(href)}" style="color:${COLORS.ink};text-decoration:underline;">${esc(text)}</a>`;
}

function row(label: string, valueHtml: string) {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${COLORS.rule};width:120px;vertical-align:top;font:600 11px ${FONT};letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.muted};">${esc(label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid ${COLORS.rule};vertical-align:top;font:15px/1.5 ${FONT};color:${COLORS.ink};">${valueHtml}</td>
    </tr>`;
}

function section(title: string, body: string) {
  return `
    <tr><td style="padding:28px 32px 0;">
      <div style="font:600 11px ${FONT};letter-spacing:0.12em;text-transform:uppercase;color:${COLORS.muted};margin-bottom:6px;">${esc(title)}</div>
      ${body}
    </td></tr>`;
}

function pill(text: string, bg: string, color: string) {
  return `<span style="display:inline-block;padding:4px 10px;border-radius:999px;background:${bg};color:${color};font:600 11px ${FONT};letter-spacing:0.06em;text-transform:uppercase;margin-right:6px;">${esc(text)}</span>`;
}

function noteBlock(text: string) {
  return `<div style="background:${COLORS.page};border-left:3px solid ${COLORS.accent};padding:14px 16px;font:15px/1.6 ${FONT};color:${COLORS.ink};white-space:pre-wrap;">${esc(text)}</div>`;
}

export function buildContactEmailSubject(s: ContactSubmission) {
  const who = s.company ? `${s.name} (${s.company})` : s.name;
  return `${s.typeLabel}: ${who}`;
}

export function buildContactEmailHtml(s: ContactSubmission) {
  const priority = s.segmentation.priority;
  const [pBg, pInk] =
    priority === "high"
      ? [COLORS.high, COLORS.highInk]
      : priority === "medium"
        ? [COLORS.medium, COLORS.mediumInk]
        : [COLORS.low, COLORS.lowInk];

  const english = s.noteEnglish.trim();
  const original = s.noteOriginal.trim();
  const showOriginal = original && original !== english;

  const contactRows = [
    row("Name", esc(s.name)),
    row("Email", link(`mailto:${s.email}`, s.email)),
    s.phone ? row("Phone", link(`tel:${s.phone.replace(/[^\d+]/g, "")}`, s.phone)) : "",
    s.company ? row("Company", esc(s.company)) : "",
    s.website ? row("Website", link(withProtocol(s.website), s.website)) : "",
    s.linkedin ? row("LinkedIn", link(withProtocol(s.linkedin), s.linkedin)) : "",
    s.github ? row("GitHub", link(withProtocol(s.github.includes("/") ? s.github : `github.com/${s.github.replace(/^@/, "")}`), s.github)) : "",
    s.budget ? row("Budget", esc(s.budget)) : "",
  ].join("");

  const gh = s.enrichment.githubProfile;
  const githubSection = gh
    ? section(
        "GitHub profile",
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row("Profile", link(gh.profileUrl, `@${gh.username}`))}
          ${row("Stats", esc(`${gh.publicRepos ?? "?"} repos · ${gh.followers ?? "?"} followers`))}
          ${gh.location ? row("Location", esc(gh.location)) : ""}
          ${gh.bio ? row("Bio", esc(gh.bio)) : ""}
        </table>`
      )
    : "";

  const replyHref = `mailto:${s.email}?subject=${encodeURIComponent(`Re: your message on my portfolio`)}`;

  return `<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(buildContactEmailSubject(s))}</title></head>
<body style="margin:0;padding:0;background:${COLORS.page};">
  <div style="display:none;max-height:0;overflow:hidden;">${esc(s.summary || english || s.typeLabel)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.page};">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${COLORS.card};border:1px solid ${COLORS.rule};border-radius:10px;overflow:hidden;">

        <tr><td style="background:${COLORS.ink};padding:18px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font:600 12px ${FONT};letter-spacing:0.14em;text-transform:uppercase;color:#ffffff;">Portfolio · New message</td>
            <td align="right" style="font:12px ${FONT};color:#bdbdbd;">${esc(formatDate(new Date(s.receivedAt)))} IST</td>
          </tr></table>
        </td></tr>
        <tr><td style="height:3px;background:${COLORS.accent};line-height:3px;font-size:0;">&nbsp;</td></tr>

        <tr><td style="padding:28px 32px 0;">
          <div>${pill(s.typeLabel, COLORS.accent, COLORS.ink)}${pill(`${priority} priority`, pBg, pInk)}</div>
          <h1 style="margin:16px 0 4px;font:700 24px/1.25 ${FONT};color:${COLORS.ink};">${esc(s.name)}${s.company ? ` <span style="font-weight:400;color:${COLORS.muted};">· ${esc(s.company)}</span>` : ""}</h1>
          <div style="font:14px ${FONT};color:${COLORS.muted};">${link(`mailto:${s.email}`, s.email)}</div>
        </td></tr>

        ${section("Message", noteBlock(english || "(no message)"))}
        ${showOriginal ? section(`Original${s.language ? ` (${s.language})` : ""}`, noteBlock(original)) : ""}

        ${section("Contact details", `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${contactRows}</table>`)}

        ${githubSection}

        <tr><td style="padding:28px 32px;">
          <a href="${esc(replyHref)}" style="display:inline-block;background:${COLORS.ink};color:#ffffff;text-decoration:none;font:600 14px ${FONT};padding:12px 22px;border-radius:6px;">Reply to ${esc(s.name.split(" ")[0] || "them")}</a>
        </td></tr>

        <tr><td style="padding:16px 32px;border-top:1px solid ${COLORS.rule};background:#fafaf8;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font:12px ${FONT};color:${COLORS.muted};">Lead score <b style="color:${COLORS.ink};">${s.segmentation.score}</b>${s.segmentation.tags.length ? ` · ${esc(s.segmentation.tags.join(", "))}` : ""}</td>
            <td align="right" style="font:11px ${MONO};color:#9a9a9a;">${esc(s.id.slice(0, 8))}</td>
          </tr></table>
        </td></tr>

      </table>
      <div style="font:11px ${FONT};color:#9a9a9a;padding-top:14px;">Sent from the contact form on your portfolio.</div>
    </td></tr>
  </table>
</body>
</html>`;
}
