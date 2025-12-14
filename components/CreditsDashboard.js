'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CreditsDashboard({ compact = false }) {
  const [credits, setCredits] = useState(0)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    fetchCreditsData()
  }, [])

  const fetchCreditsData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/credits?history=true')
      const data = await response.json()

      if (data.success) {
        setCredits(data.data.credits)
        setHistory(data.data.history || [])
      }

      // 구독 정보도 가져오기
      const subResponse = await fetch('/api/subscription')
      const subData = await subResponse.json()
      if (subData.success) {
        setSubscription(subData.data.subscription)
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getReasonLabel = (reason) => {
    const labels = {
      subscription: '구독 충전',
      ai_usage: 'AI 사용',
      blog_generation: '블로그 생성',
      consultation_report: '상담 리포트',
      marketing_campaign: '마케팅 캠페인',
      school_analysis: '학교 분석',
      naesin_analysis: '내신 분석',
      curriculum_consulting: '커리큘럼 컨설팅',
      point_purchase: '포인트 구매',
      refund: '환불'
    }
    return labels[reason] || reason
  }

  if (loading) {
    return (
      <div style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
        borderRadius: '16px',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>로딩 중...</div>
      </div>
    )
  }

  // 컴팩트 모드 (사이드바용)
  if (compact) {
    return (
      <div style={{
        padding: '16px',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.08))',
        borderRadius: '12px',
        border: '1px solid rgba(59, 130, 246, 0.25)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="#60a5fa"/>
          </svg>
          <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>보유 크레딧</span>
        </div>
        <div style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#ffffff',
          marginBottom: '12px'
        }}>
          {credits.toLocaleString()}P
        </div>
        <Link
          href="/pricing"
          style={{
            display: 'block',
            padding: '8px 12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: '600',
            textDecoration: 'none',
            textAlign: 'center'
          }}
        >
          충전하기
        </Link>
      </div>
    )
  }

  // 전체 대시보드
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(59, 130, 246, 0.25)',
      padding: '32px',
      boxShadow: '0 20px 60px rgba(30, 58, 138, 0.2)'
    }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#ffffff'
        }}>
          크레딧 현황
        </h2>
        <button
          onClick={fetchCreditsData}
          style={{
            padding: '8px 16px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            color: '#60a5fa',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          새로고침
        </button>
      </div>

      {/* 크레딧 카드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* 현재 크레딧 */}
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))',
          borderRadius: '16px',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="#60a5fa"/>
            </svg>
            <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>보유 크레딧</span>
          </div>
          <div style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#ffffff'
          }}>
            {credits.toLocaleString()}P
          </div>
        </div>

        {/* 구독 정보 */}
        <div style={{
          padding: '24px',
          background: 'rgba(15, 23, 42, 0.4)',
          borderRadius: '16px',
          border: '1px solid rgba(59, 130, 246, 0.15)'
        }}>
          <div style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '12px'
          }}>
            현재 구독
          </div>
          {subscription ? (
            <>
              <div style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '8px'
              }}>
                {subscription.plan_id?.charAt(0).toUpperCase() + subscription.plan_id?.slice(1)} 플랜
              </div>
              <div style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.5)'
              }}>
                만료일: {new Date(subscription.expires_at).toLocaleDateString('ko-KR')}
              </div>
            </>
          ) : (
            <>
              <div style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '12px'
              }}>
                구독 없음
              </div>
              <Link
                href="/pricing"
                style={{
                  color: '#60a5fa',
                  fontSize: '14px',
                  textDecoration: 'none'
                }}
              >
                요금제 선택하기 →
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 충전 버튼 */}
      <div style={{ marginBottom: '32px' }}>
        <Link
          href="/pricing"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: '600',
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          크레딧 충전하기
        </Link>
      </div>

      {/* 사용 내역 */}
      <div>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#ffffff',
          marginBottom: '16px'
        }}>
          최근 사용 내역
        </h3>

        {history.length > 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {history.slice(0, 10).map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: 'rgba(15, 23, 42, 0.4)',
                  borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.1)'
                }}
              >
                <div>
                  <div style={{
                    fontSize: '14px',
                    color: '#ffffff',
                    marginBottom: '4px'
                  }}>
                    {getReasonLabel(item.reason)}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}>
                    {formatDate(item.created_at)}
                  </div>
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: item.type === 'add' ? '#86efac' : '#fca5a5'
                }}>
                  {item.type === 'add' ? '+' : ''}{item.amount.toLocaleString()}P
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: '32px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
            background: 'rgba(15, 23, 42, 0.3)',
            borderRadius: '12px'
          }}>
            사용 내역이 없습니다
          </div>
        )}
      </div>
    </div>
  )
}
