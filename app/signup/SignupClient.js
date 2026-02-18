'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'
import { BRAIN_BASE_URL } from '@/lib/constants'
import useIsMobile from '@/hooks/useIsMobile'
import { useSearchParams } from 'next/navigation'

export default function SignupPage() {
  const [step, setStep] = useState(1) // 1: 역할 선택, 2: 정보 입력
  const [role, setRole] = useState('') // 'director', 'teacher', 'manager', 'assistant'
  const isMobile = useIsMobile()
  const [formData, setFormData] = useState({
    // 공통
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',

    // 원장 전용
    academyName: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeDataStorage: false,
    agreeMarketing: false,

    // 강사/실장/알바 전용
    inviteCode: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createSupabaseBrowserClient()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') // 'diagnosis' | null
  const token = searchParams.get('token')       // string | null

  const roleToDbRole = (r) => (r === 'director' ? 'owner' : r)

  const validateInviteCode = (code) => {
    // 임시 검증 로직 - 나중에 DB 연동
    return code.length === 8 && /^[A-Z0-9]+$/.test(code)
  }

  const validateForm = () => {
    const newErrors = {}

    // 공통 검증
    if (!formData.name) newErrors.name = '이름을 입력해주세요'
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다'
    }
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요'
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다'
    }
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다'
    }
    if (!formData.phone) newErrors.phone = '연락처를 입력해주세요'

    // 공통 동의 검증 (모든 역할)
    if (!formData.agreeTerms) newErrors.agreeTerms = '이용약관에 동의해주세요'
    if (!formData.agreePrivacy) newErrors.agreePrivacy = '개인정보 처리방침에 동의해주세요'
    if (!formData.agreeDataStorage) newErrors.agreeDataStorage = 'AI 대화 내용 저장에 동의해주세요'

    // 역할별 검증
    if (role === 'director') {
      if (!formData.academyName) newErrors.academyName = '학원명을 입력해주세요'
    } else {
      // 강사/알바
      if (!formData.inviteCode) {
        newErrors.inviteCode = '초대코드를 입력해주세요'
      } else if (!validateInviteCode(formData.inviteCode)) {
        newErrors.inviteCode = '올바른 초대코드 형식이 아닙니다 (8자리 영문 대문자+숫자)'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const redirectAfterAuth = () => {
    // 진단보고서에서 온 경우
    if (redirect === 'diagnosis' && token) {
      window.location.href =
        `${BRAIN_BASE_URL}/diagnosis/result?token=${encodeURIComponent(token)}`
      return
    }

    // 그 외 정상 플로우
    window.location.href = '/login'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const payload = {
        role: role === 'director' ? 'owner' : role,
        academyName: role === 'director' ? formData.academyName : null,
        inviteCode: role === 'director' ? null : formData.inviteCode,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        agreeMarketing: formData.agreeMarketing,
      }

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const text = await res.text()
      let data = {}
      try { data = text ? JSON.parse(text) : {} } catch { data = { raw: text } }

      if (!res.ok) {
        if (res.status === 400 && data?.error === 'INVALID_INVITE_CODE') {
          alert('초대코드가 유효하지 않습니다.')
          return
        }
        alert(`회원가입 실패: ${data?.error || res.status}`)
        console.log('signup error detail:', data)
        return
      }

      // ✅ 원장: inviteCode 화면에 보여주고 싶으면 data.inviteCode 사용
      // alert(`회원가입 완료! 초대코드: ${data.inviteCode || '-'}`)

      // ✅ 이제 로그인/세션 흐름은 너가 이미 만들어둔대로 진행하면 됨
      // 보통은 바로 /login 보내거나, 로그인 페이지로
      redirectAfterAuth()
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    setStep(2)
  }

  const roleForDb = role === 'director' ? 'owner' : role

  const startSocialSignup = async (provider) => {
    localStorage.setItem('pending_role', roleForDb)

    // ✅ 진단 redirect 정보 저장
    const redirect = searchParams.get('redirect')
    const token = searchParams.get('token')

    if (redirect === 'diagnosis' && token) {
        localStorage.setItem(
        'post_auth_redirect',
        JSON.stringify({
            type: 'diagnosis',
            token,
        })
        )
    }

    const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        },
    })

    if (error) alert(error.message)
    }

  return (
    <div className="app-layout">
      {/* Main Content */}
      <div className="main-area" style={{ paddingTop: '64px' }}>
        <main style={{ padding: isMobile ? '60px 16px 40px' : '80px 32px' }}>
          <div style={{
            maxWidth: step === 1 ? '900px' : '600px',
            margin: '0 auto'
          }}>
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Link href="/" style={{
            display: 'inline-block',
            textDecoration: 'none',
            marginBottom: '16px'
          }}>
            <h1 style={{
              fontSize: '32px',
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
          <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.6)' }}>
            {step === 1 ? '시작하기 전에, 당신의 역할을 선택해주세요' : '14일 무료 체험 시작하기'}
          </p>
        </div>

        {step === 1 ? (
          /* Step 1: 역할 선택 */
          <div>
            {/* 강사진 섹션 */}
            <div style={{
              marginBottom: '32px',
              textAlign: 'left'
            }}>
              <h3 style={{
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: '600',
                color: '#3b82f6',
                marginBottom: '16px',
                paddingLeft: '8px'
              }}>
                강사진
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: isMobile ? '16px' : '24px'
              }}>
            {/* 원장 */}
            <div
              onClick={() => handleRoleSelect('director')}
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                borderRadius: isMobile ? '16px' : '24px',
                padding: isMobile ? '24px 20px' : '48px 32px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-8px)'
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)'
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(59, 130, 246, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div style={{
                width: isMobile ? '56px' : '80px',
                height: isMobile ? '56px' : '80px',
                margin: isMobile ? '0 auto 16px' : '0 auto 24px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)'
              }}>
                <svg width={isMobile ? "28" : "40"} height={isMobile ? "28" : "40"} viewBox="0 0 24 24" fill="none">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" fill="white" opacity="0.5"/>
                  <path d="M12 14l9-5v6.5a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 15.5V9l9 5z" fill="white"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: isMobile ? '18px' : '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: isMobile ? '8px' : '12px'
              }}>
                원장
              </h3>
              <p style={{
                fontSize: isMobile ? '13px' : '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: '1.6'
              }}>
                학원을 운영하는 원장님<br/>
                전체 시스템을 관리합니다
              </p>
            </div>

            {/* 강사 */}
            <div
              onClick={() => handleRoleSelect('teacher')}
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(148, 163, 184, 0.3)',
                borderRadius: isMobile ? '16px' : '24px',
                padding: isMobile ? '24px 20px' : '48px 32px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-8px)'
                e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.6)'
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(148, 163, 184, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)'
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div style={{
                width: isMobile ? '56px' : '80px',
                height: isMobile ? '56px' : '80px',
                margin: isMobile ? '0 auto 16px' : '0 auto 24px',
                background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(148, 163, 184, 0.4)'
              }}>
                <svg width={isMobile ? "28" : "40"} height={isMobile ? "28" : "40"} viewBox="0 0 24 24" fill="none">
                  <path d="M12 6v6h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: isMobile ? '18px' : '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: isMobile ? '8px' : '12px'
              }}>
                강사
              </h3>
              <p style={{
                fontSize: isMobile ? '13px' : '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: '1.6'
              }}>
                학원에서 수업을 진행하는 강사<br/>
                학생 관리 및 수업 기록
              </p>
            </div>
              </div>
            </div>

            {/* 실무진 섹션 */}
            <div>
              <h3 style={{
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: '600',
                color: '#94a3b8',
                marginBottom: '16px',
                paddingLeft: '8px'
              }}>
                실무진
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: isMobile ? '16px' : '24px'
              }}>
            {/* 실장/정규직원 */}
            <div
              onClick={() => handleRoleSelect('manager')}
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(148, 163, 184, 0.3)',
                borderRadius: isMobile ? '16px' : '24px',
                padding: isMobile ? '24px 20px' : '48px 32px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-8px)'
                e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.6)'
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(148, 163, 184, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.3)'
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div style={{
                width: isMobile ? '56px' : '80px',
                height: isMobile ? '56px' : '80px',
                margin: isMobile ? '0 auto 16px' : '0 auto 24px',
                background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(148, 163, 184, 0.4)'
              }}>
                <svg width={isMobile ? "28" : "40"} height={isMobile ? "28" : "40"} viewBox="0 0 24 24" fill="none">
                  <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4z" fill="white"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: isMobile ? '18px' : '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: isMobile ? '8px' : '12px'
              }}>
                실장/정규직원
              </h3>
              <p style={{
                fontSize: isMobile ? '13px' : '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: '1.6'
              }}>
                학원 운영 관리 및 행정 업무<br/>
                상담 및 학생 관리 총괄
              </p>
            </div>

            {/* 조교/알바 */}
            <div
              onClick={() => handleRoleSelect('assistant')}
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(203, 213, 225, 0.3)',
                borderRadius: isMobile ? '16px' : '24px',
                padding: isMobile ? '24px 20px' : '48px 32px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-8px)'
                e.currentTarget.style.borderColor = 'rgba(203, 213, 225, 0.6)'
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(203, 213, 225, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.borderColor = 'rgba(203, 213, 225, 0.3)'
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div style={{
                width: isMobile ? '56px' : '80px',
                height: isMobile ? '56px' : '80px',
                margin: isMobile ? '0 auto 16px' : '0 auto 24px',
                background: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(203, 213, 225, 0.4)'
              }}>
                <svg width={isMobile ? "28" : "40"} height={isMobile ? "28" : "40"} viewBox="0 0 24 24" fill="none">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: isMobile ? '18px' : '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: isMobile ? '8px' : '12px'
              }}>
                조교/알바
              </h3>
              <p style={{
                fontSize: isMobile ? '13px' : '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                lineHeight: '1.6'
              }}>
                학원 보조 업무 수행<br/>
                기본적인 학생 관리
              </p>
            </div>
              </div>
            </div>
          </div>
        ) : (
          /* Step 2: 정보 입력 */
          <div>
            {/* 뒤로 가기 버튼 */}
            <button
              onClick={() => setStep(1)}
              style={{
                marginBottom: '24px',
                padding: isMobile ? '10px 16px' : '12px 20px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                color: '#93c5fd',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              역할 다시 선택
            </button>

            <div style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: isMobile ? '16px' : '24px',
              padding: isMobile ? '24px 20px' : '48px 40px',
              boxShadow: '0 20px 60px rgba(30, 58, 138, 0.2)'
            }}>
              {/* 소셜 로그인 버튼 */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', marginBottom: '24px' }}>
                  <button
                    type="button"
                    onClick={() => startSocialSignup('google')}
                    style={{
                      flex: 1,
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
                    }}
                  >
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
                    onClick={() => startSocialSignup('kakao')}
                    style={{
                      flex: 1,
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
                    }}
                  >
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

                {/* Divider */}
                <div style={{ position: 'relative', margin: '24px 0' }}>
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
                      또는 이메일로 계속하기
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* 역할 표시 */}
                <div style={{
                  marginBottom: '32px',
                  padding: '16px 20px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {role === 'director' ? '👔' : role === 'teacher' ? '👨‍🏫' : role === 'manager' ? '💼' : '👤'}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '2px' }}>
                      선택한 역할
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
                      {role === 'director' ? '원장' : role === 'teacher' ? '강사' : role === 'manager' ? '실장/정규직원' : '조교/알바'}
                    </div>
                  </div>
                </div>

                {/* 원장인 경우 학원명 */}
                {role === 'director' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '8px'
                    }}>
                      학원명 <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="academyName"
                      value={formData.academyName}
                      onChange={handleChange}
                      placeholder="예: 에듀리치 영어학원"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: errors.academyName ? '1px solid #ef4444' : '1px solid rgba(59, 130, 246, 0.2)',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '15px',
                        outline: 'none'
                      }}
                    />
                    {errors.academyName && (
                      <p style={{ marginTop: '6px', fontSize: '13px', color: '#ef4444' }}>
                        {errors.academyName}
                      </p>
                    )}
                  </div>
                )}

                {/* 이름 */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '8px'
                  }}>
                    {role === 'director' ? '원장님 성함' : '이름'} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="예: 홍길동"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: errors.name ? '1px solid #ef4444' : '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                  {errors.name && (
                    <p style={{ marginTop: '6px', fontSize: '13px', color: '#ef4444' }}>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* 강사/알바인 경우 초대코드 */}
                {role !== 'director' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '8px'
                    }}>
                      초대코드 <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="inviteCode"
                      value={formData.inviteCode}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase()
                        setFormData(prev => ({ ...prev, inviteCode: value }))
                        if (errors.inviteCode) {
                          setErrors(prev => ({ ...prev, inviteCode: '' }))
                        }
                      }}
                      placeholder="예: ABC12345"
                      maxLength="8"
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: errors.inviteCode ? '1px solid #ef4444' : '1px solid rgba(59, 130, 246, 0.2)',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '15px',
                        outline: 'none',
                        textTransform: 'uppercase'
                      }}
                    />
                    {errors.inviteCode && (
                      <p style={{ marginTop: '6px', fontSize: '13px', color: '#ef4444' }}>
                        {errors.inviteCode}
                      </p>
                    )}
                    <p style={{ marginTop: '6px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                      원장님께 받은 8자리 초대코드를 입력해주세요
                    </p>
                  </div>
                )}

                {/* 이메일 */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '8px'
                  }}>
                    이메일 <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@edurich.com"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: errors.email ? '1px solid #ef4444' : '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                  {errors.email && (
                    <p style={{ marginTop: '6px', fontSize: '13px', color: '#ef4444' }}>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* 비밀번호 */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '8px'
                  }}>
                    비밀번호 <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="8자 이상 입력해주세요"
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

                {/* 비밀번호 확인 */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '8px'
                  }}>
                    비밀번호 확인 <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="password"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    placeholder="비밀번호를 다시 입력해주세요"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: errors.passwordConfirm ? '1px solid #ef4444' : '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                  {errors.passwordConfirm && (
                    <p style={{ marginTop: '6px', fontSize: '13px', color: '#ef4444' }}>
                      {errors.passwordConfirm}
                    </p>
                  )}
                </div>

                {/* 연락처 */}
                <div style={{ marginBottom: '32px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '8px'
                  }}>
                    연락처 <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="010-1234-5678"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: errors.phone ? '1px solid #ef4444' : '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none'
                    }}
                  />
                  {errors.phone && (
                    <p style={{ marginTop: '6px', fontSize: '13px', color: '#ef4444' }}>
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* 동의서 - 모든 역할 */}
                <div style={{
                  marginBottom: '32px',
                  padding: '24px',
                  background: 'rgba(59, 130, 246, 0.08)',
                  borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.15)'
                }}>
                  {/* 전체 동의 */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px',
                    marginBottom: '16px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms && formData.agreePrivacy && formData.agreeDataStorage && formData.agreeMarketing}
                      onChange={(e) => {
                        const checked = e.target.checked
                        setFormData(prev => ({
                          ...prev,
                          agreeTerms: checked,
                          agreePrivacy: checked,
                          agreeDataStorage: checked,
                          agreeMarketing: checked
                        }))
                      }}
                      style={{
                        marginRight: '12px',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#ffffff' }}>
                      전체 동의하기
                    </span>
                  </label>

                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '12px'
                  }}>
                    필수 동의
                  </div>

                  {/* 이용약관 */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    cursor: 'pointer'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        style={{
                          marginRight: '12px',
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)' }}>
                        <span style={{ color: '#ef4444' }}>*</span> 이용약관에 동의합니다
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); window.open('/terms', '_blank') }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '13px',
                        cursor: 'pointer',
                        padding: '4px 8px'
                      }}
                    >
                      보기 &gt;
                    </button>
                  </label>
                  {errors.agreeTerms && (
                    <p style={{ fontSize: '13px', color: '#ef4444', marginLeft: '30px', marginBottom: '8px' }}>
                      {errors.agreeTerms}
                    </p>
                  )}

                  {/* 개인정보 */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    cursor: 'pointer'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        name="agreePrivacy"
                        checked={formData.agreePrivacy}
                        onChange={handleChange}
                        style={{
                          marginRight: '12px',
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)' }}>
                        <span style={{ color: '#ef4444' }}>*</span> 개인정보 처리방침에 동의합니다
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); window.open('/privacy', '_blank') }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '13px',
                        cursor: 'pointer',
                        padding: '4px 8px'
                      }}
                    >
                      보기 &gt;
                    </button>
                  </label>
                  {errors.agreePrivacy && (
                    <p style={{ fontSize: '13px', color: '#ef4444', marginLeft: '30px', marginBottom: '8px' }}>
                      {errors.agreePrivacy}
                    </p>
                  )}

                  {/* AI 대화 저장 */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'start',
                    marginBottom: '12px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      name="agreeDataStorage"
                      checked={formData.agreeDataStorage}
                      onChange={handleChange}
                      style={{
                        marginRight: '12px',
                        marginTop: '3px',
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.5' }}>
                      <span style={{ color: '#ef4444' }}>*</span> AI 대화 내용 저장에 동의합니다 (맞춤형 추천 및 이어서 대화하기 기능 제공)
                    </span>
                  </label>
                  {errors.agreeDataStorage && (
                    <p style={{ fontSize: '13px', color: '#ef4444', marginLeft: '30px', marginBottom: '8px' }}>
                      {errors.agreeDataStorage}
                    </p>
                  )}

                  <div style={{
                    height: '1px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    margin: '16px 0'
                  }}></div>

                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '12px'
                  }}>
                    선택 동의
                  </div>

                  {/* 마케팅 동의 */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'start',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      name="agreeMarketing"
                      checked={formData.agreeMarketing}
                      onChange={handleChange}
                      style={{
                        marginRight: '12px',
                        marginTop: '3px',
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.5' }}>
                      신규 기능 및 학원 운영 팁 소식 받기
                    </span>
                  </label>
                </div>

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
                    marginBottom: '16px'
                  }}
                >
                  {isLoading ? '처리 중...' : role === 'director' ? '무료 체험 시작하기' : '가입하기'}
                </button>

                {/* Login Link */}
                <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  이미 계정이 있으신가요?{' '}
                  <Link href="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>
                    로그인
                  </Link>
                </p>
              </form>
            </div>
          </div>
        )}
          </div>
        </main>
      </div>
    </div>
  )
}
