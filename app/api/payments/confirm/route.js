import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    // 런타임에 Supabase 클라이언트 생성 (빌드 시점 환경변수 문제 방지)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY
    const { paymentKey, orderId, amount } = await request.json()

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { success: false, message: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 토스페이먼츠 결제 승인 API 호출
    const encryptedSecretKey = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64')

    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encryptedSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
      }),
    })

    const paymentResult = await response.json()

    if (!response.ok) {
      console.error('결제 승인 실패:', paymentResult)
      return NextResponse.json(
        {
          success: false,
          message: paymentResult.message || '결제 승인에 실패했습니다.',
          code: paymentResult.code
        },
        { status: response.status }
      )
    }

    // 결제 성공 시 DB에 결제 내역 저장
    const { data: paymentHistory, error: paymentError } = await supabase
      .from('payment_history')
      .insert({
        order_id: orderId,
        payment_key: paymentKey,
        amount: paymentResult.totalAmount,
        payment_status: 'completed',
        payment_type: 'subscription',
        payment_method: paymentResult.method,
        card_company: paymentResult.card?.company,
        card_number: paymentResult.card?.number,
        approved_at: paymentResult.approvedAt,
        receipt_url: paymentResult.receipt?.url,
        raw_response: paymentResult
      })
      .select()
      .single()

    if (paymentError) {
      console.error('결제 내역 저장 실패:', paymentError)
      // 결제는 성공했으므로 에러를 던지지 않고 로그만 남김
    }

    return NextResponse.json({
      success: true,
      message: '결제가 완료되었습니다.',
      data: {
        paymentKey: paymentResult.paymentKey,
        orderId: paymentResult.orderId,
        orderName: paymentResult.orderName,
        totalAmount: paymentResult.totalAmount,
        method: paymentResult.method,
        approvedAt: paymentResult.approvedAt,
        receipt: paymentResult.receipt,
        card: paymentResult.card ? {
          company: paymentResult.card.company,
          number: paymentResult.card.number,
          cardType: paymentResult.card.cardType
        } : null
      }
    })
  } catch (error) {
    console.error('결제 처리 중 오류:', error)
    return NextResponse.json(
      { success: false, message: '결제 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
