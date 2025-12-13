import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { getUserSubscription, getUserCredits, canUseService } from '../../../lib/supabase'

// GET: 현재 사용자의 구독 및 크레딧 상태 조회
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

    // 구독 정보 조회
    const subscription = await getUserSubscription(userId)

    // 크레딧 정보 조회
    const credits = await getUserCredits(userId)

    // 서비스 이용 가능 여부 확인
    const serviceStatus = await canUseService(userId)

    return NextResponse.json({
      success: true,
      data: {
        subscription: subscription || null,
        credits: credits?.credits || 0,
        canUseService: serviceStatus.canUse,
        serviceStatus: serviceStatus.reason || 'active',
        message: serviceStatus.message
      }
    })
  } catch (error) {
    console.error('Subscription check error:', error)
    return NextResponse.json({
      success: false,
      error: 'server_error',
      message: '서버 오류가 발생했습니다.'
    }, { status: 500 })
  }
}
