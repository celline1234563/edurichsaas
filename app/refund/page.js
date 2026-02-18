'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RefundPage() {
  const [step, setStep] = useState(1) // 1: 정보입력, 2: 환불금액확인, 3: 완료
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 환불 정보
  const [refundData, setRefundData] = useState({
    email: '',
    orderNumber: '',
    reason: '',
    bankName: '',
    accountNumber: '',
    accountHolder: ''
  })

  // 구독 정보 (실제로는 DB에서 조회)
  const [subscriptionInfo, setSubscriptionInfo] = useState(null)

  // 환불 금액 계산
  const [refundAmount, setRefundAmount] = useState({
    totalPaid: 0,
    usedDays: 0,
    totalDays: 0,
    refundRate: 0,
    refundAmount: 0,
    is7DayRefund: false
  })

  const reasons = [
    '서비스가 기대와 달라서',
    '사용하기 어려워서',
    '필요한 기능이 없어서',
    '가격이 비싸서',
    '다른 서비스로 이동',
    '기타'
  ]

  const handleInputChange = (field, value) => {
    setRefundData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmitStep1 = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // TODO: Supabase에서 주문 정보 조회
      // 실제로는 DB에서 가져와야 함
      const mockSubscription = {
        email: refundData.email,
        plan: 'Growth',
        billingCycle: 'yearly',
        amount: 948000,
        startDate: '2025-01-15',
        status: 'active'
      }

      // 환불 금액 계산
      const startDate = new Date(mockSubscription.startDate)
      const today = new Date()
      const usedDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24))
      const totalDays = mockSubscription.billingCycle === 'yearly' ? 365 : 30
      const is7DayRefund = usedDays <= 7

      let refundAmount = 0
      let refundRate = 0

      if (is7DayRefund) {
        // 7일 이내: 전액 환불
        refundAmount = mockSubscription.amount
        refundRate = 100
      } else {
        // 7일 이후: 일할 계산
        const remainingDays = totalDays - usedDays
        refundRate = Math.round((remainingDays / totalDays) * 100)
        refundAmount = Math.round(mockSubscription.amount * (remainingDays / totalDays))
      }

      setSubscriptionInfo(mockSubscription)
      setRefundAmount({
        totalPaid: mockSubscription.amount,
        usedDays,
        totalDays,
        refundRate,
        refundAmount,
        is7DayRefund
      })

      setStep(2)
    } catch (error) {
      console.error('Refund request error:', error)
      setError(error.message || '환불 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitStep2 = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // TODO: Supabase에 환불 요청 저장
      // payment_history 테이블에 refund 상태로 기록

      // 임시 처리
      await new Promise(resolve => setTimeout(resolve, 1500))

      setStep(3)
    } catch (error) {
      console.error('Refund submit error:', error)
      setError(error.message || '환불 요청에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#020617',
      padding: '104px 20px 40px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* 헤더 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <Link href="/" style={{
            display: 'inline-block',
            fontSize: '24px',
            fontWeight: '700',
            color: '#3b82f6',
            textDecoration: 'none',
            marginBottom: '24px'
          }}>
            EduRichBrain
          </Link>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '12px'
          }}>
            구독 취소 및 환불
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.6)',
            lineHeight: '1.6'
          }}>
            아쉽지만 서비스를 떠나신다니 안타깝습니다.<br />
            환불 정책에 따라 신속하게 처리해드리겠습니다.
          </p>
        </div>

        {/* 진행 단계 표시 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '48px'
        }}>
          {[1, 2, 3].map((num) => (
            <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: step >= num
                  ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                  : 'rgba(59, 130, 246, 0.2)',
                border: step >= num ? 'none' : '1px solid rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff',
                transition: 'all 0.3s'
              }}>
                {num}
              </div>
              {num < 3 && (
                <div style={{
                  width: '80px',
                  height: '2px',
                  background: step > num
                    ? 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
                    : 'rgba(59, 130, 246, 0.2)'
                }}></div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1: 정보 입력 */}
        {step === 1 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '24px'
            }}>
              1단계: 구독 정보 확인
            </h2>

            <form onSubmit={handleSubmitStep1}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  가입 이메일 *
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={refundData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  주문번호 (선택)
                </label>
                <input
                  type="text"
                  placeholder="결제 완료 시 받은 주문번호"
                  value={refundData.orderNumber}
                  onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <p style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginTop: '6px',
                  marginBottom: 0
                }}>
                  주문번호가 없으면 이메일로 찾습니다
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  환불 사유 *
                </label>
                <select
                  value={refundData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  <option value="" style={{ background: '#1a1f3a' }}>선택해주세요</option>
                  {reasons.map((reason, idx) => (
                    <option key={idx} value={reason} style={{ background: '#1a1f3a' }}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div style={{
                  padding: '14px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  color: '#ef4444',
                  fontSize: '14px',
                  marginBottom: '24px'
                }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading
                    ? 'rgba(59, 130, 246, 0.3)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'default' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.4)'
                }}
              >
                {loading ? '조회 중...' : '다음 단계'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: 환불 금액 확인 */}
        {step === 2 && subscriptionInfo && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '24px'
            }}>
              2단계: 환불 금액 확인
            </h2>

            {/* 구독 정보 */}
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#93c5fd',
                marginBottom: '16px'
              }}>
                구독 정보
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>플랜</span>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>{subscriptionInfo.plan}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>결제 주기</span>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>
                    {subscriptionInfo.billingCycle === 'yearly' ? '연간' : '월간'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>시작일</span>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>{subscriptionInfo.startDate}</span>
                </div>
              </div>
            </div>

            {/* 환불 금액 계산 */}
            <div style={{
              background: refundAmount.is7DayRefund
                ? 'rgba(34, 197, 94, 0.1)'
                : 'rgba(59, 130, 246, 0.1)',
              border: `1px solid ${refundAmount.is7DayRefund ? 'rgba(34, 197, 94, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: refundAmount.is7DayRefund ? '#22c55e' : '#93c5fd',
                marginBottom: '16px'
              }}>
                {refundAmount.is7DayRefund ? '✅ 7일 이내 전액 환불' : '⏰ 일할 계산 환불'}
              </h3>
              <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>결제 금액</span>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>
                    {refundAmount.totalPaid.toLocaleString()}원
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>사용 기간</span>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>
                    {refundAmount.usedDays}일 / {refundAmount.totalDays}일
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>환불율</span>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>
                    {refundAmount.refundRate}%
                  </span>
                </div>
              </div>
              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>환불 금액</span>
                <span style={{
                  color: refundAmount.is7DayRefund ? '#22c55e' : '#3b82f6',
                  fontSize: '28px',
                  fontWeight: '700'
                }}>
                  {refundAmount.refundAmount.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* 환불 계좌 정보 */}
            <form onSubmit={handleSubmitStep2}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '16px'
              }}>
                환불 계좌 정보
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  은행명 *
                </label>
                <input
                  type="text"
                  placeholder="예: 국민은행"
                  value={refundData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  계좌번호 *
                </label>
                <input
                  type="text"
                  placeholder="- 없이 숫자만 입력"
                  value={refundData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  예금주 *
                </label>
                <input
                  type="text"
                  placeholder="예금주명"
                  value={refundData.accountHolder}
                  onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {error && (
                <div style={{
                  padding: '14px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  color: '#ef4444',
                  fontSize: '14px',
                  marginBottom: '24px'
                }}>
                  ⚠️ {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    color: '#60a5fa',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  이전
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 2,
                    padding: '16px',
                    background: loading
                      ? 'rgba(59, 130, 246, 0.3)'
                      : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'default' : 'pointer',
                    boxShadow: loading ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.4)'
                  }}
                >
                  {loading ? '처리 중...' : '환불 신청'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: 완료 */}
        {step === 3 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '24px',
            padding: '48px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '72px', marginBottom: '24px' }}>✅</div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '16px'
            }}>
              환불 신청이 완료되었습니다
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.6)',
              lineHeight: '1.8',
              marginBottom: '32px'
            }}>
              환불 신청이 정상적으로 접수되었습니다.<br />
              영업일 기준 3-5일 내에 등록하신 계좌로 환불 처리됩니다.
            </p>

            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
              textAlign: 'left'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#93c5fd',
                marginBottom: '16px'
              }}>
                환불 정보
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>환불 금액</span>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>
                    {refundAmount.refundAmount.toLocaleString()}원
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>은행</span>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>
                    {refundData.bankName}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>예금주</span>
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>
                    {refundData.accountHolder}
                  </span>
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '32px'
            }}>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: '1.6',
                margin: 0
              }}>
                💡 환불 처리 후 즉시 서비스 이용이 중단됩니다.<br />
                저장된 데이터는 30일간 보관 후 삭제됩니다.
              </p>
            </div>

            <Link
              href="/"
              style={{
                display: 'inline-block',
                padding: '16px 40px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
              }}
            >
              홈으로 돌아가기
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
