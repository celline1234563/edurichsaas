// app/auth/callback/route.js
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function getSafeNextUrl(nextRaw) {
  if (!nextRaw) return null

  try {
    const url = new URL(nextRaw)

    // ✅ 허용할 origin(운영 + 로컬 개발)
    const ALLOWED_ORIGINS = new Set([
      'https://edurichbrain.ai.kr',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ])

    if (!ALLOWED_ORIGINS.has(url.origin)) return null

    // ✅ “진단 결과 페이지”만 허용 (원하는 경로로 조정 가능)
    // 예: /diagnosis/result?token=...
    const ALLOWED_PATH_PREFIXES = [
      '/diagnosis/result',
      '/diagnosis/result/', // 혹시 슬래시 붙는 케이스
    ]

    const isAllowedPath = ALLOWED_PATH_PREFIXES.some((p) => url.pathname.startsWith(p))
    if (!isAllowedPath) return null

    return url.toString()
  } catch (e) {
    return null
  }
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // ✅ 여기 추가: 진단 플로우 쿼리 유지
  const redirect = searchParams.get('redirect')
  const token = searchParams.get('token')

  const diagnosisQuery =
    redirect === 'diagnosis' && token
      ? `?redirect=diagnosis&token=${encodeURIComponent(token)}`
      : ''

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=NO_CODE`)
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(`${origin}/login?error=OAUTH_CALLBACK_FAILED`)
  }

  // ✅ 소셜 추가정보 페이지도 진단 플로우면 쿼리 그대로 전달
  return NextResponse.redirect(`${origin}/signup/social${diagnosisQuery}`)
}