'use client'

import { useState } from 'react'
import Link from 'next/link'
import useIsMobile from '@/hooks/useIsMobile'

export default function PricingPage() {
  const [showPointModal, setShowPointModal] = useState(false)
  const [billingCycle, setBillingCycle] = useState('monthly') // 'monthly' or 'yearly'
  const [expandedPlan, setExpandedPlan] = useState(null)
  const isMobile = useIsMobile()

  // 요금제 데이터
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 30000,
      yearlyPrice: 288000, // 월 24,000원 (20% 할인)
      aiPoints: 1500,
      color: '#60a5fa', // blue
      features: {
        account: '원장 계정 1개',
        students: '학생 30명까지',
        crm: '기본 CRM',
        sms: 'SMS 50건/월',
        kakao: '학원전용 카카오톡 \'에듀케어 알림\' 사용',
        aiUsage: [
          '블로그 4-5편',
          '상담 리포트 10-15건',
          'AI 챗봇 기본 사용'
        ]
      },
      profitMargin: '60.1%'
    },
    {
      id: 'growth',
      name: 'Growth',
      monthlyPrice: 99000,
      yearlyPrice: 948000, // 월 79,000원 (20% 할인)
      aiPoints: 5500,
      popular: true,
      color: '#3b82f6', // bright blue
      features: {
        account: '원장 + 직원 2명',
        students: '학생 100명까지',
        crm: '전체 CRM 기능',
        sms: 'SMS 300건/월',
        kakao: '학원전용 카카오톡 \'에듀케어 알림\' 사용',
        aiUsage: [
          '블로그 10-15편',
          '상담 리포트 30-40건',
          '학교 분석 2개',
          '내신 분석 2회',
          '기타 기능 자유롭게'
        ]
      },
      badge: '대부분의 학원에 적합',
      profitMargin: '60.2%'
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 249000,
      yearlyPrice: 2388000, // 월 199,000원 (20% 할인)
      aiPoints: 15000,
      color: '#94a3b8', // silver
      features: {
        account: '원장 + 직원 5명',
        students: '학생 300명까지',
        crm: '고급 CRM + 분석',
        sms: 'SMS 1,000건/월',
        kakao: '학원전용 카카오톡 \'에듀케어 알림\' 사용',
        aiUsage: [
          '블로그 20편',
          '상담 리포트 60건',
          '학교 분석 5개',
          '내신 분석 8회',
          '커리큘럼 컨설팅 3회',
          '모든 기능 여유롭게'
        ],
        premium: [
          '우선 지원',
          '전담 매니저'
        ]
      },
      profitMargin: '60.0%'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 599000,
      yearlyPrice: 5748000, // 월 479,000원 (20% 할인)
      aiPoints: 35000,
      color: '#cbd5e1', // light silver
      features: {
        account: '직원 무제한',
        students: '학생 무제한',
        crm: '전용 DB',
        sms: 'SMS 3,000건/월',
        kakao: '학원전용 카카오톡 \'에듀케어 알림\' 사용',
        aiUsage: [
          '블로그 40편',
          '상담 리포트 150건',
          '학교 분석 15개',
          '내신 분석 20회',
          '커리큘럼 컨설팅 8회',
          '대규모 학원 운영'
        ],
        premium: [
          '24/7 전화 지원',
          '맞춤 개발 지원',
          '분기별 전략 컨설팅',
          'API 접근 권한'
        ]
      },
      profitMargin: '60.1%'
    }
  ]

  // 추가 직원 요금
  const staffPricing = [
    { role: '강사', price: 13000, margin: '90%' },
    { role: '직원', price: 8000, margin: '90%' },
    { role: '알바', price: 4000, margin: '90%' }
  ]

  // AI 포인트 충전 패키지
  const pointPackages = [
    {
      id: 'basic',
      name: '베이직',
      price: 33000,
      points: 10000,
      pricePerPoint: 3.3,
      bonus: null
    },
    {
      id: 'standard',
      name: '스탠다드',
      price: 55000,
      points: 18000,
      pricePerPoint: 3.06,
      bonus: '20%',
      popular: true
    },
    {
      id: 'premium',
      name: '프리미엄',
      price: 110000,
      points: 40000,
      pricePerPoint: 2.75,
      bonus: '33%'
    }
  ]

  // AI 기능별 포인트 소모
  const aiFeatures = {
    basic: [
      { name: '블로그 생성', points: 50, unit: '1편' },
      { name: '상담 리포트', points: 70, unit: '1건' },
      { name: '마케팅 캠페인', points: 30, unit: '1회' },
      { name: 'AI 챗봇', points: '20-50', unit: '10턴' }
    ],
    premium: [
      { name: '학교 분석', points: 300, unit: '1개', hot: true },
      { name: '내신 분석', points: 350, unit: '1회', hot: true },
      { name: '커리큘럼 컨설팅', points: 500, unit: '1회', veryHot: true }
    ]
  }

  const handleSelectPlan = (planId) => {
    // 결제 페이지로 이동 (선택한 플랜과 결제 주기 정보 전달)
    window.location.href = `/payment?plan=${planId}&cycle=${billingCycle}`
  }

  return (
    <div className="app-layout">
      {/* Main Area */}
      <div className="main-area" style={{ paddingTop: '64px' }}>
        {/* Hero Section */}
        <main style={{
          padding: isMobile ? '60px 20px 80px' : '100px 32px 120px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Page Title */}
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '48px' : '80px' }}>
            <h1 style={{
              fontSize: isMobile ? '32px' : '52px',
              fontWeight: '500',
              letterSpacing: '-0.02em',
              marginBottom: isMobile ? '16px' : '24px',
              background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              성장에 집중하세요
            </h1>
            <p style={{
              fontSize: isMobile ? '16px' : '20px',
              color: 'rgba(255, 255, 255, 0.6)',
              lineHeight: '1.6',
              marginBottom: isMobile ? '32px' : '40px',
              padding: isMobile ? '0 10px' : '0'
            }}>
              효율적인 AI 포인트 시스템으로 필요한 만큼만 사용하세요
            </p>

            {/* Billing Cycle Toggle */}
            <div style={{
              display: 'inline-flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              gap: '4px',
              padding: '4px',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? '320px' : 'none'
            }}>
              <button
                onClick={() => setBillingCycle('monthly')}
                style={{
                  padding: isMobile ? '12px 20px' : '10px 24px',
                  background: billingCycle === 'monthly'
                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                    : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: billingCycle === 'monthly' ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: billingCycle === 'monthly' ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                월간 결제
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                style={{
                  padding: isMobile ? '12px 20px' : '10px 24px',
                  background: billingCycle === 'yearly'
                    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                    : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: billingCycle === 'yearly' ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: billingCycle === 'yearly' ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                연간 결제
                <span style={{
                  fontSize: '12px',
                  color: '#86efac',
                  fontWeight: '600'
                }}>
                  최대 36% 할인
                </span>
              </button>
            </div>
          </div>

          {/* Main Pricing Plans */}
          <div className="pricing-grid" style={{
            marginBottom: isMobile ? '80px' : '120px',
          }}>
            {plans.map((plan, index) => {
              const isExpanded = expandedPlan === plan.id
              const priceText = billingCycle === 'monthly'
                ? plan.monthlyPrice.toLocaleString()
                : Math.round(plan.yearlyPrice / 12).toLocaleString()

              return (
              <div
                key={plan.id}
                style={{
                  position: 'relative',
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: plan.popular ? '2px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: isMobile ? '16px' : '24px',
                  padding: isMobile ? '0' : '40px 32px',
                  boxShadow: plan.popular
                    ? '0 20px 60px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    : '0 10px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  transform: (plan.popular && !isMobile) ? 'scale(1.05)' : 'scale(1)',
                  zIndex: plan.popular ? 10 : 1,
                  overflow: 'hidden',
                }}
                onClick={() => isMobile && setExpandedPlan(isExpanded ? null : plan.id)}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-8px)'
                    e.currentTarget.style.borderColor = plan.popular ? 'rgba(59, 130, 246, 0.7)' : 'rgba(59, 130, 246, 0.4)'
                    e.currentTarget.style.boxShadow = plan.popular
                      ? '0 30px 80px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.3)'
                      : '0 20px 60px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.2)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.transform = plan.popular ? 'scale(1.05)' : 'scale(1)'
                    e.currentTarget.style.borderColor = plan.popular ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.2)'
                    e.currentTarget.style.boxShadow = plan.popular
                      ? '0 20px 60px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      : '0 10px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                  }
                }}
              >
                {/* Popular Badge - desktop only */}
                {plan.popular && !isMobile && (
                  <div style={{
                    position: 'absolute',
                    top: '-16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    padding: '6px 24px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#ffffff',
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.5)'
                  }}>
                    인기
                  </div>
                )}

                {/* Mobile Accordion Header */}
                {isMobile ? (
                  <div style={{ padding: '20px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>
                          {plan.name}
                        </h3>
                        {plan.popular && (
                          <span style={{
                            padding: '2px 10px',
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#ffffff',
                          }}>인기</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '20px', fontWeight: '700', color: plan.color }}>
                            {priceText}원
                          </span>
                          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>/월</span>
                        </div>
                        <svg
                          width="20" height="20" viewBox="0 0 24 24" fill="none"
                          style={{
                            color: '#60a5fa',
                            transition: 'transform 0.3s',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            flexShrink: 0,
                          }}
                        >
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '8px',
                      color: '#60a5fa',
                      fontSize: '13px',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor"/>
                      </svg>
                      AI {plan.aiPoints.toLocaleString()}P
                      {plan.badge && <span style={{ color: '#93c5fd', marginLeft: '8px' }}>· {plan.badge}</span>}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Desktop Plan Header */}
                    <div style={{ marginBottom: '32px' }}>
                      <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#ffffff', marginBottom: '12px' }}>
                        {plan.name}
                      </h3>
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                          <span style={{ fontSize: '32px', fontWeight: '700', color: plan.color }}>
                            {priceText}원
                          </span>
                          <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>/월</span>
                        </div>
                        {billingCycle === 'yearly' && (
                          <p style={{ color: '#86efac', fontSize: '13px', marginTop: '4px', fontWeight: '600' }}>
                            연 {plan.yearlyPrice.toLocaleString()}원 ({Math.round((1 - (plan.yearlyPrice / 12) / plan.monthlyPrice) * 100)}% 할인)
                          </p>
                        )}
                        <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '13px', marginTop: '4px' }}>VAT 포함</p>
                      </div>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.08))',
                        padding: '16px', borderRadius: '12px',
                        border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: '#60a5fa' }}>
                            <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor"/>
                          </svg>
                          <span style={{ color: '#60a5fa', fontSize: '14px', fontWeight: '600' }}>AI 포인트</span>
                        </div>
                        <div style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff' }}>{plan.aiPoints.toLocaleString()}P</div>
                      </div>
                      {plan.badge && (
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))',
                          padding: '8px 12px', borderRadius: '8px', fontSize: '12px',
                          color: '#93c5fd', textAlign: 'center', fontWeight: '500'
                        }}>💡 {plan.badge}</div>
                      )}
                    </div>
                  </>
                )}

                {/* Features & CTA - always visible on desktop, accordion on mobile */}
                <div style={{
                  ...(isMobile && {
                    maxHeight: isExpanded ? '800px' : '0px',
                    overflow: 'hidden',
                    transition: 'max-height 0.4s ease',
                    padding: isExpanded ? '0 20px 20px' : '0 20px',
                  }),
                }}>
                  {isMobile && billingCycle === 'yearly' && (
                    <p style={{ color: '#86efac', fontSize: '12px', marginBottom: '12px', fontWeight: '600' }}>
                      연 {plan.yearlyPrice.toLocaleString()}원 ({Math.round((1 - (plan.yearlyPrice / 12) / plan.monthlyPrice) * 100)}% 할인)
                    </p>
                  )}

                  <div style={{ marginBottom: isMobile ? '20px' : '32px' }}>
                    <div style={{
                      fontSize: isMobile ? '12px' : '13px',
                      color: 'rgba(147, 197, 253, 0.8)',
                      fontWeight: '600', marginBottom: isMobile ? '12px' : '16px',
                      textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>포함 사항</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '8px' : '12px' }}>
                      {[plan.features.account, plan.features.students, plan.features.crm, plan.features.sms].map((feat, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#60a5fa', marginTop: '2px', flexShrink: 0 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" stroke="currentColor"/>
                          </svg>
                          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: isMobile ? '13px' : '14px' }}>{feat}</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#FEE500', marginTop: '2px', flexShrink: 0 }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" stroke="currentColor"/>
                        </svg>
                        <span style={{ color: 'rgba(254, 229, 0, 0.9)', fontSize: isMobile ? '13px' : '14px', fontWeight: '600' }}>{plan.features.kakao}</span>
                      </div>
                    </div>

                    <div style={{ marginTop: isMobile ? '16px' : '24px', paddingTop: isMobile ? '12px' : '20px', borderTop: '1px solid rgba(59, 130, 246, 0.15)' }}>
                      <div style={{ fontSize: '12px', color: 'rgba(147, 197, 253, 0.7)', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI 활용 예시</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {plan.features.aiUsage.map((usage, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                            <span style={{ color: '#60a5fa', fontSize: '14px', marginTop: '-1px' }}>•</span>
                            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px' }}>{usage}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {plan.features.premium && (
                      <div style={{ marginTop: isMobile ? '12px' : '20px', paddingTop: isMobile ? '12px' : '20px', borderTop: '1px solid rgba(59, 130, 246, 0.15)' }}>
                        <div style={{ fontSize: '12px', color: 'rgba(147, 197, 253, 0.9)', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>프리미엄 혜택</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {plan.features.premium.map((feature, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: '#60a5fa', marginTop: '2px', flexShrink: 0 }}>
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                              </svg>
                              <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px' }}>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleSelectPlan(plan.id) }}
                    style={{
                      width: '100%',
                      padding: isMobile ? '14px' : '16px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: isMobile ? '15px' : '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
                    }}
                  >
                    지금 시작하기
                  </button>
                </div>
              </div>
              )
            })}
          </div>

          {/* Additional Staff Section */}
          <div style={{ marginBottom: isMobile ? '80px' : '120px' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
              <h2 style={{
                fontSize: isMobile ? '28px' : '36px',
                fontWeight: '500',
                marginBottom: isMobile ? '12px' : '16px',
                background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                팀 확장 옵션
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: isMobile ? '14px' : '16px' }}>
                성장하는 조직을 위한 유연한 인력 관리
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
              maxWidth: '900px',
              margin: '0 auto'
            }}>
              {staffPricing.map((staff, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.4))',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '16px',
                    padding: isMobile ? '24px 20px' : '32px 24px',
                    textAlign: 'center',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)'
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(30, 58, 138, 0.3)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                  }}
                >
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#ffffff',
                    marginBottom: '16px'
                  }}>
                    {staff.role}
                  </div>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#60a5fa',
                    marginBottom: '8px'
                  }}>
                    {staff.price.toLocaleString()}원
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}>
                    /월 · VAT 포함
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Point Packages Section */}
          <div style={{ marginBottom: isMobile ? '80px' : '120px' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
              <h2 style={{
                fontSize: isMobile ? '28px' : '36px',
                fontWeight: '500',
                marginBottom: isMobile ? '12px' : '16px',
                background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                AI 포인트 충전
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: isMobile ? '14px' : '16px' }}>
                필요할 때 언제든지 포인트를 추가하세요
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
              {pointPackages.map((pkg, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(30, 41, 59, 0.5))',
                    backdropFilter: 'blur(20px)',
                    border: pkg.popular ? '2px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '20px',
                    padding: isMobile ? '28px 24px' : '36px 28px',
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    transform: (pkg.popular && !isMobile) ? 'scale(1.05)' : 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)'
                      e.currentTarget.style.borderColor = pkg.popular ? 'rgba(59, 130, 246, 0.7)' : 'rgba(59, 130, 246, 0.4)'
                      e.currentTarget.style.boxShadow = pkg.popular
                        ? '0 20px 60px rgba(59, 130, 246, 0.3)'
                        : '0 12px 32px rgba(59, 130, 246, 0.3)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = pkg.popular ? 'scale(1.05)' : 'scale(1)'
                      e.currentTarget.style.borderColor = pkg.popular ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.2)'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                  }}
                >
                  {pkg.popular && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      padding: '4px 16px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#ffffff'
                    }}>
                      추천
                    </div>
                  )}

                  <div style={{
                    fontSize: isMobile ? '18px' : '20px',
                    fontWeight: '600',
                    color: '#ffffff',
                    marginBottom: isMobile ? '16px' : '20px'
                  }}>
                    {pkg.name} 패키지
                  </div>

                  <div style={{
                    fontSize: isMobile ? '32px' : '36px',
                    fontWeight: '700',
                    color: pkg.popular ? '#3b82f6' : '#60a5fa',
                    marginBottom: '12px'
                  }}>
                    {pkg.price.toLocaleString()}원
                  </div>

                  <div style={{
                    fontSize: isMobile ? '13px' : '14px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginBottom: isMobile ? '20px' : '24px'
                  }}>
                    VAT 포함
                  </div>

                  <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    padding: isMobile ? '14px' : '16px',
                    borderRadius: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      fontSize: isMobile ? '28px' : '32px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '4px'
                    }}>
                      {pkg.points.toLocaleString()}P
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)'
                    }}>
                      포인트당 {pkg.pricePerPoint}원
                    </div>
                  </div>

                  {pkg.bonus && (
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: '#93c5fd',
                      fontWeight: '600'
                    }}>
                      🎁 {pkg.bonus} 보너스
                    </div>
                  )}

                  <button
                    onClick={() => window.location.href = `/payment?type=recharge&package=${pkg.id}`}
                    style={{
                      width: '100%',
                      padding: '14px',
                      marginTop: '24px',
                      background: pkg.popular
                        ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                        : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))',
                      border: pkg.popular ? 'none' : '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.5)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    충전하기
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Features Pricing Table */}
          <div style={{ marginBottom: isMobile ? '80px' : '120px' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
              <h2 style={{
                fontSize: isMobile ? '28px' : '36px',
                fontWeight: '500',
                marginBottom: isMobile ? '12px' : '16px',
                background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                AI 기능별 소모 포인트
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: isMobile ? '14px' : '16px' }}>
                투명하고 합리적인 포인트 정책
              </p>
            </div>

            <div style={{
              maxWidth: '800px',
              margin: '0 auto',
              display: 'grid',
              gap: '32px'
            }}>
              {/* Basic AI Features */}
              <div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#93c5fd',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: '#60a5fa' }}>
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  일반 AI 기능
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.4))',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}>
                  {aiFeatures.basic.map((feature, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '20px 24px',
                        borderBottom: idx < aiFeatures.basic.length - 1 ? '1px solid rgba(59, 130, 246, 0.1)' : 'none',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <div>
                        <div style={{ color: '#ffffff', fontSize: '15px', fontWeight: '500', marginBottom: '4px' }}>
                          {feature.name}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px' }}>
                          {feature.unit}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#60a5fa'
                      }}>
                        {feature.points}P
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium AI Features */}
              <div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#60a5fa',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: '#60a5fa' }}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
                  </svg>
                  프리미엄 AI 기능
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(37, 99, 235, 0.06))',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}>
                  {aiFeatures.premium.map((feature, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: isMobile ? '16px 20px' : '20px 24px',
                        borderBottom: idx < aiFeatures.premium.length - 1 ? '1px solid rgba(59, 130, 246, 0.15)' : 'none',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '4px'
                        }}>
                          <span style={{ color: '#ffffff', fontSize: isMobile ? '14px' : '15px', fontWeight: '500' }}>
                            {feature.name}
                          </span>
                          {feature.hot && <span style={{ fontSize: isMobile ? '16px' : '18px' }}>🔥</span>}
                          {feature.veryHot && <span style={{ fontSize: isMobile ? '16px' : '18px' }}>🔥🔥</span>}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: isMobile ? '12px' : '13px' }}>
                          {feature.unit}
                        </div>
                      </div>
                      <div style={{
                        fontSize: isMobile ? '18px' : '20px',
                        fontWeight: '700',
                        color: '#60a5fa'
                      }}>
                        {feature.points}P
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div style={{ marginBottom: isMobile ? '80px' : '120px' }}>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
              <h2 style={{
                fontSize: isMobile ? '28px' : '36px',
                fontWeight: '500',
                marginBottom: isMobile ? '12px' : '16px',
                background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                자주 묻는 질문
              </h2>
            </div>

            <div style={{
              maxWidth: '800px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {[
                {
                  q: '포인트가 부족하면 어떻게 하나요?',
                  a: '포인트 충전 패키지를 구매하시거나, 상위 플랜으로 업그레이드하시면 됩니다. 충전한 포인트의 유효기간은 1년입니다.'
                },
                {
                  q: '플랜 변경이 가능한가요?',
                  a: '언제든지 플랜을 변경할 수 있습니다. 상위 플랜으로 변경 시 즉시 적용되며, 하위 플랜 변경 시 다음 결제일부터 적용됩니다.'
                },
                {
                  q: '미사용 포인트는 어떻게 되나요?',
                  a: '월간 제공되는 포인트는 다음 달로 이월되지 않습니다. 단, 별도로 충전한 포인트는 유효기간 1년 내 사용 가능합니다.'
                },
                {
                  q: '환불 정책은 어떻게 되나요?',
                  a: '구독 후 7일 이내 전액 환불이 가능합니다. 7일 이후에는 남은 기간에 대해 일할 계산하여 환불해드립니다.'
                }
              ].map((faq, idx) => (
                <details
                  key={idx}
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.4))',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: isMobile ? '12px' : '16px',
                    padding: isMobile ? '20px 20px' : '24px 28px',
                    transition: 'all 0.3s'
                  }}
                >
                  <summary style={{
                    fontSize: isMobile ? '15px' : '16px',
                    fontWeight: '600',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    {faq.q}
                    <span style={{ color: '#60a5fa', fontSize: isMobile ? '18px' : '20px' }}>+</span>
                  </summary>
                  <p style={{
                    marginTop: isMobile ? '12px' : '16px',
                    fontSize: isMobile ? '13px' : '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: '1.6'
                  }}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div style={{
            textAlign: 'center',
            padding: isMobile ? '48px 24px' : '80px 40px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))',
            borderRadius: isMobile ? '16px' : '24px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <h2 style={{
              fontSize: isMobile ? '28px' : '40px',
              fontWeight: '500',
              marginBottom: isMobile ? '16px' : '20px',
              background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              지금 바로 시작하세요
            </h2>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: isMobile ? '32px' : '40px',
              lineHeight: '1.6'
            }}>
              14일 무료 체험으로 모든 기능을 경험해보세요
            </p>
            <div style={{
              display: 'flex',
              gap: isMobile ? '12px' : '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'stretch' : 'center'
            }}>
              <Link
                href="/signup"
                style={{
                  padding: isMobile ? '14px 32px' : '16px 40px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: isMobile ? '15px' : '16px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.3s',
                  boxShadow: '0 8px 24px rgba(30, 58, 138, 0.4)',
                  textAlign: 'center'
                }}
              >
                무료 체험 시작
              </Link>
              <Link
                href="/demo"
                style={{
                  padding: isMobile ? '14px 32px' : '16px 40px',
                  background: 'transparent',
                  border: '2px solid rgba(59, 130, 246, 0.4)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: isMobile ? '15px' : '16px',
                  fontWeight: '600',
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.3s',
                  backdropFilter: 'blur(8px)'
                }}
              >
                데모 예약하기
              </Link>
            </div>
          </div>
        </main>

      </div>
    </div>
  )
}
