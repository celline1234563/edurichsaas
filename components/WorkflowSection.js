'use client'

import { motion } from 'framer-motion'
import {
  Database, Brain, Zap, FileText, TrendingUp,
  MessageCircle, Users, Search, CheckCircle2, ArrowRight
} from 'lucide-react'

function FeatureBlock({ step, title, subtitle, description, align, color, icon, children }) {
  const isLeft = align === 'left'

  const colorMap = {
    cyan: { accent: '#22d3ee', bg: 'rgba(34,211,238,0.1)', border: 'rgba(34,211,238,0.3)' },
    blue: { accent: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)' },
    purple: { accent: '#a855f7', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.3)' },
  }
  const c = colorMap[color]

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '48px',
      alignItems: 'center',
    }}>
      {/* Desktop layout wrapper - uses CSS media query behavior via max-width */}
      <div style={{
        display: 'flex',
        flexDirection: isLeft ? 'row' : 'row-reverse',
        flexWrap: 'wrap',
        gap: '48px',
        alignItems: 'center',
        width: '100%',
      }}>
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ flex: '1 1 400px', textAlign: 'left', padding: '20px 0' }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: c.bg,
              border: `1px solid ${c.border}`,
              color: c.accent,
              boxShadow: '0 0 20px rgba(0,0,0,0.3)',
            }}>
              {icon}
            </div>
            <span style={{
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: c.accent,
            }}>{subtitle}</span>
          </div>

          <h3 style={{
            fontSize: 'clamp(24px, 3vw, 36px)',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '24px',
            lineHeight: '1.3',
            wordBreak: 'keep-all',
          }}>{title}</h3>

          <p style={{
            color: '#94a3b8',
            fontSize: '18px',
            lineHeight: '1.7',
            wordBreak: 'keep-all',
            marginBottom: '32px',
          }}>{description}</p>

          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px',
            fontWeight: '600',
            color: c.accent,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}>
            자세히 살펴보기
            <ArrowRight style={{ width: '20px', height: '20px' }} />
          </button>
        </motion.div>

        {/* Visual Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ flex: '1 1 400px', width: '100%' }}
        >
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/10',
            borderRadius: '16px',
            background: '#0f172a',
            border: '1px solid rgba(30,41,59,1)',
            overflow: 'hidden',
            boxShadow: `0 25px 50px rgba(0,0,0,0.5), 0 0 30px ${c.bg}`,
          }}>
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function OntologyVisual() {
  const items = [
    { label: '성적', color: '#3b82f6', icon: FileText },
    { label: '상담', color: '#22c55e', icon: MessageCircle },
    { label: '출결', color: '#a855f7', icon: Users },
    { label: '매출', color: '#f59e0b', icon: TrendingUp },
  ]

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Central Core */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '96px',
        height: '96px',
        borderRadius: '50%',
        background: '#1e293b',
        border: '2px solid rgba(34,211,238,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 50px rgba(34,211,238,0.2)',
      }}>
        <Database style={{ width: '40px', height: '40px', color: '#22d3ee' }} />
      </div>

      {/* Corner nodes */}
      {items.map((item, i) => {
        const positions = [
          { top: '24px', left: '24px' },
          { top: '24px', right: '24px' },
          { bottom: '24px', left: '24px' },
          { bottom: '24px', right: '24px' },
        ]
        const Icon = item.icon
        return (
          <motion.div
            key={i}
            style={{ position: 'absolute', ...positions[i], display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
          >
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(30,41,59,0.8)',
              border: '1px solid rgba(51,65,85,1)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}>
              <Icon style={{ width: '24px', height: '24px', color: item.color }} />
            </div>
          </motion.div>
        )
      })}

      {/* Data flow particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: '#22d3ee',
              borderRadius: '50%',
              top: '50%',
              left: '50%',
            }}
            animate={{
              x: [Math.cos(i * 1.2) * 100, 0],
              y: [Math.sin(i * 1.2) * 100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: 'linear' }}
          />
        ))}
      </div>
    </div>
  )
}

function DiagnosisVisual() {
  const items = [
    { text: '중등부 성적 추이 분석', status: '정상', color: '#34d399' },
    { text: '고2 이탈 위험군 감지', status: '위험', color: '#f87171' },
    { text: '학부모 상담 만족도', status: '우수', color: '#60a5fa' },
    { text: '마케팅 ROI 효율', status: '저조', color: '#fbbf24' },
    { text: '강사별 수업 시수', status: '분석중', color: '#94a3b8' },
  ]

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      background: '#0f172a',
    }}>
      {/* Grid background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundSize: '40px 40px',
        backgroundImage: 'linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)',
      }} />

      <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', gap: '16px' }}>
        {/* Left Panel */}
        <div style={{
          width: '50%',
          height: '100%',
          background: 'rgba(30,41,59,0.5)',
          borderRadius: '8px',
          border: '1px solid rgba(51,65,85,0.5)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#93c5fd', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search style={{ width: '12px', height: '12px' }} /> 실시간 분석 중...
          </div>

          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.5 }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                padding: '8px',
                background: 'rgba(15,23,42,0.5)',
                borderRadius: '4px',
              }}
            >
              <span style={{ color: '#cbd5e1' }}>{item.text}</span>
              <span style={{ fontWeight: '700', color: item.color }}>{item.status}</span>
            </motion.div>
          ))}

          {/* Scan line */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: '#3b82f6',
              boxShadow: '0 0 15px #3b82f6',
            }}
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Right Panel: Score */}
        <div style={{ width: '50%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '128px',
              height: '128px',
              border: '2px solid rgba(59,130,246,0.3)',
              borderRadius: '50%',
              animation: 'spin 10s linear infinite',
            }} />
            <div style={{
              position: 'absolute',
              width: '96px',
              height: '96px',
              border: '1px solid rgba(96,165,250,0.2)',
              borderRadius: '50%',
            }} />
          </div>
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
              87<span style={{ fontSize: '14px', color: '#94a3b8' }}>점</span>
            </div>
            <div style={{
              fontSize: '12px',
              color: '#93c5fd',
              background: 'rgba(59,130,246,0.1)',
              padding: '4px 8px',
              borderRadius: '4px',
            }}>경영 건강도</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActionVisual() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(30,41,59,0.8)',
        borderRadius: '12px',
        border: '1px solid rgba(51,65,85,1)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(12px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(15,23,42,0.8)',
          padding: '12px',
          borderBottom: '1px solid rgba(51,65,85,1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ marginLeft: '8px', fontSize: '12px', fontWeight: '500', color: '#94a3b8' }}>EduRichBrain Assistant</span>
        </div>

        {/* Body */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* AI Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: '12px' }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#a855f7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Brain style={{ width: '16px', height: '16px', color: '#ffffff' }} />
            </div>
            <div style={{
              background: 'rgba(51,65,85,1)',
              borderRadius: '16px',
              borderTopLeftRadius: '0',
              padding: '12px',
              fontSize: '14px',
              color: '#e2e8f0',
            }}>
              <p style={{ marginBottom: '8px' }}>
                <span style={{ color: '#fcd34d', fontWeight: '700' }}>긴급 감지:</span>{' '}
                중2 A반 수학 성적이 지난달 대비 15% 하락했습니다.
              </p>
              <p>지금 바로 학부모님께 보낼 상담 리포트를 생성할까요?</p>
            </div>
          </motion.div>

          {/* User reply */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            style={{ alignSelf: 'flex-end' }}
          >
            <div style={{
              background: '#7c3aed',
              color: '#ffffff',
              borderRadius: '16px',
              borderTopRightRadius: '0',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 4px 12px rgba(124,58,237,0.2)',
            }}>
              네, 리포트 생성해줘
            </div>
          </motion.div>

          {/* AI Result */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.2 }}
            style={{
              marginLeft: '44px',
              background: '#0f172a',
              border: '1px solid rgba(51,65,85,1)',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ padding: '8px', background: 'rgba(34,197,94,0.1)', borderRadius: '8px' }}>
              <CheckCircle2 style={{ width: '20px', height: '20px', color: '#4ade80' }} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>파일 생성 완료</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>중2_A반_심층분석_리포트.pdf</div>
            </div>
            <button style={{
              marginLeft: 'auto',
              fontSize: '12px',
              background: '#1e293b',
              border: '1px solid rgba(71,85,105,1)',
              padding: '4px 8px',
              borderRadius: '4px',
              color: '#e2e8f0',
              cursor: 'pointer',
            }}>열기</button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function WorkflowSection() {
  return (
    <section style={{
      position: 'relative',
      padding: '128px 0',
      background: '#020617',
      overflow: 'hidden',
    }}>
      {/* Top border line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(34,211,238,0.3), transparent)',
        opacity: 0.5,
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '128px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '9999px',
              border: '1px solid rgba(34,211,238,0.3)',
              background: 'rgba(34,211,238,0.1)',
              color: '#67e8f9',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '24px',
              boxShadow: '0 0 15px rgba(34,211,238,0.2)',
            }}
          >
            PROCESS FLOW
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: '700',
              marginBottom: '32px',
              lineHeight: '1.2',
            }}
          >
            학원 경영의{' '}
            <span style={{
              background: 'linear-gradient(to right, #22d3ee, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>완전 자동화</span>
            <br />
            <span style={{ color: '#ffffff' }}>3단계 프로세스</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{
              color: '#94a3b8',
              maxWidth: '680px',
              margin: '0 auto',
              fontSize: 'clamp(16px, 2vw, 20px)',
              wordBreak: 'keep-all',
              lineHeight: '1.7',
            }}
          >
            에듀리치브레인은 단순한 도구가 아닙니다. 당신의 학원을 24시간 분석하고,
            가장 완벽한 전략을 제시하는 AI 파트너입니다.
          </motion.p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '128px' }}>
          <FeatureBlock
            step="01"
            title="모든 데이터가 하나로 연결되는 순간"
            subtitle="온톨로지 구축 (Ontology)"
            description="성적표, 상담일지, 출결기록... 흩어져 있던 데이터가 에듀리치브레인의 신경망으로 연결됩니다. 학원의 모든 상황이 실시간으로 동기화되는 경험을 해보세요."
            align="left"
            color="cyan"
            icon={<Database style={{ width: '24px', height: '24px' }} />}
          >
            <OntologyVisual />
          </FeatureBlock>

          <FeatureBlock
            step="02"
            title="숨겨진 문제와 기회를 찾아내는 AI의 눈"
            subtitle="정밀 진단 (Deep Diagnosis)"
            description="교육학적 원리와 마케팅 법칙을 학습한 AI가 우리 학원의 건강 상태를 1,500가지 관점에서 분석합니다. 원장님조차 몰랐던 이탈 징후와 매출 기회를 포착합니다."
            align="right"
            color="blue"
            icon={<Brain style={{ width: '24px', height: '24px' }} />}
          >
            <DiagnosisVisual />
          </FeatureBlock>

          <FeatureBlock
            step="03"
            title="고민할 필요 없이, 클릭 한번으로 해결"
            subtitle="원클릭 전략 실행 (Action)"
            description="진단만 하고 끝나지 않습니다. '지금 당장 무엇을 해야 하는지' 구체적인 행동을 명령하고, 블로그 글부터 상담 스크립트까지 AI가 대신 작성해줍니다."
            align="left"
            color="purple"
            icon={<Zap style={{ width: '24px', height: '24px' }} />}
          >
            <ActionVisual />
          </FeatureBlock>
        </div>
      </div>
    </section>
  )
}
