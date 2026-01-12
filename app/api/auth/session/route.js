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

    // getUser()를 먼저 호출하여 토큰 갱신 강제
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return withCors(NextResponse.json({ error: 'NO_SESSION', detail: userError?.message }, { status: 401 }))
    }

    // getUser() 성공 후 갱신된 세션 가져오기
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return withCors(NextResponse.json({ error: 'SESSION_REFRESH_FAILED' }, { status: 401 }))
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
