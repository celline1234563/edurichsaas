// app/auth/callback/route.js
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=NO_CODE`)
  }

  // ✅ async client
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(`${origin}/login?error=OAUTH_CALLBACK_FAILED`)
  }

  // 세션 정상 → 소셜 추가정보 페이지
  return NextResponse.redirect(`${origin}/signup/social`)
}
