'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import useIsMobile from '@/hooks/useIsMobile'
import { BRAIN_BASE_URL } from '@/lib/constants'

export default function Navbar() {
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false)
    }
  }, [isMobile])

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: '64px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(2,6,23,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(59,130,246,0.08)',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#ffffff',
          textDecoration: 'none',
          letterSpacing: '0.02em',
          display: 'flex',
          alignItems: 'center',
        }}>
          <span style={{ color: '#3b82f6' }}>EduRich</span>Brain
        </Link>

        {/* Desktop Nav Links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {[
              { label: '제품', href: '/' },
              { label: '요금제', href: '/pricing' },
              { label: '경영진단', href: '/diagnosis' },
              { label: '블로그', href: '/blog' },
              { label: '회사', href: '/about' },
              { label: '데모', href: '/demo' },
            ].map((item) => (
              <Link key={item.label} href={item.href} style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'rgba(203,213,225,0.8)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}>
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right: CTA buttons + mobile toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!isMobile && (
            <>
              <a
                href={BRAIN_BASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid rgba(71,85,105,0.6)',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                }}
              >
                앱 시작
              </a>
              <Link href="/signup" style={{
                padding: '8px 20px',
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                borderRadius: '8px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 0 20px rgba(59,130,246,0.2)',
              }}>
                무료로 시작하기
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <button
              onClick={toggleMobileMenu}
              aria-label="메뉴 열기"
              style={{
                width: '40px',
                height: '40px',
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#e2e8f0',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {isMobile && mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: 'rgba(2,6,23,0.98)',
          backdropFilter: 'blur(20px)',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          padding: '80px 24px 24px',
        }}>
          <button
            onClick={closeMobileMenu}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '40px',
              height: '40px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
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

          <div style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '32px', textAlign: 'center' }}>
            <span style={{ color: '#3b82f6' }}>EduRich</span>Brain
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: '제품', href: '/' },
              { label: '요금제', href: '/pricing' },
              { label: '경영진단', href: '/diagnosis' },
              { label: '블로그', href: '/blog' },
              { label: '회사', href: '/about' },
              { label: '데모', href: '/demo' },
            ].map((item) => (
              <Link key={item.label} href={item.href} onClick={closeMobileMenu} style={{
                padding: '16px 20px',
                background: 'rgba(15,23,42,0.6)',
                border: '1px solid rgba(59,130,246,0.12)',
                borderRadius: '12px',
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                fontSize: '16px',
              }}>
                {item.label}
              </Link>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <Link href="/signup" onClick={closeMobileMenu} style={{
              display: 'block',
              width: '100%',
              padding: '14px 0',
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              borderRadius: '12px',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              textAlign: 'center',
              boxShadow: '0 0 20px rgba(59,130,246,0.2)',
            }}>
              무료로 시작하기
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
