'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <footer style={{
      marginLeft: isMobile ? '0' : '260px',
      background: '#0a0a1a',
      color: '#9ca3af'
    }}>
      {/* 상단 푸터 */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '40px 20px' : '64px 24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, 1fr)',
          gap: isMobile ? '32px' : '40px'
        }}>
          {/* 브랜드 섹션 */}
          <div style={{ gridColumn: isMobile ? 'span 1' : 'span 2' }}>
            <h2 style={{
              color: '#ffffff',
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '16px'
            }}>EDU RICH BRAIN</h2>
            <p style={{
              color: '#9ca3af',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              학원 성장을 위한 AI 플랫폼
              <br />
              더 이상 혼자 고민하지 마세요.
            </p>
          </div>

          {/* 제품 */}
          <div>
            <h3 style={{
              color: '#ffffff',
              fontWeight: '600',
              marginBottom: '20px',
              fontSize: '15px'
            }}>제품</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { href: '/#features', label: '기능 소개' },
                { href: '/pricing', label: '가격 정책' },
                { href: '/blog', label: '도입 사례' }
              ].map((item) => (
                <li key={item.href} style={{ marginBottom: '12px' }}>
                  <Link href={item.href} style={{
                    color: '#9ca3af',
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 회사 */}
          <div>
            <h3 style={{
              color: '#ffffff',
              fontWeight: '600',
              marginBottom: '20px',
              fontSize: '15px'
            }}>회사</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { href: '/about', label: '회사 소개' },
                { href: '/coming-soon?page=careers', label: '채용 정보' },
                { href: '/blog', label: '블로그' }
              ].map((item) => (
                <li key={item.href} style={{ marginBottom: '12px' }}>
                  <Link href={item.href} style={{
                    color: '#9ca3af',
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 지원 */}
          <div>
            <h3 style={{
              color: '#ffffff',
              fontWeight: '600',
              marginBottom: '20px',
              fontSize: '15px'
            }}>지원</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { href: '/coming-soon?page=guide', label: '사용 가이드' },
                { href: '/blog', label: 'FAQ' },
                { href: '/coming-soon?page=contact', label: '1:1 문의' }
              ].map((item) => (
                <li key={item.href} style={{ marginBottom: '12px' }}>
                  <Link href={item.href} style={{
                    color: '#9ca3af',
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 구분선 */}
        <div style={{
          borderTop: '1px solid #1f2937',
          marginTop: '48px',
          paddingTop: '32px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            <Link href="/privacy" style={{ color: '#6b7280', textDecoration: 'none' }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = '#6b7280'}
            >
              개인정보처리방침
            </Link>
            {!isMobile && <span>|</span>}
            <Link href="/terms" style={{ color: '#6b7280', textDecoration: 'none' }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = '#6b7280'}
            >
              이용약관
            </Link>
          </div>
        </div>
      </div>

      {/* 서비스 운영 안내 */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(254, 229, 0, 0.1), rgba(254, 229, 0, 0.05))',
        borderTop: '1px solid rgba(254, 229, 0, 0.3)',
        borderBottom: '1px solid rgba(254, 229, 0, 0.3)',
        padding: isMobile ? '20px' : '24px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: isMobile ? '12px' : '14px',
            color: '#ffffff',
            lineHeight: '1.8'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 10px',
              background: '#FEE500',
              color: '#3C1E1E',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '11px',
              marginRight: '8px'
            }}>서비스 운영 안내</span>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>
              '에듀리치브레인'은 마케팅 다이어트의 공식 AI SaaS 브랜드이며, 학부모 알림 및 관리 서비스는 공식 카카오톡 채널인
            </span>
            <span style={{ color: '#FEE500', fontWeight: 'bold' }}>'에듀케어 알림'</span>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>을 통해 제공됩니다.</span>
          </p>
        </div>
      </div>

      {/* 하단 푸터 - 사업자 정보 */}
      <div style={{
        background: '#111111',
        padding: '40px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <p style={{ fontWeight: '500', color: '#9ca3af', marginBottom: '8px' }}>마케팅 다이어트</p>
          <p style={{ marginBottom: '8px' }}>통신판매신고번호 : 2022-성남분당A-0669</p>
          <p style={{ marginBottom: '8px' }}>
            문의: <a href="mailto:support@marketingdiet.online" style={{ color: '#60a5fa', textDecoration: 'none' }}>support@marketingdiet.online</a>
          </p>
          <p style={{ marginBottom: '8px' }}>대표 이성연 | 경기도 성남시 분당구 대왕판교로645번길 12 (삼평동) 7, 9층 168호 | 사업자 등록번호 331-31-00742 | 전화 010-9619-5797</p>
          <p style={{ marginBottom: '8px', color: '#9ca3af', fontSize: '11px' }}>
            마케팅다이어트(대행본사) | 에듀리치브레인(학원 AI SaaS) | 에듀케어알림(학부모 카카오 알림채널)
          </p>
          <p style={{ marginBottom: '16px' }}>© 2022 Marketingdiet Inc, All rights reserved</p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px'
          }}>
            <Link href="/terms" style={{ color: '#6b7280', textDecoration: 'none' }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = '#6b7280'}
            >
              이용약관
            </Link>
            <Link href="/privacy" style={{ fontWeight: '600', color: '#ffffff', textDecoration: 'none' }}
              onMouseEnter={(e) => e.target.style.color = '#d1d5db'}
              onMouseLeave={(e) => e.target.style.color = '#ffffff'}
            >
              개인정보처리방침
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
