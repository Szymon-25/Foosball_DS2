import { neon } from '@neondatabase/serverless';

export type RegistrationStatus = 'pending' | 'accepted' | 'rejected';
export type Format = 'Solo' | '2 people';

export interface Registration {
  id: string;
  teamName: string;
  format: Format;
  skill: number;
  secretPhrase: string;
  status: RegistrationStatus;
  createdAt: string;
}

// Neon/Vercel can set the connection string under different env var names.
// The marketplace integration uses individual NEON_POSTGRES_* params instead of a single URL.
function getDbUrl(): string | undefined {
  // Try full URL vars first
  const urlVar =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING;
  if (urlVar) return urlVar;

  // Fall back to building a URL from NEON_POSTGRES_* individual params
  const host = process.env.NEON_POSTGRES_PGHOST || process.env.NEON_POSTGRES_HOST;
  const user = process.env.NEON_POSTGRES_PGUSER || process.env.NEON_POSTGRES_USER || process.env.NEON_POSTGRES_POSTGRES_USER;
  const pass = process.env.NEON_POSTGRES_PGPASSWORD || process.env.NEON_POSTGRES_PASSWORD || process.env.NEON_POSTGRES_POSTGRES_PASSWORD;
  const db   = process.env.NEON_POSTGRES_PGDATABASE || process.env.NEON_POSTGRES_DATABASE;

  if (host && user && pass && db) {
    return `postgresql://${user}:${encodeURIComponent(pass)}@${host}/${db}?sslmode=require`;
  }

  return undefined;
}

const getSql = () => {
  const url = getDbUrl();
  if (!url) {
    console.warn("No database URL found (checked DATABASE_URL, POSTGRES_URL, NEON_DATABASE_URL, POSTGRES_URL_NON_POOLING). Database will not work.");
    // Return a dummy function to prevent build crashes
    return async () => [];
  }
  return neon(url);
};

const hasDb = () => !!getDbUrl();

// Ensure the table exists
let tableInitialized = false;
async function initTable() {
  if (tableInitialized) return;
  if (!hasDb()) return;
  
  try {
    const sql = getSql();
    await sql`
      CREATE TABLE IF NOT EXISTS registrations (
        id UUID PRIMARY KEY,
        "teamName" VARCHAR(255) NOT NULL,
        format VARCHAR(50) NOT NULL,
        skill INTEGER NOT NULL,
        "secretPhrase" VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        "createdAt" VARCHAR(255) NOT NULL
      );
    `;
    tableInitialized = true;
  } catch (e) {
    console.error("Failed to initialize table", e);
  }
}

export async function getRegistrations(): Promise<Registration[]> {
  try {
    await initTable();
    if (!hasDb()) return [];
    
    const sql = getSql();
    const rows = await sql`
      SELECT id, "teamName", format, skill, "secretPhrase", status, "createdAt"
      FROM registrations
      ORDER BY "createdAt" ASC;
    `;
    return rows as Registration[];
  } catch (e) {
    console.error("Failed to fetch registrations", e);
    return [];
  }
}

export async function addRegistration(registration: Registration) {
  await initTable();
  if (!hasDb()) {
    throw new Error("Database is not configured.");
  }

  const sql = getSql();
  await sql`
    INSERT INTO registrations (id, "teamName", format, skill, "secretPhrase", status, "createdAt")
    VALUES (
      ${registration.id},
      ${registration.teamName},
      ${registration.format},
      ${registration.skill},
      ${registration.secretPhrase},
      ${registration.status},
      ${registration.createdAt}
    );
  `;
}

export async function updateRegistrationStatus(id: string, status: RegistrationStatus) {
  try {
    await initTable();
    if (!hasDb()) return false;

    const sql = getSql();
    const result = await sql`
      UPDATE registrations
      SET status = ${status}
      WHERE id = ${id}
      RETURNING id;
    `;
    return result.length > 0;
  } catch (e) {
    console.error("Failed to update status", e);
    return false;
  }
}
