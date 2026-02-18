'use client';

import Link from 'next/link';
import useIsMobile from '@/hooks/useIsMobile';

export default function RefundPolicyPage() {
  const isMobile = useIsMobile();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020617' }}>
      {/* Main Content */}
      <div className="main-area" style={{
        flex: 1,
        background: 'transparent',
        overflowY: 'auto',
        paddingTop: '64px',
      }}>
        <div style={{
          padding: isMobile ? '40px 20px' : '60px 80px',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {/* Header */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              fontSize: isMobile ? '11px' : '13px',
              color: 'rgba(255, 255, 255, 0.5)',
              marginBottom: '16px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              환불 정책
            </div>
            <h1 style={{
              fontSize: isMobile ? '32px' : '48px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '16px',
              lineHeight: '1.2',
            }}>
              EduRichBrain 환불 정책
            </h1>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}>
              시행일: 2026년 1월 1일
            </p>
          </div>

          {/* Introduction */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '40px',
          }}>
            <p style={{
              fontSize: '15px',
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: '1.8',
              margin: 0,
            }}>
              마케팅다이어트(이하 "회사")는 「전자상거래 등에서의 소비자보호에 관한 법률」에 따라 공정하고 투명한 환불 정책을 운영하고 있습니다. 본 정책은 EduRichBrain 서비스의 구독 및 크레딧 패키지 결제에 대한 환불 기준을 안내합니다.
            </p>
          </div>

          {/* Quick Summary */}
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '40px',
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#22c55e',
              marginBottom: '16px',
            }}>
              환불 정책 요약
            </h2>
            <div style={{
              display: 'grid',
              gap: '12px',
              fontSize: '15px',
              color: 'rgba(255, 255, 255, 0.8)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>✅</span>
                <span><strong>7일 이내:</strong> 전액 환불 (단, 사용한 AI 크레딧 차감)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>📊</span>
                <span><strong>7일 이후:</strong> 잔여 기간 일할 계산 환불 (사용 크레딧 차감)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>💳</span>
                <span><strong>크레딧 패키지:</strong> 미사용분에 한해 환불 가능</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>⏰</span>
                <span><strong>처리 기간:</strong> 영업일 기준 3-5일</span>
              </div>
            </div>
          </div>

          {/* Terms Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* 제1조 */}
            <Section title="제1조 (적용 범위)">
              <p>본 환불 정책은 다음 결제에 적용됩니다:</p>
              <ul>
                <li>정기 구독 결제 (Starter, Growth, Pro, Enterprise 플랜)</li>
                <li>추가 크레딧 패키지 구매 (베이직, 스탠다드, 프리미엄)</li>
                <li>기타 유료 서비스 결제</li>
              </ul>
            </Section>

            {/* 제2조 */}
            <Section title="제2조 (구독 환불 정책)">
              <SubSection title="2.1 결제일로부터 7일 이내 환불">
                <p>「전자상거래법」 제17조에 따라 결제일로부터 7일 이내에는 청약철회가 가능합니다.</p>
                <Table
                  headers={['조건', '환불 금액']}
                  rows={[
                    ['AI 크레딧 미사용', '결제 금액 전액 환불'],
                    ['AI 크레딧 사용', '결제 금액 - (사용 크레딧 × 크레딧 단가)'],
                  ]}
                />
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '8px',
                }}>
                  <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                    <strong style={{ color: '#60a5fa' }}>크레딧 단가 계산:</strong><br />
                    플랜별 월 구독료 ÷ 월 제공 크레딧 = 크레딧당 단가
                  </p>
                </div>
              </SubSection>

              <SubSection title="2.2 결제일로부터 7일 이후 환불">
                <p>7일 이후에는 잔여 기간에 대해 일할 계산으로 환불됩니다.</p>
                <div style={{
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  marginTop: '12px',
                }}>
                  <p style={{ margin: 0, fontSize: '15px', color: 'rgba(255, 255, 255, 0.9)', fontFamily: 'monospace' }}>
                    환불 금액 = 결제 금액 × (잔여일 ÷ 총 이용일) - (사용 크레딧 × 크레딧 단가)
                  </p>
                </div>
              </SubSection>

              <SubSection title="2.3 플랜별 크레딧 단가">
                <Table
                  headers={['플랜', '월 구독료', '월 크레딧', '크레딧 단가']}
                  rows={[
                    ['Starter', '29,000원', '1,500P', '약 19원/P'],
                    ['Growth', '79,000원', '5,500P', '약 14원/P'],
                    ['Pro', '199,000원', '15,000P', '약 13원/P'],
                    ['Enterprise', '399,000원', '35,000P', '약 11원/P'],
                  ]}
                />
              </SubSection>
            </Section>

            {/* 제3조 */}
            <Section title="제3조 (크레딧 패키지 환불 정책)">
              <p>별도 구매한 크레딧 패키지의 환불 정책은 다음과 같습니다:</p>
              <Table
                headers={['조건', '환불 가능 여부', '환불 금액']}
                rows={[
                  ['구매 후 7일 이내 + 미사용', '가능', '전액 환불'],
                  ['구매 후 7일 이내 + 일부 사용', '가능', '결제 금액 - (사용 크레딧 × 패키지 단가)'],
                  ['구매 후 7일 이후', '불가', '-'],
                ]}
              />

              <SubSection title="3.1 크레딧 패키지 단가">
                <Table
                  headers={['패키지', '가격', '크레딧', '단가']}
                  rows={[
                    ['베이직', '33,000원', '10,000P', '3.3원/P'],
                    ['스탠다드', '55,000원', '18,000P (20% 보너스)', '3.1원/P'],
                    ['프리미엄', '110,000원', '40,000P (33% 보너스)', '2.75원/P'],
                  ]}
                />
              </SubSection>
            </Section>

            {/* 제4조 */}
            <Section title="제4조 (환불 계산 예시)">
              <SubSection title="예시 1: 7일 이내 + 크레딧 사용">
                <div style={{
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                }}>
                  <ul style={{ margin: 0 }}>
                    <li>플랜: Growth 월간 구독 (79,000원)</li>
                    <li>사용 기간: 3일</li>
                    <li>사용 크레딧: 500P</li>
                    <li>크레딧 단가: 14원/P</li>
                    <li style={{ marginTop: '12px', color: '#22c55e', fontWeight: '600' }}>
                      환불 금액: 79,000원 - (500P × 14원) = <strong>72,000원</strong>
                    </li>
                  </ul>
                </div>
              </SubSection>

              <SubSection title="예시 2: 7일 이후 일할 계산">
                <div style={{
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                }}>
                  <ul style={{ margin: 0 }}>
                    <li>플랜: Growth 연간 구독 (948,000원)</li>
                    <li>사용 기간: 60일 (잔여 305일)</li>
                    <li>사용 크레딧: 3,000P</li>
                    <li>일할 환불: 948,000원 × (305 ÷ 365) = 792,329원</li>
                    <li>크레딧 차감: 3,000P × 14원 = 42,000원</li>
                    <li style={{ marginTop: '12px', color: '#22c55e', fontWeight: '600' }}>
                      환불 금액: 792,329원 - 42,000원 = <strong>750,329원</strong>
                    </li>
                  </ul>
                </div>
              </SubSection>
            </Section>

            {/* 제5조 */}
            <Section title="제5조 (환불 불가 사유)">
              <p>다음의 경우에는 환불이 제한될 수 있습니다:</p>
              <ul>
                <li>이용약관 또는 서비스 정책을 위반한 경우</li>
                <li>서비스를 부정하게 이용한 경우 (계정 공유, 자동화 도구 사용 등)</li>
                <li>이미 제공된 디지털 콘텐츠를 모두 사용한 경우</li>
                <li>무료 체험 기간 중 결제가 발생하지 않은 경우</li>
                <li>프로모션 또는 할인 적용 시 별도 환불 규정이 명시된 경우</li>
              </ul>
            </Section>

            {/* 제6조 */}
            <Section title="제6조 (환불 신청 방법)">
              <p>환불은 다음 방법으로 신청할 수 있습니다:</p>
              <ul>
                <li><strong>온라인 신청:</strong> <Link href="/refund" style={{ color: '#60a5fa' }}>환불 신청 페이지</Link>에서 직접 신청</li>
                <li><strong>이메일 신청:</strong> support@marketingdiet.online으로 환불 요청</li>
                <li><strong>고객센터:</strong> 서비스 내 채팅 상담을 통한 신청</li>
              </ul>

              <SubSection title="6.1 필요 정보">
                <ul>
                  <li>가입 이메일 주소</li>
                  <li>결제 주문번호 (선택)</li>
                  <li>환불 사유</li>
                  <li>환불 계좌 정보 (은행명, 계좌번호, 예금주)</li>
                </ul>
              </SubSection>
            </Section>

            {/* 제7조 */}
            <Section title="제7조 (환불 처리 기간)">
              <Table
                headers={['결제 수단', '처리 기간']}
                rows={[
                  ['신용카드', '영업일 기준 3-5일 (카드사별 상이)'],
                  ['체크카드', '영업일 기준 3-5일'],
                  ['계좌이체', '영업일 기준 1-3일'],
                  ['가상계좌', '영업일 기준 1-3일'],
                ]}
              />
              <p style={{ marginTop: '16px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                ※ 환불 처리 완료 후 실제 입금까지 결제 수단 및 금융기관에 따라 추가 시간이 소요될 수 있습니다.
              </p>
            </Section>

            {/* 제8조 */}
            <Section title="제8조 (환불 후 서비스 이용)">
              <ul>
                <li>환불 처리 완료 시 해당 구독의 서비스 이용 권한이 즉시 중단됩니다.</li>
                <li>저장된 데이터는 환불 후 30일간 보관되며, 이후 영구 삭제됩니다.</li>
                <li>환불 후 재구독 시 이전 데이터 복구가 불가능할 수 있습니다.</li>
                <li>남은 크레딧은 환불 시점에 소멸됩니다.</li>
              </ul>
            </Section>

            {/* 제9조 */}
            <Section title="제9조 (분쟁 해결)">
              <p>환불 관련 분쟁이 발생한 경우:</p>
              <ul>
                <li>먼저 고객센터를 통해 협의를 시도합니다.</li>
                <li>협의가 이루어지지 않을 경우, 한국소비자원에 분쟁 조정을 신청할 수 있습니다.</li>
                <li>관할 법원은 대한민국 서울중앙지방법원으로 합니다.</li>
              </ul>

              <div style={{
                marginTop: '16px',
                padding: '16px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '8px',
              }}>
                <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                  <strong>한국소비자원:</strong> (국번없이) 1372 | www.kca.go.kr
                </p>
              </div>
            </Section>

            {/* 문의처 */}
            <Section title="문의처">
              <Table
                headers={['항목', '내용']}
                rows={[
                  ['회사명', '마케팅다이어트'],
                  ['이메일', 'support@marketingdiet.online'],
                  ['웹사이트', 'www.edurichbrain.com'],
                ]}
              />
            </Section>

            {/* 부칙 */}
            <Section title="부칙">
              <ul>
                <li>본 환불 정책은 2026년 1월 1일부터 시행합니다.</li>
                <li>본 정책이 변경되는 경우 변경 사항을 서비스 내 공지사항을 통하여 고지하며, 변경된 정책은 공지한 날로부터 7일 후부터 효력이 발생합니다.</li>
              </ul>
            </Section>
          </div>

          {/* CTA Button */}
          <div style={{
            marginTop: '60px',
            textAlign: 'center',
          }}>
            <Link href="/refund" style={{
              display: 'inline-block',
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
            }}>
              환불 신청하기
            </Link>
          </div>

          {/* Footer Links */}
          <div style={{
            marginTop: '40px',
            paddingTop: '40px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '16px',
            justifyContent: 'center',
          }}>
            <Link href="/terms" style={{
              color: 'rgba(255, 255, 255, 0.6)',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s',
            }}>
              이용약관
            </Link>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)', display: isMobile ? 'none' : 'inline' }}>|</span>
            <Link href="/privacy" style={{
              color: 'rgba(255, 255, 255, 0.6)',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s',
            }}>
              개인정보처리방침
            </Link>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)', display: isMobile ? 'none' : 'inline' }}>|</span>
            <Link href="/" style={{
              color: 'rgba(255, 255, 255, 0.6)',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s',
            }}>
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Section Component
function Section({ title, children }) {
  return (
    <div>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        {title}
      </h2>
      <div style={{
        fontSize: '15px',
        color: 'rgba(255, 255, 255, 0.75)',
        lineHeight: '1.8',
      }}>
        <style jsx>{`
          div :global(p) {
            margin: 0 0 12px 0;
          }
          div :global(ul) {
            margin: 0;
            padding-left: 20px;
          }
          div :global(li) {
            margin-bottom: 8px;
          }
          div :global(strong) {
            color: rgba(255, 255, 255, 0.9);
          }
        `}</style>
        {children}
      </div>
    </div>
  );
}

// SubSection Component
function SubSection({ title, children }) {
  return (
    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
      <h3 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: '12px',
      }}>
        {title}
      </h3>
      <div style={{
        fontSize: '15px',
        color: 'rgba(255, 255, 255, 0.75)',
        lineHeight: '1.8',
      }}>
        <style jsx>{`
          div :global(p) {
            margin: 0 0 12px 0;
          }
          div :global(ul) {
            margin: 0;
            padding-left: 20px;
          }
          div :global(li) {
            margin-bottom: 8px;
          }
        `}</style>
        {children}
      </div>
    </div>
  );
}

// Table Component
function Table({ headers, rows }) {
  return (
    <div style={{
      overflowX: 'auto',
      marginTop: '16px',
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px',
      }}>
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} style={{
                padding: '12px 16px',
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                color: '#93c5fd',
                fontWeight: '600',
                textAlign: 'left',
              }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} style={{
                  padding: '12px 16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.75)',
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
