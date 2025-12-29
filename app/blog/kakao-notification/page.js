'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import useIsMobile from '@/hooks/useIsMobile'
import Flowchart from './Flowchart'
import { PhoneMockupDisplay } from './KakaoPhoneMockup'
import { MESSAGE_TYPES, COMPARISON_DATA, FAQ_DATA } from './constants'

export default function KakaoNotificationBlogPage() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

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
            <Link href="/" className="mobile-menu-link" onClick={closeMobileMenu}>제품</Link>
            <Link href="/pricing" className="mobile-menu-link" onClick={closeMobileMenu}>요금제</Link>
            <Link href="/diagnosis" className="mobile-menu-link" onClick={closeMobileMenu}>경영진단</Link>
            <Link href="/blog/kakao-notification" className="mobile-menu-link active" onClick={closeMobileMenu}>에듀케어 알림</Link>
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

      {/* Sidebar (Desktop Only) */}
      <aside className="sidebar">
        <Link href="/" className="sidebar-logo">
          EduRichBrain
        </Link>

        <nav className="sidebar-nav">
          <Link href="/" className="sidebar-link">제품</Link>
          <Link href="/pricing" className="sidebar-link">요금제</Link>
          <Link href="/diagnosis" className="sidebar-link">경영진단</Link>
          <Link href="/blog/kakao-notification" className="sidebar-link active">에듀케어 알림</Link>
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

      {/* Main Content */}
      <div className="main-area">
        {/* Top Bar */}
        <header className="top-bar">
          <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '14px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            블로그 목록
          </Link>
          <Link href="/signup" className="login-btn">
            시작하기
          </Link>
        </header>

        {/* Blog Content */}
        <div style={{ padding: isMobile ? '20px' : '0' }}>

          {/* Hero Section */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? '400px' : '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {/* Background Image */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
              <img
                src="https://img.hankyung.com/photo/202511/02.41917781.1.jpg"
                alt="KakaoTalk notification"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, #0a0e27 0%, rgba(10, 14, 39, 0.7) 50%, rgba(10, 14, 39, 0.4) 100%)'
              }}></div>
            </div>

            {/* Hero Content */}
            <div style={{
              position: 'relative',
              zIndex: 10,
              textAlign: 'center',
              maxWidth: '900px',
              padding: '0 24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  background: '#2563eb',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  EduRichBrain
                </span>
              </div>

              <h1 style={{
                fontSize: isMobile ? '24px' : '40px',
                fontWeight: '700',
                color: 'white',
                lineHeight: 1.3,
                marginBottom: '20px',
                wordBreak: 'keep-all'
              }}>
                학부모님들께 우리 아이의 학습현황을<br /> 가장 빠르게 주는 방법 : 카카오톡 알림
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                <span>EduRichBrain</span>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }}></span>
                <span>2025년 12월 16일</span>
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: isMobile ? '0 0 60px' : '0 32px 80px'
          }}>
            <div className="glass" style={{
              borderRadius: '16px',
              overflow: 'hidden',
              marginTop: '-60px',
              position: 'relative',
              zIndex: 20
            }}>

              {/* 공식 채널 안내 배너 */}
              <div style={{
                padding: isMobile ? '20px' : '24px 40px',
                background: 'linear-gradient(135deg, rgba(254, 229, 0, 0.2), rgba(254, 229, 0, 0.1))',
                borderBottom: '2px solid rgba(254, 229, 0, 0.4)',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? '12px' : '16px'
              }}>
                <div style={{
                  padding: '8px 14px',
                  background: '#FEE500',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexShrink: 0
                }}>
                  <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="#3C1E1E">
                    <path d="M12 3c-4.97 0-9 3.13-9 7 0 2.49 1.66 4.7 4.26 5.95-.19.7-.69 2.53-.78 2.92-.12.53.19.53.4.35.26-.22 3.07-2.09 3.59-2.45.49.07 1 .11 1.53.11 4.97 0 9-3.13 9-7s-4.03-7-9-7z" />
                  </svg>
                  <span style={{ fontWeight: 'bold', color: '#3C1E1E', fontSize: '14px' }}>공식 채널</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', fontSize: isMobile ? '14px' : '15px', fontWeight: '600', marginBottom: '4px' }}>
                    에듀리치브레인 서비스의 공식 알림 채널은 <span style={{ color: '#FEE500' }}>'에듀케어 알림'</span>입니다.
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                    상호: 마케팅 다이어트 | 대표: 이성연 | 사업자번호: , 510-27-91, , 540
                  </p>
                </div>
              </div>

              {/* Intro Section */}
              <div style={{
                padding: isMobile ? '24px' : '40px',
                borderBottom: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <h2 style={{ fontSize: isMobile ? '20px' : '26px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
                  학부모님들께 우리 아이의 학습현황을 가장 빠르게 주는 방법
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', lineHeight: 1.7, marginBottom: '24px' }}>
                  학원 운영의 모든 알림을 카카오톡으로 자동 발송 —
                  학부모는 안심하고, 원장님은 업무에서 해방됩니다.
                </p>

                <div className="glass-input" style={{
                  padding: '20px',
                  borderRadius: '12px'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#93c5fd', marginBottom: '12px' }}>
                    왜 '학원 알림톡'이 필수일까요?
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, fontSize: '14px', marginBottom: '12px' }}>
                    많은 원장님들이 여전히 <strong>학원 문자(LMS/SMS)</strong>를 통해 공지사항을 전달하고 계십니다.
                    하지만 스팸 문자로 오인받아 확인되지 않거나, 발송 비용(건당 30~50원)이 만만치 않은 것이 현실입니다.
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, fontSize: '14px' }}>
                    <strong>학원 카카오톡 알림</strong>은 대한민국 국민 대부분이 사용하는 카카오톡을 통해 발송되므로
                    도달률이 월등히 높습니다. 이제 <strong>학원 알림톡</strong>은 선택이 아닌 필수입니다.
                  </p>
                </div>
              </div>

              {/* Problems Section */}
              <div style={{ padding: isMobile ? '24px' : '40px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#f87171' }}>#</span> 원장님들의 현실적인 고민
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                  marginBottom: '24px'
                }}>
                  {[
                    "상담 예약했는데 노쇼 발생 🤯",
                    "등하원 문자 일일이 발송 ⏰",
                    "수강료 납부 안내 전화 민망함 😓",
                    "학습 리포트 발송 번거로움 📉",
                    "단체 문자 비용 부담 💸"
                  ].map((item, i) => (
                    <div key={i} className="suggestion-btn" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '14px',
                      borderRadius: '8px'
                    }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f87171', flexShrink: 0 }}></div>
                      <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '500', fontSize: '13px' }}>{item}</span>
                    </div>
                  ))}
                </div>

                <div style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  borderLeft: '3px solid #3b82f6',
                  padding: '16px',
                  borderRadius: '0 8px 8px 0'
                }}>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', lineHeight: 1.6 }}>
                    "아직도 등하원 체크를 위해 엑셀을 켜고, <strong>학원 문자</strong> 사이트에 접속하시나요?
                    반복되는 행정 업무만 줄여도 원장님은 교육 퀄리티 향상에 집중할 수 있습니다."
                  </p>
                </div>
              </div>

              {/* Solution Section */}
              <div style={{
                padding: isMobile ? '24px' : '40px',
                background: 'rgba(10, 14, 39, 0.5)',
                borderTop: '1px solid rgba(59, 130, 246, 0.15)',
                borderBottom: '1px solid rgba(59, 130, 246, 0.15)'
              }}>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', marginBottom: '28px', textAlign: 'center' }}>
                  해결책: 에듀 알림 채널 구조
                </h3>
                <Flowchart />
                <div style={{ marginTop: '28px', textAlign: 'center', maxWidth: '600px', margin: '28px auto 0' }}>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                    에듀리치브레인 시스템에서 설정만 하면, <strong style={{ color: 'rgba(255,255,255,0.85)' }}>에듀케어 알림 채널</strong>을 통해 자동으로 발송됩니다.
                  </p>
                </div>
              </div>

              {/* 에듀케어 알림 채널 안내 Section */}
              <div style={{
                padding: isMobile ? '24px' : '40px',
                background: 'rgba(254, 229, 0, 0.08)',
                borderBottom: '1px solid rgba(254, 229, 0, 0.2)'
              }}>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>
                  카카오톡 채널 '에듀케어 알림' 운영 안내
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: 1.8, marginBottom: '24px' }}>
                  본 서비스(에듀리치브레인)를 이용하는 학원의 원활한 <strong style={{ color: '#FEE500' }}>학생 관리(Edu-Care)</strong>를 위해
                  공식 알림 채널명을 <strong style={{ color: '#FEE500' }}>'에듀케어 알림'</strong>으로 운영합니다.
                </p>

                {/* 공식 채널 확인 박스 */}
                <div style={{
                  background: 'rgba(254, 229, 0, 0.15)',
                  border: '1px solid rgba(254, 229, 0, 0.3)',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '20px' }}>📢</span>
                    <span style={{ fontWeight: 'bold', color: '#FEE500', fontSize: '16px' }}>공식 채널 확인</span>
                  </div>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', minWidth: '80px' }}>채널명:</span>
                      <span style={{ color: '#FEE500', fontWeight: 'bold' }}>에듀케어 알림</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', minWidth: '80px' }}>서비스명:</span>
                      <span style={{ color: 'white', fontWeight: '500' }}>에듀리치브레인 (EduRichBrain)</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', minWidth: '80px' }}>운영 사업자:</span>
                      <span style={{ color: 'white', fontWeight: '500' }}>마케팅 다이어트</span>
                    </div>
                  </div>
                </div>

                {/* 안내 문구 */}
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderLeft: '3px solid #3b82f6',
                  padding: '16px',
                  borderRadius: '0 8px 8px 0'
                }}>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
                    ※ <strong style={{ color: '#FEE500' }}>'에듀케어 알림'</strong>은 에듀리치브레인 플랫폼에서 발송되는
                    <strong> 학부모 상담, 출결 관리 등 학생 케어 서비스 전용</strong> 알림 채널입니다.
                  </p>
                </div>

                {/* 서비스 구조 */}
                <div style={{
                  marginTop: '24px',
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                  gap: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    padding: '16px'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏢</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '4px' }}>대행본사</div>
                    <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>마케팅다이어트</div>
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    padding: '16px'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>💻</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '4px' }}>학원 AI SaaS</div>
                    <div style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: '14px' }}>에듀리치브레인</div>
                  </div>
                  <div style={{
                    background: 'rgba(254, 229, 0, 0.1)',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid rgba(254, 229, 0, 0.3)'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>💬</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '4px' }}>학부모 카카오 알림채널</div>
                    <div style={{ color: '#FEE500', fontWeight: 'bold', fontSize: '14px' }}>에듀케어 알림</div>
                  </div>
                </div>
              </div>

              {/* Phone Mockups */}
              <div style={{ padding: isMobile ? '24px' : '40px', background: 'rgba(30, 41, 59, 0.3)' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                    학부모가 받아보는 실제 화면
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>상담부터 결제, 리포트까지. <strong style={{ color: 'rgba(255,255,255,0.85)' }}>학원 카카오톡</strong>으로 깔끔하게 전달됩니다.</p>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '24px',
                  overflowX: 'auto',
                  paddingBottom: '16px',
                  justifyContent: isMobile ? 'flex-start' : 'center',
                  flexWrap: isMobile ? 'nowrap' : 'wrap'
                }}>
                  {[
                    { type: 'consultation', name: '김민준', time: '오전 9:30', label: '📌 상담 예약 알림', desc: '노쇼 방지를 위한 필수 알림' },
                    { type: 'attendance', name: '김민준', time: '오후 3:40', label: '🏫 등·하원 알림', desc: '학부모님이 가장 안심하는 기능' },
                    { type: 'payment', name: '김민준', time: '오전 10:00', label: '💳 수강료 납부 안내', desc: '미납률을 획기적으로 줄여줍니다' },
                    { type: 'report', name: '김민준', time: '오후 6:00', label: '📊 학습 리포트', desc: '학원의 전문성을 보여주는 리포트' }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <PhoneMockupDisplay type={item.type} studentName={item.name} time={item.time} />
                      <p style={{ marginTop: '14px', fontWeight: 'bold', color: '#93c5fd', fontSize: '14px' }}>{item.label}</p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{item.desc}</p>
                    </div>
                  ))}
                </div>

                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '16px' }}>
                  * 이미지를 좌우로 스크롤하여 다양한 <strong>학원 알림톡</strong> 예시를 확인해보세요.
                </p>
              </div>

              {/* Message Types */}
              <div style={{ padding: isMobile ? '24px' : '40px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}>
                  발송 가능한 알림톡 유형 상세
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                  gap: '20px'
                }}>
                  {MESSAGE_TYPES.map((type, idx) => (
                    <div key={idx} className="feature-card" style={{
                      borderRadius: '12px',
                      padding: '20px'
                    }}>
                      <h4 style={{ fontWeight: 'bold', color: '#60a5fa', marginBottom: '14px', fontSize: '16px', borderBottom: '1px solid rgba(59, 130, 246, 0.2)', paddingBottom: '8px' }}>
                        {type.category}
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {type.items.map((item, i) => (
                          <li key={i} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            padding: '8px 0',
                            borderBottom: i < type.items.length - 1 ? '1px solid rgba(59, 130, 246, 0.1)' : 'none'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ width: '5px', height: '5px', background: 'rgba(255,255,255,0.4)', borderRadius: '50%' }}></span>
                              <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '500', fontSize: '13px' }}>{item.title}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginLeft: '13px' }}>
                              <span style={{
                                color: 'rgba(255,255,255,0.5)',
                                fontSize: '11px',
                                background: 'rgba(10, 14, 39, 0.5)',
                                padding: '2px 6px',
                                borderRadius: '4px'
                              }}>{item.timing}</span>
                              <span style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 'bold' }}>{item.effect}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Effects Comparison Table */}
              <div style={{
                padding: isMobile ? '24px' : '40px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderTop: '1px solid rgba(59, 130, 246, 0.2)',
                borderBottom: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', marginBottom: '24px', textAlign: 'center' }}>
                  도입 기대 효과
                </h3>
                <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '380px' }}>
                    <thead>
                      <tr style={{ background: 'rgba(30, 58, 138, 0.4)' }}>
                        <th style={{ padding: '14px', fontWeight: '600', color: '#bfdbfe', textAlign: 'left', fontSize: '13px' }}>항목</th>
                        <th style={{ padding: '14px', fontWeight: '600', color: '#bfdbfe', textAlign: 'center', opacity: 0.6, fontSize: '13px' }}>Before</th>
                        <th style={{ padding: '14px', fontWeight: '600', color: '#facc15', textAlign: 'center', fontSize: '13px' }}>After</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARISON_DATA.map((row, idx) => (
                        <tr key={idx} style={{ background: idx % 2 === 0 ? 'rgba(30, 58, 138, 0.15)' : 'rgba(30, 58, 138, 0.08)' }}>
                          <td style={{ padding: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.9)', fontSize: '13px' }}>{row.category}</td>
                          <td style={{ padding: '14px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through', fontSize: '13px' }}>{row.before}</td>
                          <td style={{ padding: '14px', textAlign: 'center', fontWeight: 'bold', color: '#60a5fa', fontSize: '13px' }}>{row.after}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FAQ Section */}
              <div style={{ padding: isMobile ? '24px' : '40px' }}>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>자주 묻는 질문</h3>
                {FAQ_DATA.map((faq, idx) => (
                  <div key={idx} className="feature-card" style={{
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <h4 style={{ fontSize: '17px', fontWeight: 'bold', color: '#60a5fa', marginBottom: '12px' }}>Q. {faq.question}</h4>
                    <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: '20px', fontSize: '14px' }}>{faq.answer}</p>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                      gap: '12px'
                    }}>
                      {faq.comparison.map((comp, cIdx) => (
                        <div key={cIdx} style={{
                          background: 'rgba(10, 14, 39, 0.5)',
                          borderRadius: '8px',
                          padding: '14px',
                          border: '1px solid rgba(59, 130, 246, 0.15)'
                        }}>
                          <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{comp.label}</span>
                          <div style={{ display: 'flex', marginTop: '8px' }}>
                            <div style={{ flex: 1, paddingRight: '10px', borderRight: '1px solid rgba(59, 130, 246, 0.2)' }}>
                              <span style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '3px' }}>문자</span>
                              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{comp.sms}</span>
                            </div>
                            <div style={{ flex: 1, paddingLeft: '10px' }}>
                              <span style={{ display: 'block', fontSize: '10px', color: '#facc15', marginBottom: '3px' }}>알림톡</span>
                              <span style={{ fontSize: '12px', color: '#93c5fd', fontWeight: '500' }}>{comp.kakao}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 에듀케어 알림 상세 섹션 */}
              <div style={{
                padding: isMobile ? '48px 24px' : '60px 40px',
                borderTop: '1px solid rgba(59, 130, 246, 0.2)',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.5), rgba(30, 41, 59, 0.3))'
              }}>
                {/* 헤드라인 */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                  <h2 style={{
                    fontSize: isMobile ? '24px' : '32px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '16px',
                    lineHeight: 1.4
                  }}>
                    학부모님을 안심시키는 학원의 경쟁력,<br />
                    <span style={{ color: '#FEE500' }}>'에듀케어(Edu-Care)'</span> 알림 서비스
                  </h2>
                  <p style={{
                    fontSize: isMobile ? '15px' : '17px',
                    color: 'rgba(255,255,255,0.75)',
                    lineHeight: 1.8,
                    maxWidth: '800px',
                    margin: '0 auto'
                  }}>
                    에듀리치브레인(EduRichBrain)이 제공하는 프리미엄 학생 관리(Care) 시스템입니다.<br />
                    소중한 아이들의 안전과 학습 현황, 이제 공식 채널 <strong style={{ color: '#FEE500' }}>[에듀케어 알림]</strong>으로 프로답게 전달하세요.
                  </p>
                </div>

                {/* Why 섹션 */}
                <div style={{ marginBottom: '48px' }}>
                  <h3 style={{
                    fontSize: isMobile ? '20px' : '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ color: '#f87171' }}>💡</span>
                    이 서비스가 왜 필요한가요?
                  </h3>

                  <div className="glass-input" style={{
                    padding: isMobile ? '24px' : '32px',
                    borderRadius: '16px',
                    marginBottom: '24px'
                  }}>
                    <p style={{
                      fontSize: '16px',
                      color: 'rgba(255,255,255,0.85)',
                      lineHeight: 1.8,
                      marginBottom: '20px'
                    }}>
                      학부모님의 불안을 해소하고 신뢰를 쌓는 것은 학원 경영의 핵심입니다.<br />
                      하지만 기존의 문자 메시지나 개인 카톡은 한계가 있습니다.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '16px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderLeft: '3px solid #ef4444',
                        borderRadius: '8px'
                      }}>
                        <span style={{ fontSize: '20px', flexShrink: 0 }}>📱</span>
                        <div>
                          <strong style={{ color: '#fca5a5', fontSize: '15px' }}>스팸으로 오해받는 문자</strong>
                          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginTop: '4px' }}>
                            텍스트만 전송되는 문자는 학부모님이 놓치기 쉽고, 스팸으로 오해받기도 합니다.
                          </p>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '16px',
                        background: 'rgba(251, 146, 60, 0.1)',
                        borderLeft: '3px solid #fb923c',
                        borderRadius: '8px'
                      }}>
                        <span style={{ fontSize: '20px', flexShrink: 0 }}>🔒</span>
                        <div>
                          <strong style={{ color: '#fdba74', fontSize: '15px' }}>사생활 침해 없는 소통</strong>
                          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginTop: '4px' }}>
                            강사 개인 카톡으로 소통하다 보면 업무 시간 외 연락으로 강사의 피로도가 높아집니다.
                          </p>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '16px',
                        background: 'rgba(250, 204, 21, 0.1)',
                        borderLeft: '3px solid #facc15',
                        borderRadius: '8px'
                      }}>
                        <span style={{ fontSize: '20px', flexShrink: 0 }}>⚠️</span>
                        <div>
                          <strong style={{ color: '#fde047', fontSize: '15px' }}>전문성 부족</strong>
                          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginTop: '4px' }}>
                            단순 텍스트 나열은 우리 학원의 체계적인 관리 시스템을 보여주기에 부족합니다.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      marginTop: '24px',
                      padding: '16px',
                      background: 'rgba(59, 130, 246, 0.15)',
                      borderRadius: '12px',
                      borderLeft: '4px solid #3b82f6'
                    }}>
                      <p style={{ color: '#93c5fd', fontSize: '15px', fontWeight: '600' }}>
                        👉 에듀케어는 '카카오톡 공식 알림톡'을 통해 학원의 전문성과 신뢰도를 즉각적으로 높여줍니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* What 섹션 - 3가지 핵심 케어 */}
                <div style={{ marginBottom: '48px' }}>
                  <h3 style={{
                    fontSize: isMobile ? '20px' : '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ color: '#60a5fa' }}>✨</span>
                    원장님의 고민을 해결하는 3가지 핵심 케어(Care) 솔루션
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* 안전 케어 */}
                    <div className="glass-input" style={{
                      padding: isMobile ? '24px' : '32px',
                      borderRadius: '16px',
                      border: '1px solid rgba(34, 197, 94, 0.3)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px'
                        }}>🛡️</div>
                        <div>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            background: 'rgba(34, 197, 94, 0.2)',
                            color: '#86efac',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            marginBottom: '4px'
                          }}>① 안전 케어</span>
                          <h4 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 'bold', color: 'white' }}>
                            빈틈없는 등하원 실시간 알림
                          </h4>
                        </div>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: 1.7, marginBottom: '12px' }}>
                        "우리 아이가 학원에 잘 도착했나요?"라는 문의 전화가 사라집니다. 학생이 등원하고 하원하는 즉시, '에듀케어 알림' 채널을 통해 학부모님께 실시간으로 안심 알림이 발송됩니다.
                      </p>
                      <div style={{
                        padding: '12px 16px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: '#86efac'
                      }}>
                        <strong>도움되는 점:</strong> 학부모 불안 해소, 데스크 업무량 50% 감소
                      </div>
                    </div>

                    {/* 학습 케어 */}
                    <div className="glass-input" style={{
                      padding: isMobile ? '24px' : '32px',
                      borderRadius: '16px',
                      border: '1px solid rgba(168, 85, 247, 0.3)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #a855f7, #9333ea)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px'
                        }}>📊</div>
                        <div>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            background: 'rgba(168, 85, 247, 0.2)',
                            color: '#c4b5fd',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            marginBottom: '4px'
                          }}>② 학습 케어</span>
                          <h4 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 'bold', color: 'white' }}>
                            AI가 분석한 월간 성장 리포트
                          </h4>
                        </div>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: 1.7, marginBottom: '12px' }}>
                        에듀리치브레인 AI가 분석한 학생의 성적 변화, 취약점, 학습 태도를 보기 편한 모바일 리포트로 자동 발송합니다.
                      </p>
                      <div style={{
                        padding: '12px 16px',
                        background: 'rgba(168, 85, 247, 0.1)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: '#c4b5fd'
                      }}>
                        <strong>도움되는 점:</strong> 말로만 하는 상담보다 훨씬 강력한 데이터 근거 제시, 재등록률 상승 견인
                      </div>
                    </div>

                    {/* 소통 케어 */}
                    <div className="glass-input" style={{
                      padding: isMobile ? '24px' : '32px',
                      borderRadius: '16px',
                      border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px'
                        }}>💬</div>
                        <div>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: '#93c5fd',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            marginBottom: '4px'
                          }}>③ 소통 케어</span>
                          <h4 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 'bold', color: 'white' }}>
                            놓치지 않는 학원 공지사항
                          </h4>
                        </div>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: 1.7, marginBottom: '12px' }}>
                        수업 시간 변경, 보강 안내, 결제일 알림 등 중요한 정보를 카카오톡 알림톡으로 확실하게 전달합니다.
                      </p>
                      <div style={{
                        padding: '12px 16px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: '#93c5fd'
                      }}>
                        <strong>도움되는 점:</strong> 전달 누락 방지, 학원 운영의 체계화 이미지 구축
                      </div>
                    </div>
                  </div>
                </div>

                {/* 서비스 이용 안내 박스 */}
                <div style={{
                  padding: isMobile ? '28px 24px' : '36px 40px',
                  background: 'linear-gradient(135deg, rgba(254, 229, 0, 0.15), rgba(254, 229, 0, 0.05))',
                  border: '2px solid rgba(254, 229, 0, 0.4)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(254, 229, 0, 0.15)'
                }}>
                  <h3 style={{
                    fontSize: isMobile ? '18px' : '20px',
                    fontWeight: 'bold',
                    color: '#FEE500',
                    marginBottom: '20px',
                    textAlign: 'center'
                  }}>
                    📋 서비스 이용 안내
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                    gap: '16px'
                  }}>
                    <div style={{
                      padding: '16px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      borderRadius: '12px',
                      border: '1px solid rgba(254, 229, 0, 0.2)'
                    }}>
                      <div style={{ fontSize: '13px', color: 'rgba(254, 229, 0, 0.7)', marginBottom: '6px' }}>서비스명</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>에듀케어 (Edu-Care)</div>
                    </div>
                    <div style={{
                      padding: '16px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      borderRadius: '12px',
                      border: '1px solid rgba(254, 229, 0, 0.2)'
                    }}>
                      <div style={{ fontSize: '13px', color: 'rgba(254, 229, 0, 0.7)', marginBottom: '6px' }}>기능</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>에듀리치브레인 연동 학생 관리 및 알림 발송</div>
                    </div>
                    <div style={{
                      padding: '16px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      borderRadius: '12px',
                      border: '1px solid rgba(254, 229, 0, 0.2)'
                    }}>
                      <div style={{ fontSize: '13px', color: 'rgba(254, 229, 0, 0.7)', marginBottom: '6px' }}>공식 발송 채널명</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>에듀케어 알림 (@educare_alarm)</div>
                    </div>
                    <div style={{
                      padding: '16px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      borderRadius: '12px',
                      border: '1px solid rgba(254, 229, 0, 0.2)'
                    }}>
                      <div style={{ fontSize: '13px', color: 'rgba(254, 229, 0, 0.7)', marginBottom: '6px' }}>운영사</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>마케팅 다이어트</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="diagnosis-section" style={{
                padding: isMobile ? '32px 24px' : '48px 40px',
                textAlign: 'center'
              }}>
                <div className="diagnosis-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
                  <h2 className="diagnosis-title" style={{ fontSize: isMobile ? '24px' : '28px', marginBottom: '16px' }}>
                    스마트한 학원 운영의 시작
                  </h2>
                  <p className="diagnosis-desc" style={{ fontSize: '15px', marginBottom: '28px' }}>
                    지금 바로 에듀리치브레인 데모를 체험해보고,
                    학원 알림톡으로 변화된 학원 운영을 경험하세요.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                    <Link href="/demo" className="diagnosis-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      예시 데모 써보기 →
                    </Link>
                    <button style={{
                      background: '#FEE500',
                      color: '#3C1E1E',
                      padding: '14px 28px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      fontSize: '15px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3c-4.97 0-9 3.13-9 7 0 2.49 1.66 4.7 4.26 5.95-.19.7-.69 2.53-.78 2.92-.12.53.19.53.4.35.26-.22 3.07-2.09 3.59-2.45.49.07 1 .11 1.53.11 4.97 0 9-3.13 9-7s-4.03-7-9-7z" />
                      </svg>
                      카톡 채널 친구추가
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
              <Link href="/blog" className="suggest-chip" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                ← 목록으로
              </Link>
              <button className="suggest-chip" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
                공유하기
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
