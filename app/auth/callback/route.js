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
  const flow = searchParams.get('flow') // "diagnosis"면 진단에서 온 것
  const nextRaw = searchParams.get('next') // brain으로 돌아갈 전체 URL

  if (!code) {
    // 로그인 페이지는 너네 SaaS 라우팅에 맞게 수정
    return NextResponse.redirect(`${origin}/login?error=NO_CODE`)
  }

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(`${origin}/login?error=OAUTH_CALLBACK_FAILED`)
  }

  // ✅ 진단에서 온 경우에만: 안전한 next로 복귀
  if (flow === 'diagnosis') {
    const safeNext = getSafeNextUrl(nextRaw)
    if (safeNext) {
      return NextResponse.redirect(safeNext)
    }
    // 안전하지 않으면 그냥 기본 경로로 보냄
  }

  // 기본: 기존대로 소셜 추가정보 페이지
  return NextResponse.redirect(`${origin}/signup/social`)
}
