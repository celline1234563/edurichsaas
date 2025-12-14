import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyPassword, newSessionToken } from '@/lib/authCrypto'
import { SESSION_COOKIE_NAME, cookieOptions } from '@/lib/cookies'

export async function POST(req) {
  try {
    const { email, password, rememberMe } = await req.json()

    // 1) 계정 조회
    const { data: account, error: aErr } = await supabaseAdmin
      .from('accounts')
      .select('id, password') // 네 컬럼명이 password라 했지
      .eq('email', email)
      .maybeSingle()

    if (aErr) {
      return NextResponse.json({ error: 'DB_ERROR', detail: aErr.message }, { status: 500 })
    }
    if (!account) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 })
    }

    // 2) 비번 검증
    const ok = await verifyPassword(password, account.password)
    if (!ok) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 })
    }

    // 3) 세션 생성 + DB insert (expires_at 절대 null 금지)
    const token = newSessionToken()

    const days = rememberMe ? 90 : 1  // ✅ 체크 안하면 DB 만료는 짧게
    const expiresAt = new Date(Date.now() + days * 86400000).toISOString()

    const { error: sErr } = await supabaseAdmin
      .from('account_sessions')
      .insert({
        account_id: account.id,
        session_token: token,
        expires_at: expiresAt, // ✅ 이게 핵심
      })

    if (sErr) {
      return NextResponse.json(
        { error: 'SESSION_INSERT_FAILED', detail: sErr },
        { status: 500 }
      )
    }

    // 4) 쿠키 세팅
    const jar = await cookies() // ✅ Next 15에서 필요
    jar.set(
      SESSION_COOKIE_NAME,
      token,
      cookieOptions({
        // rememberMe=false면 maxAge 안 주면 “브라우저 세션 쿠키”
        maxAge: rememberMe ? days * 86400 : undefined,
      })
    )

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'LOGIN_FAILED', detail: String(e?.message || e) }, { status: 500 })
  }
}
