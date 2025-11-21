'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DemoPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // iframe 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 50%, #1a1f3a 100%)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Top Bar */}
      <div style={{
        width: '100%',
        height: '60px',
        background: 'rgba(10, 14, 39, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Left: Logo & Back */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link
            href="/"
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#ffffff',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            EduRichBrain
          </Link>
        </div>

        {/* Center: Demo Label */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          padding: '8px 20px',
          borderRadius: '12px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '14px' }}>✨</span>
          </div>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#3b82f6'
          }}>
            실시간 데모 체험
          </span>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            href="/pricing"
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease'
            }}
          >
            요금제 보기
          </Link>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '60px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 14, 39, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          zIndex: 20
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(59, 130, 246, 0.2)',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: '500'
          }}>
            데모 환경을 불러오는 중...
          </div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Main Content: iframe with frame effect */}
      <div style={{
        flex: 1,
        width: '100%',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '2px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 0 40px rgba(59, 130, 246, 0.15), inset 0 0 20px rgba(0, 0, 0, 0.3)'
        }}>
          <iframe
            src="http://localhost:3000"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: '#0a0e27',
              display: 'block'
            }}
            title="EduRichBrain Demo"
            allow="clipboard-read; clipboard-write"
          />

          {/* 흰색 오버레이 (데모 느낌) */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.15)',
            pointerEvents: 'none',
            zIndex: 10
          }} />

          {/* 하단 체험모드 배너 */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '6px 16px',
            background: 'rgba(10, 14, 39, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#3b82f6',
            zIndex: 15,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            체험 모드 · 예시 데이터
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div style={{
        width: '100%',
        padding: '12px 24px',
        background: 'rgba(10, 14, 39, 0.8)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(59, 130, 246, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '13px',
        color: 'rgba(255, 255, 255, 0.6)'
      }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>💡 모든 기능을 자유롭게 둘러보세요</span>
          <span>📊 예시 데이터로 구성되어 있습니다</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a
            href="mailto:support@edurichbrain.com"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            문의하기
          </a>
          <span>|</span>
          <Link
            href="/signup"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            회원가입하고 시작하기 →
          </Link>
        </div>
      </div>
    </div>
  )
}
