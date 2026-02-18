'use client'

import { motion } from 'framer-motion'
import { Check, X, User } from 'lucide-react'

export default function ComparisonSection() {
  return (
    <section style={{
      padding: '80px 0',
      background: '#020617',
      borderTop: '1px solid rgba(15,23,42,1)',
    }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '32px',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Competitor Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{
              flex: '1 1 400px',
              maxWidth: '560px',
              padding: '32px',
              borderRadius: '16px',
              border: '1px solid rgba(30,41,59,1)',
              background: 'rgba(15,23,42,0.3)',
              opacity: 0.7,
              transition: 'all 0.5s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ padding: '8px', background: '#1e293b', borderRadius: '8px' }}>
                <User style={{ width: '24px', height: '24px', color: '#94a3b8' }} />
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#94a3b8' }}>
                일반 행정 직원 / 기존 방식
              </h3>
            </div>
            <p style={{
              color: '#64748b',
              marginBottom: '32px',
              minHeight: '48px',
              wordBreak: 'keep-all',
            }}>
              데이터를 정리하고 엑셀로 보고하지만, 결국 전략적 판단은 원장님의 몫입니다.
            </p>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { ok: true, text: '단순 데이터 정리 가능' },
                { ok: true, text: '기본적인 문서 작성' },
                { ok: false, text: '전문적 경영 분석 부재' },
                { ok: false, text: '전략 실행을 위한 구체적 가이드 부재' },
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#94a3b8' }}>
                  {item.ok
                    ? <Check style={{ width: '20px', height: '20px', color: '#475569' }} />
                    : <X style={{ width: '20px', height: '20px', color: '#ef4444' }} />
                  }
                  {item.text}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* EduRichBrain Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{
              flex: '1 1 400px',
              maxWidth: '560px',
              padding: '32px',
              borderRadius: '16px',
              border: '1px solid rgba(59,130,246,0.3)',
              background: 'linear-gradient(to bottom, rgba(15,23,42,1), rgba(30,58,138,0.1))',
              boxShadow: '0 0 50px rgba(37,99,235,0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Glow */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '128px',
              height: '128px',
              background: 'rgba(59,130,246,0.2)',
              filter: 'blur(48px)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }} />

            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
              에듀리치브레인 (AI)
            </h3>
            <p style={{
              color: '#bfdbfe',
              marginBottom: '32px',
              minHeight: '48px',
              wordBreak: 'keep-all',
            }}>
              데이터를 연결하고, 진단하고, 코칭하고, 실행합니다. 스스로 생각하는 능동적인 파트너.
            </p>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { text: '완전한 온톨로지 데이터 연결', highlight: false },
                { text: '자동화된 정밀 AI 진단', highlight: true },
                { text: '개인화된 맞춤 코칭 제공', highlight: false },
                { text: '원클릭 전략 자동 실행', highlight: true },
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ffffff' }}>
                  <div style={{
                    padding: '4px',
                    background: 'rgba(59,130,246,0.2)',
                    borderRadius: '50%',
                  }}>
                    <Check style={{ width: '16px', height: '16px', color: '#60a5fa' }} />
                  </div>
                  <span style={{
                    fontWeight: item.highlight ? '600' : '400',
                    color: item.highlight ? '#dbeafe' : '#ffffff',
                  }}>{item.text}</span>
                </li>
              ))}
            </ul>

            <button style={{
              marginTop: '32px',
              width: '100%',
              padding: '12px 0',
              background: '#ffffff',
              color: '#1e3a5f',
              fontWeight: '700',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}>
              지금 도입 문의하기
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
