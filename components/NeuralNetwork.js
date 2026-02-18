'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial, Line } from '@react-three/drei'
import * as THREE from 'three'

// Minimal node positions — 6 nodes, spread loosely
const NODES = [
  [-2.5, 1.8, 1],
  [2.2, -0.8, 2],
  [-1.5, -2, 0],
  [2.8, 2, -0.5],
  [0, 2.5, -1.5],
  [-0.5, -1, 2.5],
]

function GlowNode({ position }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color="#60a5fa" toneMapped={false} />
      </mesh>
      <mesh scale={[3, 3, 3]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.08} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Connection({ start, end }) {
  const mid = useMemo(() => {
    const m = new THREE.Vector3().addVectors(
      new THREE.Vector3(...start),
      new THREE.Vector3(...end)
    ).multiplyScalar(0.5)
    // Gentle outward curve
    const dir = m.clone().normalize()
    m.add(dir.multiplyScalar(0.6))
    return m
  }, [start, end])

  const curve = useMemo(
    () => new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      mid,
      new THREE.Vector3(...end)
    ),
    [start, mid, end]
  )
  const points = useMemo(() => curve.getPoints(16), [curve])

  return (
    <Line
      points={points}
      color="#60a5fa"
      lineWidth={1.5}
      transparent
      opacity={0.15}
    />
  )
}

function Network() {
  // Each node connects to 1-2 neighbors only
  const connections = useMemo(() => [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 5], [5, 2],
  ], [])

  const groupRef = useRef(null)
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta / 60
    }
  })

  return (
    <group ref={groupRef}>
      {NODES.map((pos, i) => (
        <GlowNode key={i} position={pos} />
      ))}
      {connections.map(([a, b], i) => (
        <Connection key={i} start={NODES[a]} end={NODES[b]} />
      ))}
    </group>
  )
}

function DustParticles() {
  const count = 300
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 14 * Math.cbrt(Math.random())
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
      ref.current.rotation.y -= delta / 100
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#475569" size={0.04} sizeAttenuation depthWrite={false} opacity={0.3} />
    </Points>
  )
}

function Camera() {
  const { camera, size } = useThree()
  const isMobile = size.width < 768
  const targetZ = isMobile ? 12 : 8

  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.02)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function NeuralNetwork() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 1,
      pointerEvents: 'none',
      opacity: 0.6,
    }}>
      <Canvas
        camera={{ position: [0, 0, 16], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <fog attach="fog" args={['#020617', 6, 24]} />
        <Network />
        <DustParticles />
        <Camera />
      </Canvas>
    </div>
  )
}
