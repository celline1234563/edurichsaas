'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import useIsMobile from '@/hooks/useIsMobile'

// API 개별 연동 키 (test_ck_로 시작) - payment() 메서드용
const TOSS_CLIENT_KEY = 'test_ck_yZqmkKeP8gpnEQad79Pn3bQRxB9l'

export default function PaymentPage() {
  const isMobile = useIsMobile()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [userData, setUserData] = useState(null)
  const [sdkReady, setSdkReady] = useState(false)

  const paymentRef = useRef(null)

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 30000,
      yearlyPrice: 230000,
      aiPoints: 1500,
    },
    {
      id: 'growth',
      name: 'Growth',
      monthlyPrice: 99000,
      yearlyPrice: 790000,
      aiPoints: 5500,
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 249000,
      yearlyPrice: 1990000,
      aiPoints: 15000,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 599000,
      yearlyPrice: 4800000,
      aiPoints: 40000,
    }
  ]

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) {
          alert('결제를 진행하려면 먼저 로그인이 필요합니다.')
          const params = new URLSearchParams(window.location.search)
          const plan = params.get('plan')
          const cycle = params.get('cycle')
          sessionStorage.setItem('pendingPayment', JSON.stringify({ plan, cycle }))
          window.location.href = '/login'
          return
        }

        const data = await res.json()
        setUserData(data.user)
        setIsLoggedIn(true)
        setAuthChecking(false)

        const params = new URLSearchParams(window.location.search)
        const plan = params.get('plan')
        const cycle = params.get('cycle')

        if (plan) {
          const planData = plans.find(p => p.id === plan)
          setSelectedPlan(planData)
        }
        if (cycle) {
          setBillingCycle(cycle)
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
    if (!isLoggedIn || !selectedPlan || authChecking) return

    const loadTossPayments = async () => {
      // SDK 스크립트 로드
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
        console.log('TossPayments 초기화 시작:', { customerKey, clientKey: TOSS_CLIENT_KEY })

        const tossPayments = window.TossPayments(TOSS_CLIENT_KEY)

        // payment() 메서드로 결제 인스턴스 생성 (API 개별 연동 키 방식)
        const payment = tossPayments.payment({ customerKey })
        paymentRef.current = payment

        setSdkReady(true)
        console.log('토스페이먼츠 SDK 초기화 완료')
      } catch (error) {
        console.error('토스페이먼츠 SDK 초기화 실패:', error)
        console.error('에러 상세:', error.message, error.code)
        alert(`결제 SDK 초기화 실패: ${error.message || error}`)
      }
    }

    loadTossPayments()
  }, [isLoggedIn, selectedPlan, authChecking, userData])

  const getPrice = () => {
    if (!selectedPlan) return 0
    return billingCycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice
  }

  const getMonthlyPrice = () => {
    if (!selectedPlan) return 0
    return billingCycle === 'monthly' ? selectedPlan.monthlyPrice : Math.round(selectedPlan.yearlyPrice / 12)
  }

  const getDiscount = () => {
    if (!selectedPlan || billingCycle === 'monthly') return 0
    return Math.round((1 - (selectedPlan.yearlyPrice / 12) / selectedPlan.monthlyPrice) * 100)
  }

  const handlePayment = async () => {
    if (!paymentRef.current || !sdkReady) {
      alert('결제 SDK가 준비되지 않았습니다. 잠시 후 다시 시도해주세요.')
      return
    }

    setIsLoading(true)

    try {
      // 정기결제(빌링) - requestBillingAuth() 사용
      // 카드 등록 후 빌링키 발급 → 이후 자동결제
      await paymentRef.current.requestBillingAuth({
        method: 'CARD', // 자동결제(빌링)는 카드만 지원
        successUrl: `${window.location.origin}/payment/billing-success?plan=${selectedPlan.id}&cycle=${billingCycle}`,
        failUrl: `${window.location.origin}/payment/fail?plan=${selectedPlan.id}&cycle=${billingCycle}`,
        customerEmail: userData?.email,
        customerName: userData?.name || userData?.academyName || '고객',
      })
    } catch (error) {
      console.error('카드 등록 요청 실패:', error)
      alert(`카드 등록 요청에 실패했습니다: ${error.message}`)
      setIsLoading(false)
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 50%, #1a1f3a 100%)',
      padding: isMobile ? '24px 16px' : '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: isMobile ? '24px' : '40px',
          textAlign: 'center'
        }}>
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
          <h1 style={{
            fontSize: isMobile ? '24px' : '36px',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '8px'
          }}>
            결제하기
          </h1>
          <p style={{
            fontSize: isMobile ? '14px' : '16px',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
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
          {/* 주문 요약 (모바일에서 먼저 표시) */}
          {isMobile && selectedPlan && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 20px 60px rgba(30, 58, 138, 0.2)',
              order: -1
            }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '16px'
              }}>
                주문 요약
              </h2>
              <div style={{
                marginBottom: '16px',
                padding: '16px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#3b82f6',
                  marginBottom: '4px'
                }}>
                  {selectedPlan.name}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>
                  {billingCycle === 'monthly' ? '월간 구독' : '연간 구독'}
                </div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff'
              }}>
                <span>총 결제금액</span>
                <span style={{ color: '#3b82f6' }}>
                  {getPrice().toLocaleString()}원
                </span>
              </div>
            </div>
          )}

          {/* 결제 위젯 영역 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: isMobile ? '16px' : '24px',
            padding: isMobile ? '24px 20px' : '40px',
            boxShadow: '0 20px 60px rgba(30, 58, 138, 0.2)'
          }}>
            {selectedPlan ? (
              <>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '16px'
                }}>
                  정기결제 카드 등록
                </h2>

                {/* 정기결제 안내 */}
                <div style={{
                  padding: '20px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <span style={{ fontSize: '28px' }}>💳</span>
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#ffffff'
                      }}>
                        신용/체크카드 자동결제
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.6)'
                      }}>
                        카드 등록 후 매월 자동으로 결제됩니다
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    lineHeight: '1.6'
                  }}>
                    • 첫 결제: 카드 등록 직후 진행<br/>
                    • 다음 결제: 매월 같은 날 자동 결제<br/>
                    • 언제든 구독 취소 가능
                  </div>
                </div>

                {/* 결제 버튼 */}
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
                    transition: 'all 0.3s',
                    boxShadow: (isLoading || !sdkReady) ? 'none' : '0 8px 24px rgba(30, 58, 138, 0.4)',
                    marginBottom: '12px'
                  }}
                >
                  {isLoading ? '카드 등록 중...' : !sdkReady ? 'SDK 로딩 중...' : `카드 등록 후 ${getPrice().toLocaleString()}원 결제`}
                </button>

                {/* 보안 안내 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor" opacity="0.5"/>
                  </svg>
                  토스페이먼츠 보안 결제
                </div>
              </>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: 'rgba(255, 255, 255, 0.5)'
              }}>
                <p style={{ marginBottom: '16px', fontSize: '16px' }}>선택된 플랜이 없습니다</p>
                <Link href="/pricing" style={{
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  요금제 페이지로 이동 →
                </Link>
              </div>
            )}
          </div>

          {/* 주문 요약 (데스크톱에서만 표시) */}
          {!isMobile && (
            <div style={{
              position: 'sticky',
              top: '40px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 20px 60px rgba(30, 58, 138, 0.2)'
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '24px'
                }}>
                  주문 요약
                </h2>

                {selectedPlan ? (
                  <>
                    {/* 플랜 정보 */}
                    <div style={{
                      marginBottom: '24px',
                      padding: '20px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#3b82f6',
                        marginBottom: '8px'
                      }}>
                        {selectedPlan.name}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '12px'
                      }}>
                        {billingCycle === 'monthly' ? '월간 구독' : '연간 구독'}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="#60a5fa"/>
                        </svg>
                        매월 {selectedPlan.aiPoints.toLocaleString()} AI 포인트
                      </div>
                    </div>

                    {/* 가격 상세 */}
                    <div style={{
                      marginBottom: '24px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}>
                        <span>기본 요금</span>
                        <span>
                          {billingCycle === 'monthly'
                            ? `${selectedPlan.monthlyPrice.toLocaleString()}원/월`
                            : `${selectedPlan.yearlyPrice.toLocaleString()}원/년`
                          }
                        </span>
                      </div>

                      {billingCycle === 'yearly' && (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                          fontSize: '14px',
                          color: '#86efac'
                        }}>
                          <span>연간 할인</span>
                          <span>-{getDiscount()}%</span>
                        </div>
                      )}

                      <div style={{
                        height: '1px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        margin: '16px 0'
                      }}></div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#ffffff'
                      }}>
                        <span>총 결제금액</span>
                        <span style={{ color: '#3b82f6' }}>
                          {getPrice().toLocaleString()}원
                        </span>
                      </div>

                      {billingCycle === 'yearly' && (
                        <div style={{
                          marginTop: '8px',
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.5)',
                          textAlign: 'right'
                        }}>
                          월 {getMonthlyPrice().toLocaleString()}원
                        </div>
                      )}
                    </div>

                    {/* 포함 사항 */}
                    <div style={{
                      padding: '20px',
                      background: 'rgba(15, 23, 42, 0.4)',
                      borderRadius: '12px',
                      marginBottom: '20px'
                    }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '12px'
                      }}>
                        포함된 기능
                      </div>
                      {[
                        '상담 관리 시스템',
                        'AI 커리큘럼 생성',
                        '마케팅 자동화',
                        '학생 리포트 자동화',
                        '데이터 분석 대시보드'
                      ].map((feature, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px',
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.6)'
                        }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#3b82f6" strokeWidth="2"/>
                          </svg>
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* 환불 정책 */}
                    <div style={{
                      padding: '16px',
                      background: 'rgba(59, 130, 246, 0.08)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      lineHeight: '1.6'
                    }}>
                      <strong style={{ color: 'rgba(255, 255, 255, 0.7)' }}>환불 정책</strong><br/>
                      구독 후 7일 이내 전액 환불 가능합니다. 이후에는 남은 기간에 대해 일할 계산하여 환불됩니다.
                    </div>
                  </>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}>
                    <p style={{ marginBottom: '16px' }}>선택된 플랜이 없습니다</p>
                    <Link href="/pricing" style={{
                      color: '#3b82f6',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      요금제 페이지로 이동 →
                    </Link>
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
