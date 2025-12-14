import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyPassword, newSessionToken } from '@/lib/authCrypto'
import { SESSION_COOKIE_NAME, SESSION_DAYS, cookieOptions } from '@/lib/cookies'

export async function POST(req) {
  const { email, password } = await req.json()

  const { data: account, error } = await supabaseAdmin
    .from('accounts')
    .select('id,password')
    .eq('email', email)
    .maybeSingle()

  if (error || !account) {
    return NextResponse.json({ error: 'INVALID_LOGIN' }, { status: 401 })
  }

  const ok = await verifyPassword(password, account.password)
  if (!ok) {
    return NextResponse.json({ error: 'INVALID_LOGIN' }, { status: 401 })
  }

  const sessionToken = newSessionToken()
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000).toISOString()

  const { error: sErr } = await supabaseAdmin
    .from('account_sessions')
    .insert({ account_id: account.id, session_token: sessionToken, expires_at: expiresAt })

  if (sErr) {
    return NextResponse.json({ error: 'SESSION_CREATE_FAILED', detail: String(sErr.message || '') }, { status: 500 })
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, cookieOptions())
  return NextResponse.json({ ok: true })
}
