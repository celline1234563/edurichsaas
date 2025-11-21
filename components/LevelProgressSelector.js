'use client'

import { useState } from 'react'

/**
 * LevelProgressSelector 컴포넌트
 *
 * 레벨을 선택하면 해당 레벨의 상세 정보를 아래 탭에 표시하는 컴포넌트
 *
 * @param {Object} props
 * @param {Array} props.levels - 레벨 데이터 배열
 *   예: [{ level: 2, name: '기본 시스템 구축', range: '원생 10-30명', tasks: ['task1', 'task2'] }]
 * @param {number} props.defaultLevel - 기본 선택 레벨 (optional)
 */
export default function LevelProgressSelector({ levels, defaultLevel = null }) {
  const [selectedLevel, setSelectedLevel] = useState(defaultLevel)

  return (
    <div style={{ width: '100%', maxWidth: '100%', overflow: 'visible' }}>
      {/* 레벨 진행 그래프 */}
      <div style={{
        position: 'relative',
        padding: '30px 0 70px 0',
        marginBottom: '24px',
        height: '180px'
      }}>
        {/* 레벨 포인트들 */}
        <div style={{
          position: 'relative',
          height: '100%',
          width: '100%'
        }}>
          {/* 연결선 - 각 포인트를 정확히 지나가도록 계산 */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
              pointerEvents: 'none',
              overflow: 'visible'
            }}
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
                <stop offset="40%" style={{ stopColor: '#3b82f6', stopOpacity: 0.5 }} />
                <stop offset="70%" style={{ stopColor: '#3b82f6', stopOpacity: 0.7 }} />
                <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            {/* 각 레벨 포인트를 정확히 지나가는 곡선 */}
            <path
              d={(() => {
                const points = levels.map((_, index) => {
                  const progress = index / (levels.length - 1)
                  const x = progress * 96 + 2
                  const y = 100 - Math.pow(progress, 3.5) * 100
                  return { x, y }
                })

                // 부드러운 곡선을 위한 베지어 경로 생성
                let path = `M ${points[0].x} ${points[0].y}`
                for (let i = 0; i < points.length - 1; i++) {
                  const curr = points[i]
                  const next = points[i + 1]
                  const midX = (curr.x + next.x) / 2
                  path += ` Q ${midX} ${curr.y}, ${midX} ${(curr.y + next.y) / 2}`
                  path += ` Q ${midX} ${next.y}, ${next.x} ${next.y}`
                }
                return path
              })()}
              stroke="url(#lineGradient)"
              strokeWidth="0.8"
              fill="none"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {levels.map((levelData, index) => {
            const isSelected = selectedLevel === levelData.level
            const totalLevels = levels.length

            // 극단적 지수 성장 곡선 - SVG와 동일한 계산
            const progress = index / (totalLevels - 1)
            const heightPercent = Math.pow(progress, 3.5) * 100
            const bottomPosition = heightPercent

            return (
              <div
                key={levelData.level}
                style={{
                  position: 'absolute',
                  left: `${(index / (totalLevels - 1)) * 96 + 2}%`,
                  bottom: `${bottomPosition}%`,
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  zIndex: 2
                }}
                onClick={() => setSelectedLevel(levelData.level)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(-50%) scale(1)'
                }}
              >
                {/* 원 */}
                <div style={{
                  width: isSelected ? '48px' : '36px',
                  height: isSelected ? '48px' : '36px',
                  borderRadius: '50%',
                  background: isSelected
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    : 'rgba(59, 130, 246, 0.15)',
                  border: isSelected
                    ? '3px solid #3b82f6'
                    : '2px solid rgba(59, 130, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isSelected ? '16px' : '13px',
                  fontWeight: '700',
                  color: isSelected ? '#ffffff' : '#94a3b8',
                  transition: 'all 0.3s ease',
                  boxShadow: isSelected
                    ? '0 4px 12px rgba(59, 130, 246, 0.4)'
                    : 'none'
                }}>
                  {levelData.level}
                </div>

                {/* 레벨명 */}
                <div style={{
                  marginTop: '8px',
                  fontSize: '10px',
                  color: isSelected ? '#e2e8f0' : '#64748b',
                  fontWeight: isSelected ? '600' : '400',
                  textAlign: 'center',
                  whiteSpace: 'normal',
                  maxWidth: '70px',
                  lineHeight: '1.2',
                  transition: 'color 0.3s ease'
                }}>
                  {levelData.name}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 선택된 레벨 상세 정보 */}
      {selectedLevel && (
        <div style={{
          background: 'rgba(59, 130, 246, 0.05)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '12px',
          padding: '20px 24px',
          animation: 'fadeIn 0.3s ease'
        }}>
          {(() => {
            const currentLevel = levels.find(l => l.level === selectedLevel)
            if (!currentLevel) return null

            return (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid rgba(59, 130, 246, 0.15)'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff'
                  }}>
                    {currentLevel.level}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#e2e8f0',
                      marginBottom: '2px'
                    }}>
                      {currentLevel.name}
                    </h3>
                    <p style={{
                      fontSize: '12px',
                      color: '#94a3b8'
                    }}>
                      {currentLevel.range}
                    </p>
                  </div>
                </div>

                <div>
                  {/* 1, 7, 8 레벨은 설명 문장, 나머지는 필수 업무 리스트 */}
                  {[1, 7, 8].includes(currentLevel.level) ? (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      {currentLevel.tasks?.map((sentence, idx) => (
                        <p
                          key={idx}
                          style={{
                            fontSize: '13px',
                            color: '#cbd5e1',
                            lineHeight: '1.6',
                            margin: 0
                          }}
                        >
                          {sentence}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <>
                      <p style={{
                        fontSize: '12px',
                        color: '#94a3b8',
                        marginBottom: '10px',
                        fontWeight: '500'
                      }}>
                        *성장을 위해 가장 필수적인 업무
                      </p>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        {currentLevel.tasks?.map((task, idx) => (
                          <li
                            key={idx}
                            style={{
                              fontSize: '13px',
                              color: '#cbd5e1',
                              paddingLeft: '18px',
                              position: 'relative',
                              lineHeight: '1.5'
                            }}
                          >
                            <span style={{
                              position: 'absolute',
                              left: 0,
                              color: '#3b82f6'
                            }}>
                              •
                            </span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </>
            )
          })()}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
