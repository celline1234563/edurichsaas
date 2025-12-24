import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { SESSION_COOKIE_NAME, cookieOptions } from '@/lib/cookies'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (token) {
      await supabaseAdmin.from('account_sessions').delete().eq('session_token', token)
    }

    cookieStore.set(SESSION_COOKIE_NAME, '', cookieOptions({ maxAge: 0 }))
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'LOGOUT_FAILED', detail: String(e?.message || e) }, { status: 500 })
  }
}
