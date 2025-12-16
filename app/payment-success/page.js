'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import useIsMobile from '@/hooks/useIsMobile'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()
  const [countdown, setCountdown] = useState(5)
  const [showConfetti, setShowConfetti] = useState(true)

  const planName = searchParams.get('plan') || 'Starter'
  const academyName = searchParams.get('academy') || '회원'

  // 카운트다운 및 자동 리다이렉트
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = 'https://edurichbrain.ai.kr'
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Confetti 효과 (3초 후 숨김)
  useEffect(() => {
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false)
    }, 3000)
    return () => clearTimeout(confettiTimer)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 50%, #1a1f3a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Confetti Animation */}
      {showConfetti && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 10
        }}>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                background: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)],
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                animation: `confetti-fall ${Math.random() * 2 + 2}s linear forwards`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes check-appear {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>

      {/* Success Card */}
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8))',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: isMobile ? '20px' : '24px',
        padding: isMobile ? '32px 20px' : '48px 40px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(30, 58, 138, 0.3)',
        position: 'relative',
        zIndex: 5
      }}>
        {/* Success Icon with Animation */}
        <div style={{
          position: 'relative',
          width: isMobile ? '80px' : '100px',
          height: isMobile ? '80px' : '100px',
          margin: isMobile ? '0 auto 24px' : '0 auto 32px'
        }}>
          {/* Pulse Ring */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '50%',
            border: '3px solid rgba(16, 185, 129, 0.5)',
            animation: 'pulse-ring 1.5s ease-out infinite'
          }} />

          {/* Check Circle */}
          <div style={{
            width: isMobile ? '80px' : '100px',
            height: isMobile ? '80px' : '100px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'check-appear 0.6s ease-out forwards',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)'
          }}>
            <svg width={isMobile ? "40" : "50"} height={isMobile ? "40" : "50"} viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: isMobile ? '22px' : '28px',
          fontWeight: '700',
          color: '#ffffff',
          marginBottom: '12px',
          lineHeight: '1.3'
        }}>
          {academyName}님, 환영합니다!
        </h1>

        <p style={{
          fontSize: isMobile ? '15px' : '18px',
          color: '#10b981',
          fontWeight: '600',
          marginBottom: isMobile ? '20px' : '24px'
        }}>
          결제가 성공적으로 완료되었습니다
        </p>

        {/* Plan Info */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: isMobile ? '12px' : '16px',
          padding: isMobile ? '16px' : '20px',
          marginBottom: isMobile ? '24px' : '32px'
        }}>
          <div style={{
            fontSize: isMobile ? '13px' : '14px',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '8px'
          }}>
            선택한 요금제
          </div>
          <div style={{
            fontSize: isMobile ? '20px' : '24px',
            fontWeight: '700',
            color: '#3b82f6'
          }}>
            {planName} Plan
          </div>
        </div>

        {/* What's Next */}
        <div style={{
          textAlign: 'left',
          marginBottom: isMobile ? '24px' : '32px'
        }}>
          <h3 style={{
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: isMobile ? '12px' : '16px'
          }}>
            이제 시작해볼까요?
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '8px' : '12px' }}>
            {[
              { step: '1', text: '학원 기본 정보 설정하기', icon: '🏫' },
              { step: '2', text: '첫 번째 학생 등록하기', icon: '👨‍🎓' },
              { step: '3', text: 'AI 상담 도우미 체험하기', icon: '🤖' }
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '10px' : '12px',
                padding: isMobile ? '10px 12px' : '12px 16px',
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: isMobile ? '10px' : '12px',
                border: '1px solid rgba(59, 130, 246, 0.15)'
              }}>
                <span style={{ fontSize: isMobile ? '18px' : '20px' }}>{item.icon}</span>
                <span style={{ fontSize: isMobile ? '13px' : '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => window.location.href = 'https://edurichbrain.ai.kr'}
          style={{
            width: '100%',
            padding: isMobile ? '14px 24px' : '18px 32px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            border: 'none',
            borderRadius: isMobile ? '12px' : '14px',
            color: '#ffffff',
            fontSize: isMobile ? '15px' : '18px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
            transition: 'all 0.3s ease',
            marginBottom: '16px'
          }}
        >
          에듀리치브레인 시작하기
        </button>

        {/* Auto Redirect Notice */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.5)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: '#3b82f6',
            borderRadius: '50%',
            animation: 'pulse-ring 1s ease-out infinite'
          }} />
          <span>{countdown}초 후 자동으로 이동합니다...</span>
        </div>

        {/* Support Link */}
        <div style={{
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <p style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.4)'
          }}>
            문제가 있으신가요?{' '}
            <a
              href="mailto:support@edurichbrain.com"
              style={{ color: '#3b82f6', textDecoration: 'none' }}
            >
              고객센터 문의하기
            </a>
          </p>
        </div>
      </div>

      {/* Background Decoration */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 50%, #1a1f3a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: '#ffffff', fontSize: '16px' }}>로딩 중...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
