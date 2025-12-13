'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

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
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (result?.error) {
        setLoginError('이메일 또는 비밀번호가 일치하지 않습니다.')
        setIsLoading(false)
      } else if (result?.ok) {
        // 결제 대기 중인 정보가 있는지 확인
        const pendingPayment = sessionStorage.getItem('pendingPayment')
        if (pendingPayment) {
          const { plan, cycle } = JSON.parse(pendingPayment)
          sessionStorage.removeItem('pendingPayment')
          window.location.href = `/payment?plan=${plan}&cycle=${cycle}`
        } else {
          // 데모 페이지로 이동
          window.location.href = '/demo'
        }
      }
    } catch (error) {
      setLoginError('로그인 중 오류가 발생했습니다.')
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // 입력하면 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (loginError) {
      setLoginError('')
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    setLoginError('')

    try {
      const result = await signIn('credentials', {
        email: 'demo@edurichbrain.com',
        password: 'demo1234',
        redirect: false
      })

      if (result?.ok) {
        window.location.href = '/demo'
      } else {
        setLoginError('데모 로그인에 실패했습니다.')
        setIsLoading(false)
      }
    } catch (error) {
      setLoginError('로그인 중 오류가 발생했습니다.')
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    signIn(provider, { callbackUrl: '/demo' })
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link href="/" className="sidebar-logo">
          EduRichBrain
        </Link>

        <nav className="sidebar-nav">
          <Link href="/" className="sidebar-link">제품</Link>
          <Link href="/pricing" className="sidebar-link">요금제</Link>
          <Link href="/diagnosis" className="sidebar-link">경영진단</Link>
          <Link href="/blog" className="sidebar-link">블로그</Link>
          <Link href="/about" className="sidebar-link">회사</Link>
          <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="sidebar-link">데모</a>
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
        <header className="top-bar">
          <button className="search-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <Link href="/" className="login-btn">
            홈으로
          </Link>
        </header>

        <main style={{
          padding: '100px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 60px)'
        }}>
          <div style={{ width: '100%', maxWidth: '450px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{
            display: 'inline-block',
            textDecoration: 'none',
            marginBottom: '12px'
          }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#ffffff',
              background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              EduRichBrain
            </h1>
          </Link>
          <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>
            다시 만나서 반갑습니다
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(30, 58, 138, 0.2)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '24px'
          }}>
            로그인
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '8px'
              }}>
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
                  border: errors.email ? '1px solid #ef4444' : '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.2s'
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
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '8px'
              }}>
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
                  border: errors.password ? '1px solid #ef4444' : '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '15px',
                  outline: 'none'
                }}
              />
              {errors.password && (
                <p style={{ marginTop: '6px', fontSize: '13px', color: '#ef4444' }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  style={{ marginRight: '8px', width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  로그인 상태 유지
                </span>
              </label>
              <Link href="/forgot-password" style={{
                fontSize: '14px',
                color: '#3b82f6',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}>
                비밀번호 찾기
              </Link>
            </div>

            {/* Login Error Message */}
            {loginError && (
              <div style={{
                padding: '12px 16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
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
                background: isLoading ? 'rgba(59, 130, 246, 0.5)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                boxShadow: isLoading ? 'none' : '0 8px 24px rgba(30, 58, 138, 0.4)',
                marginBottom: '12px'
              }}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>

            {/* Demo Login Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              style={{
                width: '100%',
                padding: '16px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                color: '#93c5fd',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                backdropFilter: 'blur(8px)'
              }}
            >
              데모 계정으로 체험하기
            </button>
          </form>

          {/* Divider */}
          <div style={{ position: 'relative', margin: '32px 0' }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              background: 'rgba(59, 130, 246, 0.2)'
            }}></div>
            <div style={{
              position: 'relative',
              textAlign: 'center'
            }}>
              <span style={{
                padding: '0 16px',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '14px'
              }}>
                또는
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google로 계속하기
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('kakao')}
              style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
              <div style={{
                width: '20px',
                height: '20px',
                background: '#FEE500',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#000000', fontWeight: '700', fontSize: '12px' }}>K</span>
              </div>
              카카오로 계속하기
            </button>
          </div>

          {/* Signup Link */}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>
              아직 계정이 없으신가요?{' '}
              <Link href="/signup" style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                무료로 시작하기
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.3)', lineHeight: '1.6' }}>
            로그인 시 EduRichBrain의{' '}
            <Link href="/terms" style={{ textDecoration: 'underline', color: 'rgba(255, 255, 255, 0.4)' }}>
              이용약관
            </Link>{' '}
            및{' '}
            <Link href="/privacy" style={{ textDecoration: 'underline', color: 'rgba(255, 255, 255, 0.4)' }}>
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
