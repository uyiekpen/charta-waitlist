import { Pool } from 'pg'
import { NextResponse } from 'next/server'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
let tableReady: Promise<void> | undefined

function ensureTable() {
  tableReady ??= pool
    .query(`CREATE TABLE IF NOT EXISTS waitlist_signups (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text NOT NULL UNIQUE,
      created_at timestamptz NOT NULL DEFAULT now()
    )`)
    .then(() => undefined)
  return tableReady
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
    }

    await ensureTable()
    await pool.query('INSERT INTO waitlist_signups (email) VALUES ($1) ON CONFLICT (email) DO NOTHING', [email])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Waitlist submission failed:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
