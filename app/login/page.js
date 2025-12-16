'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { BRAIN_BASE_URL } from '@/lib/constants'
import useIsMobile from '@/hooks/useIsMobile'

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  const searchParams = useSearchParams()

  const getPostLoginRedirectUrl = () => {
    // 진단 결과에서 넘어온 케이스만 복귀
    const redirect = searchParams.get('redirect') // "diagnosis" 기대
    const token = searchParams.get('token')

    if (redirect === 'diagnosis' && token) {
      return `${BRAIN_BASE_URL}/diagnosis/result?token=${encodeURIComponent(token)}`
    }

    // 일반 로그인 유저는 SAAS 기본 경로로
    return '/' // 너희 기본 진입점에 맞게 / 로 바꿔도 됨
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다'
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setLoginError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // rememberMe는 서버에서 세션 만료(days) 조절할 때 쓰고 싶으면 같이 보냄
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      })

      const text = await res.text()
      let data = {}
      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        data = { error: 'INVALID_JSON', raw: text }
      }

      if (!res.ok) {
        // 서버 에러코드별 메시지 매핑
        const msg =
          data?.error === 'INVALID_CREDENTIALS'
            ? '이메일 또는 비밀번호가 일치하지 않습니다.'
            : data?.error === 'ACCOUNT_DISABLED'
              ? '비활성화된 계정입니다. 관리자에게 문의해주세요.'
              : data?.error === 'LOGIN_FAILED'
                ? '로그인에 실패했습니다.'
                : '로그인 중 오류가 발생했습니다.'

        setLoginError(msg)
        setIsLoading(false)
        return
      }

      // ✅ 로그인 성공: 서버가 쿠키를 심어줌(SESSION_COOKIE_NAME)
      const pendingPayment = sessionStorage.getItem('pendingPayment')
      if (pendingPayment) {
        const { plan, cycle } = JSON.parse(pendingPayment)
        sessionStorage.removeItem('pendingPayment')
        window.location.href = `/payment?plan=${plan}&cycle=${cycle}`
      } else {
        window.location.href = getPostLoginRedirectUrl()
      }
    } catch (error) {
      setLoginError('로그인 중 오류가 발생했습니다.')
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    if (loginError) setLoginError('')
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    setLoginError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'demo@edurichbrain.com',
          password: 'demo1234',
          rememberMe: true,
        }),
      })

      const text = await res.text()
      let data = {}
      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        data = { error: 'INVALID_JSON', raw: text }
      }

      if (!res.ok) {
        setLoginError(
          data?.error === 'INVALID_CREDENTIALS'
            ? '데모 로그인에 실패했습니다.'
            : '로그인 중 오류가 발생했습니다.'
        )
        setIsLoading(false)
        return
      }

      window.location.href = getPostLoginRedirectUrl()
    } catch (error) {
      setLoginError('로그인 중 오류가 발생했습니다.')
      setIsLoading(false)
    }
  }

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  const closeMobileMenu = () => setMobileMenuOpen(false)

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
          <Link href="/" className="sidebar-link">
            제품
          </Link>
          <Link href="/pricing" className="sidebar-link">
            요금제
          </Link>
          <Link href="/diagnosis" className="sidebar-link">
            경영진단
          </Link>
          <Link href="/blog" className="sidebar-link">
            블로그
          </Link>
          <Link href="/about" className="sidebar-link">
            회사
          </Link>
          <Link href="/demo" className="sidebar-link">
            데모
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-icon-btn" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-area">
        <header className="top-bar">
          <button className="search-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path
                d="M21 21l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <Link href="/" className="login-btn">
            홈으로
          </Link>
        </header>

        <main
          style={{
            padding: isMobile ? '80px 20px 40px' : '100px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 60px)',
          }}
        >
          <div style={{ width: '100%', maxWidth: '450px' }}>
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Link
                href="/"
                style={{
                  display: 'inline-block',
                  textDecoration: 'none',
                  marginBottom: '12px',
                }}
              >
                <h1
                  style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#ffffff',
                    background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  EduRichBrain
                </h1>
              </Link>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>
                다시 만나서 반갑습니다
              </p>
            </div>

            {/* Form Card */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: isMobile ? '20px' : '24px',
                padding: isMobile ? '28px 20px' : '40px',
                boxShadow: '0 20px 60px rgba(30, 58, 138, 0.2)',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '24px',
                }}
              >
                로그인
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '8px',
                    }}
                  >
                    이메일
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: errors.email
                        ? '1px solid #ef4444'
                        : '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.2s',
                    }}
                  />
                  {errors.email && (
                    <p style={{ marginTop: '6px', fontSize: '13px', color: '#ef4444' }}>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '8px',
                    }}
                  >
                    비밀번호
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: errors.password
                        ? '1px solid #ef4444'
                        : '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none',
                    }}
                  />
                  {errors.password && (
                    <p style={{ marginTop: '6px', fontSize: '13px', color: '#ef4444' }}>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      style={{
                        marginRight: '8px',
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer',
                      }}
                    />
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                      로그인 상태 유지
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    style={{
                      fontSize: '14px',
                      color: '#3b82f6',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                  >
                    비밀번호 찾기
                  </Link>
                </div>

                {/* Login Error Message */}
                {loginError && (
                  <div
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      marginBottom: '16px',
                    }}
                  >
                    <p style={{ margin: 0, fontSize: '14px', color: '#ef4444' }}>
                      {loginError}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: isLoading
                      ? 'rgba(59, 130, 246, 0.5)'
                      : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: isLoading ? 'none' : '0 8px 24px rgba(30, 58, 138, 0.4)',
                    marginBottom: '12px',
                  }}
                >
                  {isLoading ? '로그인 중...' : '로그인'}
                </button>

                {/* Demo Login Button */}
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    color: '#93c5fd',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  데모 계정으로 체험하기
                </button>
              </form>

              {/* Signup Link */}
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>
                  아직 계정이 없으신가요?{' '}
                  <Link
                    href="/signup"
                    style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}
                  >
                    무료로 시작하기
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer Info */}
            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.3)', lineHeight: '1.6' }}>
                로그인 시 EduRichBrain의{' '}
                <Link
                  href="/terms"
                  style={{ textDecoration: 'underline', color: 'rgba(255, 255, 255, 0.4)' }}
                >
                  이용약관
                </Link>{' '}
                및{' '}
                <Link
                  href="/privacy"
                  style={{ textDecoration: 'underline', color: 'rgba(255, 255, 255, 0.4)' }}
                >
                  개인정보처리방침
                </Link>
                에 동의한 것으로 간주됩니다.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0e27' }} />}>
      <LoginForm />
    </Suspense>
  )
}
