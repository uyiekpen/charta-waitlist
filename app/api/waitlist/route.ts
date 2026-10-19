import { Pool } from "pg";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_SSL === "true"
      ? { rejectUnauthorized: false }
      : undefined,
});

let tableReady: Promise<void> | undefined;

async function ensureTable(): Promise<void> {
  if (!tableReady) {
    tableReady = pool
      .query(
        `
        CREATE TABLE IF NOT EXISTS waitlist_signups (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          first_name text,
          last_name text,
          email text NOT NULL UNIQUE,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `,
      )
      .then(() => undefined)
      .catch((error) => {
        tableReady = undefined;
        throw error;
      });
  }

  return tableReady;
}

export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("Waitlist error: DATABASE_URL is not configured.");

      return NextResponse.json(
        { error: "The waitlist service is temporarily unavailable." },
        { status: 500 },
      );
    }

    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    const firstName =
      typeof body.firstName === "string" ? body.firstName.trim() : "";

    const lastName =
      typeof body.lastName === "string" ? body.lastName.trim() : "";

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Please complete all fields." },
        { status: 400 },
      );
    }

    if (firstName.length > 100 || lastName.length > 100 || email.length > 254) {
      return NextResponse.json(
        { error: "One or more fields exceed the allowed length." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    }

    await ensureTable();

    await pool.query(
      `INSERT INTO waitlist_signups
        (first_name, last_name, email)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [firstName, lastName, email],
    );

    return NextResponse.json(
      { success: true, message: "Waitlist submission successful." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Waitlist submission failed:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    const dbError = error as {
      code?: string;
      detail?: string;
    };

    if (dbError.code) {
      console.error("PostgreSQL error code:", dbError.code);
    }

    if (dbError.detail) {
      console.error("PostgreSQL error detail:", dbError.detail);
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
