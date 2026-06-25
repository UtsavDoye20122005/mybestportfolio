import { Pool } from "pg";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { ContactSubmission } from "./types";

const dataDirectory = path.join(process.cwd(), ".data");
const submissionsFile = path.join(dataDirectory, "contact-submissions.json");
const postgresTableName = "contact_submissions";

declare global {
  var __contactPgPool: Pool | undefined;
  var __contactPgInit: Promise<void> | undefined;
}

async function ensureStore() {
  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    await fs.access(submissionsFile);
  } catch {
    await fs.writeFile(submissionsFile, "[]\n", "utf8");
  }
}

function getPostgresPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  if (!global.__contactPgPool) {
    global.__contactPgPool = new Pool({
      connectionString,
      ssl:
        process.env.DATABASE_SSL === "true"
          ? {
              rejectUnauthorized: false,
            }
          : undefined,
    });
  }

  return global.__contactPgPool;
}

async function ensurePostgresStore() {
  const pool = getPostgresPool();
  if (!pool) {
    return null;
  }

  if (!global.__contactPgInit) {
    global.__contactPgInit = pool
      .query(
        `
          CREATE TABLE IF NOT EXISTS ${postgresTableName} (
            id TEXT PRIMARY KEY,
            received_at TIMESTAMPTZ NOT NULL,
            bucket TEXT NOT NULL,
            priority TEXT NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            company TEXT NOT NULL DEFAULT '',
            payload JSONB NOT NULL
          );

          CREATE INDEX IF NOT EXISTS idx_contact_submissions_received_at
            ON ${postgresTableName} (received_at DESC);

          CREATE INDEX IF NOT EXISTS idx_contact_submissions_bucket
            ON ${postgresTableName} (bucket);

          CREATE INDEX IF NOT EXISTS idx_contact_submissions_priority
            ON ${postgresTableName} (priority);
        `
      )
      .then(() => undefined);
  }

  await global.__contactPgInit;
  return pool;
}

export async function readContactSubmissions() {
  const postgres = await ensurePostgresStore();
  if (postgres) {
    const result = await postgres.query<{ payload: ContactSubmission }>(
      `
        SELECT payload
        FROM ${postgresTableName}
        ORDER BY received_at DESC
      `
    );

    return result.rows.map((row) => row.payload);
  }

  await ensureStore();

  try {
    const raw = await fs.readFile(submissionsFile, "utf8");
    const parsed = JSON.parse(raw) as ContactSubmission[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.sort((a, b) => Date.parse(b.receivedAt) - Date.parse(a.receivedAt));
  } catch {
    return [];
  }
}

export async function appendContactSubmission(submission: ContactSubmission) {
  const postgres = await ensurePostgresStore();
  if (postgres) {
    await postgres.query(
      `
        INSERT INTO ${postgresTableName} (
          id,
          received_at,
          bucket,
          priority,
          name,
          email,
          company,
          payload
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [
        submission.id,
        submission.receivedAt,
        submission.segmentation.bucket,
        submission.segmentation.priority,
        submission.name,
        submission.email,
        submission.company,
        submission,
      ]
    );

    return submission;
  }

  const current = await readContactSubmissions();
  current.unshift(submission);
  await fs.writeFile(submissionsFile, `${JSON.stringify(current, null, 2)}\n`, "utf8");
  return submission;
}
