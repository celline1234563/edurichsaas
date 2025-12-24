// app/api/auth/login/route.js
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyPassword, newSessionToken } from '@/lib/authCrypto'
import { SESSION_COOKIE_NAME, cookieOptions } from '@/lib/cookies'

export async function POST(req) {
  try {
    const { email, password, rememberMe } = await req.json()

    const { data: account, error: aErr } = await supabaseAdmin
      .from('accounts')
      .select('id, password')
      .eq('email', email)
      .maybeSingle()

    if (aErr) return NextResponse.json({ error: 'DB_ERROR', detail: aErr.message }, { status: 500 })
    if (!account) return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 })

    const ok = await verifyPassword(password, account.password)
    if (!ok) return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 })

    const token = newSessionToken()
    const days = rememberMe ? 90 : 1
    const expiresAt = new Date(Date.now() + days * 86400000).toISOString()

    const { error: sErr } = await supabaseAdmin
      .from('account_sessions')
      .insert({ account_id: account.id, session_token: token, expires_at: expiresAt })

    if (sErr) {
      return NextResponse.json({ error: 'SESSION_INSERT_FAILED', detail: sErr }, { status: 500 })
    }

    const jar = await cookies()
    jar.set(
      SESSION_COOKIE_NAME,
      token,
      cookieOptions({
        // rememberMe=false면 세션 쿠키로(브라우저 닫으면 만료) 하고 싶으면 maxAge를 안 주면 됨
        maxAge: rememberMe ? days * 86400 : undefined,
      })
    )

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'LOGIN_FAILED', detail: String(e?.message || e) }, { status: 500 })
  }
}
