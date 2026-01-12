import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// 역할별 월 가격
const ROLE_PRICES = {
  instructor: 13000,  // 강사
  staff: 8000,        // 직원
  parttime: 4000      // 알바
}

export async function POST(request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY

    const { userId, memberEmail, memberName, role } = await request.json()

    // 필수 파라미터 검증
    if (!userId || !memberEmail || !role) {
      return NextResponse.json(
        { success: false, message: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 역할 검증
    if (!ROLE_PRICES[role]) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 역할입니다.' },
        { status: 400 }
      )
    }

    const monthlyPrice = ROLE_PRICES[role]

    // 구독 정보 조회
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('customer_key', userId)
      .eq('status', 'active')
      .single()

    if (subError || !subscription) {
      return NextResponse.json(
        { success: false, message: '활성 구독을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 빌링키 조회
    const { data: billingInfo, error: billingError } = await supabase
      .from('billing_keys')
      .select('*')
      .eq('customer_key', userId)
      .eq('is_active', true)
      .single()

    if (billingError || !billingInfo) {
      return NextResponse.json(
        { success: false, message: '등록된 결제 수단이 없습니다.' },
        { status: 404 }
      )
    }

    // 일할 계산: (월 가격 / 30) * 남은 일수
    const nextPaymentDate = new Date(subscription.next_payment_date)
    const today = new Date()
    const daysRemaining = Math.max(1, Math.ceil((nextPaymentDate - today) / (1000 * 60 * 60 * 24)))
    const proratedAmount = Math.ceil((monthlyPrice / 30) * daysRemaining)

    // 토스페이먼츠 빌링 결제
    const orderId = `TEAM_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    const encryptedSecretKey = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64')

    const roleNames = { instructor: '강사', staff: '직원', parttime: '알바' }
    const orderName = `팀원 추가 (${roleNames[role]}) - 일할계산`

    const response = await fetch(`https://api.tosspayments.com/v1/billing/${billingInfo.billing_key}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encryptedSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerKey: userId,
        amount: proratedAmount,
        orderId,
        orderName,
      }),
    })

    const paymentResult = await response.json()

    if (!response.ok) {
      console.error('Team member billing failed:', paymentResult)
      return NextResponse.json(
        {
          success: false,
          message: paymentResult.message || '결제에 실패했습니다.',
          code: paymentResult.code
        },
        { status: response.status }
      )
    }

    // 결제 내역 저장
    await supabase
      .from('payment_history')
      .insert({
        order_id: orderId,
        payment_key: paymentResult.paymentKey,
        billing_key: billingInfo.billing_key,
        customer_key: userId,
        amount: paymentResult.totalAmount,
        payment_status: 'completed',
        payment_type: 'team_prorated',
        payment_method: paymentResult.method,
        card_company: paymentResult.card?.company,
        card_number: paymentResult.card?.number,
        approved_at: paymentResult.approvedAt,
        receipt_url: paymentResult.receipt?.url,
        raw_response: paymentResult
      })

    // 초대 토큰 생성
    const inviteToken = crypto.randomBytes(32).toString('hex')

    // 팀 멤버 레코드 생성
    const { data: teamMember, error: memberError } = await supabase
      .from('team_members')
      .insert({
        subscription_id: subscription.id,
        owner_user_id: userId,
        member_email: memberEmail,
        member_name: memberName,
        role,
        monthly_price: monthlyPrice,
        status: 'pending',
        invite_token: inviteToken,
        invite_sent_at: new Date().toISOString()
      })
      .select()
      .single()

    if (memberError) {
      console.error('Failed to create team member:', memberError)
      return NextResponse.json(
        { success: false, message: '팀원 추가에 실패했습니다.' },
        { status: 500 }
      )
    }

    // TODO: 초대 이메일 발송
    // const inviteUrl = `https://edurichbrain.vercel.app/signup/invite?token=${inviteToken}`
    // await sendInviteEmail(memberEmail, memberName, inviteUrl, roleNames[role])

    return NextResponse.json({
      success: true,
      message: '팀원이 추가되었습니다. 초대 이메일이 발송됩니다.',
      data: {
        teamMemberId: teamMember.id,
        memberEmail,
        memberName,
        role,
        monthlyPrice,
        proratedAmount,
        daysRemaining,
        paymentKey: paymentResult.paymentKey,
        inviteToken,
        receipt: paymentResult.receipt
      }
    })
  } catch (error) {
    console.error('Team invite error:', error)
    return NextResponse.json(
      { success: false, message: '팀원 초대 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
