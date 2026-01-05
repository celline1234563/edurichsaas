// app/api/auth/me/route.js
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase'
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
    // Supabase Auth 세션 확인
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return withCors(NextResponse.json({ error: 'NO_SESSION' }, { status: 401 }))
    }

    // accounts 테이블에서 추가 정보 가져오기
    const { data: account } = await supabaseAdmin
      .from('accounts')
      .select('id, name, email, role, academy_id, phone')
      .eq('user_id', user.id)
      .maybeSingle()

    return withCors(NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: account?.name || user.user_metadata?.name,
        role: account?.role,
        academyId: account?.academy_id,
        phone: account?.phone || user.user_metadata?.phone
      }
    }))
  } catch (e) {
    return withCors(NextResponse.json({ error: 'ME_FAILED', detail: String(e?.message || e) }, { status: 500 }))
  }
}
