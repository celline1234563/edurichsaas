'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function DemoPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)
  const [checkingSubscription, setCheckingSubscription] = useState(true)

  // 구독 상태 확인
  useEffect(() => {
    const checkSubscription = async () => {
      if (status === 'loading') return

      if (status === 'unauthenticated') {
        setCheckingSubscription(false)
        setSubscriptionStatus({ canUse: false, reason: 'unauthenticated' })
        return
      }

      // 데모 사용자는 바로 접근 허용
      if (session?.user?.isDemo) {
        setCheckingSubscription(false)
        setSubscriptionStatus({ canUse: true, reason: 'demo_user' })
        return
      }

      try {
        const response = await fetch('/api/subscription')
        const data = await response.json()

        if (data.success) {
          setSubscriptionStatus({
            canUse: data.data.canUseService,
            reason: data.data.serviceStatus,
            credits: data.data.credits,
            subscription: data.data.subscription
          })
        } else {
          setSubscriptionStatus({ canUse: false, reason: data.error })
        }
      } catch (error) {
        console.error('Subscription check error:', error)
        setSubscriptionStatus({ canUse: false, reason: 'error' })
      } finally {
        setCheckingSubscription(false)
      }
    }

    checkSubscription()
  }, [status, session])

  useEffect(() => {
    // iframe 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 50%, #1a1f3a 100%)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="메뉴 열기"
          style={{
            position: 'fixed',
            top: '16px',
            left: '16px',
            width: '44px',
            height: '44px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.15))',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#ffffff',
            zIndex: 100
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      )}

      {/* Mobile Menu Panel */}
      {isMobile && mobileMenuOpen && (
        <div className="mobile-menu-panel">
          <button
            onClick={closeMobileMenu}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.08))',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <div className="mobile-menu-logo">EduRichBrain</div>

          <nav className="mobile-menu-nav">
            <Link href="/" className="mobile-menu-link" onClick={closeMobileMenu}>제품</Link>
            <Link href="/pricing" className="mobile-menu-link" onClick={closeMobileMenu}>요금제</Link>
            <Link href="/diagnosis" className="mobile-menu-link" onClick={closeMobileMenu}>경영진단</Link>
            <Link href="/blog" className="mobile-menu-link" onClick={closeMobileMenu}>블로그</Link>
            <Link href="/about" className="mobile-menu-link" onClick={closeMobileMenu}>회사</Link>
            <a href="https://edurichbrain.vercel.app/" target="_blank" rel="noopener noreferrer" className="mobile-menu-link active" onClick={closeMobileMenu}>데모</a>
          </nav>

          <div className="mobile-menu-footer">
            <Link
              href="/signup"
              className="login-btn"
              onClick={closeMobileMenu}
              style={{ width: '100%', textAlign: 'center' }}
            >
              시작하기
            </Link>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div style={{
        width: '100%',
        height: '60px',
        background: 'rgba(10, 14, 39, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 16px' : '0 24px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Left: Logo & Back */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '20px' }}>
          <Link
            href="/"
            style={{
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: '700',
              color: '#ffffff',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginLeft: isMobile ? '48px' : '0'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!isMobile && 'EduRichBrain'}
          </Link>
        </div>

        {/* Right: Actions */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              href="/pricing"
              style={{
                padding: '8px 20px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s ease'
              }}
            >
              요금제 보기
            </Link>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {(isLoading || checkingSubscription) && (
        <div style={{
          position: 'absolute',
          top: '60px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 14, 39, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          zIndex: 20
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(59, 130, 246, 0.2)',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: '500'
          }}>
            {checkingSubscription ? '구독 상태 확인 중...' : '데모 환경을 불러오는 중...'}
          </div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Subscription Required Overlay */}
      {!checkingSubscription && subscriptionStatus && !subscriptionStatus.canUse && (
        <div style={{
          position: 'absolute',
          top: '60px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 14, 39, 0.98)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          zIndex: 25,
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '480px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '24px',
            padding: isMobile ? '32px 24px' : '48px 40px',
            boxShadow: '0 20px 60px rgba(30, 58, 138, 0.3)'
          }}>
            {/* Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {subscriptionStatus.reason === 'unauthenticated' ? (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : subscriptionStatus.reason === 'no_subscription' || subscriptionStatus.reason === 'subscription_expired' ? (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: isMobile ? '24px' : '28px',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '16px'
            }}>
              {subscriptionStatus.reason === 'unauthenticated' && '로그인이 필요합니다'}
              {subscriptionStatus.reason === 'no_subscription' && '구독이 필요합니다'}
              {subscriptionStatus.reason === 'subscription_expired' && '구독이 만료되었습니다'}
              {subscriptionStatus.reason === 'insufficient_credits' && '크레딧이 부족합니다'}
            </h2>

            {/* Description */}
            <p style={{
              fontSize: '15px',
              color: 'rgba(255, 255, 255, 0.6)',
              lineHeight: '1.6',
              marginBottom: '32px'
            }}>
              {subscriptionStatus.reason === 'unauthenticated' && 'EduRichBrain 서비스를 이용하려면 먼저 로그인해주세요.'}
              {subscriptionStatus.reason === 'no_subscription' && 'AI 학원 경영 도구를 사용하려면 요금제를 선택해주세요.'}
              {subscriptionStatus.reason === 'subscription_expired' && '구독이 만료되었습니다. 계속 이용하시려면 구독을 갱신해주세요.'}
              {subscriptionStatus.reason === 'insufficient_credits' && `현재 보유 크레딧: ${subscriptionStatus.credits || 0}P. 추가 크레딧을 충전해주세요.`}
            </p>

            {/* Credits Display (if logged in) */}
            {subscriptionStatus.credits !== undefined && subscriptionStatus.reason !== 'unauthenticated' && (
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '24px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>
                  보유 크레딧
                </div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#60a5fa' }}>
                  {(subscriptionStatus.credits || 0).toLocaleString()}P
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {subscriptionStatus.reason === 'unauthenticated' ? (
                <>
                  <Link
                    href="/login"
                    style={{
                      padding: '16px 32px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      textAlign: 'center',
                      boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
                    }}
                  >
                    시작하기
                  </Link>
                  <Link
                    href="/signup"
                    style={{
                      padding: '16px 32px',
                      background: 'transparent',
                      border: '2px solid rgba(59, 130, 246, 0.4)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      textAlign: 'center'
                    }}
                  >
                    회원가입하기
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/pricing"
                    style={{
                      padding: '16px 32px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      textAlign: 'center',
                      boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
                    }}
                  >
                    {subscriptionStatus.reason === 'insufficient_credits' ? '크레딧 충전하기' : '요금제 선택하기'}
                  </Link>
                  <Link
                    href="/"
                    style={{
                      padding: '16px 32px',
                      background: 'transparent',
                      border: '2px solid rgba(59, 130, 246, 0.4)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      textAlign: 'center'
                    }}
                  >
                    홈으로 돌아가기
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content: iframe with frame effect */}
      <div style={{
        flex: 1,
        width: '100%',
        padding: isMobile ? '10px' : '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '2px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 0 40px rgba(59, 130, 246, 0.15), inset 0 0 20px rgba(0, 0, 0, 0.3)'
        }}>
          <iframe
            src="https://edurichbrain.vercel.app/"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: '#0a0e27',
              display: 'block'
            }}
            title="EduRichBrain Demo"
            allow="clipboard-read; clipboard-write"
          />

          {/* 흰색 오버레이 (데모 느낌) */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.15)',
            pointerEvents: 'none',
            zIndex: 10
          }} />

          {/* 하단 체험모드 배너 */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '6px 16px',
            background: 'rgba(10, 14, 39, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#3b82f6',
            zIndex: 15,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            체험 모드 · 예시 데이터
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div style={{
        width: '100%',
        padding: isMobile ? '12px 16px' : '12px 24px',
        background: 'rgba(10, 14, 39, 0.8)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(59, 130, 246, 0.2)',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: isMobile ? '11px' : '13px',
        color: 'rgba(255, 255, 255, 0.6)',
        gap: isMobile ? '12px' : '0'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '8px' : '20px',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          <span>💡 모든 기능을 자유롭게 둘러보세요</span>
          <span>📊 예시 데이터로 구성되어 있습니다</span>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '12px' : '16px',
          alignItems: 'center'
        }}>
          <a
            href="mailto:support@edurichbrain.com"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            문의하기
          </a>
          {!isMobile && <span>|</span>}
          <Link
            href="/signup"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            회원가입하고 시작하기 →
          </Link>
        </div>
      </div>
    </div>
  )
}
