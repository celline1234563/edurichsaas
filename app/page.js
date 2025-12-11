'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [mainInput, setMainInput] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [blogPosts, setBlogPosts] = useState([])

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

  const handleEnter = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (!mainInput.trim()) {
      alert('내용을 입력해주세요')
      return
    }
    alert('회원가입 후 AI와 대화를 시작합니다!\n\n→ app.edurichbrain.com으로 이동')
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
    </div>
  )
}
