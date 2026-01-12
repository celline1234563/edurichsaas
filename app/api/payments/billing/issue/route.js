import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY
    const { authKey, customerKey } = await request.json()

    // 디버깅: 환경변수 로드 확인
    console.log('=== Billing Issue Debug ===')
    console.log('TOSS_SECRET_KEY exists:', !!TOSS_SECRET_KEY)
    console.log('TOSS_SECRET_KEY length:', TOSS_SECRET_KEY?.length)
    console.log('authKey:', authKey?.substring(0, 10) + '...')
    console.log('customerKey:', customerKey?.substring(0, 10) + '...')

    if (!TOSS_SECRET_KEY) {
      console.error('TOSS_SECRET_KEY is not set!')
      return NextResponse.json(
        { success: false, message: '서버 설정 오류: 시크릿 키가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    if (!authKey || !customerKey) {
      return NextResponse.json(
        { success: false, message: 'authKey와 customerKey가 필요합니다.' },
        { status: 400 }
      )
    }

    // 토스페이먼츠 빌링키 발급 API 호출
    const encryptedSecretKey = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64')

    const response = await fetch('https://api.tosspayments.com/v1/billing/authorizations/issue', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encryptedSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authKey,
        customerKey,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Billing key issuance failed:', result)
      return NextResponse.json(
        {
          success: false,
          message: result.message || '빌링키 발급에 실패했습니다.',
          code: result.code
        },
        { status: response.status }
      )
    }

    // 빌링키 정보를 DB에 저장
    const { data: billingData, error: billingError } = await supabase
      .from('billing_keys')
      .upsert({
        customer_key: customerKey,
        billing_key: result.billingKey,
        card_company: result.card?.company,
        card_number: result.card?.number,
        card_type: result.card?.cardType,
        authenticated_at: result.authenticatedAt,
        is_active: true,
        raw_response: result
      }, {
        onConflict: 'customer_key'
      })
      .select()
      .single()

    if (billingError) {
      console.error('Failed to save billing key:', billingError)
      // 빌링키 발급은 성공했으므로 에러를 던지지 않고 로그만 남김
    }

    return NextResponse.json({
      success: true,
      message: '빌링키가 발급되었습니다.',
      data: {
        billingKey: result.billingKey,
        customerKey: result.customerKey,
        card: result.card ? {
          company: result.card.company,
          number: result.card.number,
          cardType: result.card.cardType
        } : null
      }
    })
  } catch (error) {
    console.error('Billing key issuance error:', error)
    return NextResponse.json(
      { success: false, message: '빌링키 발급 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
