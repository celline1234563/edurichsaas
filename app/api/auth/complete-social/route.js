// app/api/auth/complete-social/route.js
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase' // service role client

export async function POST(req) {
  try {
    const { role, academyName, inviteCode, name, phone, agree_marketing } = await req.json()

    // 1) 현재 로그인 유저 확인 (소셜 OAuth로 이미 로그인된 상태)
    const supabase = await createSupabaseServerClient()
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) {
      return NextResponse.json({ error: 'NOT_AUTHENTICATED' }, { status: 401 })
    }

    const user_id = user.id
    const email = user.email

    // 2) (원장) academies 생성 + invite_code 생성
    let academy_id = null

    if (role === 'owner') {
      if (!academyName) return NextResponse.json({ error: 'ACADEMY_NAME_REQUIRED' }, { status: 400 })

      // invite_code: 8자리 영문대문자+숫자
      const invite_code = generateInviteCode8()

      const { data: academy, error: aErr } = await supabaseAdmin
        .from('academies')
        .insert({
          name: academyName,
          owner_id: user_id,      // ✅ 너 테이블 컬럼이 owner_id 라고 했지
          invite_code,            // ✅ academies에 invite_code 컬럼 있어야 함
        })
        .select('id, invite_code')
        .single()

      if (aErr) {
        return NextResponse.json({ error: 'ACADEMY_CREATE_FAILED', detail: aErr.message }, { status: 500 })
      }

      academy_id = academy.id
    } else {
      // (직원) 초대코드로 academy 찾기 (academies.invite_code 기준)
      if (!inviteCode) return NextResponse.json({ error: 'INVITE_CODE_REQUIRED' }, { status: 400 })

      const { data: academy, error: findErr } = await supabaseAdmin
        .from('academies')
        .select('id')
        .eq('invite_code', inviteCode)
        .single()

      if (findErr || !academy) {
        return NextResponse.json({ error: 'INVALID_INVITE_CODE' }, { status: 400 })
      }
      academy_id = academy.id
    }

    // 3) accounts upsert (이미 있으면 업데이트)
    const { error: accErr } = await supabaseAdmin
      .from('accounts')
      .upsert(
        {
          user_id,
          academy_id,
          name,
          email,
          phone,
          role,               // owner/teacher/manager/assistant
          agree_marketing: !!agree_marketing, // ✅ 컬럼명 agree_marketing
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

    if (accErr) {
      return NextResponse.json({ error: 'ACCOUNT_UPSERT_FAILED', detail: accErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'SERVER_ERROR', detail: String(e?.message || e) }, { status: 500 })
  }
}

function generateInviteCode8() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let out = ''
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}
