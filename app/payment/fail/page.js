'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PaymentFailContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const message = searchParams.get('message')
  const type = searchParams.get('type') || 'subscription'
  const plan = searchParams.get('plan')
  const cycle = searchParams.get('cycle')
  const pkg = searchParams.get('package')

  // 타입에 따라 다시 시도 URL 설정
  const getRetryUrl = () => {
    if (type === 'recharge') {
      return pkg ? `/payment?type=recharge&package=${pkg}` : '/payment?type=recharge'
    }
    return plan ? `/payment?type=subscription&plan=${plan}&cycle=${cycle || 'monthly'}` : '/pricing'
  }
  const retryUrl = getRetryUrl()

  const getErrorMessage = () => {
    switch (code) {
      case 'PAY_PROCESS_CANCELED':
        return '결제가 취소되었습니다.'
      case 'PAY_PROCESS_ABORTED':
        return '결제가 중단되었습니다.'
      case 'REJECT_CARD_COMPANY':
        return '카드사에서 결제를 거부했습니다.'
      case 'INVALID_CARD_NUMBER':
        return '유효하지 않은 카드 번호입니다.'
      case 'EXCEED_MAX_CARD_INSTALLMENT_PLAN':
        return '할부 개월 수가 초과되었습니다.'
      case 'NOT_SUPPORTED_INSTALLMENT_PLAN_CARD_OR_MERCHANT':
        return '할부가 지원되지 않는 카드입니다.'
      default:
        return message || '결제 처리 중 오류가 발생했습니다.'
    }
  }

  return (
    <div style={{
      maxWidth: '500px',
      width: '100%',
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(239, 68, 68, 0.25)',
      borderRadius: '24px',
      padding: '40px',
      textAlign: 'center',
      boxShadow: '0 20px 60px rgba(239, 68, 68, 0.1)'
    }}>
      {/* 실패 아이콘 */}
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
        marginBottom: '16px'
      }}>
        {getErrorMessage()}
      </p>

      {code && (
        <p style={{
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.4)',
          marginBottom: '32px',
          fontFamily: 'monospace'
        }}>
          오류 코드: {code}
        </p>
      )}

      {/* 안내 메시지 */}
      <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '24px',
        textAlign: 'left'
      }}>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.7)',
          lineHeight: '1.6',
          margin: 0
        }}>
          결제가 정상적으로 처리되지 않았습니다.
          카드 정보를 확인하시거나, 다른 결제 수단으로 다시 시도해 주세요.
        </p>
      </div>

      {/* 버튼 */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <Link
          href={retryUrl}
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

      {/* 고객센터 안내 */}
      <p style={{
        marginTop: '24px',
        fontSize: '13px',
        color: 'rgba(255, 255, 255, 0.5)'
      }}>
        문제가 계속되면{' '}
        <a
          href="mailto:support@edurichbrain.ai.kr"
          style={{ color: '#3b82f6', textDecoration: 'none' }}
        >
          고객센터
        </a>
        로 문의해 주세요.
      </p>
    </div>
  )
}

export default function PaymentFailPage() {
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
        <PaymentFailContent />
      </Suspense>
    </div>
  )
}
