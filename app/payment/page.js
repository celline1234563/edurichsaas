'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvc: '',
    agreePayment: false
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // 로그인 체크
    const userData = localStorage.getItem('userData') || localStorage.getItem('user')

    if (!userData) {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉션
      alert('결제를 진행하려면 먼저 로그인이 필요합니다.')
      const params = new URLSearchParams(window.location.search)
      const plan = params.get('plan')
      const cycle = params.get('cycle')
      // 로그인 후 다시 결제 페이지로 돌아올 수 있도록 정보 저장
      sessionStorage.setItem('pendingPayment', JSON.stringify({ plan, cycle }))
      window.location.href = '/login'
      return
    }

    setIsLoggedIn(true)

    // URL에서 선택한 플랜 가져오기
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
  }, [])

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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = '카드번호 16자리를 입력해주세요'
    }
    if (!formData.cardName) {
      newErrors.cardName = '카드 소유자 이름을 입력해주세요'
    }
    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = '유효기간을 MM/YY 형식으로 입력해주세요'
    }
    if (!formData.cvc || formData.cvc.length < 3) {
      newErrors.cvc = 'CVC 3자리를 입력해주세요'
    }
    if (!formData.agreePayment) {
      newErrors.agreePayment = '결제 동의가 필요합니다'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    let processedValue = value

    // 카드번호 자동 포맷팅
    if (name === 'cardNumber') {
      processedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
    }

    // 유효기간 자동 포맷팅
    if (name === 'expiryDate') {
      processedValue = value.replace(/\D/g, '')
      if (processedValue.length >= 2) {
        processedValue = processedValue.slice(0, 2) + '/' + processedValue.slice(2, 4)
      }
    }

    // CVC 숫자만
    if (name === 'cvc') {
      processedValue = value.replace(/\D/g, '').slice(0, 4)
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    // 임시 결제 처리 로직
    setTimeout(() => {
      setIsLoading(false)

      // 결제 정보 저장
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')
      localStorage.setItem('userData', JSON.stringify({
        ...userData,
        subscriptionType: selectedPlan?.id,
        billingCycle: billingCycle,
        paymentDate: new Date().toISOString(),
        aiPoints: selectedPlan?.aiPoints
      }))

      // 결제 성공 페이지로 바로 이동 (alert 제거)
      const academyName = userData.academyName || userData.name || '회원'
      window.location.href = `/payment-success?plan=${selectedPlan?.name}&academy=${encodeURIComponent(academyName)}`
    }, 2000)
  }

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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 50%, #1a1f3a 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <Link href="/" style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#ffffff',
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: '16px'
          }}>
            EduRichBrain
          </Link>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '8px'
          }}>
            결제 정보 입력
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            안전한 결제를 위해 정보를 입력해주세요
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* 결제 폼 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(30, 58, 138, 0.2)'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '24px'
            }}>
              카드 정보
            </h2>

            <form onSubmit={handleSubmit}>
              {/* 카드번호 */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '8px'
                }}>
                  카드번호
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: errors.cardNumber ? '1px solid #ef4444' : '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                />
                {errors.cardNumber && (
                  <p style={{ marginTop: '6px', fontSize: '13px', color: '#ef4444' }}>
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              {/* 카드 소유자 */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '8px'
                }}>
                  카드 소유자
                </label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="HONG GILDONG"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: errors.cardName ? '1px solid #ef4444' : '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                />
                {errors.cardName && (
                  <p style={{ marginTop: '6px', fontSize: '13px', color: '#ef4444' }}>
                    {errors.cardName}
                  </p>
                )}
              </div>

              {/* 유효기간 & CVC */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '8px'
                  }}>
                    유효기간
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: errors.expiryDate ? '1px solid #ef4444' : '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                  {errors.expiryDate && (
                    <p style={{ marginTop: '6px', fontSize: '13px', color: '#ef4444' }}>
                      {errors.expiryDate}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '8px'
                  }}>
                    CVC
                  </label>
                  <input
                    type="text"
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength="4"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: errors.cvc ? '1px solid #ef4444' : '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                  {errors.cvc && (
                    <p style={{ marginTop: '6px', fontSize: '13px', color: '#ef4444' }}>
                      {errors.cvc}
                    </p>
                  )}
                </div>
              </div>

              {/* 결제 동의 */}
              <div style={{
                marginBottom: '24px',
                padding: '20px',
                background: 'rgba(59, 130, 246, 0.08)',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.15)'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'start',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    name="agreePayment"
                    checked={formData.agreePayment}
                    onChange={handleChange}
                    style={{
                      marginRight: '12px',
                      marginTop: '3px',
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.5' }}>
                    위 카드로 <strong>{getPrice().toLocaleString()}원</strong>을 결제하는 것에 동의합니다.
                    구독은 언제든지 취소할 수 있으며, 다음 결제일 전까지 요금이 청구되지 않습니다.
                  </span>
                </label>
                {errors.agreePayment && (
                  <p style={{ fontSize: '13px', color: '#ef4444', marginLeft: '30px', marginTop: '8px' }}>
                    {errors.agreePayment}
                  </p>
                )}
              </div>

              {/* 결제 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: isLoading ? 'rgba(59, 130, 246, 0.5)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: isLoading ? 'none' : '0 8px 24px rgba(30, 58, 138, 0.4)',
                  marginBottom: '12px'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(30, 58, 138, 0.6)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(30, 58, 138, 0.4)'
                  }
                }}
              >
                {isLoading ? '결제 처리 중...' : `${getPrice().toLocaleString()}원 결제하기`}
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
                256비트 SSL 암호화로 안전하게 보호됩니다
              </div>
            </form>
          </div>

          {/* 주문 요약 */}
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
        </div>
      </div>
    </div>
  )
}
