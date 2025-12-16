'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useIsMobile from '@/hooks/useIsMobile';

export default function PrivacyPage() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0a0e27 0%, #16213e 50%, #1a1f3a 100%)' }}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="메뉴 열기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      )}

      {/* Mobile Menu Panel */}
      {isMobile && mobileMenuOpen && (
        <div className="mobile-menu-panel">
          <button
            onClick={closeMobileMenu}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.08))',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <div className="mobile-menu-logo">EduRichBrain</div>

          <nav className="mobile-menu-nav">
            <Link href="/" className="mobile-menu-link" onClick={closeMobileMenu}>제품</Link>
            <Link href="/pricing" className="mobile-menu-link" onClick={closeMobileMenu}>요금제</Link>
            <Link href="/diagnosis" className="mobile-menu-link" onClick={closeMobileMenu}>경영진단</Link>
            <Link href="/blog" className="mobile-menu-link" onClick={closeMobileMenu}>블로그</Link>
            <Link href="/about" className="mobile-menu-link" onClick={closeMobileMenu}>회사</Link>
            <Link href="/demo" className="mobile-menu-link" onClick={closeMobileMenu}>데모</Link>
          </nav>

          <div className="mobile-menu-footer">
            <Link
              href="/signup"
              className="login-btn"
              onClick={closeMobileMenu}
              style={{ width: '100%', textAlign: 'center' }}
            >
              시작하기
            </Link>
          </div>
        </div>
      )}

      {/* Left Sidebar Navigation */}
      <aside className="sidebar" style={{
        width: '260px',
        background: 'rgba(10, 14, 39, 0.95)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
      }}>
        <Link href="/" style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: 'white',
          textDecoration: 'none',
          marginBottom: '40px',
        }}>
          EduRichBrain
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link href="/" style={{
            color: 'rgba(255, 255, 255, 0.7)',
            textDecoration: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s',
          }}>
            제품
          </Link>
          <Link href="/pricing" style={{
            color: 'rgba(255, 255, 255, 0.7)',
            textDecoration: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s',
          }}>
            요금제
          </Link>
          <Link href="/diagnosis" style={{
            color: 'rgba(255, 255, 255, 0.7)',
            textDecoration: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s',
          }}>
            경영진단
          </Link>
          <Link href="/blog" style={{
            color: 'rgba(255, 255, 255, 0.7)',
            textDecoration: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s',
          }}>
            블로그
          </Link>
          <Link href="/about" style={{
            color: 'rgba(255, 255, 255, 0.7)',
            textDecoration: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s',
          }}>
            회사
          </Link>
          <Link href="/demo" style={{
            color: 'rgba(255, 255, 255, 0.7)',
            textDecoration: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'all 0.2s',
          }}>
            데모
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-area" style={{
        flex: 1,
        background: 'transparent',
        overflowY: 'auto',
      }}>
        {/* Top Bar */}
        <header style={{
          height: '60px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '0 20px' : '0 40px',
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              padding: '8px',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link href="/signup" style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'none',
            }}>
              시작하기
            </Link>
          </div>
        </header>

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
              개인정보처리방침
            </div>
            <h1 style={{
              fontSize: isMobile ? '32px' : '48px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '16px',
              lineHeight: '1.2',
            }}>
              EduRichBrain 개인정보처리방침
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
              마케팅다이어트(이하 "회사")는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.
            </p>
          </div>

          {/* Table of Contents */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '40px',
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '16px',
            }}>
              목차
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '8px',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)',
            }}>
              <div>제1조 개인정보의 처리 목적</div>
              <div>제2조 수집하는 개인정보 항목</div>
              <div>제3조 개인정보의 처리 및 보유기간</div>
              <div>제4조 개인정보의 제3자 제공</div>
              <div>제5조 개인정보 처리의 위탁</div>
              <div>제6조 정보주체의 권리·의무</div>
              <div>제7조 개인정보의 파기</div>
              <div>제8조 개인정보의 안전성 확보조치</div>
              <div>제9조 개인정보 자동 수집 장치</div>
              <div>제10조 개인정보 보호책임자</div>
            </div>
          </div>

          {/* Terms Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* 제1조 */}
            <Section title="제1조 (개인정보의 처리 목적)">
              <p>
                회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>

              <SubSection title="1.1 회원가입 및 관리">
                <ul>
                  <li>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
                  <li>회원자격 유지·관리, 서비스 부정이용 방지</li>
                  <li>각종 고지·통지, 고충처리</li>
                </ul>
              </SubSection>

              <SubSection title="1.2 서비스 제공">
                <ul>
                  <li>학원 운영 관리 서비스 제공 (상담 관리, 학생 관리, 출결 관리 등)</li>
                  <li>AI 기반 콘텐츠 생성 서비스 제공 (블로그, 커리큘럼, 마케팅 자료 등)</li>
                  <li>맞춤형 서비스 제공, 서비스 이용 기록 분석</li>
                </ul>
              </SubSection>

              <SubSection title="1.3 결제 및 정산">
                <ul>
                  <li>유료 서비스 이용에 대한 요금 결제·정산</li>
                  <li>구독 관리, 환불 처리</li>
                </ul>
              </SubSection>

              <SubSection title="1.4 마케팅 및 광고 활용">
                <ul>
                  <li>신규 서비스 개발 및 맞춤 서비스 제공</li>
                  <li>이벤트 및 광고성 정보 제공 (별도 동의 시)</li>
                  <li>서비스 이용 통계 및 분석</li>
                </ul>
              </SubSection>
            </Section>

            {/* 제2조 */}
            <Section title="제2조 (수집하는 개인정보 항목)">
              <SubSection title="2.1 필수 수집 항목">
                <Table
                  headers={['수집 시점', '수집 항목']}
                  rows={[
                    ['회원가입 시', '이메일 주소, 비밀번호, 이름, 학원명, 연락처'],
                    ['유료 서비스 이용 시', '결제 정보 (카드사명, 카드번호 일부), 결제 기록'],
                    ['서비스 이용 시', '서비스 이용 기록, 접속 로그, IP 주소, 기기 정보'],
                  ]}
                />
              </SubSection>

              <SubSection title="2.2 선택 수집 항목">
                <ul>
                  <li>사업자등록번호, 대표자명, 사업장 주소 (세금계산서 발행 시)</li>
                  <li>마케팅 수신 동의 여부</li>
                </ul>
              </SubSection>

              <SubSection title="2.3 학원 운영 관련 정보 (이용자가 입력)">
                <ul>
                  <li>학생 정보: 학생명, 학년, 연락처, 학부모 연락처, 상담 기록</li>
                  <li>※ 위 정보는 이용자가 직접 입력하며, 회사는 서비스 제공 목적으로만 저장·처리합니다.</li>
                </ul>
              </SubSection>
            </Section>

            {/* 제3조 */}
            <Section title="제3조 (개인정보의 처리 및 보유기간)">
              <p>
                회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>

              <SubSection title="3.1 회원정보">
                <ul>
                  <li><strong>보유기간:</strong> 회원 탈퇴 시까지</li>
                  <li><strong>예외:</strong> 관계 법령에 따라 보존이 필요한 경우 해당 기간까지</li>
                </ul>
              </SubSection>

              <SubSection title="3.2 관련 법령에 따른 보유기간">
                <Table
                  headers={['보존 항목', '보존 기간', '근거 법령']}
                  rows={[
                    ['계약 또는 청약철회 등에 관한 기록', '5년', '전자상거래법'],
                    ['대금결제 및 재화 등의 공급에 관한 기록', '5년', '전자상거래법'],
                    ['소비자의 불만 또는 분쟁처리에 관한 기록', '3년', '전자상거래법'],
                    ['웹사이트 방문 기록', '3개월', '통신비밀보호법'],
                  ]}
                />
              </SubSection>
            </Section>

            {/* 제4조 */}
            <Section title="제4조 (개인정보의 제3자 제공)">
              <p>
                회사는 정보주체의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
              </p>
              <ul>
                <li>현재 회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다.</li>
                <li>향후 제3자 제공이 필요한 경우 별도의 동의를 받겠습니다.</li>
              </ul>
            </Section>

            {/* 제5조 */}
            <Section title="제5조 (개인정보 처리의 위탁)">
              <p>
                회사는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를 위탁하고 있습니다.
              </p>
              <Table
                headers={['수탁업체', '위탁 업무', '보유 기간']}
                rows={[
                  ['토스페이먼츠', '결제 처리', '위탁계약 종료 시'],
                  ['Supabase (미국)', '데이터베이스 호스팅', '회원 탈퇴 시'],
                  ['Vercel (미국)', '웹서비스 호스팅', '회원 탈퇴 시'],
                  ['Anthropic (미국)', 'AI 콘텐츠 생성', '처리 완료 즉시 삭제'],
                  ['솔라피 (Solapi)', 'SMS/알림톡 발송', '발송 완료 후 3개월'],
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
                <strong style={{ color: '#f59e0b' }}>※ 국외 이전 관련:</strong> Supabase, Vercel, Anthropic은 미국 소재 기업으로, 서비스 제공을 위해 개인정보가 국외로 이전될 수 있습니다. 해당 업체들은 GDPR 등 국제 개인정보 보호 기준을 준수합니다.
              </div>
            </Section>

            {/* 제6조 */}
            <Section title="제6조 (정보주체와 법정대리인의 권리·의무 및 행사방법)">
              <SubSection title="6.1 정보주체의 권리">
                <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
                <ul>
                  <li>개인정보 열람 요구</li>
                  <li>오류 등이 있을 경우 정정 요구</li>
                  <li>삭제 요구</li>
                  <li>처리정지 요구</li>
                </ul>
              </SubSection>

              <SubSection title="6.2 권리 행사 방법">
                <ul>
                  <li>서비스 내 계정 설정에서 직접 조회·수정·삭제</li>
                  <li>개인정보 보호책임자에게 이메일로 요청</li>
                  <li>회사는 요청을 받은 날로부터 10일 이내에 조치하고 결과를 알려드립니다.</li>
                </ul>
              </SubSection>

              <SubSection title="6.3 아동의 개인정보">
                <ul>
                  <li>회사는 만 14세 미만 아동의 개인정보를 수집하지 않습니다. 만 14세 미만의 경우 법정대리인의 동의가 필요하며, 법정대리인은 아동의 개인정보에 대한 열람, 정정, 삭제, 처리정지를 요구할 수 있습니다.</li>
                </ul>
              </SubSection>
            </Section>

            {/* 제7조 */}
            <Section title="제7조 (개인정보의 파기)">
              <SubSection title="7.1 파기 절차">
                <ul>
                  <li>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.</li>
                  <li>정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.</li>
                </ul>
              </SubSection>

              <SubSection title="7.2 파기 방법">
                <ul>
                  <li><strong>전자적 파일:</strong> 복원이 불가능한 방법으로 영구 삭제</li>
                  <li><strong>종이 문서:</strong> 분쇄기로 분쇄하거나 소각</li>
                </ul>
              </SubSection>
            </Section>

            {/* 제8조 */}
            <Section title="제8조 (개인정보의 안전성 확보조치)">
              <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
              <ul>
                <li><strong>관리적 조치:</strong> 내부관리계획 수립·시행, 정기적 직원 교육</li>
                <li><strong>기술적 조치:</strong> 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
                <li><strong>물리적 조치:</strong> 전산실, 자료보관실 등의 접근통제</li>
                <li><strong>암호화:</strong> 비밀번호는 단방향 암호화하여 저장, 중요 데이터는 SSL/TLS 암호화 통신 적용</li>
              </ul>
            </Section>

            {/* 제9조 */}
            <Section title="제9조 (개인정보 자동 수집 장치의 설치·운영 및 거부)">
              <SubSection title="9.1 쿠키의 사용 목적">
                <ul>
                  <li>회사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.</li>
                  <li>쿠키는 웹사이트 서버가 이용자의 브라우저에 전송하는 소량의 텍스트 파일로, 이용자 컴퓨터에 저장됩니다.</li>
                </ul>
              </SubSection>

              <SubSection title="9.2 쿠키의 설치·운영 및 거부">
                <ul>
                  <li>이용자는 쿠키 설치에 대한 선택권을 가지고 있으며, 웹브라우저 설정을 통해 쿠키 허용, 쿠키 차단 등의 설정을 할 수 있습니다.</li>
                  <li>다만, 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.</li>
                </ul>
              </SubSection>
            </Section>

            {/* 제10조 */}
            <Section title="제10조 (개인정보 보호책임자)">
              <p>
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <Table
                headers={['항목', '내용']}
                rows={[
                  ['개인정보 보호책임자', '이성연 / 대표'],
                  ['연락처', 'support@marketingdiet.online'],
                ]}
              />
              <p style={{ marginTop: '16px' }}>
                정보주체는 회사의 서비스를 이용하면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의할 수 있습니다. 회사는 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.
              </p>
            </Section>

            {/* 제11조 */}
            <Section title="제11조 (권익침해 구제방법)">
              <p>
                정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다.
              </p>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                marginTop: '16px',
              }}>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li><strong>개인정보분쟁조정위원회:</strong> (국번없이) 1833-6972 (www.kopico.go.kr)</li>
                  <li><strong>개인정보침해신고센터:</strong> (국번없이) 118 (privacy.kisa.or.kr)</li>
                  <li><strong>대검찰청 사이버수사과:</strong> (국번없이) 1301 (www.spo.go.kr)</li>
                  <li><strong>경찰청 사이버안전국:</strong> (국번없이) 182 (cyberbureau.police.go.kr)</li>
                </ul>
              </div>
            </Section>

            {/* 제12조 */}
            <Section title="제12조 (개인정보처리방침 변경)">
              <ul>
                <li>이 개인정보처리방침은 2026년 1월 1일부터 적용됩니다.</li>
                <li>이전의 개인정보처리방침은 아래에서 확인하실 수 있습니다.</li>
                <li>본 방침이 변경되는 경우 변경 사항을 서비스 내 공지사항을 통하여 고지하며, 변경된 개인정보처리방침은 공지한 날로부터 7일 후부터 효력이 발생합니다.</li>
              </ul>
            </Section>

            {/* 부칙 */}
            <Section title="부칙">
              <p>본 개인정보처리방침은 2026년 1월 1일부터 시행합니다.</p>
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
            <Link href="/refund" style={{
              color: 'rgba(255, 255, 255, 0.6)',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s',
            }}>
              환불 정책
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
