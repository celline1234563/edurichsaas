import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { getUserCredits, deductCredits, addCredits, getCreditHistory } from '../../../lib/supabase'

// GET: 크레딧 잔액 및 히스토리 조회
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: 'unauthorized',
        message: '로그인이 필요합니다.'
      }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const includeHistory = searchParams.get('history') === 'true'

    // 크레딧 정보 조회
    const credits = await getUserCredits(userId)

    let response = {
      success: true,
      data: {
        credits: credits?.credits || 0,
        lastUpdated: credits?.updated_at || null
      }
    }

    // 히스토리 포함 요청 시
    if (includeHistory) {
      const history = await getCreditHistory(userId)
      response.data.history = history || []
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Credits fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'server_error',
      message: '서버 오류가 발생했습니다.'
    }, { status: 500 })
  }
}

// POST: 크레딧 차감 (AI 기능 사용 시)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: 'unauthorized',
        message: '로그인이 필요합니다.'
      }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { amount, reason } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'invalid_amount',
        message: '유효하지 않은 크레딧 금액입니다.'
      }, { status: 400 })
    }

    // 크레딧 차감
    const result = await deductCredits(userId, amount, reason || 'ai_usage')

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error,
        message: '크레딧이 부족합니다.'
      }, { status: 402 }) // Payment Required
    }

    return NextResponse.json({
      success: true,
      data: {
        remaining: result.remaining,
        deducted: amount
      },
      message: '크레딧이 차감되었습니다.'
    })
  } catch (error) {
    console.error('Credits deduction error:', error)
    return NextResponse.json({
      success: false,
      error: 'server_error',
      message: '서버 오류가 발생했습니다.'
    }, { status: 500 })
  }
}
