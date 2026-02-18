'use client'

export default function HeroOrbSection() {
  return (
    <div style={{
      marginTop: 'clamp(48px, 8vw, 96px)',
      position: 'relative',
      width: '100%',
      maxWidth: '1200px',
      marginLeft: 'auto',
      marginRight: 'auto',
    }}>
      {/* Content area - transparent, floating on page background */}
      <div style={{
        position: 'relative',
        padding: 'clamp(24px, 5vw, 60px) clamp(16px, 3.3vw, 40px)',
        minHeight: 'clamp(280px, 47vw, 560px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>

        {/* ===== Center Orb - Image Placeholder ===== */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          width: 'clamp(90px, 13vw, 160px)',
          height: 'clamp(90px, 13vw, 160px)',
          borderRadius: '50%',
          overflow: 'hidden',
        }}>
          {/* TODO: src에 실제 구슬 이미지 경로를 넣으세요 (예: "/orb.png") */}
          <img
            src=""
            alt="Energy Orb"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>

        {/* ===== Connecting Lines SVG - Smooth bezier fiber-optic curves ===== */}
        <svg className="hero-orb-lines" style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 5,
          pointerEvents: 'none',
        }} viewBox="0 0 1200 560" preserveAspectRatio="none">
          <defs>
            {/* Neon glow filter - double layer */}
            <filter id="neonGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1"/>
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2"/>
              <feMerge>
                <feMergeNode in="blur2"/>
                <feMergeNode in="blur1"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            {/* Lighter glow for secondary lines */}
            <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Left-going gradients */}
            <linearGradient id="fiberGradL" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="rgba(100, 180, 255, 0.75)" />
              <stop offset="70%" stopColor="rgba(70, 150, 255, 0.4)" />
              <stop offset="100%" stopColor="rgba(50, 120, 240, 0.12)" />
            </linearGradient>
            {/* Right-going gradients */}
            <linearGradient id="fiberGradR" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(100, 180, 255, 0.75)" />
              <stop offset="70%" stopColor="rgba(70, 150, 255, 0.4)" />
              <stop offset="100%" stopColor="rgba(50, 120, 240, 0.12)" />
            </linearGradient>

            {/* Flow particle gradient - left */}
            <linearGradient id="flowGradL" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="rgba(160, 210, 255, 0.9)" />
              <stop offset="100%" stopColor="rgba(100, 180, 255, 0.2)" />
            </linearGradient>
            {/* Flow particle gradient - right */}
            <linearGradient id="flowGradR" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(160, 210, 255, 0.9)" />
              <stop offset="100%" stopColor="rgba(100, 180, 255, 0.2)" />
            </linearGradient>
          </defs>

          {/* ---- Top-Left Connection (3 fibers + flow) ---- */}
          <path d="M 580 272 C 440 255, 340 168, 280 108"
            stroke="url(#fiberGradL)" strokeWidth="2.5" fill="none" filter="url(#neonGlow)" />
          <path d="M 585 266 C 455 245, 355 160, 290 100"
            stroke="url(#fiberGradL)" strokeWidth="1.5" fill="none" filter="url(#softGlow)" opacity="0.5" />
          <path d="M 574 278 C 430 268, 330 178, 272 118"
            stroke="url(#fiberGradL)" strokeWidth="1" fill="none" filter="url(#softGlow)" opacity="0.3" />
          <path d="M 580 272 C 440 255, 340 168, 280 108"
            stroke="url(#flowGradL)" strokeWidth="1.5" fill="none" filter="url(#softGlow)"
            strokeDasharray="8 32" className="line-flow" />

          {/* ---- Bottom-Left Connection (3 fibers + flow) ---- */}
          <path d="M 580 288 C 440 305, 340 392, 280 452"
            stroke="url(#fiberGradL)" strokeWidth="2.5" fill="none" filter="url(#neonGlow)" />
          <path d="M 585 294 C 455 315, 355 400, 290 460"
            stroke="url(#fiberGradL)" strokeWidth="1.5" fill="none" filter="url(#softGlow)" opacity="0.5" />
          <path d="M 574 282 C 430 292, 330 382, 272 442"
            stroke="url(#fiberGradL)" strokeWidth="1" fill="none" filter="url(#softGlow)" opacity="0.3" />
          <path d="M 580 288 C 440 305, 340 392, 280 452"
            stroke="url(#flowGradL)" strokeWidth="1.5" fill="none" filter="url(#softGlow)"
            strokeDasharray="8 32" className="line-flow" />

          {/* ---- Top-Right Connection (3 fibers + flow) ---- */}
          <path d="M 620 272 C 760 255, 860 168, 920 108"
            stroke="url(#fiberGradR)" strokeWidth="2.5" fill="none" filter="url(#neonGlow)" />
          <path d="M 615 266 C 745 245, 845 160, 910 100"
            stroke="url(#fiberGradR)" strokeWidth="1.5" fill="none" filter="url(#softGlow)" opacity="0.5" />
          <path d="M 626 278 C 770 268, 870 178, 928 118"
            stroke="url(#fiberGradR)" strokeWidth="1" fill="none" filter="url(#softGlow)" opacity="0.3" />
          <path d="M 620 272 C 760 255, 860 168, 920 108"
            stroke="url(#flowGradR)" strokeWidth="1.5" fill="none" filter="url(#softGlow)"
            strokeDasharray="8 32" className="line-flow" />

          {/* ---- Bottom-Right Connection (3 fibers + flow) ---- */}
          <path d="M 620 288 C 760 305, 860 392, 920 452"
            stroke="url(#fiberGradR)" strokeWidth="2.5" fill="none" filter="url(#neonGlow)" />
          <path d="M 615 294 C 745 315, 845 400, 910 460"
            stroke="url(#fiberGradR)" strokeWidth="1.5" fill="none" filter="url(#softGlow)" opacity="0.5" />
          <path d="M 626 282 C 770 292, 870 382, 928 442"
            stroke="url(#fiberGradR)" strokeWidth="1" fill="none" filter="url(#softGlow)" opacity="0.3" />
          <path d="M 620 288 C 760 305, 860 392, 920 452"
            stroke="url(#flowGradR)" strokeWidth="1.5" fill="none" filter="url(#softGlow)"
            strokeDasharray="8 32" className="line-flow" />
        </svg>

        {/* ===== Card: AI 리포트 (Top Left) ===== */}
        <div className="orb-card" style={{
          position: 'absolute',
          top: 'clamp(16px, 3.3vw, 40px)',
          left: 'clamp(16px, 3.3vw, 40px)',
          width: 'clamp(130px, 22vw, 260px)',
          background: 'rgba(10, 18, 40, 0.8)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(80, 150, 255, 0.2)',
          borderRadius: 'clamp(10px, 1.3vw, 16px)',
          padding: 'clamp(12px, 1.7vw, 20px)',
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.1), 0 0 30px rgba(59, 130, 246, 0.05), inset 0 0 20px rgba(59, 130, 246, 0.04)',
          zIndex: 15,
        }}>
          <div style={{ fontSize: 'clamp(12px, 1.25vw, 15px)', fontWeight: '700', color: '#ffffff', marginBottom: 'clamp(8px, 1.3vw, 16px)' }}>AI 리포트</div>
          <div className="orb-card-detail" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 0.8vw, 10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 0.8vw, 10px)' }}>
              <div style={{
                width: 'clamp(18px, 1.8vw, 22px)',
                height: 'clamp(18px, 1.8vw, 22px)',
                borderRadius: '6px',
                background: 'rgba(59, 130, 246, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: 'clamp(10px, 1.1vw, 13px)', color: '#cbd5e1', whiteSpace: 'nowrap' }}>학생 성취도 분석</span>
              <span style={{
                marginLeft: 'auto', padding: '2px 8px', borderRadius: '9999px',
                background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80',
                fontSize: 'clamp(9px, 0.9vw, 11px)', fontWeight: '600', whiteSpace: 'nowrap',
              }}>완료</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 0.8vw, 10px)' }}>
              <div style={{
                width: 'clamp(18px, 1.8vw, 22px)',
                height: 'clamp(18px, 1.8vw, 22px)',
                borderRadius: '6px',
                background: 'rgba(59, 130, 246, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: 'clamp(10px, 1.1vw, 13px)', color: '#cbd5e1' }}>월간 리포트 생성</span>
            </div>
          </div>
        </div>

        {/* ===== Card: 학습 분석 (Top Right) ===== */}
        <div className="orb-card" style={{
          position: 'absolute',
          top: 'clamp(16px, 3.3vw, 40px)',
          right: 'clamp(16px, 3.3vw, 40px)',
          width: 'clamp(130px, 22vw, 260px)',
          background: 'rgba(10, 18, 40, 0.8)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(80, 150, 255, 0.2)',
          borderRadius: 'clamp(10px, 1.3vw, 16px)',
          padding: 'clamp(12px, 1.7vw, 20px)',
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.1), 0 0 30px rgba(59, 130, 246, 0.05), inset 0 0 20px rgba(59, 130, 246, 0.04)',
          zIndex: 15,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(8px, 1.3vw, 16px)' }}>
            <span style={{ fontSize: 'clamp(12px, 1.25vw, 15px)', fontWeight: '700', color: '#ffffff' }}>학습 분석</span>
            <span className="orb-card-detail" style={{ fontSize: 'clamp(9px, 0.9vw, 11px)', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              전월 대비 60%
            </span>
          </div>
          <div className="orb-card-detail">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 'clamp(48px, 6.7vw, 80px)', gap: '6px', padding: '0 4px' }}>
              {[40, 55, 35, 70, 85, 65, 90].map((h, i) => (
                <div key={i} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{
                    width: '100%',
                    height: `${h}%`,
                    background: i >= 5
                      ? 'linear-gradient(180deg, #60a5fa, #2563eb)'
                      : 'rgba(59, 130, 246, 0.3)',
                    borderRadius: '4px 4px 0 0',
                    boxShadow: i >= 5 ? '0 0 10px rgba(59, 130, 246, 0.4)' : 'none',
                  }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: 'clamp(8px, 0.8vw, 10px)', color: '#64748b', padding: '0 4px' }}>
              {['4월', '5월', '6월', '7월', '8월', '9월', '10월'].map((m, i) => (
                <span key={i}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ===== Card: 워크플로우 (Bottom Left) ===== */}
        <div className="orb-card" style={{
          position: 'absolute',
          bottom: 'clamp(16px, 3.3vw, 40px)',
          left: 'clamp(16px, 3.3vw, 40px)',
          width: 'clamp(130px, 22vw, 260px)',
          background: 'rgba(10, 18, 40, 0.8)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(80, 150, 255, 0.2)',
          borderRadius: 'clamp(10px, 1.3vw, 16px)',
          padding: 'clamp(12px, 1.7vw, 20px)',
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.1), 0 0 30px rgba(59, 130, 246, 0.05), inset 0 0 20px rgba(59, 130, 246, 0.04)',
          zIndex: 15,
        }}>
          <div style={{ fontSize: 'clamp(12px, 1.25vw, 15px)', fontWeight: '700', color: '#ffffff', marginBottom: 'clamp(8px, 1.3vw, 16px)' }}>워크플로우</div>
          <div className="orb-card-detail" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1vw, 12px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 0.8vw, 10px)' }}>
              <div style={{
                width: 'clamp(18px, 2vw, 24px)',
                height: 'clamp(18px, 2vw, 24px)',
                borderRadius: '6px',
                background: 'rgba(34, 197, 94, 0.2)', border: '1px solid rgba(34, 197, 94, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: 'clamp(10px, 1.1vw, 13px)', color: '#ffffff' }}>학생 데이터 수집</span>
            </div>
            <div style={{ width: '1px', height: '16px', background: 'rgba(71, 85, 105, 0.5)', marginLeft: '12px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 0.8vw, 10px)' }}>
              <div style={{
                width: 'clamp(18px, 2vw, 24px)',
                height: 'clamp(18px, 2vw, 24px)',
                borderRadius: '6px',
                background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60a5fa' }} />
              </div>
              <span style={{ fontSize: 'clamp(10px, 1.1vw, 13px)', color: '#94a3b8' }}>AI 분석 자동화</span>
            </div>
            <div style={{ fontSize: 'clamp(9px, 0.9vw, 11px)', color: '#64748b', marginTop: '4px' }}>워크플로우를 만들어보세요...</div>
          </div>
        </div>

        {/* ===== Card: 인사이트 (Bottom Right) ===== */}
        <div className="orb-card" style={{
          position: 'absolute',
          bottom: 'clamp(16px, 3.3vw, 40px)',
          right: 'clamp(16px, 3.3vw, 40px)',
          width: 'clamp(130px, 22vw, 260px)',
          background: 'rgba(10, 18, 40, 0.8)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(80, 150, 255, 0.2)',
          borderRadius: 'clamp(10px, 1.3vw, 16px)',
          padding: 'clamp(12px, 1.7vw, 20px)',
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.1), 0 0 30px rgba(59, 130, 246, 0.05), inset 0 0 20px rgba(59, 130, 246, 0.04)',
          zIndex: 15,
        }}>
          <div style={{ fontSize: 'clamp(12px, 1.25vw, 15px)', fontWeight: '700', color: '#ffffff', marginBottom: 'clamp(8px, 1.3vw, 16px)' }}>인사이트</div>
          <div className="orb-card-detail" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1vw, 12px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 0.8vw, 10px)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60a5fa', flexShrink: 0 }} />
              <span style={{ fontSize: 'clamp(10px, 1.1vw, 13px)', color: '#cbd5e1' }}>주간 보고서 자동화</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 'auto', color: '#4ade80', flexShrink: 0 }}>
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
              <span style={{
                padding: '4px 10px', borderRadius: '9999px',
                background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.25)',
                color: '#93c5fd', fontSize: 'clamp(9px, 0.9vw, 11px)',
              }}>학습 트렌드</span>
              <span style={{
                padding: '4px 10px', borderRadius: '9999px',
                background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.25)',
                color: '#fbbf24', fontSize: 'clamp(9px, 0.9vw, 11px)',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v4l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                핵심 포인트
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Glow */}
      <div style={{
        position: 'absolute',
        bottom: '-40px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '75%',
        height: '96px',
        background: 'rgba(37, 99, 235, 0.15)',
        filter: 'blur(80px)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />
    </div>
  )
}
