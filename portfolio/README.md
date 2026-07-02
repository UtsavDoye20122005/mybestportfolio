# Portfolio

This Next.js portfolio now includes a simple contact backend that can:

- receive structured form submissions from `/contact`
- save each submission to Postgres when `DATABASE_URL` is configured
- fall back to `portfolio/.data/contact-submissions.json` in local development if no database is configured
- segment leads by bucket, score, priority, and tags
- optionally enrich GitHub usernames with the GitHub API
- expose a protected review dashboard at `/secret/inbox`

## Local Setup

```bash
cd portfolio
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env.local`.

Minimum useful setup:

```bash
CONTACT_EMAIL=you@example.com
DATABASE_URL=postgres://...
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me
ADMIN_SESSION_SECRET=change-this-to-a-long-random-string
```

For production, `DATABASE_URL` should point to your hosted Postgres database. The app will automatically create the `contact_submissions` table the first time it connects.

For email delivery, configure one of these:

- `SMTP_URL`
- `SMTP_HOST` + `SMTP_PORT` + `SMTP_USER` + `SMTP_PASS`
- `EMAIL_USER` + `EMAIL_PASS` for the Gmail fallback used by the main contact route

Optional enrichment:

- `GITHUB_TOKEN`
  When a visitor provides a GitHub profile, the backend can fetch repo/follower counts and show them in the private lead dashboard.

## Reviewing Leads

1. Open `/contact` and submit a test lead.
2. Open `/secret/inbox/login`.
3. Sign in with `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
4. Review and filter submissions by bucket, priority, or search text.

## Storage Note

For public deployment, use `DATABASE_URL`. The file-based store is only a local fallback and should not be relied on in serverless production.

## Visitor Counter

This portfolio includes a visitor counter at `/api/visitor`.

- `POST /api/visitor` increments the visitor count and returns the new value.
- `GET /api/visitor` reads the current count.
- The frontend component at `app/components/VisitorCounter.tsx` uses the API to show the visitor number.

### Production behavior

- With `DATABASE_URL` configured, visitor counts are stored in Postgres in the `visitor_counter` table.
- Without `DATABASE_URL`, the app falls back to `.data/visitor-count.json` for local development.

### Recommended deployment

Use a hosted Postgres database and set `DATABASE_URL` in your production environment.

## Commands

```bash
npm run dev
npm run lint
```
