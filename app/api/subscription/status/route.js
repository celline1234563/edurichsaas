import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'userId가 필요합니다.' },
        { status: 400 }
      )
    }

    // 활성 구독 확인 (customer_key로 조회)
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('customer_key', userId)
      .eq('status', 'active')
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116은 결과가 없을 때 발생
      console.error('구독 조회 오류:', error)
    }

    return NextResponse.json({
      success: true,
      hasSubscription: !!subscription,
      subscription: subscription || null
    })
  } catch (error) {
    console.error('구독 상태 확인 오류:', error)
    return NextResponse.json(
      { success: false, message: '구독 상태 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
