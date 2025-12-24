// app/api/auth/signup/route.js
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase' // service role client

export async function POST(req) {
  try {
    const body = await req.json()
    const {
      role, // 'owner' | 'teacher' | 'manager' | 'assistant'
      academyName,
      inviteCode,
      name,
      email,
      password,
      phone,
      agreeMarketing, // ✅ row name: agree_marketing
    } = body || {}

    // basic validation (필요 최소만)
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 })
    }
    if (!role) {
      return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 })
    }
    if (role === 'owner' && !academyName) {
      return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 })
    }
    if (role !== 'owner' && !inviteCode) {
      return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 })
    }

    // 1) Auth signUp (서버 client)
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone }, // auth.users.user_metadata
      },
    })

    if (error) {
      const msg = String(error.message || '')
      // supabase는 상황에 따라 문구가 달라서 넓게 잡음
      if (
        msg.toLowerCase().includes('already') ||
        msg.toLowerCase().includes('registered') ||
        msg.toLowerCase().includes('exists') ||
        msg.toLowerCase().includes('duplicate')
      ) {
        return NextResponse.json({ error: 'EMAIL_EXISTS' }, { status: 409 })
      }
      return NextResponse.json({ error: 'SIGNUP_FAILED', detail: msg }, { status: 400 })
    }

    const userId = data?.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'SIGNUP_FAILED', detail: 'NO_USER_ID' }, { status: 500 })
    }

    // 공통: accounts upsert helper
    const upsertAccount = async ({ academyId }) => {
      // accounts 테이블 구조: user_id, academy_id, role, name, email, phone, agree_marketing ...
      // (네가 보여준 컬럼에 맞춰서 최소로만 넣음)
      const { error: accErr } = await supabaseAdmin
        .from('accounts')
        .upsert(
          {
            user_id: userId,
            academy_id: academyId ?? null,
            role,
            name,
            email,
            phone: phone ?? null,
            agree_marketing: !!agreeMarketing,
          },
          { onConflict: 'user_id' }
        )

      if (accErr) throw new Error(`ACCOUNTS_UPSERT_FAILED: ${accErr.message}`)
    }

    if (role === 'owner') {
      // 2-A) owner: academies 생성 + invite_code 생성
      // invite_code는 DB 함수 generate_invite_code() 사용 (이미 만들어둔 상태 가정)
      // ✅ owner 컬럼은 owner_id 라고 했지
      const { data: academy, error: acadErr } = await supabaseAdmin
        .from('academies')
        .insert({
          name: academyName,
          owner_id: userId,
          invite_code: null, // 아래 update에서 채움(함수로)
        })
        .select('id')
        .single()

      if (acadErr) {
        return NextResponse.json(
          { error: 'OWNER_CREATE_FAILED', detail: acadErr.message },
          { status: 500 }
        )
      }

      // invite_code 채우기 (DB 함수가 1개로 유니크해야 함)
      const { error: codeErr } = await supabaseAdmin
        .from('academies')
        .update({ invite_code: supabaseAdmin.rpc ? undefined : undefined }) // dummy
        .eq('id', academy.id)

      // 위 update는 쓸데없는 줄이라 삭제해도 되지만,
      // supabase-js는 update에 "rpc 호출"을 직접 못 넣으니,
      // 아래처럼 SQL RPC로 채우는 방식이 안전함.

      const { data: newCode, error: rpcErr } = await supabaseAdmin.rpc('generate_invite_code')
      if (rpcErr) {
        return NextResponse.json(
          { error: 'OWNER_CREATE_FAILED', detail: rpcErr.message },
          { status: 500 }
        )
      }

      const { error: updErr } = await supabaseAdmin
        .from('academies')
        .update({ invite_code: newCode })
        .eq('id', academy.id)

      if (updErr) {
        return NextResponse.json(
          { error: 'OWNER_CREATE_FAILED', detail: updErr.message },
          { status: 500 }
        )
      }

      // 2-C) accounts 생성(원장도)
      try {
        await upsertAccount({ academyId: academy.id })
      } catch (e) {
        return NextResponse.json(
          { error: 'OWNER_CREATE_FAILED', detail: String(e?.message || e) },
          { status: 500 }
        )
      }

      return NextResponse.json({ ok: true, academyId: academy.id })
    }

    // 2-B) staff: inviteCode로 academies 찾고 accounts 생성
    const { data: academyRow, error: findErr } = await supabaseAdmin
      .from('academies')
      .select('id')
      .eq('invite_code', inviteCode)
      .single()

    if (findErr || !academyRow?.id) {
      return NextResponse.json({ error: 'INVALID_INVITE_CODE' }, { status: 400 })
    }

    try {
      await upsertAccount({ academyId: academyRow.id })
    } catch (e) {
      return NextResponse.json(
        { error: 'STAFF_CREATE_FAILED', detail: String(e?.message || e) },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, academyId: academyRow.id })
  } catch (e) {
    return NextResponse.json(
      { error: 'SIGNUP_FAILED', detail: String(e?.message || e) },
      { status: 500 }
    )
  }
}
