// app/api/auth/social-complete/route.js
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase'

// 8자리 초대코드 (A-Z0-9)
function makeInviteCode(len = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let out = ''
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { role, academyName, inviteCode, phone, agree_marketing } = body || {}

    // 0) 로그인 유저 확인 (세션 기준)
    const supabase = await createSupabaseServerClient()
    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData?.user?.id) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }
    const userId = userData.user.id
    const email = userData.user.email || null
    const name = userData.user.user_metadata?.name || userData.user.user_metadata?.full_name || null

    // 공통 입력 체크
    if (!role) return NextResponse.json({ error: 'ROLE_REQUIRED' }, { status: 400 })
    if (!phone) return NextResponse.json({ error: 'PHONE_REQUIRED' }, { status: 400 })

    // 1) accounts 먼저 upsert (academy_id는 뒤에서 세팅)
    //    ✅ agree_marketing 컬럼명 주의
    const baseAccount = {
      user_id: userId,
      name,
      email,
      phone,
      role,
      agree_marketing: !!agree_marketing,
      updated_at: new Date().toISOString(),
    }

    const { error: accErr1 } = await supabaseAdmin
      .from('accounts')
      .upsert(baseAccount, { onConflict: 'user_id' })
    if (accErr1) {
      return NextResponse.json({ error: 'ACCOUNTS_UPSERT_FAILED', detail: accErr1.message }, { status: 500 })
    }

    // 2) owner면 academies 생성 + invite_code 생성 + accounts.academy_id 업데이트
    if (role === 'owner') {
      if (!academyName) {
        return NextResponse.json({ error: 'ACADEMY_NAME_REQUIRED' }, { status: 400 })
      }

      // invite_code 충돌 방지: 몇 번 시도
      let createdAcademy = null
      let lastErr = null

      for (let i = 0; i < 8; i++) {
        const code = makeInviteCode(8)

        const { data: academy, error: acadErr } = await supabaseAdmin
          .from('academies')
          .insert({
            name: academyName,
            owner_id: userId,      // ✅ 너 테이블 컬럼이 owner_id라 했지
            invite_code: code,     // ✅ 같이 저장
          })
          .select('id, invite_code')
          .single()

        if (!acadErr) {
          createdAcademy = academy
          break
        }
        lastErr = acadErr
      }

      if (!createdAcademy) {
        return NextResponse.json({ error: 'ACADEMY_CREATE_FAILED', detail: lastErr?.message }, { status: 500 })
      }

      const { error: accErr2 } = await supabaseAdmin
        .from('accounts')
        .update({ academy_id: createdAcademy.id, updated_at: new Date().toISOString() })
        .eq('user_id', userId)

      if (accErr2) {
        return NextResponse.json({ error: 'ACCOUNTS_LINK_ACADEMY_FAILED', detail: accErr2.message }, { status: 500 })
      }

      return NextResponse.json({ ok: true, academy: createdAcademy })
    }

    // 3) staff면 inviteCode로 academy 찾아서 accounts.academy_id 업데이트
    if (!inviteCode) {
      return NextResponse.json({ error: 'INVITE_CODE_REQUIRED' }, { status: 400 })
    }

    const { data: academy, error: findErr } = await supabaseAdmin
      .from('academies')
      .select('id')
      .eq('invite_code', inviteCode)
      .single()

    if (findErr || !academy?.id) {
      return NextResponse.json({ error: 'INVALID_INVITE_CODE' }, { status: 400 })
    }

    const { error: accErr3 } = await supabaseAdmin
      .from('accounts')
      .update({ academy_id: academy.id, updated_at: new Date().toISOString() })
      .eq('user_id', userId)

    if (accErr3) {
      return NextResponse.json({ error: 'ACCOUNTS_LINK_ACADEMY_FAILED', detail: accErr3.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'SOCIAL_COMPLETE_FAILED', detail: String(e?.message || e) }, { status: 500 })
  }
}
