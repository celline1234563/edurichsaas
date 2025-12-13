'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ComingSoonContent() {
  const [isMobile, setIsMobile] = useState(false);
  const searchParams = useSearchParams();
  const pageName = searchParams.get('page') || '페이지';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const pageNames = {
    'careers': '채용 정보',
    'guide': '사용 가이드',
    'contact': '1:1 문의'
  };

  const displayName = pageNames[pageName] || pageName;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a12 0%, #1a1a2e 50%, #0a0a12 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      marginLeft: isMobile ? '0' : '260px'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        {/* 아이콘 */}
        <div style={{
          width: '120px',
          height: '120px',
          margin: '0 auto 32px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 60px rgba(59, 130, 246, 0.3)'
        }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        </div>

        {/* 제목 */}
        <h1 style={{
          fontSize: isMobile ? '28px' : '36px',
          fontWeight: '700',
          color: '#ffffff',
          marginBottom: '16px'
        }}>
          {displayName}
        </h1>

        {/* 준비중 메시지 */}
        <p style={{
          fontSize: '18px',
          color: '#9ca3af',
          marginBottom: '8px'
        }}>
          페이지 준비중입니다
        </p>
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          더 나은 서비스를 위해 열심히 준비하고 있습니다.<br />
          빠른 시일 내에 찾아뵙겠습니다.
        </p>

        {/* 홈으로 돌아가기 버튼 */}
        <Link href="/" style={{
          display: 'inline-block',
          padding: '14px 32px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          color: '#ffffff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '15px',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default function ComingSoonPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a12 0%, #1a1a2e 50%, #0a0a12 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: '#9ca3af' }}>로딩중...</p>
      </div>
    }>
      <ComingSoonContent />
    </Suspense>
  );
}
