// app/api/auth/me/route.js
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { SESSION_COOKIE_NAME } from '@/lib/cookies'
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
    const jar = await cookies()
    const token = jar.get(SESSION_COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ error: 'NO_SESSION' }, { status: 401 })

    const nowIso = new Date().toISOString()

    const { data, error } = await supabaseAdmin
      .from('account_sessions')
      .select('account_id, expires_at')
      .eq('session_token', token)
      .gt('expires_at', nowIso)
      .maybeSingle()

    if (error) return NextResponse.json({ error: 'DB_ERROR', detail: error.message }, { status: 500 })
    if (!data) return NextResponse.json({ error: 'SESSION_EXPIRED' }, { status: 401 })

    return NextResponse.json({ ok: true, accountId: data.account_id })
  } catch (e) {
    return NextResponse.json({ error: 'ME_FAILED', detail: String(e?.message || e) }, { status: 500 })
  }
}