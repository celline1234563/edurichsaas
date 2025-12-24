import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

function makeInviteCode(len = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let out = ''
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

export async function POST(req) {
  try {
    const supabase = await createSupabaseServerClient()

    // 1) 현재 로그인 유저 확인
    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }
    const user = userData.user
    const userId = user.id
    const email = user.email

    // 2) body
    const body = await req.json()
    const {
      role, // owner/teacher/manager/assistant
      name,
      phone,
      agree_marketing,
      academy_name,
      invite_code,
    } = body || {}

    if (!role || !name || !phone) {
      return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 })
    }
    if (role === 'owner' && !academy_name) {
      return NextResponse.json({ error: 'ACADEMY_NAME_REQUIRED' }, { status: 400 })
    }
    if (role !== 'owner' && (!invite_code || String(invite_code).length !== 8)) {
      return NextResponse.json({ error: 'INVITE_CODE_REQUIRED' }, { status: 400 })
    }

    // 3) owner면 academies 생성 + invite_code 생성
    let academyId = null

    if (role === 'owner') {
      // invite_code 생성 (중복이면 재시도)
      let code = null
      for (let i = 0; i < 10; i++) {
        const cand = makeInviteCode(8)
        const { data: exists } = await supabaseAdmin
          .from('academies')
          .select('id')
          .eq('invite_code', cand)
          .maybeSingle()
        if (!exists) { code = cand; break }
      }
      if (!code) return NextResponse.json({ error: 'INVITE_CODE_GEN_FAILED' }, { status: 500 })

      const { data: academy, error: academyErr } = await supabaseAdmin
        .from('academies')
        .insert({
          name: academy_name,
          owner_id: userId,      // ✅ 너가 말한 컬럼명 owner_id
          invite_code: code,     // ✅ academies에 invite_code 같이 저장
        })
        .select('id')
        .single()

      if (academyErr) {
        return NextResponse.json({ error: 'ACADEMY_CREATE_FAILED', detail: academyErr.message }, { status: 500 })
      }

      academyId = academy.id
    } else {
      // staff: invite_code로 academies 찾기
      const { data: academy, error: findErr } = await supabaseAdmin
        .from('academies')
        .select('id')
        .eq('invite_code', invite_code)
        .single()

      if (findErr || !academy?.id) {
        return NextResponse.json({ error: 'INVALID_INVITE_CODE' }, { status: 400 })
      }
      academyId = academy.id
    }

    // 4) accounts upsert(생성/갱신)
    // accounts 구조: user_id(PK), academy_id, name, email, phone, role, agree_marketing
    const { error: accErr } = await supabaseAdmin
      .from('accounts')
      .upsert({
        user_id: userId,
        academy_id: academyId,
        name,
        email,
        phone,
        role,
        agree_marketing: !!agree_marketing, // ✅ agree_marketing 컬럼명
      }, { onConflict: 'user_id' })

    if (accErr) {
      return NextResponse.json({ error: 'ACCOUNT_UPSERT_FAILED', detail: accErr.message }, { status: 500 })
    }

    // 5) auth.user_metadata도 같이 업데이트 (선택)
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...(user.user_metadata || {}),
        name,
        phone,
        role,
        academy_id: academyId,
        agree_marketing: !!agree_marketing,
      },
    })

    return NextResponse.json({ ok: true, academy_id: academyId })
  } catch (e) {
    return NextResponse.json({ error: 'SERVER_ERROR', detail: String(e?.message || e) }, { status: 500 })
  }
}
