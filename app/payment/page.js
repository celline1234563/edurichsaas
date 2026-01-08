'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import useIsMobile from '@/hooks/useIsMobile'

// API 개별 연동 키 (test_ck_로 시작) - payment() 메서드용
const TOSS_CLIENT_KEY = 'test_ck_yZqmkKeP8gpnEQad79Pn3bQRxB9l'

export default function PaymentPage() {
  const isMobile = useIsMobile()
  const [paymentType, setPaymentType] = useState('subscription') // subscription or recharge
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [userData, setUserData] = useState(null)
  const [sdkReady, setSdkReady] = useState(false)

  const paymentRef = useRef(null)

  // 구독 플랜
  const plans = [
    { id: 'starter', name: 'Starter', monthlyPrice: 30000, yearlyPrice: 230000, aiPoints: 1500 },
    { id: 'growth', name: 'Growth', monthlyPrice: 99000, yearlyPrice: 790000, aiPoints: 5500 },
    { id: 'pro', name: 'Pro', monthlyPrice: 249000, yearlyPrice: 1990000, aiPoints: 15000 },
    { id: 'enterprise', name: 'Enterprise', monthlyPrice: 599000, yearlyPrice: 4800000, aiPoints: 40000 }
  ]

  // 포인트 충전 패키지
  const pointPackages = [
    { id: 'basic', name: '베이직 패키지', price: 33000, points: 10000, bonus: null, pricePerPoint: 3.3 },
    { id: 'standard', name: '스탠다드 패키지', price: 55000, points: 18000, bonus: '20%', pricePerPoint: 3.06, recommended: true },
    { id: 'premium', name: '프리미엄 패키지', price: 110000, points: 40000, bonus: '33%', pricePerPoint: 2.75 }
  ]

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) {
          alert('결제를 진행하려면 먼저 로그인이 필요합니다.')
          const params = new URLSearchParams(window.location.search)
          sessionStorage.setItem('pendingPayment', JSON.stringify(Object.fromEntries(params)))
          window.location.href = '/login'
          return
        }

        const data = await res.json()
        setUserData(data.user)
        setIsLoggedIn(true)
        setAuthChecking(false)

        const params = new URLSearchParams(window.location.search)
        const type = params.get('type') || 'subscription'
        setPaymentType(type)

        if (type === 'subscription') {
          const plan = params.get('plan')
          const cycle = params.get('cycle')
          if (plan) {
            const planData = plans.find(p => p.id === plan)
            setSelectedPlan(planData)
          }
          if (cycle) setBillingCycle(cycle)
        } else if (type === 'recharge') {
          const pkg = params.get('package')
          if (pkg) {
            const pkgData = pointPackages.find(p => p.id === pkg)
            setSelectedPackage(pkgData)
          }
        }
      } catch {
        alert('인증 확인 중 오류가 발생했습니다.')
        window.location.href = '/login'
      }
    }
    checkAuth()
  }, [])

  // 토스페이먼츠 SDK 로드 및 payment 인스턴스 초기화
  useEffect(() => {
    const hasSelection = paymentType === 'subscription' ? selectedPlan : selectedPackage
    if (!isLoggedIn || !hasSelection || authChecking) return

    const loadTossPayments = async () => {
      if (!window.TossPayments) {
        const script = document.createElement('script')
        script.src = 'https://js.tosspayments.com/v2/standard'
        script.async = true
        script.onload = initializePayment
        document.head.appendChild(script)
      } else {
        initializePayment()
      }
    }

    const initializePayment = async () => {
      try {
        const customerKey = userData?.id || `customer_${Date.now()}`
        const tossPayments = window.TossPayments(TOSS_CLIENT_KEY)
        const payment = tossPayments.payment({ customerKey })
        paymentRef.current = payment
        setSdkReady(true)
      } catch (error) {
        console.error('토스페이먼츠 SDK 초기화 실패:', error)
        alert(`결제 SDK 초기화 실패: ${error.message || error}`)
      }
    }

    loadTossPayments()
  }, [isLoggedIn, selectedPlan, selectedPackage, authChecking, userData, paymentType])

  const getPrice = () => {
    if (paymentType === 'recharge') {
      return selectedPackage?.price || 0
    }
    if (!selectedPlan) return 0
    return billingCycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice
  }

  // 정기결제 (빌링)
  const handleBillingPayment = async () => {
    if (!paymentRef.current || !sdkReady) {
      alert('결제 SDK가 준비되지 않았습니다.')
      return
    }
    setIsLoading(true)
    try {
      await paymentRef.current.requestBillingAuth({
        method: 'CARD',
        successUrl: `${window.location.origin}/payment/billing-success?plan=${selectedPlan.id}&cycle=${billingCycle}`,
        failUrl: `${window.location.origin}/payment/fail?type=subscription&plan=${selectedPlan.id}&cycle=${billingCycle}`,
        customerEmail: userData?.email,
        customerName: userData?.name || userData?.academyName || '고객',
      })
    } catch (error) {
      console.error('카드 등록 요청 실패:', error)
      alert(`카드 등록 요청에 실패했습니다: ${error.message}`)
      setIsLoading(false)
    }
  }

  // 일반결제 (포인트 충전)
  const handleRechargePayment = async () => {
    if (!paymentRef.current || !sdkReady) {
      alert('결제 SDK가 준비되지 않았습니다.')
      return
    }
    setIsLoading(true)
    try {
      const orderId = `RECHARGE_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      await paymentRef.current.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: selectedPackage.price },
        orderId,
        orderName: `AI 포인트 ${selectedPackage.points.toLocaleString()}P 충전`,
        successUrl: `${window.location.origin}/payment/success?type=recharge&package=${selectedPackage.id}&points=${selectedPackage.points}`,
        failUrl: `${window.location.origin}/payment/fail?type=recharge&package=${selectedPackage.id}`,
        customerEmail: userData?.email,
        customerName: userData?.name || userData?.academyName || '고객',
      })
    } catch (error) {
      console.error('결제 요청 실패:', error)
      alert(`결제 요청에 실패했습니다: ${error.message}`)
      setIsLoading(false)
    }
  }

  const handlePayment = () => {
    if (paymentType === 'subscription') {
      handleBillingPayment()
    } else {
      handleRechargePayment()
    }
  }

  if (authChecking) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 50%, #1a1f3a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: '#ffffff', fontSize: '18px' }}>인증 확인 중...</div>
      </div>
    )
  }

  const hasSelection = paymentType === 'subscription' ? selectedPlan : selectedPackage

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 50%, #1a1f3a 100%)',
      padding: isMobile ? '24px 16px' : '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: isMobile ? '24px' : '40px', textAlign: 'center' }}>
          <Link href="/" style={{
            fontSize: isMobile ? '20px' : '24px',
            fontWeight: '700',
            color: '#ffffff',
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: '16px'
          }}>
            EduRichBrain
          </Link>
          <h1 style={{ fontSize: isMobile ? '24px' : '36px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
            {paymentType === 'subscription' ? '구독 결제' : 'AI 포인트 충전'}
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: 'rgba(255, 255, 255, 0.6)' }}>
            토스페이먼츠로 안전하게 결제하세요
          </p>
        </div>

        <div style={{
          display: isMobile ? 'flex' : 'grid',
          flexDirection: 'column',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 400px',
          gap: isMobile ? '24px' : '32px',
          alignItems: 'start'
        }}>
          {/* 결제 영역 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: isMobile ? '16px' : '24px',
            padding: isMobile ? '24px 20px' : '40px',
            boxShadow: '0 20px 60px rgba(30, 58, 138, 0.2)'
          }}>
            {paymentType === 'recharge' ? (
              // 포인트 충전 UI
              <>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '24px' }}>
                  충전할 패키지 선택
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {pointPackages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      style={{
                        padding: '20px',
                        background: selectedPackage?.id === pkg.id
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(30, 41, 59, 0.5)',
                        border: selectedPackage?.id === pkg.id
                          ? '2px solid #3b82f6'
                          : '1px solid rgba(51, 65, 85, 0.5)',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        position: 'relative'
                      }}
                    >
                      {pkg.recommended && (
                        <span style={{
                          position: 'absolute',
                          top: '-10px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: '#3b82f6',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '4px 12px',
                          borderRadius: '20px'
                        }}>
                          추천
                        </span>
                      )}
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
                        {pkg.name}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>
                            {pkg.price.toLocaleString()}원
                          </span>
                          <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginLeft: '8px' }}>
                            VAT 포함
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>
                            {pkg.points.toLocaleString()}P
                          </div>
                          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                            포인트당 {pkg.pricePerPoint}원
                          </div>
                        </div>
                      </div>
                      {pkg.bonus && (
                        <div style={{
                          marginTop: '12px',
                          padding: '8px 12px',
                          background: 'rgba(251, 191, 36, 0.15)',
                          borderRadius: '8px',
                          display: 'inline-block'
                        }}>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#fbbf24' }}>
                            🎁 {pkg.bonus} 보너스
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* 결제 버튼 */}
                <button
                  onClick={handlePayment}
                  disabled={isLoading || !sdkReady || !selectedPackage}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: (isLoading || !sdkReady || !selectedPackage)
                      ? 'rgba(59, 130, 246, 0.5)'
                      : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: (isLoading || !sdkReady || !selectedPackage) ? 'not-allowed' : 'pointer',
                    boxShadow: (isLoading || !sdkReady || !selectedPackage) ? 'none' : '0 8px 24px rgba(30, 58, 138, 0.4)',
                  }}
                >
                  {isLoading ? '결제 진행 중...' : !sdkReady ? 'SDK 로딩 중...' : !selectedPackage ? '패키지를 선택하세요' : `${selectedPackage.price.toLocaleString()}원 결제하기`}
                </button>
              </>
            ) : (
              // 구독 결제 UI (기존)
              hasSelection ? (
                <>
                  <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>
                    정기결제 카드 등록
                  </h2>
                  <div style={{
                    padding: '20px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    borderRadius: '12px',
                    marginBottom: '24px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '28px' }}>💳</span>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
                          신용/체크카드 자동결제
                        </div>
                        <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
                          카드 등록 후 매월 자동으로 결제됩니다
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', lineHeight: '1.6' }}>
                      • 첫 결제: 카드 등록 직후 진행<br/>
                      • 다음 결제: 매월 같은 날 자동 결제<br/>
                      • 언제든 구독 취소 가능
                    </div>
                  </div>
                  <button
                    onClick={handlePayment}
                    disabled={isLoading || !sdkReady}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: (isLoading || !sdkReady)
                        ? 'rgba(59, 130, 246, 0.5)'
                        : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: (isLoading || !sdkReady) ? 'not-allowed' : 'pointer',
                      boxShadow: (isLoading || !sdkReady) ? 'none' : '0 8px 24px rgba(30, 58, 138, 0.4)',
                      marginBottom: '12px'
                    }}
                  >
                    {isLoading ? '카드 등록 중...' : !sdkReady ? 'SDK 로딩 중...' : `카드 등록 후 ${getPrice().toLocaleString()}원 결제`}
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor" opacity="0.5"/>
                    </svg>
                    토스페이먼츠 보안 결제
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255, 255, 255, 0.5)' }}>
                  <p style={{ marginBottom: '16px', fontSize: '16px' }}>선택된 플랜이 없습니다</p>
                  <Link href="/pricing" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                    요금제 페이지로 이동 →
                  </Link>
                </div>
              )
            )}
          </div>

          {/* 주문 요약 사이드바 */}
          {!isMobile && (
            <div style={{ position: 'sticky', top: '40px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 20px 60px rgba(30, 58, 138, 0.2)'
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '24px' }}>
                  주문 요약
                </h2>

                {paymentType === 'recharge' && selectedPackage ? (
                  <>
                    <div style={{
                      marginBottom: '24px',
                      padding: '20px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: '600', color: '#3b82f6', marginBottom: '8px' }}>
                        {selectedPackage.name}
                      </div>
                      <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '12px' }}>
                        AI 포인트 충전
                      </div>
                      <div style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff' }}>
                        {selectedPackage.points.toLocaleString()}P
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '600', color: '#ffffff' }}>
                      <span>총 결제금액</span>
                      <span style={{ color: '#3b82f6' }}>{selectedPackage.price.toLocaleString()}원</span>
                    </div>
                  </>
                ) : paymentType === 'subscription' && selectedPlan ? (
                  <>
                    <div style={{
                      marginBottom: '24px',
                      padding: '20px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                      <div style={{ fontSize: '20px', fontWeight: '600', color: '#3b82f6', marginBottom: '8px' }}>
                        {selectedPlan.name}
                      </div>
                      <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '12px' }}>
                        {billingCycle === 'monthly' ? '월간 구독' : '연간 구독'}
                      </div>
                      <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="#60a5fa"/>
                        </svg>
                        매월 {selectedPlan.aiPoints.toLocaleString()} AI 포인트
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '600', color: '#ffffff' }}>
                      <span>총 결제금액</span>
                      <span style={{ color: '#3b82f6' }}>{getPrice().toLocaleString()}원</span>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255, 255, 255, 0.5)' }}>
                    <p>선택된 상품이 없습니다</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
