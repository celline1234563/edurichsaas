'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import useIsMobile from '@/hooks/useIsMobile'
import { BRAIN_BASE_URL } from '@/lib/constants'
import HeroSection from '@/components/HeroSection'
import WorkflowSection from '@/components/WorkflowSection'
import ComparisonSection from '@/components/ComparisonSection'
import { Sparkles, TrendingUp, ArrowRight, BarChart3, Plus } from 'lucide-react'

export default function HomePage() {
  const [authStatus, setAuthStatus] = useState('loading')
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
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          setAuthStatus('authenticated')
        } else {
          setAuthStatus('unauthenticated')
        }
      } catch {
        setAuthStatus('unauthenticated')
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    const checkSubscription = async () => {
      if (authStatus === 'loading') return
      if (authStatus === 'unauthenticated') {
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
  }, [authStatus])

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  const categoryColors = {
    'EduRichBrain': 'rgba(34, 211, 238, 0.15)',
    '교육리서치': 'rgba(34, 197, 94, 0.15)',
    '경영리서치': 'rgba(245, 158, 11, 0.15)',
    'AI': 'rgba(168, 85, 247, 0.15)',
  }

  const categoryTextColors = {
    'EduRichBrain': '#22d3ee',
    '교육리서치': '#4ade80',
    '경영리서치': '#fbbf24',
    'AI': '#c4b5fd',
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020617' }}>
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
              background: 'rgba(34, 211, 238, 0.1)',
              border: '1px solid rgba(34, 211, 238, 0.3)',
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
            border: '1px solid rgba(34, 211, 238, 0.15)'
          }}>
            <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>학원 경영의 모든 것</p>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>Pro 플랜 업그레이드</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-area" style={{ background: '#020617' }}>
        {/* Top Bar */}
        <header style={{
          height: '60px',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          background: 'rgba(2,6,23,0.6)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(34,211,238,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href={BRAIN_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #2563eb, #0891b2)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              앱 시작
            </a>
            <Link href="/signup" style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #2563eb, #0891b2)',
              border: '1px solid rgba(34,211,238,0.4)',
              borderRadius: '8px',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 4px 12px rgba(34,211,238,0.2)',
            }}>
              시작하기
            </Link>
          </div>
        </header>

        {/* === HERO SECTION (3D Neural Brain) === */}
        <HeroSection />

        {/* === WORKFLOW SECTION (3-Step Process) === */}
        <WorkflowSection />

        {/* === COMPARISON SECTION === */}
        <ComparisonSection />

        {/* === INSIGHTS / LATEST NEWS SECTION === */}
        <section style={{
          padding: isMobile ? '80px 16px' : '128px 24px',
          background: '#020617',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Ambient glows */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '25%',
            width: '500px',
            height: '500px',
            background: 'rgba(8,145,178,0.08)',
            borderRadius: '50%',
            filter: 'blur(120px)',
            pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            {/* Section Header */}
            <div style={{
              display: 'flex',
              alignItems: isMobile ? 'flex-start' : 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '48px',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '16px',
            }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  background: 'rgba(8,145,178,0.15)',
                  border: '1px solid rgba(34,211,238,0.2)',
                  color: '#22d3ee',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  backdropFilter: 'blur(8px)',
                }}>
                  <Sparkles style={{ width: '12px', height: '12px' }} />
                  INSIGHTS
                </div>
                <h2 style={{
                  fontSize: isMobile ? '28px' : '48px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '12px',
                  letterSpacing: '-0.02em',
                }}>Latest News</h2>
                <p style={{ color: '#94a3b8', fontSize: '18px' }}>
                  학원 경영과 교육 기술에 관한 최신 인사이트를 확인하세요.
                </p>
              </div>
              {!isMobile && (
                <Link href="/blog" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#94a3b8',
                  fontWeight: '500',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s',
                }}>
                  전체 보기
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </Link>
              )}
            </div>

            {/* News Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '96px',
            }}>
              {blogPosts.length > 0 ? blogPosts.map((post) => (
                <Link href={`/blog/${post.id}`} key={post.id} style={{ textDecoration: 'none' }}>
                  <article style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}>
                    {/* Image */}
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '16/10',
                      marginBottom: '20px',
                      overflow: 'hidden',
                      borderRadius: '16px',
                      background: '#0f172a',
                      border: '1px solid rgba(30,41,59,1)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }}>
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: 0.7,
                          transition: 'all 0.5s',
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, #020617, rgba(2,6,23,0.2), transparent)',
                        opacity: 0.8,
                      }} />
                      {/* Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(2,6,23,0.8)',
                        border: '1px solid rgba(51,65,85,1)',
                        backdropFilter: 'blur(12px)',
                        fontSize: '10px',
                        fontWeight: '700',
                        color: categoryTextColors[post.category] || '#22d3ee',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        {post.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{
                        color: '#64748b',
                        fontSize: '12px',
                        fontWeight: '500',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}>
                        <span style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: '#22d3ee',
                        }} />
                        {post.date}
                      </div>
                      <h3 className="line-clamp-2" style={{
                        fontSize: '17px',
                        fontWeight: '700',
                        color: '#e2e8f0',
                        lineHeight: '1.5',
                      }}>
                        {post.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              )) : (
                <article style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#0f172a',
                  border: '1px solid rgba(30,41,59,1)',
                }}>
                  <div style={{ height: '160px', background: 'linear-gradient(135deg, #2563eb, #0891b2)' }} />
                  <div style={{ padding: '20px' }}>
                    <span style={{ color: '#64748b', fontSize: '12px' }}>로딩 중...</span>
                    <h3 style={{ fontSize: '17px', fontWeight: '600', color: '#ffffff' }}>블로그 글을 불러오는 중입니다</h3>
                  </div>
                </article>
              )}
            </div>

            {isMobile && (
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#22d3ee', fontWeight: '500', textDecoration: 'none' }}>
                  전체 보기
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </Link>
              </div>
            )}

            {/* === DIAGNOSIS BANNER === */}
            <div style={{
              position: 'relative',
              width: '100%',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid rgba(30,41,59,1)',
              background: 'rgba(15,23,42,0.4)',
              backdropFilter: 'blur(8px)',
            }}>
              {/* Background effects */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, #020617, rgba(15,23,42,0.9), rgba(30,58,138,0.15))',
              }} />
              <div style={{
                position: 'absolute',
                right: '-80px',
                top: '-80px',
                width: '384px',
                height: '384px',
                background: 'rgba(37,99,235,0.08)',
                filter: 'blur(80px)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }} />
              {/* Grid pattern */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundSize: '30px 30px',
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                opacity: 0.2,
              }} />

              <div style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                padding: isMobile ? '48px 24px' : '64px',
                gap: isMobile ? '40px' : '48px',
              }}>
                {/* Left: Text */}
                <div style={{ flex: 1, textAlign: isMobile ? 'center' : 'left' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    color: '#60a5fa',
                    fontSize: '12px',
                    fontWeight: '700',
                    marginBottom: '24px',
                    boxShadow: '0 0 10px rgba(59,130,246,0.2)',
                  }}>
                    <TrendingUp style={{ width: '14px', height: '14px' }} />
                    AI BUSINESS DIAGNOSIS
                  </div>

                  <h2 style={{
                    fontSize: isMobile ? '28px' : '48px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '24px',
                    lineHeight: '1.2',
                  }}>
                    우리 학원 경영 레벨,<br />
                    <span style={{
                      background: 'linear-gradient(to right, #22d3ee, #3b82f6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>데이터로 확인해보세요.</span>
                  </h2>

                  <p style={{
                    color: '#94a3b8',
                    fontSize: '18px',
                    marginBottom: '40px',
                    maxWidth: '560px',
                    margin: isMobile ? '0 auto 40px' : '0 0 40px',
                    lineHeight: '1.7',
                  }}>
                    감에 의존하는 경영은 이제 끝났습니다. AI가 1,500가지 지표를 분석하여 현재 상태를 진단하고,{' '}
                    <span style={{ color: '#e2e8f0' }}>상위 1% 학원으로 가는 최적의 경로</span>를 제시합니다.
                  </p>

                  <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: 'center',
                    gap: '16px',
                    justifyContent: isMobile ? 'center' : 'flex-start',
                  }}>
                    <Link href="/diagnosis" style={{
                      padding: '16px 32px',
                      background: '#2563eb',
                      borderRadius: '12px',
                      fontWeight: '700',
                      color: '#ffffff',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 0 30px rgba(37,99,235,0.3)',
                      fontSize: '16px',
                    }}>
                      무료로 진단 받기
                      <ArrowRight style={{ width: '20px', height: '20px' }} />
                    </Link>
                    <span style={{ color: '#64748b', fontSize: '14px' }}>
                      * 3분 소요 / 별도 설치 없음
                    </span>
                  </div>
                </div>

                {/* Right: Chart Visual */}
                {!isMobile && (
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ position: 'relative', width: '360px', height: '360px' }}>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(15,23,42,0.6)',
                        borderRadius: '24px',
                        border: '1px solid rgba(51,65,85,0.5)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '24px',
                        transition: 'transform 0.5s',
                      }}>
                        {/* Card header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                          <div>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'rgba(59,130,246,0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: '8px',
                            }}>
                              <BarChart3 style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
                            </div>
                            <div style={{ height: '8px', width: '80px', background: '#334155', borderRadius: '9999px' }} />
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff' }}>A+</div>
                            <div style={{ fontSize: '12px', color: '#22d3ee' }}>Excellent</div>
                          </div>
                        </div>

                        {/* Neon Bars */}
                        <div style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'space-between',
                          gap: '16px',
                          padding: '0 8px 16px',
                        }}>
                          {[35, 55, 45, 85].map((height, i) => (
                            <div key={i} style={{ position: 'relative', width: '100%' }}>
                              <div style={{
                                width: '100%',
                                height: `${height}%`,
                                minHeight: `${height * 2}px`,
                                background: i === 3
                                  ? 'linear-gradient(to top, #2563eb, #22d3ee)'
                                  : '#1e293b',
                                borderRadius: '8px 8px 0 0',
                                transition: 'all 1s',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: i === 3 ? '0 0 20px rgba(34,211,238,0.5)' : 'none',
                              }}>
                                {i === 3 && (
                                  <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '1px',
                                    background: 'rgba(255,255,255,0.5)',
                                  }} />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* FAB */}
                        <div style={{
                          position: 'absolute',
                          right: '-16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                        }}>
                          <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: '#020617',
                            border: '1px solid rgba(51,65,85,1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            cursor: 'pointer',
                          }}>
                            <Plus style={{ width: '24px', height: '24px', color: '#ffffff' }} />
                          </div>
                        </div>
                      </div>

                      {/* Decor glows */}
                      <div style={{
                        position: 'absolute',
                        zIndex: -1,
                        bottom: '-40px',
                        left: '-40px',
                        width: '128px',
                        height: '128px',
                        background: 'rgba(34,211,238,0.15)',
                        borderRadius: '50%',
                        filter: 'blur(32px)',
                      }} />
                      <div style={{
                        position: 'absolute',
                        zIndex: -1,
                        top: '-20px',
                        right: '-20px',
                        width: '96px',
                        height: '96px',
                        background: 'rgba(59,130,246,0.15)',
                        borderRadius: '50%',
                        filter: 'blur(24px)',
                      }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* === CTA SECTION === */}
        <section style={{
          padding: isMobile ? '80px 16px' : '120px 24px',
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(34,211,238,0.03)',
            filter: 'blur(100px)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 style={{
              fontSize: isMobile ? '32px' : '48px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '24px',
            }}>
              EduRichBrain{' '}
              <span style={{
                background: 'linear-gradient(to right, #22d3ee, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>시작하기</span>
            </h2>
            <p style={{
              fontSize: isMobile ? '16px' : '20px',
              color: '#cbd5e1',
              maxWidth: '600px',
              margin: '0 auto',
              marginBottom: isMobile ? '40px' : '48px',
              lineHeight: '1.7',
            }}>
              지금 바로 시작하고 학원 경영의 새로운 기준을 경험하세요.
              <br />데이터로 증명된 성과가 기다리고 있습니다.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
            }}>
              <Link href="/demo" style={{
                width: isMobile ? '100%' : 'auto',
                padding: '16px 40px',
                background: 'linear-gradient(to right, #2563eb, #0891b2)',
                color: '#ffffff',
                fontWeight: '700',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(37,99,235,0.4)',
                textDecoration: 'none',
                textAlign: 'center',
              }}>
                무료 체험
              </Link>
              <Link href="/demo" style={{
                width: isMobile ? '100%' : 'auto',
                padding: '16px 40px',
                background: 'transparent',
                border: '2px solid rgba(51,65,85,1)',
                color: '#ffffff',
                fontWeight: '700',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)',
                textDecoration: 'none',
                textAlign: 'center',
              }}>
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
          borderTop: '1px solid rgba(15,23,42,1)',
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
            background: 'linear-gradient(135deg, rgba(2,6,23,0.95), rgba(15,23,42,0.9))',
            border: '1px solid rgba(34,211,238,0.3)',
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
              background: 'rgba(34,211,238,0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {subscriptionStatus?.reason === 'unauthenticated' ? (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                background: 'rgba(34,211,238,0.1)',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '24px',
                border: '1px solid rgba(34,211,238,0.2)'
              }}>
                <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '4px' }}>보유 크레딧</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#22d3ee' }}>{(subscriptionStatus?.credits || 0).toLocaleString()}P</div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {subscriptionStatus?.reason === 'unauthenticated' ? (
                <>
                  <Link href="/login" style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #2563eb, #0891b2)', borderRadius: '12px', color: '#ffffff', fontSize: '16px', fontWeight: '600', textDecoration: 'none', textAlign: 'center', boxShadow: '0 8px 24px rgba(34,211,238,0.3)' }}>시작하기</Link>
                  <Link href="/signup" style={{ padding: '16px 32px', background: 'transparent', border: '2px solid rgba(34,211,238,0.4)', borderRadius: '12px', color: '#ffffff', fontSize: '16px', fontWeight: '600', textDecoration: 'none', textAlign: 'center' }}>회원가입하기</Link>
                </>
              ) : (
                <>
                  <Link href="/pricing" style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #2563eb, #0891b2)', borderRadius: '12px', color: '#ffffff', fontSize: '16px', fontWeight: '600', textDecoration: 'none', textAlign: 'center', boxShadow: '0 8px 24px rgba(34,211,238,0.3)' }}>
                    {subscriptionStatus?.reason === 'insufficient_credits' ? '크레딧 충전하기' : '요금제 선택하기'}
                  </Link>
                  <button onClick={() => setShowAccessModal(false)} style={{ padding: '16px 32px', background: 'transparent', border: '2px solid rgba(34,211,238,0.4)', borderRadius: '12px', color: '#ffffff', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>닫기</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
