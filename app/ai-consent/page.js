'use client';

import Link from 'next/link';
import useIsMobile from '@/hooks/useIsMobile';

export default function AIConsentPage() {
  const isMobile = useIsMobile();

  return (
    <div style={{ minHeight: '100vh', background: '#020617' }}>
      {/* Main Content */}
      <div style={{
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
              AI 데이터 동의서
            </div>
            <h1 style={{
              fontSize: isMobile ? '28px' : '44px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '16px',
              lineHeight: '1.2',
            }}>
              AI 대화 내용 저장 동의서
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#60a5fa',
              marginBottom: '8px',
            }}>
              맞춤형 추천 및 이어서 대화하기 기능 제공
            </p>
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
              마케팅다이어트(이하 "회사")는 EduRichBrain 서비스 내 AI 기능을 통해 생성된 대화 내용 및 콘텐츠의 저장·활용에 관하여 아래와 같이 안내드리며, 이용자의 동의를 받고자 합니다.
            </p>
          </div>

          {/* Terms Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* 제1조 */}
            <Section title="제1조 (동의 목적)">
              <p>
                본 동의서는 이용자가 EduRichBrain 서비스 내 AI 기능을 사용하면서 생성되는 대화 내용 및 콘텐츠를 회사가 저장하고 활용하는 것에 대한 동의를 받기 위한 것입니다.
              </p>
              <div style={{
                marginTop: '16px',
                padding: '16px',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
              }}>
                <strong style={{ color: '#22c55e' }}>동의하실 경우,</strong> 더욱 개인화된 서비스와 편리한 기능을 이용하실 수 있습니다.
              </div>
            </Section>

            {/* 제2조 */}
            <Section title="제2조 (저장 및 활용 항목)">
              <p>회사가 저장하고 활용하는 항목은 다음과 같습니다:</p>
              <Table
                headers={['항목', '세부 내용']}
                rows={[
                  ['AI 대화 내용', '이용자가 AI에게 입력한 질문, 요청 사항 및 AI의 응답 내용'],
                  ['AI 생성 콘텐츠', '블로그 글, 커리큘럼, 마케팅 자료, 학습 리포트 등 AI가 생성한 모든 콘텐츠'],
                  ['이용 패턴', 'AI 기능 사용 빈도, 선호하는 기능, 콘텐츠 유형별 사용 현황'],
                  ['피드백 데이터', 'AI 응답에 대한 만족도, 수정 내역, 재생성 요청 등'],
                ]}
              />
            </Section>

            {/* 제3조 */}
            <Section title="제3조 (활용 목적)">
              <p>수집된 정보는 다음의 목적으로 활용됩니다:</p>

              <SubSection title="3.1 이용자 편의 기능 제공">
                <ul>
                  <li><strong>이어서 대화하기:</strong> 이전 대화 맥락을 기억하여 연속적인 대화 및 작업 가능</li>
                  <li><strong>맞춤형 추천:</strong> 이용자의 학원 특성과 선호도에 맞는 콘텐츠 및 기능 추천</li>
                  <li><strong>작업 히스토리:</strong> 생성한 콘텐츠 저장 및 재사용, 수정 기능 제공</li>
                </ul>
              </SubSection>

              <SubSection title="3.2 서비스 품질 향상">
                <ul>
                  <li><strong>AI 모델 개선:</strong> 더 정확하고 유용한 응답을 제공하기 위한 AI 학습 및 개선</li>
                  <li><strong>새로운 기능 개발:</strong> 이용 패턴 분석을 통한 신규 기능 기획 및 개발</li>
                  <li><strong>오류 개선:</strong> AI 응답의 오류 및 부정확한 내용 개선</li>
                </ul>
              </SubSection>

              <SubSection title="3.3 통계 및 연구">
                <ul>
                  <li>비식별화된 데이터를 활용한 서비스 이용 통계 분석 및 학원 교육 관련 연구</li>
                </ul>
              </SubSection>
            </Section>

            {/* 제4조 */}
            <Section title="제4조 (AI 생성 콘텐츠의 권리)">
              <SubSection title="4.1 이용자의 권리">
                <ul>
                  <li>이용자가 AI를 활용하여 생성한 콘텐츠는 이용자가 자유롭게 사용, 수정, 배포할 수 있습니다.</li>
                  <li>이용자는 생성된 콘텐츠를 학원 운영, 마케팅, 교육 등 본래 목적에 맞게 활용할 수 있습니다.</li>
                </ul>
              </SubSection>

              <SubSection title="4.2 회사의 권리">
                <ul>
                  <li>회사는 AI 대화 내용 및 생성 콘텐츠를 다음의 목적으로 활용할 수 있는 비독점적, 전 세계적, 무상의 라이선스를 보유합니다:
                    <ul style={{ marginTop: '8px' }}>
                      <li>AI 모델 학습 및 성능 개선</li>
                      <li>서비스 품질 향상 및 신규 기능 개발</li>
                      <li>비식별화된 형태의 통계 분석 및 연구</li>
                    </ul>
                  </li>
                  <li>회사는 이용자의 개인정보가 포함된 콘텐츠를 제3자에게 공개하지 않으며, AI 학습에는 비식별화된 데이터만 사용합니다.</li>
                </ul>
              </SubSection>
            </Section>

            {/* 제5조 */}
            <Section title="제5조 (보유 및 이용 기간)">
              <Table
                headers={['데이터 유형', '보유 기간']}
                rows={[
                  ['AI 대화 내용', '회원 탈퇴 시까지 (또는 동의 철회 시)'],
                  ['AI 생성 콘텐츠', '회원 탈퇴 시까지 (또는 동의 철회 시)'],
                  ['비식별화된 학습 데이터', '서비스 운영 기간 동안 영구 보관'],
                ]}
              />
              <div style={{
                marginTop: '16px',
                padding: '16px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
              }}>
                <strong style={{ color: '#f59e0b' }}>※ 참고:</strong> 비식별화된 데이터는 특정 개인을 식별할 수 없도록 처리된 데이터로, 동의 철회 후에도 AI 학습 목적으로 활용될 수 있습니다.
              </div>
            </Section>

            {/* 제6조 */}
            <Section title="제6조 (동의 거부 및 철회)">
              <SubSection title="6.1 동의 거부권">
                <ul>
                  <li>이용자는 본 동의를 거부할 권리가 있습니다.</li>
                  <li>다만, 동의를 거부하실 경우 다음 기능의 이용이 제한될 수 있습니다:
                    <ul style={{ marginTop: '8px' }}>
                      <li>이어서 대화하기 기능</li>
                      <li>맞춤형 콘텐츠 추천</li>
                      <li>AI 생성 콘텐츠 히스토리 저장 및 조회</li>
                    </ul>
                  </li>
                </ul>
              </SubSection>

              <SubSection title="6.2 동의 철회">
                <ul>
                  <li>이용자는 언제든지 동의를 철회할 수 있습니다.</li>
                  <li><strong>철회 방법:</strong> 서비스 내 [설정] {'>'} [개인정보 관리] {'>'} [AI 데이터 저장 동의 철회] 또는 고객센터 문의</li>
                  <li>동의 철회 시 저장된 AI 대화 내용 및 생성 콘텐츠는 삭제되며, 삭제 완료 후에는 복구가 불가능합니다.</li>
                  <li>단, 이미 비식별화되어 AI 학습에 활용된 데이터는 철회 대상에서 제외됩니다.</li>
                </ul>
              </SubSection>
            </Section>

            {/* 제7조 */}
            <Section title="제7조 (데이터 삭제 요청)">
              <ul>
                <li>이용자는 저장된 AI 대화 내용 및 생성 콘텐츠의 전체 또는 일부 삭제를 요청할 수 있습니다.</li>
                <li><strong>삭제 방법:</strong>
                  <ul style={{ marginTop: '8px' }}>
                    <li>서비스 내 각 콘텐츠별 삭제 기능 사용</li>
                    <li>[설정] {'>'} [데이터 관리] {'>'} [AI 대화 기록 삭제]</li>
                    <li>고객센터를 통한 일괄 삭제 요청</li>
                  </ul>
                </li>
                <li>삭제 요청은 요청일로부터 7일 이내에 처리됩니다.</li>
              </ul>
            </Section>

            {/* 제8조 */}
            <Section title="제8조 (안전성 확보 조치)">
              <p>회사는 AI 대화 내용 및 생성 콘텐츠의 안전한 보관을 위해 다음과 같은 조치를 취합니다:</p>
              <ul>
                <li><strong>암호화:</strong> 저장 데이터 및 전송 데이터 암호화 (SSL/TLS, AES-256)</li>
                <li><strong>접근 통제:</strong> 권한이 있는 담당자만 데이터에 접근 가능</li>
                <li><strong>비식별화:</strong> AI 학습에 사용되는 데이터는 개인 식별이 불가능하도록 처리</li>
                <li><strong>접근 기록:</strong> 데이터 접근 및 처리 기록 보관</li>
              </ul>
            </Section>

            {/* 제9조 */}
            <Section title="제9조 (문의처)">
              <p>본 동의서에 대한 문의사항이 있으시면 아래로 연락해 주시기 바랍니다:</p>
              <Table
                headers={['항목', '내용']}
                rows={[
                  ['회사명', '마케팅다이어트'],
                  ['개인정보 보호책임자', '이성연 / 대표'],
                  ['연락처', 'support@marketingdiet.online'],
                ]}
              />
            </Section>

            {/* 동의 확인 */}
            <Section title="동의 확인">
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                padding: '24px',
              }}>
                <p style={{ marginBottom: '24px', color: 'rgba(255, 255, 255, 0.9)' }}>
                  본인은 위의 내용을 충분히 이해하였으며, AI 대화 내용 저장 및 활용에 동의합니다.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}>
                    <input type="checkbox" style={{
                      width: '20px',
                      height: '20px',
                      marginTop: '2px',
                      accentColor: '#3b82f6',
                    }} />
                    <div>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '4px',
                        marginRight: '8px',
                      }}>필수</span>
                      <span style={{ color: '#ffffff' }}>AI 대화 내용 저장에 동의합니다.</span>
                      <p style={{
                        margin: '8px 0 0 0',
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.5)',
                      }}>
                        (맞춤형 추천 및 이어서 대화하기 기능 제공)
                      </p>
                    </div>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}>
                    <input type="checkbox" style={{
                      width: '20px',
                      height: '20px',
                      marginTop: '2px',
                      accentColor: '#3b82f6',
                    }} />
                    <div>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '4px',
                        marginRight: '8px',
                      }}>필수</span>
                      <span style={{ color: '#ffffff' }}>AI 서비스 개선을 위한 학습 데이터 활용에 동의합니다.</span>
                      <p style={{
                        margin: '8px 0 0 0',
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.5)',
                      }}>
                        (비식별화된 데이터로 AI 모델 개선에 활용)
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </Section>

            {/* 부칙 */}
            <Section title="부칙">
              <p>본 동의서는 2026년 1월 1일부터 시행합니다.</p>
            </Section>
          </div>

          {/* Footer Links */}
          <div style={{
            marginTop: '60px',
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
