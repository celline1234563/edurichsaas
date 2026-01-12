'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { BRAIN_BASE_URL } from '@/lib/constants'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('processing') // processing, success, error
  const [paymentData, setPaymentData] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  // 서비스 시작하기 버튼 클릭 핸들러
  const handleStartService = async () => {
    try {
      const supabase = createSupabaseBrowserClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        // 세션이 있으면 토큰과 함께 마이페이지 구독 탭으로 이동
        const { access_token, refresh_token } = session
        const hash = `access_token=${encodeURIComponent(access_token)}&refresh_token=${encodeURIComponent(refresh_token)}`
        window.location.href = `${BRAIN_BASE_URL}/mypage?tab=subscription#${hash}`
      } else {
        // 세션이 없으면 마이페이지 구독 탭으로 이동
        window.location.href = `${BRAIN_BASE_URL}/mypage?tab=subscription`
      }
    } catch (error) {
      console.error('세션 가져오기 실패:', error)
      window.location.href = `${BRAIN_BASE_URL}/mypage?tab=subscription`
    }
  }

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentKey = searchParams.get('paymentKey')
      const orderId = searchParams.get('orderId')
      const amount = searchParams.get('amount')
      const type = searchParams.get('type') || 'subscription'
      const points = searchParams.get('points')

      if (!paymentKey || !orderId || !amount) {
        setStatus('error')
        setErrorMessage('결제 정보가 올바르지 않습니다.')
        return
      }

      try {
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
            type,
            points: points ? Number(points) : null,
          }),
        })

        const result = await response.json()

        if (result.success) {
          setPaymentData(result.data)
          setStatus('success')
        } else {
          setStatus('error')
          setErrorMessage(result.message || '결제 승인에 실패했습니다.')
        }
      } catch (error) {
        console.error('결제 확인 오류:', error)
        setStatus('error')
        setErrorMessage('결제 처리 중 오류가 발생했습니다.')
      }
    }

    confirmPayment()
  }, [searchParams])

  return (
    <div style={{
      maxWidth: '500px',
      width: '100%',
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(59, 130, 246, 0.25)',
      borderRadius: '24px',
      padding: '40px',
      textAlign: 'center',
      boxShadow: '0 20px 60px rgba(30, 58, 138, 0.2)'
    }}>
      {status === 'processing' && (
          <>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              border: '4px solid rgba(59, 130, 246, 0.2)',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '12px'
            }}>
              결제 처리 중...
            </h1>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              잠시만 기다려주세요
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '12px'
            }}>
              {paymentData?.type === 'recharge' ? '포인트 충전 완료!' : '결제 완료!'}
            </h1>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '32px'
            }}>
              {paymentData?.type === 'recharge'
                ? `${paymentData?.pointsCredited?.toLocaleString()}P가 충전되었습니다.`
                : `${paymentData?.orderName || '구독'} 결제가 성공적으로 완료되었습니다.`
              }
            </p>

            {/* 결제 정보 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.4)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>주문번호</span>
                <span style={{ color: '#ffffff', fontSize: '14px', fontFamily: 'monospace' }}>
                  {paymentData?.orderId}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>결제수단</span>
                <span style={{ color: '#ffffff', fontSize: '14px' }}>
                  {paymentData?.method}
                  {paymentData?.card && ` (${paymentData.card.company})`}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>결제일시</span>
                <span style={{ color: '#ffffff', fontSize: '14px' }}>
                  {paymentData?.approvedAt ? new Date(paymentData.approvedAt).toLocaleString('ko-KR') : '-'}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>결제금액</span>
                <span style={{ color: '#3b82f6', fontSize: '20px', fontWeight: '700' }}>
                  {paymentData?.totalAmount?.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* 영수증 링크 */}
            {paymentData?.receipt?.url && (
              <a
                href={paymentData.receipt.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  padding: '12px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  color: '#3b82f6',
                  fontSize: '14px',
                  textDecoration: 'none',
                  marginBottom: '24px'
                }}
              >
                영수증 보기 →
              </a>
            )}

            {/* 서비스 시작 버튼 */}
            <button
              onClick={handleStartService}
              style={{
                display: 'block',
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              {paymentData?.type === 'recharge' ? '서비스로 돌아가기' : '서비스 시작하기'}
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '12px'
            }}>
              결제 실패
            </h1>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '32px'
            }}>
              {errorMessage}
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link
                href="/payment"
                style={{
                  flex: 1,
                  padding: '16px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
              >
                다시 시도
              </Link>
              <Link
                href="/"
                style={{
                  flex: 1,
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
              >
                홈으로
              </Link>
            </div>
          </>
        )}
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 50%, #1a1f3a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Suspense fallback={
        <div style={{ color: '#ffffff', fontSize: '18px' }}>로딩 중...</div>
      }>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  )
}
