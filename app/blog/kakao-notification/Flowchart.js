'use client'

const Box = ({ title, subtitle, borderColor, icon }) => (
  <div style={{
    width: '100%',
    maxWidth: '384px',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    border: `2px solid ${borderColor}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    transition: 'transform 0.3s',
    background: '#1e293b',
    color: 'white'
  }}>
    {icon && <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>}
    <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>{title}</h3>
    <p style={{ fontSize: '14px', opacity: 0.8, color: '#94a3b8' }}>{subtitle}</p>
  </div>
);

const ArrowDown = ({ label }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '64px',
    position: 'relative',
    zIndex: 0
  }}>
    <div style={{ width: '2px', height: '100%', background: '#475569' }}></div>
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#334155',
      padding: '4px 12px',
      borderRadius: '9999px',
      border: '1px solid #475569',
      fontSize: '12px',
      fontWeight: '600',
      color: '#94a3b8',
      whiteSpace: 'nowrap'
    }}>
      {label}
    </div>
    <div style={{
      width: '12px',
      height: '12px',
      borderRight: '2px solid #475569',
      borderBottom: '2px solid #475569',
      transform: 'rotate(45deg)',
      marginTop: '-6px',
      background: '#0f172a'
    }}></div>
  </div>
);

export default function Flowchart() {
  return (
    <div style={{
      background: '#0f172a',
      padding: 'clamp(24px, 5vw, 48px)',
      borderRadius: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid #334155'
    }}>

      {/* Background Decorative Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.2,
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '40px',
          left: '40px',
          width: '128px',
          height: '128px',
          background: '#3b82f6',
          borderRadius: '50%',
          filter: 'blur(48px)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '40px',
          right: '40px',
          width: '160px',
          height: '160px',
          background: '#8b5cf6',
          borderRadius: '50%',
          filter: 'blur(48px)'
        }}></div>
      </div>

      <h3 style={{ color: 'white', fontSize: 'clamp(20px, 4vw, 30px)', fontWeight: 'bold', marginBottom: '8px', zIndex: 10 }}>
        서비스 채널 연동 구조
      </h3>
      <p style={{ color: '#9ca3af', marginBottom: '48px', zIndex: 10, textAlign: 'center' }}>
        에듀리치브레인과 카카오톡 채널의 유기적인 운영 관계
      </p>

      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 10,
        gap: '8px'
      }}>

        <Box
          title="본랩(BornLab)"
          subtitle="사업자 · 서비스 개발 및 운영 총괄"
          borderColor="#3b82f6"
          icon="🏢"
        />

        <ArrowDown label="개발 및 운영" />

        <Box
          title="에듀리치브레인"
          subtitle="학원 경영 자동화 플랫폼 (AI SAAS)"
          borderColor="#60a5fa"
          icon="🧠"
        />

        <ArrowDown label="알림톡 발송 기능 연동" />

        <Box
          title="에듀 알림 채널"
          subtitle="학부모 대상 알림톡 발송 전용 채널"
          borderColor="#facc15"
          icon="💬"
        />

      </div>
    </div>
  );
}
