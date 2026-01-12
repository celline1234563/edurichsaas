import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY
    const { billingKey, customerKey, amount, orderName, planId, cycle } = await request.json()

    if (!billingKey || !amount || !orderName) {
      return NextResponse.json(
        { success: false, message: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 팀원 추가 비용 조회
    const { data: teamMembers } = await supabase
      .from('team_members')
      .select('monthly_price, role')
      .eq('owner_user_id', customerKey)
      .in('status', ['pending', 'active'])

    const teamMembersCost = teamMembers?.reduce((sum, m) => sum + m.monthly_price, 0) || 0
    const totalAmount = Number(amount) + teamMembersCost

    // 주문 ID 생성
    const orderId = `BILLING_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    // 토스페이먼츠 빌링 결제 API 호출
    const encryptedSecretKey = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64')

    const response = await fetch(`https://api.tosspayments.com/v1/billing/${billingKey}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encryptedSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerKey,
        amount: totalAmount,
        orderId,
        orderName: teamMembersCost > 0
          ? `${orderName} + 팀원 ${teamMembers.length}명`
          : orderName,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Billing payment failed:', result)
      return NextResponse.json(
        {
          success: false,
          message: result.message || '결제에 실패했습니다.',
          code: result.code
        },
        { status: response.status }
      )
    }

    // 다음 결제일 계산
    const nextPaymentDate = new Date()
    if (cycle === 'yearly') {
      nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1)
    } else {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)
    }

    // 결제 내역을 DB에 저장
    const { data: paymentHistory, error: paymentError } = await supabase
      .from('payment_history')
      .insert({
        order_id: orderId,
        payment_key: result.paymentKey,
        billing_key: billingKey,
        customer_key: customerKey,
        amount: result.totalAmount,
        payment_status: 'completed',
        payment_type: 'billing',
        payment_method: result.method,
        card_company: result.card?.company,
        card_number: result.card?.number,
        approved_at: result.approvedAt,
        receipt_url: result.receipt?.url,
        plan_id: planId,
        billing_cycle: cycle,
        next_payment_date: nextPaymentDate.toISOString(),
        raw_response: result
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Failed to save payment history:', paymentError)
    }

    // 구독 정보 업데이트/생성
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .upsert({
        customer_key: customerKey,
        billing_key: billingKey,
        plan_id: planId,
        billing_cycle: cycle,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: nextPaymentDate.toISOString(),
        next_payment_date: nextPaymentDate.toISOString(),
        last_payment_amount: result.totalAmount
      }, {
        onConflict: 'customer_key'
      })

    if (subscriptionError) {
      console.error('Failed to update subscription:', subscriptionError)
    }

    return NextResponse.json({
      success: true,
      message: '정기결제가 완료되었습니다.',
      data: {
        paymentKey: result.paymentKey,
        orderId: result.orderId,
        orderName: result.orderName,
        totalAmount: result.totalAmount,
        method: result.method,
        approvedAt: result.approvedAt,
        receipt: result.receipt,
        card: result.card ? {
          company: result.card.company,
          number: result.card.number,
          cardType: result.card.cardType
        } : null,
        nextPaymentDate: nextPaymentDate.toLocaleDateString('ko-KR')
      }
    })
  } catch (error) {
    console.error('Billing payment error:', error)
    return NextResponse.json(
      { success: false, message: '결제 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
