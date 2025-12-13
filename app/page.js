'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function HomePage() {
  const { status } = useSession()
  const [mainInput, setMainInput] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [blogPosts, setBlogPosts] = useState([])
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)
  const [showAccessModal, setShowAccessModal] = useState(false)

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

  useEffect(() => {
    // Notion 블로그 데이터 가져오기
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => setBlogPosts(data.slice(0, 4))) // 최신 4개만
      .catch(err => console.error('블로그 데이터 로드 실패:', err))
  }, [])

  // 구독 상태 확인
  useEffect(() => {
    const checkSubscription = async () => {
      if (status === 'loading') return
      if (status === 'unauthenticated') {
        setSubscriptionStatus({ canUse: false, reason: 'unauthenticated' })
        return
      }

      try {
        const response = await fetch('/api/subscription')
        const data = await response.json()
        if (data.success) {
          setSubscriptionStatus({
            canUse: data.data.canUseService,
            reason: data.data.serviceStatus,
            credits: data.data.credits
          })
        } else {
          setSubscriptionStatus({ canUse: false, reason: data.error })
        }
      } catch (error) {
        setSubscriptionStatus({ canUse: false, reason: 'error' })
      }
    }
    checkSubscription()
  }, [status])

  const handleEnter = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (!mainInput.trim()) {
      alert('내용을 입력해주세요')
      return
    }

    // 로그인 확인
    if (status === 'unauthenticated') {
      setShowAccessModal(true)
      return
    }

    // 구독 상태 확인
    if (subscriptionStatus && !subscriptionStatus.canUse) {
      setShowAccessModal(true)
      return
    }

    // 구독이 있으면 바로 이동
    window.open('https://edurichbrain.vercel.app/', '_blank')
  }

  const fillSuggestion = (text) => {
    setMainInput(text)
    document.getElementById('mainInput').focus()
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <div className="app-layout">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="메뉴 열기"
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
            <Link href="/" className="mobile-menu-link active" onClick={closeMobileMenu}>제품</Link>
            <Link href="/pricing" className="mobile-menu-link" onClick={closeMobileMenu}>요금제</Link>
            <Link href="/diagnosis" className="mobile-menu-link" onClick={closeMobileMenu}>경영진단</Link>
            <Link href="/blog" className="mobile-menu-link" onClick={closeMobileMenu}>블로그</Link>
            <Link href="/about" className="mobile-menu-link" onClick={closeMobileMenu}>회사</Link>
            <Link href="/demo" className="mobile-menu-link" onClick={closeMobileMenu}>데모</Link>
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

      {/* Left Sidebar Navigation (Desktop Only) */}
      <aside className="sidebar">
        <Link href="/" className="sidebar-logo">
          EduRichBrain
        </Link>

        <nav className="sidebar-nav">
          <Link href="/" className="sidebar-link active">제품</Link>
          <Link href="/pricing" className="sidebar-link">요금제</Link>
          <Link href="/diagnosis" className="sidebar-link">경영진단</Link>
          <Link href="/blog" className="sidebar-link">블로그</Link>
          <Link href="/about" className="sidebar-link">회사</Link>
          <Link href="/demo" className="sidebar-link">데모</Link>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-area">
        {/* Top Bar */}
        <header className="top-bar">
          <button className="search-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <Link href="/signup" className="login-btn">
            시작하기
          </Link>
        </header>

        {/* Hero Section */}
        <main className="content-main">
          <div className="hero-container">
            <h1 className="main-title">
              무엇을 도와드릴까요?
            </h1>

            {/* Chat Input */}
            <div className="input-section">
              <div className="input-box">
                <input
                  id="mainInput"
                  type="text"
                  value={mainInput}
                  onChange={(e) => setMainInput(e.target.value)}
                  onKeyPress={handleEnter}
                  placeholder="고민되는 학생이 있으신가요? 예: 중2 영어, 문법은 잘하는데 듣기가 약해요"
                  className="main-input"
                />
                <button onClick={handleSubmit} className="submit-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Quick Suggestions */}
              <div className="suggestions">
                <button onClick={() => fillSuggestion('학원 경영 레벨테스트 받기')} className="suggest-chip">
                  학원 경영 레벨테스트 받기
                </button>
                <button onClick={() => fillSuggestion('학생 리포트 자동 작성')} className="suggest-chip">
                  학생 리포트 자동 작성
                </button>
                <button onClick={() => fillSuggestion('커리큘럼 만들기')} className="suggest-chip">
                  커리큘럼 만들기
                </button>
                <button onClick={() => fillSuggestion('더 보기')} className="suggest-chip">
                  더 보기
                </button>
              </div>
            </div>

            {/* Feature Links */}
            <div className="feature-links">
              <span>EduRichBrain Business에 대해 알아보기</span>
              <span>EduRichBrain으로 검색하기</span>
              <span>리서치</span>
              <span>더 보기</span>
            </div>
          </div>
        </main>

        {/* Latest News Section */}
        <section className="content-section">
          <div className="section-title-bar">
            <Link href="/blog" className="see-all">모두 보기</Link>
          </div>

          <div className="card-grid">
            {blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <Link href={`/blog/${post.id}`} key={post.id} style={{ textDecoration: 'none' }}>
                  <article className="info-card">
                    <div className="card-thumb" style={{
                      backgroundImage: `url(${post.coverImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}></div>
                    <div className="card-body">
                      <span className="card-date">{post.date}</span>
                      <h3>{post.title}</h3>
                    </div>
                  </article>
                </Link>
              ))
            ) : (
              // 로딩 중 스켈레톤
              <>
                <article className="info-card">
                  <div className="card-thumb"></div>
                  <div className="card-body">
                    <span className="card-date">로딩 중...</span>
                    <h3>블로그 글을 불러오는 중입니다</h3>
                  </div>
                </article>
              </>
            )}
          </div>
        </section>

        {/* 경영진단 Section */}
        <section className="diagnosis-section">
          <div className="diagnosis-container">
            <h2 className="diagnosis-title">우리 학원 경영 레벨은?</h2>
            <p className="diagnosis-desc">3분 만에 확인하는 무료 경영 진단 테스트</p>
            <Link href="/diagnosis" className="diagnosis-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
              경영진단 시작하기
            </Link>
          </div>
        </section>

        {/* EduRichBrain 시작하기 Section */}
        <section className="cta-section">
          <div className="cta-container">
            <h2 className="cta-title">EduRichBrain 시작하기</h2>
            <p className="cta-desc">지금 바로 시작하고 학원 경영의 새로운 기준을 경험하세요</p>
            <div className="cta-buttons">
              <Link href="/demo" className="cta-btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>무료 체험</Link>
              <Link href="/demo" className="cta-btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>데모 보기</Link>
            </div>
          </div>
        </section>

      </div>

      {/* Access Required Modal */}
      {showAccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '24px',
            padding: isMobile ? '32px 24px' : '48px 40px',
            textAlign: 'center',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowAccessModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.6)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

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
              {subscriptionStatus?.reason === 'unauthenticated' ? (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: isMobile ? '22px' : '26px',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '16px'
            }}>
              {subscriptionStatus?.reason === 'unauthenticated' && '로그인이 필요합니다'}
              {subscriptionStatus?.reason === 'no_subscription' && '구독이 필요합니다'}
              {subscriptionStatus?.reason === 'subscription_expired' && '구독이 만료되었습니다'}
              {subscriptionStatus?.reason === 'insufficient_credits' && '크레딧이 부족합니다'}
              {!subscriptionStatus && '서비스 이용 불가'}
            </h2>

            {/* Description */}
            <p style={{
              fontSize: '15px',
              color: 'rgba(255, 255, 255, 0.6)',
              lineHeight: '1.6',
              marginBottom: '32px'
            }}>
              {subscriptionStatus?.reason === 'unauthenticated' && 'AI 학원 경영 도구를 사용하려면 먼저 로그인해주세요.'}
              {subscriptionStatus?.reason === 'no_subscription' && '서비스를 이용하려면 요금제를 선택해주세요.'}
              {subscriptionStatus?.reason === 'subscription_expired' && '계속 이용하시려면 구독을 갱신해주세요.'}
              {subscriptionStatus?.reason === 'insufficient_credits' && `현재 보유 크레딧: ${subscriptionStatus?.credits || 0}P`}
            </p>

            {/* Credits Display */}
            {subscriptionStatus?.credits !== undefined && subscriptionStatus?.reason !== 'unauthenticated' && (
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
                  {(subscriptionStatus?.credits || 0).toLocaleString()}P
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {subscriptionStatus?.reason === 'unauthenticated' ? (
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
                    {subscriptionStatus?.reason === 'insufficient_credits' ? '크레딧 충전하기' : '요금제 선택하기'}
                  </Link>
                  <button
                    onClick={() => setShowAccessModal(false)}
                    style={{
                      padding: '16px 32px',
                      background: 'transparent',
                      border: '2px solid rgba(59, 130, 246, 0.4)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    닫기
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
