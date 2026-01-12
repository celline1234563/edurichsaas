// app/api/auth/session/route.js
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { BRAIN_BASE_URL } from '@/lib/constants'

const BRAIN_ORIGIN = BRAIN_BASE_URL

function withCors(res) {
  res.headers.set('Access-Control-Allow-Origin', BRAIN_ORIGIN)
  res.headers.set('Access-Control-Allow-Credentials', 'true')
  res.headers.set('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return res
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }))
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      return withCors(NextResponse.json({ error: 'NO_SESSION' }, { status: 401 }))
    }

    return withCors(NextResponse.json({
      ok: true,
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at
      }
    }))
  } catch (e) {
    return withCors(NextResponse.json({ error: 'SESSION_FAILED', detail: String(e?.message || e) }, { status: 500 }))
  }
}
