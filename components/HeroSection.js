'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Sparkles, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const NeuralNetwork = dynamic(() => import('./NeuralNetwork'), { ssr: false })

export default function HeroSection() {
  const CONTENT_DELAY = 0.5

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      minHeight: '700px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: '#020617',
    }}>
      {/* === CSS Background Layers === */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {/* Gradient mesh */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 50% at 50% 50%, rgba(30,58,138,0.15) 0%, transparent 60%),
            radial-gradient(circle 600px at 20% 60%, rgba(59,130,246,0.08) 0%, transparent 50%),
            radial-gradient(circle 500px at 80% 30%, rgba(99,102,241,0.06) 0%, transparent 50%)
          `,
        }} />

        {/* Dot grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(148,163,184,0.12) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        {/* Floating orbs */}
        <div className="hero-orb-1" style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          top: '10%',
          left: '-5%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />
        <div className="hero-orb-2" style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          bottom: '5%',
          right: '-5%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />
        <div className="hero-orb-3" style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        {/* Subtle horizontal lines */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(0deg, transparent 49.5%, rgba(148,163,184,0.04) 50%, transparent 50.5%)',
          backgroundSize: '100% 80px',
        }} />

        {/* Top fade */}
        <div style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '160px',
          background: 'linear-gradient(to bottom, #020617, transparent)',
          pointerEvents: 'none',
        }} />
        {/* Bottom fade */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '160px',
          background: 'linear-gradient(to top, #020617, transparent)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* === Minimal Neural Network overlay === */}
      <NeuralNetwork />

      <div style={{
        position: 'relative',
        zIndex: 30,
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        textAlign: 'center',
      }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: CONTENT_DELAY, ease: 'easeOut' }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '9999px',
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            marginBottom: '28px',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)',
          }}
        >
          <Sparkles style={{ width: '16px', height: '16px', color: '#60a5fa' }} />
          <span style={{
            fontSize: '13px',
            fontWeight: '500',
            color: '#93c5fd',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            에듀리치브레인 내부 진입 중...
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: CONTENT_DELAY + 0.2, ease: 'easeOut' }}
          style={{
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            marginBottom: '28px',
            lineHeight: '1.1',
            textShadow: '0 4px 30px rgba(0,0,0,0.5)',
          }}
        >
          <span style={{ display: 'block', color: '#ffffff' }}>에듀리치브레인,</span>
          <span style={{
            display: 'block',
            fontSize: '0.55em',
            fontWeight: '600',
            lineHeight: '1.4',
            marginTop: '8px',
            background: 'linear-gradient(to right, #60a5fa, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>문제를 찾고, 전략을 실행하고,<br />학원을 성장시킵니다.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: CONTENT_DELAY + 0.4, ease: 'easeOut' }}
          style={{
            fontSize: 'clamp(18px, 2.2vw, 22px)',
            color: '#cbd5e1',
            maxWidth: '680px',
            margin: '0 auto 36px',
            lineHeight: '1.7',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            wordBreak: 'keep-all',
          }}
        >
          학원 부자, 경영 부자, 시간 부자 —{' '}
          <span style={{ color: '#ffffff', fontWeight: '500' }}>원장님의 학원의 주도권을 되찾아드리는</span>{' '}
          데이터 + AI 전략 비서
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: CONTENT_DELAY + 0.6, ease: 'easeOut' }}
          className="hero-buttons"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          <Link href="/diagnosis" style={{
            position: 'relative',
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            borderRadius: '9999px',
            fontWeight: '600',
            color: '#ffffff',
            fontSize: '16px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 40px rgba(37, 99, 235, 0.4)',
            transition: 'all 0.2s',
            overflow: 'hidden',
          }}>
            지금 진단 시작하기
            <Zap style={{ width: '16px', height: '16px', fill: '#ffffff' }} />
          </Link>

          <Link href="/demo" style={{
            padding: '16px 32px',
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(71, 85, 105, 1)',
            borderRadius: '9999px',
            fontWeight: '500',
            color: '#e2e8f0',
            fontSize: '16px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
          }}>
            라이브 데모 보기
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: CONTENT_DELAY + 1.5, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          zIndex: 30,
        }}
      >
        <div style={{
          width: '24px',
          height: '40px',
          border: '2px solid rgba(71, 85, 105, 1)',
          borderRadius: '9999px',
          padding: '4px',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{
              width: '6px',
              height: '6px',
              background: '#3b82f6',
              borderRadius: '50%',
            }}
          />
        </div>
      </motion.div>
    </section>
  )
}
