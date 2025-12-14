import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { SESSION_COOKIE_NAME } from '@/lib/cookies'

export async function POST() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value

  if (token) {
    await supabaseAdmin.from('account_sessions').delete().eq('session_token', token)
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 })
  return NextResponse.json({ ok: true })
}
