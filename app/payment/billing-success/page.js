'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { BRAIN_BASE_URL } from '@/lib/constants'

const plans = {
  starter: { name: 'Starter', monthlyPrice: 30000, yearlyPrice: 230000 },
  growth: { name: 'Growth', monthlyPrice: 99000, yearlyPrice: 790000 },
  pro: { name: 'Pro', monthlyPrice: 249000, yearlyPrice: 1990000 },
  enterprise: { name: 'Enterprise', monthlyPrice: 599000, yearlyPrice: 4800000 }
}

// 팀원 역할별 가격
const TEAM_ROLE_PRICES = {
  instructor: { name: '강사', price: 13000 },
  staff: { name: '직원', price: 8000 },
  parttime: { name: '알바', price: 4000 }
}

function BillingSuccessContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('processing') // processing, success, error
  const [paymentData, setPaymentData] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [retryUrl, setRetryUrl] = useState('/payment')
  const [addedTeamMembers, setAddedTeamMembers] = useState([])

  const navigateWithSession = async (path) => {
    try {
      const supabase = createSupabaseBrowserClient()

      // 먼저 getUser()로 토큰 갱신 시도
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // getUser 성공 후 갱신된 세션 가져오기
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) {
          const hash = `access_token=${encodeURIComponent(session.access_token)}&refresh_token=${encodeURIComponent(session.refresh_token || '')}`
          window.location.href = `${BRAIN_BASE_URL}${path}#${hash}`
          return
        }
      }

      // 브라우저 세션이 없으면 서버 API를 통해 세션 복구 시도
      const authRes = await fetch('/api/auth/session', { credentials: 'include' })
      if (authRes.ok) {
        const authData = await authRes.json()
        if (authData.session?.access_token) {
          const hash = `access_token=${encodeURIComponent(authData.session.access_token)}&refresh_token=${encodeURIComponent(authData.session.refresh_token || '')}`
          window.location.href = `${BRAIN_BASE_URL}${path}#${hash}`
          return
        }
      }

      // 세션 복구 실패 시 로그인 페이지로 리다이렉트
      window.location.href = `${BRAIN_BASE_URL}/login?redirect=${encodeURIComponent(path)}`
    } catch (error) {
      console.error('Failed to get session:', error)
      window.location.href = `${BRAIN_BASE_URL}/login?redirect=${encodeURIComponent(path)}`
    }
  }

  const handleStartService = async () => {
    await navigateWithSession('/mypage?tab=subscription')
  }

  const handleCheckSubscription = async (e) => {
    e.preventDefault()
    await navigateWithSession('/mypage?tab=subscription')
  }

  useEffect(() => {
    const processBilling = async () => {
      const authKey = searchParams.get('authKey')
      const customerKey = searchParams.get('customerKey')
      const planId = searchParams.get('plan')
      const cycle = searchParams.get('cycle') || 'monthly'

      // 다시 시도 URL 설정 (플랜 정보 유지)
      if (planId) {
        setRetryUrl(`/payment?plan=${planId}&cycle=${cycle}`)
      }

      if (!authKey || !customerKey) {
        setStatus('error')
        setErrorMessage('카드 인증 정보가 올바르지 않습니다.')
        return
      }

      const plan = plans[planId]
      if (!plan) {
        setStatus('error')
        setErrorMessage('선택한 요금제를 찾을 수 없습니다.')
        return
      }

      // sessionStorage에서 팀원 정보 가져오기
      let pendingTeamMembers = []
      try {
        const storedMembers = sessionStorage.getItem('pendingTeamMembers')
        if (storedMembers) {
          pendingTeamMembers = JSON.parse(storedMembers)
        }
      } catch (e) {
        console.error('팀원 정보 파싱 오류:', e)
      }

      // 팀원 비용 계산
      const teamMembersCost = pendingTeamMembers.reduce(
        (sum, m) => sum + (TEAM_ROLE_PRICES[m.role]?.price || 0), 0
      )

      const baseAmount = cycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
      const amount = baseAmount + teamMembersCost

      let orderName = `EduRichBrain ${plan.name} ${cycle === 'monthly' ? '월간' : '연간'} 구독`
      if (pendingTeamMembers.length > 0) {
        orderName += ` + 팀원 ${pendingTeamMembers.length}명`
      }

      try {
        // 1. 빌링키 발급 API 호출
        const billingKeyResponse = await fetch('/api/payments/billing/issue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ authKey, customerKey })
        })

        const billingKeyResult = await billingKeyResponse.json()

        if (!billingKeyResult.success) {
          setStatus('error')
          setErrorMessage(billingKeyResult.message || '빌링키 발급에 실패했습니다.')
          return
        }

        const { billingKey } = billingKeyResult.data

        // 2. 빌링키로 첫 결제 실행 (팀원 정보 포함)
        const paymentResponse = await fetch('/api/payments/billing/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            billingKey,
            customerKey,
            amount,
            orderName,
            planId,
            cycle,
            teamMembers: pendingTeamMembers // 팀원 정보 전달
          })
        })

        const paymentResult = await paymentResponse.json()

        if (paymentResult.success) {
          setPaymentData(paymentResult.data)
          setAddedTeamMembers(pendingTeamMembers)
          setStatus('success')

          // 성공 시 sessionStorage 정리
          sessionStorage.removeItem('pendingTeamMembers')
        } else {
          setStatus('error')
          setErrorMessage(paymentResult.message || '결제 처리에 실패했습니다.')
        }
      } catch (error) {
        console.error('Billing process error:', error)
        setStatus('error')
        setErrorMessage('결제 처리 중 오류가 발생했습니다.')
      }
    }

    processBilling()
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
            정기결제 등록 중...
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            카드 등록 및 첫 결제를 처리하고 있습니다
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
            정기결제 등록 완료!
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '32px'
          }}>
            {paymentData?.orderName || '구독'} 결제가 성공적으로 완료되었습니다.
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
              <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>다음 결제일</span>
              <span style={{ color: '#ffffff', fontSize: '14px' }}>
                {paymentData?.nextPaymentDate || '다음 달 같은 날'}
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

          {/* 정기결제 안내 */}
          <div style={{
            padding: '16px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '12px',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            <p style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6',
              margin: 0
            }}>
              정기결제가 등록되었습니다. 매월 같은 날 자동으로 결제됩니다.
              언제든 마이페이지에서 구독을 취소할 수 있습니다.
            </p>
          </div>

          {/* 팀원 추가 결과 또는 안내 */}
          {addedTeamMembers.length > 0 ? (
            <div style={{
              padding: '16px',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '12px',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '18px' }}>👥</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#22c55e' }}>
                  팀원 {addedTeamMembers.length}명 추가 완료
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {addedTeamMembers.map((member, idx) => (
                  <div key={idx} style={{
                    padding: '10px 12px',
                    background: 'rgba(15, 23, 42, 0.4)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', color: '#ffffff' }}>
                        {member.name || member.email}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                        {TEAM_ROLE_PRICES[member.role]?.name}
                      </div>
                    </div>
                    <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
                      +{TEAM_ROLE_PRICES[member.role]?.price.toLocaleString()}원/월
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              padding: '16px',
              background: 'rgba(100, 116, 139, 0.1)',
              border: '1px solid rgba(100, 116, 139, 0.2)',
              borderRadius: '12px',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '18px' }}>👥</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8' }}>
                  팀원을 추가하시겠어요?
                </span>
              </div>
              <p style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: '1.5',
                margin: '0 0 12px 0'
              }}>
                강사, 직원, 알바를 추가하여 함께 서비스를 이용할 수 있습니다.
              </p>
              <Link
                href="/payment?type=team"
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: '#60a5fa',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                팀원 추가하기 →
              </Link>
            </div>
          )}

          {/* 영수증 및 구독현황 버튼 */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {paymentData?.receipt?.url && (
              <a
                href={paymentData.receipt.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  color: '#3b82f6',
                  fontSize: '14px',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
              >
                영수증 보기
              </a>
            )}
            <button
              onClick={handleCheckSubscription}
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '12px',
                color: '#22c55e',
                fontSize: '14px',
                textDecoration: 'none',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              구독 및 결제현황 확인
            </button>
          </div>

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
            서비스 시작하기
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
            정기결제 등록 실패
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
        </>
      )}
    </div>
  )
}

export default function BillingSuccessPage() {
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
        <div style={{ color: '#ffffff', fontSize: '18px' }}>Loading...</div>
      }>
        <BillingSuccessContent />
      </Suspense>
    </div>
  )
}
