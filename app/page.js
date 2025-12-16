'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import useIsMobile from '@/hooks/useIsMobile'

export default function HomePage() {
  const { status } = useSession()
  const [mainInput, setMainInput] = useState('')
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [blogPosts, setBlogPosts] = useState([])
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)
  const [showAccessModal, setShowAccessModal] = useState(false)

  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false)
    }
  }, [isMobile])

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => setBlogPosts(data.slice(0, 4)))
      .catch(err => console.error('블로그 데이터 로드 실패:', err))
  }, [])

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

    if (status === 'unauthenticated') {
      setShowAccessModal(true)
      return
    }

    if (subscriptionStatus && !subscriptionStatus.canUse) {
      setShowAccessModal(true)
      return
    }

    window.open('https://edurichbrain.ai.kr/', '_blank')
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

  const quickSuggestions = [
    '학원 경영 레벨테스트 받기',
    '학생 리포트 자동 작성',
    '커리큘럼 만들기',
    '더 보기',
  ]

  const categoryColors = {
    'EduRichBrain': 'rgba(59, 130, 246, 0.2)',
    '교육리서치': 'rgba(34, 197, 94, 0.2)',
    '경영리서치': 'rgba(245, 158, 11, 0.2)',
    'AI': 'rgba(168, 85, 247, 0.2)',
  }

  const categoryTextColors = {
    'EduRichBrain': '#93c5fd',
    '교육리서치': '#86efac',
    '경영리서치': '#fcd34d',
    'AI': '#c4b5fd',
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
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
            border: '1px solid rgba(59, 130, 246, 0.15)'
          }}>
            <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>학원 경영의 모든 것</p>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>Pro 플랜 업그레이드</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-area">
        {/* Top Bar */}
        <header className="top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="search-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <Link href="/signup" className="login-btn">
            시작하기
          </Link>
        </header>

        {/* Hero Section - New Design */}
        <section style={{
          position: 'relative',
          width: '100%',
          paddingTop: isMobile ? '48px' : '96px',
          paddingBottom: isMobile ? '80px' : '128px',
          paddingLeft: isMobile ? '16px' : '24px',
          paddingRight: isMobile ? '16px' : '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          overflow: 'visible'
        }}>
          {/* Background Ambience */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: isMobile ? '300px' : '800px',
            height: isMobile ? '300px' : '600px',
            background: 'rgba(37, 99, 235, 0.2)',
            borderRadius: '50%',
            filter: isMobile ? 'blur(80px)' : 'blur(120px)',
            pointerEvents: 'none',
            zIndex: 0,
            mixBlendMode: 'screen',
            opacity: 0.6
          }}></div>

          {/* Content Container */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '900px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            {/* Badge */}
            <div style={{
              marginBottom: isMobile ? '24px' : '32px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              background: 'rgba(59, 130, 246, 0.1)',
              backdropFilter: 'blur(12px)'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: '#60a5fa' }}>
                <path d="M12 3l1.09 6.26L18 10l-4.91.74L12 17l-1.09-6.26L6 10l4.91-.74L12 3z" fill="currentColor"/>
              </svg>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AI-Powered Management
              </span>
            </div>

            {/* Main Title */}
            <h1 style={{
              fontSize: isMobile ? '36px' : '64px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '24px',
              lineHeight: isMobile ? '1.2' : '1.1',
              letterSpacing: '-0.02em'
            }}>
              무엇을 <span style={{
                background: 'linear-gradient(to right, #60a5fa, #2563eb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>도와드릴까요?</span>
            </h1>

            <p style={{
              color: '#cbd5e1',
              fontSize: isMobile ? '16px' : '20px',
              maxWidth: '600px',
              marginBottom: isMobile ? '40px' : '48px',
              fontWeight: '300',
              lineHeight: '1.6'
            }}>
              AI가 분석하는 학원 경영의 새로운 기준.<br />
              데이터 기반 의사결정으로 성장을 가속화하세요.
            </p>

            {/* Glass Input Field */}
            <div style={{
              width: '100%',
              maxWidth: '640px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                inset: '-4px',
                background: 'linear-gradient(to right, #2563eb, #60a5fa)',
                borderRadius: '20px',
                filter: 'blur(20px)',
                opacity: 0.25,
                pointerEvents: 'none'
              }}></div>

              <div style={{ position: 'relative' }}>
                <input
                  id="mainInput"
                  type="text"
                  value={mainInput}
                  onChange={(e) => setMainInput(e.target.value)}
                  onKeyPress={handleEnter}
                  placeholder="고민되는 학생이 있으신가요? (예: 중2 영어 성적)"
                  style={{
                    width: '100%',
                    height: isMobile ? '56px' : '64px',
                    paddingLeft: isMobile ? '20px' : '24px',
                    paddingRight: isMobile ? '56px' : '64px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '16px',
                    color: '#ffffff',
                    fontSize: isMobile ? '14px' : '16px',
                    outline: 'none',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                  }}
                />
                <button
                  onClick={handleSubmit}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '8px',
                    height: isMobile ? '40px' : '48px',
                    width: isMobile ? '40px' : '48px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    border: 'none',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(30, 58, 138, 0.5)'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            <div style={{
              marginTop: '32px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: isMobile ? '8px' : '12px'
            }}>
              {quickSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => fillSuggestion(suggestion === '더 보기' ? '' : suggestion)}
                  style={{
                    padding: isMobile ? '8px 14px' : '10px 18px',
                    borderRadius: '9999px',
                    fontSize: isMobile ? '12px' : '14px',
                    fontWeight: '500',
                    color: '#cbd5e1',
                    background: 'rgba(30, 41, 59, 0.4)',
                    border: '1px solid rgba(51, 65, 85, 1)',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Feature Links */}
            <div style={{
              marginTop: '32px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: isMobile ? '16px' : '24px',
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: '500',
              color: '#64748b'
            }}>
              {['EduRichBrain Business', '검색하기', '리서치', '더 보기'].map((link, idx) => (
                <a key={idx} href="#" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {link}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ opacity: 0 }}>
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Floating Interface Mockup */}
          <div style={{
            marginTop: isMobile ? '64px' : '96px',
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',
            margin: `${isMobile ? '64px' : '96px'} auto 0`
          }} className="perspective-1000">
            <div style={{
              position: 'relative',
              borderRadius: '24px',
              background: '#0a0e27',
              border: '1px solid rgba(51, 65, 85, 0.8)',
              boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.7)',
              overflow: 'hidden'
            }}>
              {/* Header / Toolbar */}
              <div style={{
                height: isMobile ? '56px' : '64px',
                background: 'rgba(15, 23, 42, 0.9)',
                borderBottom: '1px solid rgba(30, 41, 59, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: isMobile ? '0 16px' : '0 24px',
                backdropFilter: 'blur(12px)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.8)' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(234, 179, 8, 0.8)' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.8)' }}></div>
                  </div>
                  <div style={{ height: '24px', width: '1px', background: 'rgba(51, 65, 85, 1)', margin: '0 8px' }}></div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    background: 'rgba(30, 58, 138, 0.3)',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.3)'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#60a5fa' }}>
                      <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1v3a1 1 0 01-1 1h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 01-1-1v-3a1 1 0 011-1h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2z" fill="currentColor"/>
                    </svg>
                    <span style={{ fontSize: '14px', color: '#dbeafe', fontWeight: '700' }}>
                      AI Workspace {!isMobile && <span style={{ fontWeight: '400', opacity: 0.7 }}>v3.0</span>}
                    </span>
                  </div>
                </div>
                {!isMobile && (
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: 'rgba(30, 41, 59, 1)',
                    border: '1px solid rgba(51, 65, 85, 1)',
                    fontSize: '12px',
                    color: '#64748b'
                  }}>
                    Autosave: On
                  </div>
                )}
              </div>

              {/* Main Canvas Area */}
              <div style={{
                position: 'relative',
                background: '#0f111a',
                padding: isMobile ? '16px' : '32px',
                minHeight: isMobile ? '400px' : '500px',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: isMobile ? '16px' : '24px'
              }} className="bg-grid-pattern">
                {/* Background Center Glow */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: isMobile ? '200px' : '400px',
                  height: isMobile ? '200px' : '400px',
                  background: 'rgba(37, 99, 235, 0.1)',
                  filter: isMobile ? 'blur(60px)' : 'blur(100px)',
                  borderRadius: '50%'
                }}></div>

                {/* Floating Card: Blog Content */}
                {!isMobile && (
                  <div className="animate-float-delayed" style={{
                    position: 'absolute',
                    top: '10%',
                    right: '5%',
                    width: '260px',
                    background: 'rgba(30, 41, 59, 0.8)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(71, 85, 105, 0.5)',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                    zIndex: 10
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ padding: '8px', background: 'rgba(34, 197, 94, 0.2)', borderRadius: '8px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: '#4ade80' }}>
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>블로그 컨텐츠</div>
                        <div style={{ fontSize: '13px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          생성 완료
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ height: '8px', width: '100%', background: 'rgba(51, 65, 85, 1)', borderRadius: '4px' }}></div>
                      <div style={{ height: '8px', width: '80%', background: 'rgba(51, 65, 85, 1)', borderRadius: '4px' }}></div>
                      <div style={{ height: '8px', width: '90%', background: 'rgba(51, 65, 85, 1)', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                )}

                {/* Floating Card: Study Report */}
                {!isMobile && (
                  <div className="animate-float" style={{
                    position: 'absolute',
                    bottom: '15%',
                    left: '5%',
                    width: '300px',
                    background: 'rgba(30, 41, 59, 0.8)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(71, 85, 105, 0.5)',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                    zIndex: 10
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ padding: '8px', background: 'rgba(168, 85, 247, 0.2)', borderRadius: '8px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: '#c084fc' }}>
                          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>학습 자동 보고서</div>
                        <div style={{ fontSize: '13px', color: '#94a3b8' }}>김민수 학생 (중2)</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>성취도 분석</span>
                      <span style={{ fontSize: '13px', color: '#c084fc', fontWeight: '700' }}>A Grade</span>
                    </div>
                    <div style={{ width: '100%', background: 'rgba(51, 65, 85, 1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ background: 'linear-gradient(to right, #a855f7, #3b82f6)', height: '100%', width: '92%' }}></div>
                    </div>
                  </div>
                )}

                {/* Center Main Piece */}
                <div style={{
                  position: 'relative',
                  zIndex: 20,
                  width: '100%',
                  maxWidth: '480px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '24px',
                  padding: isMobile ? '24px' : '32px',
                  boxShadow: '0 0 50px rgba(37, 99, 235, 0.2)'
                }}>
                  {/* Active Indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '6px 16px',
                    background: '#2563eb',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.5)',
                    border: '1px solid #60a5fa',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap'
                  }}>
                    <span style={{ width: '6px', height: '6px', background: '#ffffff', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></span>
                    GENERATING STRATEGY...
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px', marginTop: isMobile ? '16px' : '8px' }}>
                    <div style={{
                      padding: '12px',
                      background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                      borderRadius: '16px',
                      color: '#ffffff',
                      boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
                      flexShrink: 0
                    }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 9v6M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <h2 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '700', color: '#ffffff', marginBottom: '4px', lineHeight: '1.3' }}>
                        2024 윈터스쿨 설명회 전략
                      </h2>
                      <p style={{ color: '#94a3b8', fontSize: isMobile ? '13px' : '15px' }}>
                        타겟: 예비 고1 / 목표: 등록률 30% 증대
                      </p>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div style={{
                    background: 'rgba(2, 6, 23, 0.5)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(30, 41, 59, 1)',
                    marginBottom: '24px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid rgba(30, 41, 59, 1)', paddingBottom: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(51, 65, 85, 1)' }}></div>
                      <div style={{ width: '60px', height: '6px', background: 'rgba(30, 41, 59, 1)', borderRadius: '3px' }}></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ height: '12px', width: '100%', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '4px' }}></div>
                      <div style={{ height: '12px', width: '90%', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '4px' }}></div>
                      <div style={{ height: '12px', width: '95%', background: 'rgba(30, 41, 59, 0.8)', borderRadius: '4px' }}></div>
                      <div style={{ height: '12px', width: '60%', background: 'rgba(30, 58, 138, 0.3)', borderRadius: '4px', border: '1px solid rgba(59, 130, 246, 0.2)' }}></div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                    <span style={{ color: '#93c5fd', fontWeight: '600' }}>AI Writing Copy...</span>
                    <span style={{ color: '#ffffff', fontFamily: 'monospace' }}>84%</span>
                  </div>
                  <div style={{ width: '100%', background: 'rgba(30, 41, 59, 1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ background: '#3b82f6', height: '100%', width: '84%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '60px', background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5))', animation: 'pulse 1.5s infinite' }}></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                    <button style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '12px',
                      background: '#2563eb',
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(30, 58, 138, 0.3)'
                    }}>
                      미리보기
                    </button>
                    <button style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '12px',
                      background: 'rgba(30, 41, 59, 1)',
                      border: '1px solid rgba(51, 65, 85, 1)',
                      color: '#ffffff',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      수정하기
                    </button>
                  </div>
                </div>
              </div>

              {/* Scanning Overlay Effect */}
              <div className="animate-scan" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(to right, transparent, #60a5fa, transparent)',
                opacity: 0.5,
                pointerEvents: 'none',
                zIndex: 30,
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)'
              }}></div>
            </div>

            {/* Bottom Glow */}
            <div style={{
              position: 'absolute',
              bottom: '-40px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '75%',
              height: '96px',
              background: 'rgba(37, 99, 235, 0.2)',
              filter: 'blur(80px)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}></div>
          </div>
        </section>

        {/* Latest News Section */}
        <section style={{ padding: isMobile ? '60px 16px' : '96px 24px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: isMobile ? '32px' : '40px' }}>
            <div>
              <h2 style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>Latest News</h2>
              <p style={{ color: '#94a3b8' }}>학원 경영과 교육에 관한 최신 인사이트</p>
            </div>
            {!isMobile && (
              <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontWeight: '500', textDecoration: 'none' }}>
                모두 보기
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {blogPosts.length > 0 ? blogPosts.map((post) => (
              <Link href={`/blog/${post.id}`} key={post.id} style={{ textDecoration: 'none' }}>
                <article className="glass-panel" style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.3s'
                }}>
                  <div style={{
                    height: '160px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{
                        fontSize: '10px',
                        padding: '4px 8px',
                        borderRadius: '9999px',
                        border: '1px solid',
                        fontWeight: '500',
                        background: categoryColors[post.category] || 'rgba(51, 65, 85, 1)',
                        color: categoryTextColors[post.category] || '#cbd5e1',
                        borderColor: 'transparent'
                      }}>
                        {post.category}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '12px' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                          <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        {post.date}
                      </span>
                    </div>
                    <h3 className="line-clamp-2" style={{ fontSize: '17px', fontWeight: '600', color: '#ffffff', lineHeight: '1.4' }}>
                      {post.title}
                    </h3>
                  </div>
                </article>
              </Link>
            )) : (
              <article className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ height: '160px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}></div>
                <div style={{ padding: '20px' }}>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>로딩 중...</span>
                  <h3 style={{ fontSize: '17px', fontWeight: '600', color: '#ffffff' }}>블로그 글을 불러오는 중입니다</h3>
                </div>
              </article>
            )}
          </div>

          {isMobile && (
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontWeight: '500', textDecoration: 'none' }}>
                모두 보기
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          )}
        </section>

        {/* Diagnosis CTA Section */}
        <section style={{ padding: isMobile ? '48px 16px' : '48px 24px', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'linear-gradient(to right, rgba(30, 58, 138, 0.4), rgba(15, 23, 42, 0.4))',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            padding: isMobile ? '48px 24px' : '64px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: isMobile ? '40px' : '64px'
          }}>
            {/* Background Shapes */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '256px', height: '256px', background: 'rgba(37, 99, 235, 0.2)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '256px', height: '256px', background: 'rgba(126, 34, 206, 0.1)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }}></div>

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '560px', textAlign: isMobile ? 'center' : 'left' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '9999px',
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#93c5fd',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '24px'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                경영 진단
              </div>
              <h2 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: '700', color: '#ffffff', marginBottom: '24px' }}>
                우리 학원 경영 레벨은?
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: isMobile ? '16px' : '18px', lineHeight: '1.6', marginBottom: '32px' }}>
                단 3분이면 충분합니다. AI가 분석하는 학원 경영 상태를 무료로 진단받고 맞춤형 솔루션을 제안받으세요.
              </p>
              <Link
                href="/diagnosis"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: isMobile ? '14px 28px' : '16px 32px',
                  background: '#ffffff',
                  color: '#1e3a8a',
                  fontWeight: '700',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  textDecoration: 'none',
                  fontSize: isMobile ? '15px' : '16px'
                }}
              >
                경영진단 시작하기
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            {/* Visual Element */}
            {!isMobile && (
              <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '320px' }}>
                <div className="glass-panel" style={{
                  aspectRatio: '1',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '16px', height: '160px', width: '100%' }}>
                    <div style={{ width: '32px', background: 'rgba(59, 130, 246, 0.3)', borderRadius: '8px 8px 0 0', height: '40%' }}></div>
                    <div style={{ width: '32px', background: 'rgba(59, 130, 246, 0.5)', borderRadius: '8px 8px 0 0', height: '60%' }}></div>
                    <div style={{ width: '32px', background: 'rgba(59, 130, 246, 0.7)', borderRadius: '8px 8px 0 0', height: '80%' }}></div>
                    <div style={{ width: '32px', background: '#3b82f6', borderRadius: '8px 8px 0 0', height: '100%', boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}></div>
                  </div>
                  <div style={{ position: 'absolute', top: '24px', left: '24px', right: '24px' }}>
                    <div style={{ height: '8px', width: '48px', background: 'rgba(51, 65, 85, 1)', borderRadius: '4px', marginBottom: '8px' }}></div>
                    <div style={{ height: '24px', width: '96px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '6px' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Start CTA Section */}
        <section style={{ padding: isMobile ? '80px 16px' : '120px 24px', maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(37, 99, 235, 0.05)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }}></div>

          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 style={{ fontSize: isMobile ? '32px' : '48px', fontWeight: '700', color: '#ffffff', marginBottom: '24px' }}>
              EduRichBrain <span style={{ color: '#3b82f6' }}>시작하기</span>
            </h2>
            <p style={{ fontSize: isMobile ? '16px' : '20px', color: '#cbd5e1', marginBottom: isMobile ? '40px' : '48px', maxWidth: '600px', margin: '0 auto', marginBottom: isMobile ? '40px' : '48px' }}>
              지금 바로 시작하고 학원 경영의 새로운 기준을 경험하세요.
              <br />데이터로 증명된 성과가 기다리고 있습니다.
            </p>

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <Link
                href="/demo"
                style={{
                  width: isMobile ? '100%' : 'auto',
                  padding: '16px 40px',
                  background: 'linear-gradient(to right, #2563eb, #3b82f6)',
                  color: '#ffffff',
                  fontWeight: '700',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(30, 58, 138, 0.4)',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
              >
                무료 체험
              </Link>
              <Link
                href="/demo"
                style={{
                  width: isMobile ? '100%' : 'auto',
                  padding: '16px 40px',
                  background: 'transparent',
                  border: '2px solid rgba(71, 85, 105, 1)',
                  color: '#ffffff',
                  fontWeight: '700',
                  borderRadius: '12px',
                  backdropFilter: 'blur(8px)',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
              >
                데모 보기
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: isMobile ? '48px 16px 24px' : '48px 24px 24px',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '14px',
          position: 'relative',
          zIndex: 10,
          borderTop: '1px solid rgba(30, 41, 59, 1)'
        }}>
          <p>&copy; 2024 EduRichBrain. All rights reserved.</p>
        </footer>
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

            <h2 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>
              {subscriptionStatus?.reason === 'unauthenticated' && '로그인이 필요합니다'}
              {subscriptionStatus?.reason === 'no_subscription' && '구독이 필요합니다'}
              {subscriptionStatus?.reason === 'subscription_expired' && '구독이 만료되었습니다'}
              {subscriptionStatus?.reason === 'insufficient_credits' && '크레딧이 부족합니다'}
              {!subscriptionStatus && '서비스 이용 불가'}
            </h2>

            <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.6', marginBottom: '32px' }}>
              {subscriptionStatus?.reason === 'unauthenticated' && 'AI 학원 경영 도구를 사용하려면 먼저 로그인해주세요.'}
              {subscriptionStatus?.reason === 'no_subscription' && '서비스를 이용하려면 요금제를 선택해주세요.'}
              {subscriptionStatus?.reason === 'subscription_expired' && '계속 이용하시려면 구독을 갱신해주세요.'}
              {subscriptionStatus?.reason === 'insufficient_credits' && `현재 보유 크레딧: ${subscriptionStatus?.credits || 0}P`}
            </p>

            {subscriptionStatus?.credits !== undefined && subscriptionStatus?.reason !== 'unauthenticated' && (
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '24px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>보유 크레딧</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#60a5fa' }}>{(subscriptionStatus?.credits || 0).toLocaleString()}P</div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {subscriptionStatus?.reason === 'unauthenticated' ? (
                <>
                  <Link href="/login" style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '12px', color: '#ffffff', fontSize: '16px', fontWeight: '600', textDecoration: 'none', textAlign: 'center', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)' }}>시작하기</Link>
                  <Link href="/signup" style={{ padding: '16px 32px', background: 'transparent', border: '2px solid rgba(59, 130, 246, 0.4)', borderRadius: '12px', color: '#ffffff', fontSize: '16px', fontWeight: '600', textDecoration: 'none', textAlign: 'center' }}>회원가입하기</Link>
                </>
              ) : (
                <>
                  <Link href="/pricing" style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '12px', color: '#ffffff', fontSize: '16px', fontWeight: '600', textDecoration: 'none', textAlign: 'center', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)' }}>
                    {subscriptionStatus?.reason === 'insufficient_credits' ? '크레딧 충전하기' : '요금제 선택하기'}
                  </Link>
                  <button onClick={() => setShowAccessModal(false)} style={{ padding: '16px 32px', background: 'transparent', border: '2px solid rgba(59, 130, 246, 0.4)', borderRadius: '12px', color: '#ffffff', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>닫기</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
