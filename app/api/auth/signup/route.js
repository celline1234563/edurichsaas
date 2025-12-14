import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { hashPassword, newSessionToken, newUuid } from '@/lib/authCrypto'
import { generateInviteCode } from '@/lib/inviteCode'
import { SESSION_COOKIE_NAME, SESSION_DAYS, cookieOptions } from '@/lib/cookies'

export async function POST(req) {
  const body = await req.json()

  const {
    role,          // 'owner' | 'teacher' | 'manager' | 'assistant'
    academyName,   // owner only
    inviteCode,    // staff only
    name,
    email,
    password,
    phone,
    agreeMarketing,
  } = body || {}

  try {
    const passwordHash = await hashPassword(password)
    let accountId = null

    if (role === 'owner') {
      const academyId = newUuid()
      const inv = generateInviteCode(8)

      const { data, error } = await supabaseAdmin.rpc('rpc_signup_owner', {
        p_academy_id: academyId,
        p_academy_name: academyName,
        p_invite_code: inv,
        p_name: name,
        p_email: email,
        p_password_hash: passwordHash,
        p_phone: phone,
        p_agree_marketing: !!agreeMarketing,
      })

      if (error) {
        const msg = String(error.message || '')
        if (msg.includes('UNIQUE_VIOLATION')) {
          return NextResponse.json({ error: 'EMAIL_OR_CODE_EXISTS' }, { status: 409 })
        }
        return NextResponse.json({ error: 'SIGNUP_FAILED', detail: msg }, { status: 500 })
      }

      accountId = data
    } else {
      const { data, error } = await supabaseAdmin.rpc('rpc_signup_staff', {
        p_invite_code: inviteCode,
        p_name: name,
        p_email: email,
        p_password_hash: passwordHash,
        p_phone: phone,
        p_role: role,
        p_agree_marketing: !!agreeMarketing,
      })

      if (error) {
        const msg = String(error.message || '')
        if (msg.includes('INVALID_INVITE_CODE')) {
          return NextResponse.json({ error: 'INVALID_INVITE_CODE' }, { status: 400 })
        }
        if (msg.includes('UNIQUE_VIOLATION')) {
          return NextResponse.json({ error: 'EMAIL_EXISTS' }, { status: 409 })
        }
        return NextResponse.json({ error: 'SIGNUP_FAILED', detail: msg }, { status: 500 })
      }

      accountId = data
    }

    // 세션 생성
    const sessionToken = newSessionToken()
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000).toISOString()

    const { error: sErr } = await supabaseAdmin
      .from('account_sessions')
      .insert({ account_id: accountId, session_token: sessionToken, expires_at: expiresAt })

    if (sErr) {
      return NextResponse.json({ error: 'SESSION_CREATE_FAILED', detail: String(sErr.message || '') }, { status: 500 })
    }

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, cookieOptions())
    return NextResponse.json({ ok: true, accountId, role })
  } catch (e) {
    console.error('🔥 SIGNUP ERROR:', e)
    return NextResponse.json(
      { error: 'SIGNUP_FAILED', detail: String(e?.message || e) },  
      { status: 500 }
    )
  }
}
