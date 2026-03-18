'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import useIsMobile from '@/hooks/useIsMobile';

/* ── Scroll-reveal wrapper ─────────────────────────────── */
function Reveal({ children, delay = 0, y = 60 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Horizontal rule with fade ─────────────────────────── */
function Divider({ isMobile }) {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: isMobile ? '0 24px' : '0 40px',
    }}>
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
      }} />
    </div>
  );
}

/* ── Shared styles ─────────────────────────────────────── */
const bodyText = (isMobile) => ({
  fontSize: isMobile ? '15px' : '17px',
  color: 'rgba(255,255,255,0.5)',
  lineHeight: 1.85,
  fontWeight: '300',
  margin: 0,
});

const sectionLabel = (isMobile) => ({
  fontSize: isMobile ? '11px' : '12px',
  color: '#3b82f6',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  marginBottom: '20px',
  fontWeight: '500',
});

const sectionTitle = (isMobile) => ({
  fontSize: isMobile ? '28px' : '44px',
  fontWeight: '300',
  color: 'white',
  lineHeight: 1.2,
  letterSpacing: '-0.03em',
  marginBottom: isMobile ? '32px' : '48px',
});

const highlight = {
  color: 'rgba(255,255,255,0.85)',
  fontWeight: '500',
};

export default function AboutPage() {
  const isMobile = useIsMobile();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const sectionPad = isMobile ? '80px 24px' : '120px 40px';

  return (
    <div style={{ background: '#020617', minHeight: '100vh', overflow: 'hidden' }}>

      {/* ═══════════════ HERO ═══════════════ */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div style={{
          position: 'relative',
          minHeight: isMobile ? '85vh' : '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: isMobile ? '120px 24px 80px' : '0 40px',
          overflow: 'hidden',
        }}>
          {/* Background glow */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: isMobile ? '400px' : '800px',
            height: isMobile ? '400px' : '800px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative',
              zIndex: 1,
              fontSize: isMobile ? '34px' : '60px',
              fontWeight: '300',
              color: 'white',
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              maxWidth: '760px',
              margin: '0 auto',
              marginBottom: isMobile ? '20px' : '28px',
            }}
          >
            학원 현장을 아는 AI.
            <br /><span style={{ fontWeight: '600' }}>그게 다릅니다.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: '520px',
              margin: '0 auto',
            }}
          >
            <p style={{
              fontSize: isMobile ? '16px' : '18px',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.8,
              fontWeight: '300',
            }}>
              750곳의 학원에서 직접 배운 것들이
              <br />코드 안에 들어가 있습니다.
            </p>
          </motion.div>

          {/* Scroll indicator */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              style={{
                position: 'absolute',
                bottom: '48px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: '1px',
                  height: '48px',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.2), transparent)',
                }}
              />
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* ═══════════════ 우리가 하는 일 ═══════════════ */}
      <section style={{ padding: sectionPad }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <Reveal>
            <div style={sectionLabel(isMobile)}>
              우리가 하는 일
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 style={sectionTitle(isMobile)}>
              원장님은 수업만 하면 됩니다.
              <br /><span style={{ fontWeight: '600' }}>나머지는 브레인이 합니다.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p style={{
              ...bodyText(isMobile),
              marginBottom: isMobile ? '36px' : '48px',
            }}>
              학원을 운영하면 불안한 순간이 있습니다.
            </p>
          </Reveal>

          {/* Pain points — stacked lines */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '12px' : '16px',
            marginBottom: isMobile ? '36px' : '48px',
            paddingLeft: isMobile ? '16px' : '24px',
            borderLeft: '2px solid rgba(59,130,246,0.15)',
          }}>
            {[
              '콜백을 깜빡했습니다.',
              '결석한 학생을 놓쳤습니다.',
              '중간고사가 코앞인데 준비를 못 했습니다.',
              '강사가 뭔가 이상한데 확인할 방법이 없습니다.',
            ].map((line, i) => (
              <Reveal key={i} delay={0.15 + i * 0.06}>
                <p style={{
                  ...bodyText(isMobile),
                  color: 'rgba(255,255,255,0.55)',
                }}>
                  {line}
                </p>
              </Reveal>
            ))}
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '24px' : '28px',
            marginBottom: isMobile ? '36px' : '48px',
          }}>
            <Reveal delay={0.4}>
              <p style={bodyText(isMobile)}>
                작지만, 놓치면 학생이 빠집니다.
                <br />알고 있어도, 정신없으면 놓칩니다.
                <br />느낌은 오지만, 데이터가 없으면 확인을 못 합니다.
              </p>
            </Reveal>

            <Reveal delay={0.45}>
              <p style={{
                ...bodyText(isMobile),
                color: 'rgba(255,255,255,0.7)',
              }}>
                <span style={highlight}>브레인은 이걸 대신합니다.</span>
              </p>
            </Reveal>

            <Reveal delay={0.5}>
              <p style={bodyText(isMobile)}>
                놓친 걸 잡아주고,
                <br />시기를 미리 알려주고,
                <br />터지기 전에 징후를 보여줍니다.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <Divider isMobile={isMobile} />

      {/* ═══════════════ 왜 우리인가 ═══════════════ */}
      <section style={{ padding: sectionPad }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <Reveal>
            <div style={sectionLabel(isMobile)}>
              왜 우리인가
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 style={{
              ...sectionTitle(isMobile),
              marginBottom: isMobile ? '24px' : '36px',
            }}>
              GPT한테 물으면
              <br />"마케팅을 강화하세요"가 나옵니다.
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p style={{
              ...bodyText(isMobile),
              marginBottom: isMobile ? '32px' : '44px',
            }}>
              <span style={highlight}>브레인한테 물으면 이렇게 나옵니다.</span>
            </p>
          </Reveal>

          {/* Chat-style quote block */}
          <Reveal delay={0.2}>
            <div style={{
              position: 'relative',
              padding: isMobile ? '28px 24px' : '36px 32px',
              borderRadius: '16px',
              background: 'rgba(59,130,246,0.04)',
              border: '1px solid rgba(59,130,246,0.12)',
              marginBottom: isMobile ? '36px' : '48px',
            }}>
              {/* Small "Brain" label */}
              <div style={{
                fontSize: '11px',
                color: '#3b82f6',
                fontWeight: '600',
                letterSpacing: '0.05em',
                marginBottom: '16px',
              }}>
                BRAIN
              </div>
              <p style={{
                fontSize: isMobile ? '15px' : '17px',
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.85,
                fontWeight: '300',
                margin: 0,
              }}>
                "중간고사 2주 전입니다.
                <br />내신분석 콘텐츠 올리면
                <br />비슷한 규모 학원은 상담이 3건 더 들어왔습니다.
                <br /><span style={{ color: '#60a5fa' }}>올리시겠어요?"</span>
              </p>
            </div>
          </Reveal>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '24px' : '28px',
          }}>
            <Reveal delay={0.25}>
              <p style={bodyText(isMobile)}>
                차이가 뭐냐면,
                <br /><span style={highlight}>750곳의 학원 운영 데이터</span>가 들어가 있기 때문입니다.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p style={bodyText(isMobile)}>
                언제 어떤 콘텐츠를 만들어야 하는지.
                <br />어떤 규모의 학원이 어떤 시기에 뭘 해야 하는지.
                <br />학부모가 진짜 반응하는 게 뭔지.
              </p>
            </Reveal>

            <Reveal delay={0.35}>
              <p style={{
                ...bodyText(isMobile),
                color: 'rgba(255,255,255,0.7)',
              }}>
                일반론이 아니라, <span style={highlight}>현장</span>입니다.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <Divider isMobile={isMobile} />

      {/* ═══════════════ 원칙 ═══════════════ */}
      <section style={{ padding: isMobile ? '80px 24px 60px' : '120px 40px 80px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <Reveal>
            <div style={sectionLabel(isMobile)}>
              원칙
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 style={sectionTitle(isMobile)}>
              기능은
              <br /><span style={{ fontWeight: '600' }}>단순해야 합니다.</span>
            </h2>
          </Reveal>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '24px' : '28px',
            marginBottom: isMobile ? '40px' : '56px',
          }}>
            <Reveal delay={0.15}>
              <p style={bodyText(isMobile)}>
                원장님은 바쁩니다.
                <br />실장님도 바쁩니다.
                <br />강사님은 더 바쁩니다.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <p style={bodyText(isMobile)}>
                새로운 툴을 안 쓰는 게 아니라
                <br /><span style={highlight}>쓸 여유가 없는 겁니다.</span>
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <p style={bodyText(isMobile)}>
                그래서 브레인은 이렇게 만들었습니다.
              </p>
            </Reveal>
          </div>

          {/* Feature highlight box */}
          <Reveal delay={0.3}>
            <div style={{
              position: 'relative',
              padding: isMobile ? '36px 24px' : '48px 40px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              textAlign: 'center',
              marginBottom: isMobile ? '48px' : '64px',
            }}>
              <p style={{
                fontSize: isMobile ? '18px' : '22px',
                fontWeight: '400',
                color: 'white',
                lineHeight: 1.6,
                margin: 0,
                letterSpacing: '-0.01em',
              }}>
                강사는 <span style={{ fontWeight: '600', color: '#60a5fa' }}>녹음 버튼 하나</span>만 누르면 됩니다.
              </p>
              <p style={{
                fontSize: isMobile ? '14px' : '15px',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.8,
                margin: 0,
                marginTop: '16px',
                fontWeight: '300',
              }}>
                수업일지, 학습 보고서, 학부모 리포트.
                <br />나머지는 자동입니다.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bottom spacer for footer */}
      <div style={{ height: isMobile ? '40px' : '60px' }} />
    </div>
  );
}
