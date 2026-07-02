import { Pool } from "pg";
import { promises as fs } from "node:fs";
import path from "node:path";

const dataDirectory = path.join(process.cwd(), ".data");
const visitorCountFile = path.join(dataDirectory, "visitor-count.json");
const postgresTableName = "visitor_counter";

declare global {
  var __visitorPgPool: Pool | undefined;
  var __visitorPgInit: Promise<void> | undefined;
}

function getPostgresPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  if (!global.__visitorPgPool) {
    global.__visitorPgPool = new Pool({
      connectionString,
      ssl:
        process.env.DATABASE_SSL === "true"
          ? {
              rejectUnauthorized: false,
            }
          : undefined,
    });
  }

  return global.__visitorPgPool;
}

async function ensurePostgresTable() {
  const pool = getPostgresPool();
  if (!pool) {
    return null;
  }

  if (!global.__visitorPgInit) {
    global.__visitorPgInit = pool
      .query(
        `
          CREATE TABLE IF NOT EXISTS ${postgresTableName} (
            id TEXT PRIMARY KEY,
            count BIGINT NOT NULL DEFAULT 0
          );
        `
      )
      .then(() => undefined);
  }

  await global.__visitorPgInit;
  return pool;
}

async function readVisitsFromDb() {
  const pool = await ensurePostgresTable();
  if (!pool) {
    return null;
  }

  const result = await pool.query<{ count: string }>(
    `SELECT count FROM ${postgresTableName} WHERE id = $1`,
    ["visitors"]
  );

  if (result.rowCount === 0) {
    return 0;
  }

  return Number(result.rows[0].count) || 0;
}

async function incrementVisitsInDb() {
  const pool = await ensurePostgresTable();
  if (!pool) {
    return null;
  }

  const result = await pool.query<{ count: string }>(
    `INSERT INTO ${postgresTableName} (id, count) VALUES ($1, 1)
       ON CONFLICT (id) DO UPDATE
       SET count = ${postgresTableName}.count + 1
       RETURNING count`,
    ["visitors"]
  );

  return Number(result.rows[0].count);
}

async function ensureFileStore() {
  await fs.mkdir(dataDirectory, { recursive: true });
  try {
    await fs.access(visitorCountFile);
  } catch {
    await fs.writeFile(visitorCountFile, JSON.stringify({ count: 0 }, null, 2), "utf8");
  }
}

async function readVisitsFromFile() {
  await ensureFileStore();
  const raw = await fs.readFile(visitorCountFile, "utf8");
  const data = JSON.parse(raw);
  return typeof data?.count === "number" ? data.count : 0;
}

async function incrementVisitsInFile() {
  const current = await readVisitsFromFile();
  const next = current + 1;
  await fs.writeFile(visitorCountFile, JSON.stringify({ count: next }, null, 2), "utf8");
  return next;
}

export async function getVisitorCount() {
  try {
    const dbCount = await readVisitsFromDb();
    if (dbCount !== null) {
      return dbCount;
    }
  } catch (error) {
    console.error("Visitor DB read failed:", error);
  }

  return readVisitsFromFile();
}

export async function incrementVisitorCount() {
  try {
    const dbCount = await incrementVisitsInDb();
    if (dbCount !== null) {
      return dbCount;
    }
  } catch (error) {
    console.error("Visitor DB increment failed:", error);
  }

  return incrementVisitsInFile();
}
