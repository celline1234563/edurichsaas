'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial, Float, Html, Sparkles, Line } from '@react-three/drei'
import * as THREE from 'three'

const DATA_NODES = [
  { text: '시험 성적 분석', pos: [-2, 1.5, 2] },
  { text: '이탈 위험 감지', pos: [2, -1, 3] },
  { text: '학습 보고서 생성', pos: [-3, -1.5, 0] },
  { text: '블로그 자동 포스팅', pos: [3, 2, 1] },
  { text: '맞춤형 코칭 전략', pos: [0, 3, -2] },
  { text: '학부모 상담 가이드', pos: [-3.9, 0.3, 0.5], labelOffset: [-0.6, 0.1, 0] },
  { text: '매출 예측 시뮬레이션', pos: [2.5, -2.5, -1] },
  { text: '강사 성과 분석', pos: [0, -3, 2] },
  { text: '출결 패턴 인식', pos: [-3.5, 2, -1] },
  { text: '마케팅 ROI 최적화', pos: [3, 0, -2] },
]

function DataNeuron({ position, text, labelOffset = [0.1, 0.1, 0] }) {
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#60a5fa" toneMapped={false} />
        </mesh>
        <mesh scale={[2.5, 2.5, 2.5]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.15} toneMapped={false} />
        </mesh>
        <Html position={labelOffset} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <div style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#0c1629',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              boxShadow: '0 0 12px rgba(59,130,246,0.15), 0 4px 16px rgba(0,0,0,0.6)',
            }}>
              <span style={{
                color: '#93c5fd',
                fontWeight: '700',
                fontSize: '11px',
                letterSpacing: '0.04em',
              }}>
                {text}
              </span>
            </div>
          </div>
        </Html>
      </group>
    </Float>
  )
}

function NeuralConnection({ start, end, mid }) {
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(start, mid, end), [start, mid, end])
  const points = useMemo(() => curve.getPoints(20), [curve])

  const colors = useMemo(() => {
    const colorStart = new THREE.Color('#60a5fa')
    const colorEnd = new THREE.Color('#818cf8')
    return new Array(points.length).fill(0).map((_, i) => {
      const t = i / (points.length - 1)
      return colorStart.clone().lerp(colorEnd, t)
    })
  }, [points])

  return (
    <Line
      points={points}
      color="white"
      vertexColors={colors}
      lineWidth={3}
      transparent
      opacity={0.4}
    />
  )
}

function SynapseNetwork() {
  const pts = useMemo(() => DATA_NODES.map(n => new THREE.Vector3(...n.pos)), [])

  const connections = useMemo(() => {
    const conns = []
    pts.forEach((start, i) => {
      const targets = [
        pts[(i + 1) % pts.length],
        pts[(i + 3) % pts.length],
        pts[(i + 5) % pts.length],
      ]
      targets.forEach((end) => {
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
        const dist = start.distanceTo(end)
        const center = new THREE.Vector3(0, 0, 0)
        const dir = new THREE.Vector3().subVectors(mid, center).normalize()
        dir.x += (Math.random() - 0.5) * 0.5
        dir.y += (Math.random() - 0.5) * 0.5
        dir.z += (Math.random() - 0.5) * 0.5
        mid.add(dir.normalize().multiplyScalar(dist * 0.3))
        conns.push({ start, end, mid })
      })
    })
    return conns
  }, [pts])

  return (
    <group>
      {connections.map((conn, i) => (
        <NeuralConnection key={i} start={conn.start} end={conn.end} mid={conn.mid} />
      ))}
    </group>
  )
}

function BrainMatter() {
  const count = 1500
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 18 * Math.cbrt(Math.random())
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  const ref = useRef(null)
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta / 80
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#475569" size={0.05} sizeAttenuation depthWrite={false} opacity={0.4} />
    </Points>
  )
}

function BrainCamera() {
  const { camera, size } = useThree()
  const isMobile = size.width < 768
  const targetZ = isMobile ? 14 : 7

  useFrame((state) => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.02)
    const x = state.pointer.x * 0.5
    const y = state.pointer.y * 0.5
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, x, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, y, 0.05)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function NeuralBrain() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      overflow: 'hidden',
      background: '#020617',
    }}>
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <Canvas
          camera={{ position: [0, 0, 18], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <fog attach="fog" args={['#020617', 5, 30]} />
          <group rotation={[0, 0, Math.PI / 12]}>
            <SynapseNetwork />
            {DATA_NODES.map((node, i) => (
              <DataNeuron
                key={i}
                position={node.pos}
                text={node.text}
                labelOffset={node.labelOffset}
              />
            ))}
          </group>
          <BrainMatter />
          <Sparkles count={50} scale={12} size={3} speed={0.4} opacity={0.5} color="#60a5fa" />
          <BrainCamera />
        </Canvas>
      </div>

      {/* Radial overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(2,6,23,0.2) 50%, rgba(2,6,23,0.9) 100%)',
        pointerEvents: 'none',
      }} />
      {/* Top fade */}
      <div style={{
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '128px',
        background: 'linear-gradient(to bottom, #020617, transparent)',
        pointerEvents: 'none',
      }} />
      {/* Bottom fade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '128px',
        background: 'linear-gradient(to top, #020617, transparent)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}
