'use client'

import useIsMobile from '@/hooks/useIsMobile'
import { BRAIN_BASE_URL } from '@/lib/constants'
import LevelProgressSelector from '@/components/LevelProgressSelector'

export default function DiagnosisPage() {
  const isMobile = useIsMobile()

  return (
    <div className="app-layout">
      {/* Main Content Area */}
      <div className="main-area" style={{ paddingTop: '64px' }}>
        <div style={{
          minHeight: '100vh',
          color: '#e2e8f0'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: isMobile ? '16px 16px' : '24px 20px' }}>
            {/* Hero Section */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(37, 99, 235, 0.04))',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: isMobile ? '10px' : '12px',
              padding: isMobile ? '20px 16px' : '32px 28px',
              marginBottom: isMobile ? '20px' : '32px'
            }}>
              <h1 style={{
                fontSize: isMobile ? '20px' : '28px',
                fontWeight: '600',
                marginBottom: isMobile ? '8px' : '12px',
                color: '#e2e8f0',
                lineHeight: '1.3'
              }}>
                우리 학원은 지금 어느 단계일까요?
              </h1>

              <p style={{
                fontSize: isMobile ? '13px' : '15px',
                color: '#94a3b8',
                marginBottom: isMobile ? '16px' : '24px',
                lineHeight: '1.5'
              }}>
                실제 발로 뛰며 알게된 학원 경영의 비밀
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: isMobile ? '8px' : '12px',
                marginBottom: isMobile ? '16px' : '24px'
              }}>
                {[
                  { title: '커리큘럼', desc: '학습 관리 체계' },
                  { title: '시스템', desc: '운영 효율성' },
                  { title: '마케팅', desc: '홍보 & 브랜딩' }
                ].map((item, i) => (
                  <div key={i} style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid rgba(59, 130, 246, 0.15)',
                    borderRadius: isMobile ? '6px' : '8px',
                    padding: isMobile ? '10px 6px' : '14px',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ fontSize: isMobile ? '11px' : '13px', fontWeight: '600', marginBottom: '2px', color: '#e2e8f0' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: isMobile ? '9px' : '11px', color: '#64748b' }}>{item.desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  window.open(`${BRAIN_BASE_URL}/diagnosis`, '_blank')
                }}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  fontSize: isMobile ? '13px' : '14px',
                  fontWeight: '600',
                  padding: isMobile ? '10px 20px' : '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                }}
              >
                무료로 5분 진단 시작하기
              </button>

              <p style={{ fontSize: isMobile ? '11px' : '12px', color: '#64748b', marginTop: isMobile ? '8px' : '10px', textAlign: 'center' }}>
                66개 질문 • 소요시간 약 5분
              </p>
            </div>

            {/* 영상 섹션 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.3)',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              borderRadius: isMobile ? '10px' : '12px',
              padding: isMobile ? '16px' : '24px',
              marginBottom: isMobile ? '20px' : '32px'
            }}>
              <h2 style={{
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '600',
                marginBottom: isMobile ? '10px' : '14px',
                color: '#e2e8f0'
              }}>
                레벨테스트 소개 영상
              </h2>
              <div style={{
                aspectRatio: '16/9',
                maxHeight: isMobile ? '180px' : '280px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: isMobile ? '6px' : '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed rgba(59, 130, 246, 0.2)'
              }}>
                <div style={{ textAlign: 'center', color: '#64748b' }}>
                  <div style={{ fontSize: isMobile ? '24px' : '32px', marginBottom: '8px' }}>▶</div>
                  <p style={{ fontSize: isMobile ? '11px' : '13px' }}>실제 촬영 영상 영역</p>
                </div>
              </div>
            </div>

            {/* 레벨별 설명 */}
            <div style={{ marginBottom: isMobile ? '20px' : '32px' }}>
              <h2 style={{
                fontSize: isMobile ? '15px' : '18px',
                fontWeight: '600',
                marginBottom: isMobile ? '12px' : '16px',
                color: '#e2e8f0'
              }}>
                단계별로 이런 업무를 자세하게 가이드 해드립니다
              </h2>

              <LevelProgressSelector
                levels={[
                  {
                    level: 1,
                    name: '1단계: 생존 (Solo)',
                    range: '원생 0 ~ 30명',
                    tasks: [
                      '강의력이 곧 마케팅이다: "이탈률 0%"를 목표로 아이 한 명 한 명에게 집착하세요.',
                      '학부모 안심 문자 루틴: "오늘 철수가 함수 부분을 헷갈려해서 이 부분을 꽉 잡았습니다" 구체적 피드백 전송.',
                      '돈 쓰지 않는 홍보: 화려한 광고 대신, 원장님의 교육 철학과 수업 일지를 블로그에 진솔하게 기록하세요.',
                      '청소도 경영이다: 아이들이 오고 싶게 만드는 청결한 환경과 면학 분위기를 직접 조성하세요.',
                      '경쟁사 벤치마킹: 우리 동네 1등 학원에 학부모인 척 전화해서 상담 프로세스와 커리큘럼 분석하기.',
                      '초기 상담의 기술: 등록 강요보다 "아이의 현재 상태"를 정확히 진단하고 공감해주는 데 시간 쏟기.',
                      '나만의 무기 만들기: 인근 학원들이 못 해주는 것(예: 밤 10시까지 밀착 케어) 한 가지를 확실하게 어필하세요.'
                    ]
                  },
                  {
                    level: 2,
                    name: '2단계: 최소 조직 (Staff)',
                    range: '원생 30 ~ 70명',
                    tasks: [
                      '첫 채용(실장/알바): 원장님의 시간을 확보하기 위해 채점, 차량, 청소를 도와줄 보조 인력 채용.',
                      '수익화 모델(돈 구멍) 설계: 정규 수업 외에 특강, 보충, 내신 대비 등을 별도 유료 "상품"으로 기획하세요.',
                      '지역 검색 장악: 네이버에 "동네명+과목" 검색 시 우리 학원이 가장 매력적으로 보이도록 플레이스 세팅하기.',
                      '시험 기간의 기적: 내신 대비 기간에 압도적인 관리량을 보여주어 학부모를 우리 편(Fan)으로 만드세요.',
                      '해피콜 루틴화: 성적이 떨어지거나 사고 쳤을 때만 전화하지 말고, 잘하고 있을 때 칭찬 전화 돌리기.',
                      '진입 장벽 만들기: "아무나 받지 않는다"는 인식을 심어주기 위해 간단하더라도 입학 레벨테스트 도입.',
                      '증거 수집: 아이들의 성적 향상 사례, 학부모의 감사 문자를 캡처하여 마케팅 소재로 아카이빙하세요.'
                    ]
                  },
                  {
                    level: 3,
                    name: '3단계: 시장 검증 (Teacher)',
                    range: '원생 70 ~ 110명',
                    tasks: [
                      '첫 강사 채용: 나(원장)만큼 가르칠 수 있는 강사를 뽑고, 내 노하우를 전수하는 첫 시도.',
                      '자체 교재 Vol.1 개발: 시중 교재 짜깁기가 아닌, 우리 학원 로고가 박힌 자체 제본 교재로 전문성 증명.',
                      '소개팅 쿠션 전략: 바로 청혼(등록)하지 마세요. "학부모 설명회"라는 가벼운 만남으로 썸(신뢰)부터 타세요.',
                      '블로그 퍼널(Funnel) 완성: 정보성 글(검색) → 교육 철학(설득) → 상담 신청(전환)으로 이어지는 글쓰기 구조.',
                      '바이럴 이벤트: "친구랑 같이 오면 피자 파티" 등 아이들이 스스로 친구를 데려올 명분(Trigger) 만들어주기.',
                      '성적대별 반 편성: 수준별로 반을 나누어 "잘하는 애는 더 잘하게, 못하는 애는 케어하게" 시스템 분리.',
                      '제 값 받기(Pricing): 이제 싼 맛에 오는 학원이 아닙니다. 수업 가치에 맞는 적정 수강료로 인상안 검토.'
                    ]
                  },
                  {
                    level: 4,
                    name: '4단계: 팀 빌딩 (Team)',
                    range: '원생 110 ~ 250명',
                    tasks: [
                      '중간 관리자(Key Man) 발굴: 강사들 중 나의 오른팔이 되어줄 "실장급/팀장급" 리더를 눈여겨보고 키우세요.',
                      '업무 표준화(Manual): 강사가 바뀌어도 수업 퀄리티가 유지되도록 강의 계획서와 상담 매뉴얼 문서화.',
                      'CRM 시스템 필수 도입: 원장님 머릿속, 엑셀, 수첩에 흩어진 학생 정보를 통합 데이터베이스로 이관.',
                      '아이언맨 상담 화법: "성적이 나빠요"라고 지적하지 말고, "아이의 잠재력(미래)"을 보여주는 상담 스크립트 정착.',
                      '타겟 학교 점령: 인근 학교 중 3곳을 정해 그 학교 전교권 학생을 배출하고 "OO학교 전문" 타이틀 확보.',
                      '객단가(ARPU) 상승: 수업료 외에 교재비, 모의고사비, 코칭비 등 부가 수익 구조를 촘촘하게 설계.',
                      '데이터 기반 강사 평가: "열심히 해요"가 아닌, 재등록률/성적향상률 등 수치로 강사를 평가하고 보상하세요.'
                    ]
                  },
                  {
                    level: 5,
                    name: '5단계: 기업화 (Company)',
                    range: '원생 250 ~ 500명',
                    tasks: [
                      '부서별 조직화: 교수부, 상담부, 행정부로 조직을 나누고 각 부서장에게 권한과 책임 위임.',
                      '빈 의자 테스트(위임): 원장님이 일주일 휴가를 다녀와도 학원이 문제없이 돌아가는지 시스템 점검.',
                      '고수익 상품군(High-Ticket): 입시 컨설팅, 의대 반, 유학 반 등 수익성이 높은 프리미엄 라인업 런칭.',
                      '랜드마크 설명회: 100명 이상 모이는 대형 호텔/강당 설명회를 개최하여 지역 1등 이미지를 굳히세요.',
                      '재무 경영(P&L): 통장 잔고만 보지 말고 월별 손익계산서를 작성하여 불필요한 비용(Leak)을 차단.',
                      '사내 강사 아카데미: 외부에서 비싼 스타강사를 스카우트하기보다, 신입을 우리 색깔에 맞게 키워내는 교육 시스템.',
                      '학원 문화(Culture) 정립: "우리는 왜 가르치는가?"에 대한 핵심 가치를 전 직원이 공유하고 내재화.'
                    ]
                  },
                  {
                    level: 6,
                    name: '6단계: 시스템 완성 (System)',
                    range: '원생 500 ~ 1,000명',
                    tasks: [
                      '확장 가능성 확보: 이 시스템 그대로 다른 지역에 심어도 성공할 수 있는지 "복제 가능성" 검증.',
                      '압도적 브랜딩: 타 학원이 감히 경쟁할 엄두를 못 낼 정도로 지역 내 "대체 불가능한 브랜드" 구축.',
                      '콘텐츠 자산화(IP): 우리 학원의 교재, 커리큘럼, 테스트지를 외부 판매하거나 출판하여 수익 다각화.',
                      '하이브리드 교육: 오프라인 강의실의 한계를 넘어 줌(Zoom)이나 VOD 클래스로 수강생 범위 전국 확대.',
                      '인하우스 마케팅팀: 외주 대행사에 맡기지 말고, 기획/디자인/영상 제작이 가능한 내부 마케팅 부서 가동.',
                      '사회적 권위 확보: 원장님의 이름으로 된 교육 서적 출판, 언론 인터뷰 등을 통해 "교육 전문가" 포지셔닝.',
                      '핵심 인재 락인(Lock-in): 스톡옵션이나 파격적인 인센티브 제도로 에이스 강사가 독립하지 않고 머물게 하기.'
                    ]
                  },
                  {
                    level: 7,
                    name: '7단계: 다지점 (Multi)',
                    range: '원생 1,000명 이상',
                    tasks: [
                      '2호점, 3호점 확장: 본점의 성공 시스템을 그대로 복제(Ctrl+C, Ctrl+V)하여 직영점 확장.',
                      '관리의 복잡성 해결: 지점이 늘어나도 품질이 떨어지지 않도록 "슈퍼바이저(감독관)" 시스템 도입.',
                      '중앙 집중형 마케팅: 본사에서 브랜드 마케팅을 총괄하고, 지점은 교육과 관리에만 집중하는 구조.',
                      '통합 재무 관리: 전 지점의 자금 흐름을 한눈에 파악하고 효율적으로 배분하는 ERP 시스템 구축.',
                      '부동산 자산화: 매달 나가는 월세를 없애고, 학원 건물을 매입하거나 사옥을 지어 자산 가치 증대.',
                      '브랜드 팬덤 구축: 학원을 넘어선 "교육 커뮤니티"를 만들어 학부모들이 자발적으로 우리 브랜드를 수호하게 만듦.',
                      'R&D 투자: 당장의 매출보다 미래 먹거리를 위한 교육 프로그램 연구 개발에 예산 투자.'
                    ]
                  },
                  {
                    level: 8,
                    name: '8단계: 엑시트 (Exit/Franchise)',
                    range: '지점 6개 이상',
                    tasks: [
                      '가맹 본부(Franchise) 설립: 교육 서비스를 파는 학원에서, "성공 시스템"을 파는 가맹 본사로 비즈니스 모델 전환.',
                      '전문 경영인(CEO) 영입: 원장님은 이사회 의장(Visionary)으로 물러나고, 실무는 전문 경영인에게 맡기세요.',
                      '교육 그룹 도약: 입시 학원을 넘어 유학원, 스터디카페, 성인 교육 등 연관 비즈니스로 수직 계열화.',
                      '엑시트(Exit) 전략: 기업공개(IPO)를 하거나 사모펀드/대기업에 매각하여 평생 일군 가치를 현금화할 준비.',
                      '사회 공헌(CSR): 장학 재단 설립이나 지역 사회 기부를 통해 "존경받는 교육 기업"으로 유산(Legacy) 남기기.',
                      '완전한 자유: 시스템이 돈을 벌어다 주는 구조를 완성하고, 원장님은 진정으로 원하는 새로운 꿈에 도전하세요.',
                      '명예의 전당: 대한민국 사교육 역사에 기록될 만한 성공 스토리와 경영 철학 정리.'
                    ]
                  }
                ]}
                defaultLevel={null}
              />
            </div>

            {/* 실제 사용자 후기 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.3)',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              borderRadius: isMobile ? '10px' : '12px',
              padding: isMobile ? '16px' : '24px',
              marginBottom: isMobile ? '20px' : '32px'
            }}>
              <h2 style={{
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '600',
                marginBottom: isMobile ? '12px' : '16px',
                color: '#e2e8f0'
              }}>
                실제 원장님들의 후기
              </h2>

              <div style={{ display: 'grid', gap: isMobile ? '10px' : '12px' }}>
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
                    borderRadius: isMobile ? '6px' : '8px',
                    padding: isMobile ? '12px' : '14px',
                    border: '1px solid rgba(59, 130, 246, 0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '6px' : '8px' }}>
                      <div>
                        <h4 style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '600', color: '#e2e8f0', marginBottom: '2px' }}>
                          {item.name}
                        </h4>
                        <p style={{ fontSize: isMobile ? '10px' : '11px', color: '#64748b' }}>{item.academy}</p>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: isMobile ? '4px' : '6px',
                        fontSize: isMobile ? '10px' : '11px',
                        fontWeight: '600'
                      }}>
                        <span style={{ color: '#f59e0b' }}>{item.before}</span>
                        <span style={{ color: '#64748b' }}>→</span>
                        <span style={{ color: '#10b981' }}>{item.after}</span>
                      </div>
                    </div>

                    <p style={{ fontSize: isMobile ? '11px' : '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                      "{item.review}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
