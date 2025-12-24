// app/auth/callback/route.js
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(req) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  // 니가 redirectTo에 실어 보낸 값들
  const role = url.searchParams.get('role') || 'teacher'
  const redirect = url.searchParams.get('redirect') || ''
  const token = url.searchParams.get('token') || ''

  const supabase = await createSupabaseServerClient()

  // 1) code -> session
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(new URL(`/login?error=OAUTH_FAILED`, url.origin))
    }
  }

  // 2) 세션 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL(`/login?error=NO_SESSION`, url.origin))
  }

  // 3) accounts 존재 여부 확인
  const { data: account } = await supabase
    .from('accounts')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (account?.user_id) {
    // 이미 onboarding 완료된 유저 -> 서비스로
    return NextResponse.redirect(new URL(`/`, url.origin))
  }

  // 4) onboarding으로
  const qs = new URLSearchParams({ role })
  if (redirect) qs.set('redirect', redirect)
  if (token) qs.set('token', token)

  return NextResponse.redirect(new URL(`/auth/onboarding?${qs.toString()}`, url.origin))
}
