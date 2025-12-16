'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { supabase } from '@/lib/supabase'
import LevelProgressSelector from '@/components/LevelProgressSelector'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

export default function DiagnosisPage() {
  const router = useRouter()

  // 스텝 관리: intro, input, test, result
  const [step, setStep] = useState('intro')
  const [selectedLevel, setSelectedLevel] = useState(null)

  // 입력 데이터
  const [studentCount, setStudentCount] = useState('')
  const [staffCount, setStaffCount] = useState('')

  // 테스트 데이터
  const [assessmentId, setAssessmentId] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})

  // 결과 데이터
  const [result, setResult] = useState(null)
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSignupPrompt, setShowSignupPrompt] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 사용자 로그인 상태 확인
  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setIsLoggedIn(!!user)
  }

  // Intro 화면
  const IntroScreen = () => (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 20px' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(37, 99, 235, 0.04))',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '12px',
        padding: '32px 28px',
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '600',
          marginBottom: '12px',
          color: '#e2e8f0',
          lineHeight: '1.3'
        }}>
          우리 학원은 지금 어느 단계일까요?
        </h1>

        <p style={{
          fontSize: '15px',
          color: '#94a3b8',
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          실제 발로 뛰며 알게된 학원 경영의 비밀
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {[
            { title: '커리큘럼', desc: '학습 관리 체계' },
            { title: '시스템', desc: '운영 효율성' },
            { title: '마케팅', desc: '홍보 & 브랜딩' }
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(15, 23, 42, 0.4)',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              borderRadius: '8px',
              padding: '14px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#e2e8f0' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '11px', color: '#64748b' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            // edurichbrain 레벨테스트로 바로 이동
            window.open('https://edurichbrain.ai.kr/diagnosis', '_blank')
          }}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
          }}
        >
          무료로 5분 진단 시작하기
        </button>

        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '10px', textAlign: 'center' }}>
          66개 질문 • 소요시간 약 5분
        </p>
      </div>

      {/* 영상 섹션 - 컴팩트 */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.3)',
        border: '1px solid rgba(59, 130, 246, 0.15)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '14px',
          color: '#e2e8f0'
        }}>
          레벨테스트 소개 영상
        </h2>
        <div style={{
          aspectRatio: '16/9',
          maxHeight: '280px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed rgba(59, 130, 246, 0.2)'
        }}>
          <div style={{ textAlign: 'center', color: '#64748b' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>▶</div>
            <p style={{ fontSize: '13px' }}>실제 촬영 영상 영역</p>
          </div>
        </div>
      </div>

      {/* 레벨별 설명 - 새 컴포넌트 사용 */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '16px',
          color: '#e2e8f0'
        }}>
          단계별로 이런 업무를 자세하게 가이드 해드립니다
        </h2>

        <LevelProgressSelector
          levels={[
            {
              level: 1,
              name: '과외/1인원장 시작',
              range: '원생 1-10명',
              tasks: [
                '처음 학원을 시작하거나 과외로 운영 중인 단계입니다.',
                '아직 체계적인 시스템 없이 원장님 혼자 모든 것을 관리하고 있습니다.'
              ]
            },
            {
              level: 2,
              name: '기본 시스템 구축',
              range: '원생 10-30명',
              tasks: [
                '학생 진도 관리 시트 만들기',
                '네이버 플레이스 등록하기',
                '월별 수업 계획표 작성'
              ]
            },
            {
              level: 3,
              name: '전문화 시작',
              range: '원생 30-50명',
              tasks: [
                '자체교재 1종 개발하기',
                '인스타그램 계정 운영 시작',
                '성적대별 반 편성 시스템 구축'
              ]
            },
            {
              level: 4,
              name: '시스템화',
              range: '원생 50-100명',
              tasks: [
                'CRM 시스템 도입하기',
                '대표 학교 3곳 확보하기',
                '레벨별 커리큘럼 3단계 이상 구축'
              ]
            },
            {
              level: 5,
              name: '조직화',
              range: '원생 100-200명',
              tasks: [
                '레벨테스트 입소문 만들기',
                '100명 설명회 2회 개최',
                '파워 실무자 육성 시스템 구축'
              ]
            },
            {
              level: 6,
              name: '확장',
              range: '원생 200+명',
              tasks: [
                '2호점 오픈 준비하기',
                '입시 컨텐츠를 프로그램과 연계',
                '지역 브랜드 구축 전략 실행'
              ]
            },
            {
              level: 7,
              name: '전국 브랜드화 시작',
              range: '3개 지점 이상',
              tasks: [
                '여러 지점을 운영하며 지역을 넘어 전국적인 브랜드 구축을 시작합니다.',
                '표준화된 시스템과 프로세스로 각 지점이 독립적으로 운영됩니다.'
              ]
            },
            {
              level: 8,
              name: '상장/매각 등 대기업화',
              range: '10개 지점 이상',
              tasks: [
                '기업공개(IPO)나 M&A를 준비하는 단계로 조직이 완전히 체계화되었습니다.',
                '원장님은 경영자로서 전략과 비전에 집중하며 실무는 전문 경영진이 담당합니다.'
              ]
            }
          ]}
          defaultLevel={null}
        />
      </div>

      {/* 실제 사용자 후기 - 심플 */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.3)',
        border: '1px solid rgba(59, 130, 246, 0.15)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '16px',
          color: '#e2e8f0'
        }}>
          실제 원장님들의 후기
        </h2>

        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            {
              name: '김** 원장님',
              academy: '서울 강남구 학원',
              before: 'Level 3',
              after: 'Level 4',
              review: '마케팅 부분이 병목이라는 걸 처음 알았어요. 조언대로 SNS를 시작했더니 3개월 만에 원생 15명이 늘었습니다!'
            },
            {
              name: '이** 원장님',
              academy: '경기 분당구 교습소',
              before: 'Level 2',
              after: 'Level 3',
              review: '시스템이 없다는 게 가장 큰 문제였어요. CRM 도입하고 체계를 잡으니 학부모 만족도가 확 올랐습니다.'
            },
            {
              name: '박** 원장님',
              academy: '부산 해운대구 학원',
              before: 'Level 4',
              after: 'Level 5',
              review: '레벨테스트 결과를 토대로 커리큘럼을 재정비했습니다. 특히 자체교재 비중을 50%까지 올린 게 큰 변화였어요.'
            }
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              padding: '14px',
              border: '1px solid rgba(59, 130, 246, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#e2e8f0', marginBottom: '2px' }}>
                    {item.name}
                  </h4>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>{item.academy}</p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  <span style={{ color: '#f59e0b' }}>{item.before}</span>
                  <span style={{ color: '#64748b' }}>→</span>
                  <span style={{ color: '#10b981' }}>{item.after}</span>
                </div>
              </div>

              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                "{item.review}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Input 화면
  const InputScreen = () => {
    const handleStart = () => {
      if (!studentCount || !staffCount) {
        alert('원생 수와 직원 수를 모두 입력해주세요.')
        return
      }

      // edurichbrain으로 리디렉션 (실제 레벨테스트는 edurichbrain에서 진행)
      const params = new URLSearchParams({
        student_count: studentCount,
        staff_count: staffCount
      })

      // 새 탭에서 edurichbrain 레벨테스트 열기
      window.open(`https://app.edurichbrain.com/diagnosis?${params.toString()}`, '_blank')

      // 또는 현재 페이지에서 이동하려면:
      // window.location.href = `https://app.edurichbrain.com/diagnosis?${params.toString()}`
    }

    return (
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '24px 20px' }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.3)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '12px',
          padding: '28px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '10px',
            color: '#e2e8f0'
          }}>
            기본 정보 입력
          </h2>
          <p style={{
            fontSize: '13px',
            color: '#94a3b8',
            marginBottom: '24px'
          }}>
            정확한 진단을 위해 현재 학원 현황을 알려주세요
          </p>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              padding: '10px',
              marginBottom: '20px',
              color: '#fca5a5',
              fontSize: '12px'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '6px',
              color: '#e2e8f0'
            }}>
              현재 원생 수
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={studentCount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                setStudentCount(value)
              }}
              placeholder="대략적인 인원을 입력해주세요 (예: 50)"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#e2e8f0',
                fontSize: '14px'
              }}
            />
            <p style={{
              fontSize: '11px',
              color: '#64748b',
              marginTop: '6px'
            }}>
              * 정확한 인원이 아니어도 괜찮습니다. 대략 몇 명대인지만 알려주세요.
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '6px',
              color: '#e2e8f0'
            }}>
              직원 수 (원장님 포함)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={staffCount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                setStaffCount(value)
              }}
              placeholder="예: 3"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#e2e8f0',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setStep('intro')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                background: 'transparent',
                color: '#94a3b8',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              이전
            </button>
            <button
              onClick={handleStart}
              disabled={!studentCount || !staffCount}
              style={{
                flex: 2,
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                background: (!studentCount || !staffCount) ? '#64748b' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: (!studentCount || !staffCount) ? 'not-allowed' : 'pointer',
                opacity: (!studentCount || !staffCount) ? 0.5 : 1
              }}
            >
              테스트 시작
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Test 화면
  const TestScreen = () => {
    if (questions.length === 0) {
      return <div style={{ textAlign: 'center', padding: '100px', color: '#94a3b8' }}>질문을 불러오는 중...</div>
    }

    const currentQuestion = questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100

    const handleAnswer = async (answer) => {
      try {
        await fetch(`/api/level-test/${assessmentId}/answer`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question_id: currentQuestion.id,
            answer: answer
          })
        })

        setAnswers(prev => ({
          ...prev,
          [currentQuestion.id]: answer
        }))

        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1)
        } else {
          handleComplete()
        }
      } catch (err) {
        console.error('Answer error:', err)
        alert('답변 저장 중 오류가 발생했습니다.')
      }
    }

    const handleComplete = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/level-test/${assessmentId}/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assessment_id: assessmentId })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || '결과 처리 중 오류가 발생했습니다.')
        }

        setResult(data.result)
        setStep('result')

        if (!isLoggedIn) {
          setTimeout(() => {
            setShowSignupPrompt(true)
          }, 1000)
        }
      } catch (err) {
        console.error('Complete error:', err)
        alert(err.message)
      } finally {
        setLoading(false)
      }
    }

    const handlePrevious = () => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1)
      }
    }

    const getCategoryColor = (category) => {
      switch (category) {
        case 'curriculum': return '#10b981'
        case 'system': return '#8b5cf6'
        case 'marketing': return '#f59e0b'
        default: return '#3b82f6'
      }
    }

    const getCategoryName = (category) => {
      switch (category) {
        case 'curriculum': return '커리큘럼'
        case 'system': return '시스템'
        case 'marketing': return '마케팅'
        default: return ''
      }
    }

    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '24px 20px' }}>
        {/* 진행률 바 */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>
              질문 {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '600' }}>
              {Math.round(progress)}% 완료
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
              transition: 'width 0.3s',
              borderRadius: '999px'
            }} />
          </div>
        </div>

        {/* 질문 카드 */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.3)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '12px',
          padding: '28px',
          marginBottom: '16px'
        }}>
          {/* 카테고리 뱃지 */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '600',
              background: `${getCategoryColor(currentQuestion.category)}20`,
              color: getCategoryColor(currentQuestion.category),
              border: `1px solid ${getCategoryColor(currentQuestion.category)}40`
            }}>
              {getCategoryName(currentQuestion.category)}
            </span>
          </div>

          {/* 질문 */}
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            lineHeight: '1.4',
            color: '#e2e8f0',
            marginBottom: '24px'
          }}>
            {currentQuestion.question_text}
          </h2>

          {/* O/X 버튼 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              onClick={() => handleAnswer(true)}
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '2px solid #10b981',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(16, 185, 129, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(16, 185, 129, 0.1)'
              }}
            >
              예
            </button>
            <button
              onClick={() => handleAnswer(false)}
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '2px solid #ef4444',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.1)'
              }}
            >
              아니오
            </button>
          </div>
        </div>

        {/* 이전 버튼 */}
        {currentQuestionIndex > 0 && (
          <button
            onClick={handlePrevious}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              background: 'transparent',
              color: '#94a3b8',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'block',
              margin: '0 auto'
            }}
          >
            ← 이전 질문
          </button>
        )}

        {loading && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(59, 130, 246, 0.2)',
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
                margin: '0 auto 12px',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ color: '#e2e8f0', fontSize: '14px' }}>결과를 분석하는 중...</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Result 화면
  const ResultScreen = () => {
    if (!result) {
      return <div style={{ textAlign: 'center', padding: '100px', color: '#94a3b8' }}>결과를 불러오는 중...</div>
    }

    const getLevelName = (level) => {
      const names = {
        2: '기본 시스템 구축',
        3: '전문화 시작',
        4: '시스템화',
        5: '조직화',
        6: '확장'
      }
      return names[level] || ''
    }

    const getLevelColor = (level) => {
      const colors = {
        2: '#10b981',
        3: '#3b82f6',
        4: '#8b5cf6',
        5: '#f59e0b',
        6: '#ef4444'
      }
      return colors[level] || '#3b82f6'
    }

    const getCategoryNameKo = (category) => {
      const names = {
        curriculum: '커리큘럼',
        system: '시스템',
        marketing: '마케팅'
      }
      return names[category] || category
    }

    // 레이더 차트 데이터
    const chartData = {
      labels: ['커리큘럼', '시스템', '마케팅'],
      datasets: [{
        label: '현재 점수',
        data: [
          result.category_scores?.curriculum || 0,
          result.category_scores?.system || 0,
          result.category_scores?.marketing || 0
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)'
      }]
    }

    const chartOptions = {
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20,
            color: '#64748b'
          },
          grid: {
            color: 'rgba(59, 130, 246, 0.1)'
          },
          pointLabels: {
            color: '#e2e8f0',
            font: {
              size: 12
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }

    const isBlurred = !isLoggedIn && showSignupPrompt

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 20px', position: 'relative' }}>
        {/* 비회원 블러 처리 + 회원가입 모달 */}
        {isBlurred && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '420px',
              textAlign: 'center'
            }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#e2e8f0'
              }}>
                진단이 완료되었습니다
              </h2>

              <p style={{
                fontSize: '14px',
                color: '#94a3b8',
                marginBottom: '24px',
                lineHeight: '1.5'
              }}>
                상세한 결과와 맞춤 액션 플랜을 확인하려면<br />
                회원가입이 필요합니다.
              </p>

              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                <p style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '10px', fontWeight: '600' }}>
                  회원가입 후 확인 가능:
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    '정확한 레벨 및 카테고리별 점수',
                    '레이더 차트로 한눈에 보는 균형도',
                    '병목 지점 상세 분석',
                    '다음 레벨로 가는 액션 플랜',
                    '히스토리 추적 및 개선 추이'
                  ].map((text, i) => (
                    <li key={i} style={{
                      fontSize: '12px',
                      color: '#94a3b8',
                      marginBottom: '6px',
                      paddingLeft: '16px',
                      position: 'relative'
                    }}>
                      <span style={{ position: 'absolute', left: 0, color: '#3b82f6' }}>•</span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => router.push('/signup/role')}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '10px'
                }}
              >
                회원가입하고 결과 확인하기
              </button>

              <button
                onClick={() => setShowSignupPrompt(false)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  background: 'transparent',
                  color: '#94a3b8',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                미리보기 (제한됨)
              </button>
            </div>
          </div>
        )}

        {/* 실제 결과 화면 */}
        <div style={{ filter: isBlurred ? 'blur(8px)' : 'none', pointerEvents: isBlurred ? 'none' : 'auto' }}>
          {/* 레벨 표시 */}
          <div style={{
            background: `linear-gradient(135deg, ${getLevelColor(result.effective_level)}15, ${getLevelColor(result.effective_level)}08)`,
            border: `2px solid ${getLevelColor(result.effective_level)}`,
            borderRadius: '12px',
            padding: '28px',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <div style={{
              fontSize: '48px',
              fontWeight: '700',
              color: getLevelColor(result.effective_level),
              marginBottom: '6px'
            }}>
              Level {result.effective_level}
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#e2e8f0'
            }}>
              {getLevelName(result.effective_level)}
            </div>
          </div>

          {/* 카테고리별 점수 & 레이더 차트 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>
            {/* 카테고리별 진행바 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.3)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', color: '#e2e8f0' }}>
                카테고리별 완성도
              </h3>

              {['curriculum', 'system', 'marketing'].map((category) => {
                const score = result.category_scores?.[category] || 0
                const color = category === 'curriculum' ? '#10b981' : category === 'system' ? '#8b5cf6' : '#f59e0b'

                return (
                  <div key={category} style={{ marginBottom: '14px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '6px'
                    }}>
                      <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '600' }}>
                        {getCategoryNameKo(category)}
                      </span>
                      <span style={{ fontSize: '12px', color: color, fontWeight: '600' }}>
                        {score}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '999px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${score}%`,
                        height: '100%',
                        background: color,
                        borderRadius: '999px',
                        transition: 'width 0.5s'
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 레이더 차트 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.3)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', color: '#e2e8f0' }}>
                균형도 분석
              </h3>
              <div style={{ maxWidth: '280px', margin: '0 auto' }}>
                <Radar data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* 강점 & 병목 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: result.strengths?.length > 0 ? 'repeat(2, 1fr)' : '1fr',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {result.strengths?.length > 0 && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '18px'
              }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#10b981' }}>
                  강점
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {result.strengths.map((s, i) => (
                    <li key={i} style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>
                      <span style={{ color: '#10b981', marginRight: '6px' }}>•</span>
                      {getCategoryNameKo(s)} 체계화 우수
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              padding: '18px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#f59e0b' }}>
                집중 영역
              </h3>
              <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
                <span style={{ color: '#f59e0b', fontWeight: '600' }}>
                  {getCategoryNameKo(result.bottleneck)}
                </span> 부분을 보강하면 다음 레벨로 성장할 수 있습니다
              </p>
            </div>
          </div>

          {/* 액션 플랜 */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.3)',
            border: '2px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h2 style={{
              fontSize: '17px',
              fontWeight: '600',
              marginBottom: '18px',
              color: '#e2e8f0'
            }}>
              Level {result.effective_level + 1}로 가는 액션 플랜
            </h2>

            {result.next_actions && result.next_actions.length > 0 ? (
              <div style={{ display: 'grid', gap: '14px' }}>
                {result.next_actions.map((action, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(59, 130, 246, 0.08)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '8px',
                    padding: '16px',
                    borderLeft: '3px solid #3b82f6'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        background: '#3b82f6',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'white',
                        flexShrink: 0
                      }}>
                        {action.priority}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0', margin: 0 }}>
                            {action.title}
                          </h3>
                          {action.time && (
                            <span style={{
                              fontSize: '10px',
                              color: '#64748b',
                              background: 'rgba(59, 130, 246, 0.15)',
                              padding: '2px 6px',
                              borderRadius: '3px'
                            }}>
                              {action.time}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', lineHeight: '1.5' }}>
                          {action.description}
                        </p>
                        {action.link && (
                          <Link
                            href={action.link}
                            style={{
                              display: 'inline-block',
                              fontSize: '12px',
                              color: '#3b82f6',
                              textDecoration: 'none',
                              fontWeight: '600'
                            }}
                          >
                            바로 시작하기 →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                축하합니다! 현재 레벨에서 할 수 있는 모든 것을 갖추셨습니다.
              </p>
            )}
          </div>

          {/* CTA */}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '12px 32px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              대시보드에서 실행하기
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 메인 렌더
  return (
    <>
      {step === 'intro' ? (
        // Intro 화면은 사이드바 있음
        <div className="app-layout">
          {/* Left Sidebar Navigation */}
          <aside className="sidebar">
            <Link href="/" className="sidebar-logo">
              EduRichBrain
            </Link>

            <nav className="sidebar-nav">
              <Link href="/" className="sidebar-link">제품</Link>
              <Link href="/pricing" className="sidebar-link">요금제</Link>
              <Link href="/diagnosis" className="sidebar-link active">경영진단</Link>
              <Link href="/blog" className="sidebar-link">블로그</Link>
              <Link href="/about" className="sidebar-link">회사</Link>
              <Link href="/demo" className="sidebar-link">데모</Link>
            </nav>

            <div className="sidebar-footer">
              <button className="sidebar-icon-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="main-area">
            <div style={{
              minHeight: '100vh',
              color: '#e2e8f0',
              paddingTop: '60px'
            }}>
              <IntroScreen />
            </div>
          </div>
        </div>
      ) : (
        // Input 이후 화면은 사이드바 없음
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 50%, #1a1f3a 100%)',
          color: '#e2e8f0',
          paddingTop: '60px'
        }}>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>

          {step === 'input' && <InputScreen />}
          {step === 'test' && <TestScreen />}
          {step === 'result' && <ResultScreen />}
        </div>
      )}
    </>
  )
}
