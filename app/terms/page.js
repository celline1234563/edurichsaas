'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TermsPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
              이용약관
            </div>
            <h1 style={{
              fontSize: isMobile ? '32px' : '48px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '16px',
              lineHeight: '1.2',
            }}>
              EduRichBrain 서비스 이용약관
            </h1>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}>
              최종 업데이트: 2024년 12월
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
              본 이용약관(이하 "약관")은 마케팅다이어트(이하 "회사")가 제공하는 EduRichBrain 서비스(이하 "서비스")의 이용에 관한 조건 및 절차, 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다. 서비스를 이용하시기 전에 본 약관을 주의 깊게 읽어주시기 바랍니다.
            </p>
          </div>

          {/* Terms Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* 제1조 */}
            <Section title="제1조 (목적)">
              <p>
                본 약관은 회사가 운영하는 EduRichBrain 플랫폼에서 제공하는 서비스의 이용조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </Section>

            {/* 제2조 */}
            <Section title="제2조 (정의)">
              <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
              <ul>
                <li><strong>"서비스"</strong>란 EduRichBrain 소프트웨어, 플랫폼 및 회사가 제공하는 모든 관련 기능, 콘텐츠를 의미합니다.</li>
                <li><strong>"이용자"</strong>란 본 약관에 동의하고 서비스를 이용하는 개인 또는 법인을 의미합니다.</li>
                <li><strong>"콘텐츠"</strong>란 이용자가 서비스 내에서 업로드, 생성, 공유하는 모든 데이터, 정보, 자료를 의미합니다.</li>
                <li><strong>"AI 기능"</strong>란 서비스 내에서 제공되는 인공지능 기반 콘텐츠 생성, 분석, 추천 등의 기능을 의미합니다.</li>
                <li><strong>"크레딧"</strong>란 AI 기능 사용을 위해 필요한 서비스 내 가상 화폐를 의미합니다.</li>
              </ul>
            </Section>

            {/* 제3조 */}
            <Section title="제3조 (약관의 효력 및 변경)">
              <ul>
                <li>본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</li>
                <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경된 약관은 적용일자 및 변경사유를 명시하여 서비스 내 공지합니다.</li>
                <li>변경된 약관에 동의하지 않는 이용자는 서비스 이용을 중단하고 탈퇴할 수 있으며, 변경된 약관의 효력 발생일 이후에도 서비스를 계속 이용하는 경우 변경된 약관에 동의한 것으로 간주합니다.</li>
              </ul>
            </Section>

            {/* 제4조 */}
            <Section title="제4조 (서비스 이용 계약의 성립)">
              <ul>
                <li>서비스 이용 계약은 이용자가 본 약관에 동의하고 회원가입을 완료한 후, 회사가 이를 승낙함으로써 성립됩니다.</li>
                <li>회사는 다음 각 호에 해당하는 경우 이용신청을 승낙하지 않을 수 있습니다:
                  <ul style={{ marginTop: '8px' }}>
                    <li>실명이 아니거나 타인의 정보를 이용한 경우</li>
                    <li>허위 정보를 기재하거나 필수 정보를 누락한 경우</li>
                    <li>기타 서비스 운영에 현저한 지장을 초래할 우려가 있는 경우</li>
                  </ul>
                </li>
                <li>이용자는 가입 시 제공한 정보에 변경이 있는 경우 즉시 회사에 알려야 합니다.</li>
              </ul>
            </Section>

            {/* 제5조 */}
            <Section title="제5조 (이용자 계정)">
              <SubSection title="5.1 계정 생성 및 관리">
                <ul>
                  <li>이용자는 정확하고 완전한 정보를 제공하여 계정을 생성해야 합니다.</li>
                  <li>이용자는 계정 정보의 비밀을 유지할 책임이 있으며, 계정에서 발생하는 모든 활동에 대해 책임을 집니다.</li>
                </ul>
              </SubSection>
              <SubSection title="5.2 계정 보안">
                <ul>
                  <li>이용자는 강력한 비밀번호를 사용하고, 가능한 경우 이중 인증을 활성화해야 합니다.</li>
                  <li>계정의 무단 사용이 의심되는 경우 즉시 회사에 통지해야 합니다.</li>
                </ul>
              </SubSection>
              <SubSection title="5.3 계정 제한">
                <ul>
                  <li>이용자는 타인에게 계정을 양도하거나 공유할 수 없습니다. 회사는 본 약관을 위반하거나 금지된 활동에 관여하는 계정을 정지 또는 해지할 권리를 보유합니다.</li>
                </ul>
              </SubSection>
            </Section>

            {/* 제6조 */}
            <Section title="제6조 (서비스 이용료 및 결제)">
              <SubSection title="6.1 요금제 및 결제">
                <ul>
                  <li>서비스는 무료 체험, 정기 구독, 크레딧 기반 등 다양한 요금제를 제공합니다.</li>
                  <li>구독 요금제의 경우 월간 또는 연간 단위로 청구되며, 자동 갱신됩니다.</li>
                  <li>결제는 토스페이먼츠를 통해 처리되며, 이용 가능한 결제 수단은 서비스 내에서 안내됩니다.</li>
                </ul>
              </SubSection>
              <SubSection title="6.2 환불 정책">
                <ul>
                  <li>환불은 관련 법령 및 회사의 환불 정책에 따라 처리됩니다.</li>
                  <li>구독 취소는 계정 설정 또는 고객센터를 통해 언제든지 가능하며, 취소 시점에 따라 잔여 기간에 대한 환불이 제공될 수 있습니다.</li>
                  <li>사용된 크레딧은 환불 대상에서 제외됩니다.</li>
                </ul>
              </SubSection>
              <SubSection title="6.3 가격 변경">
                <ul>
                  <li>회사는 서비스 가격을 변경할 수 있으며, 가격 변경 시 최소 30일 전에 이용자에게 통지합니다.</li>
                </ul>
              </SubSection>
            </Section>

            {/* 제7조 */}
            <Section title="제7조 (지식재산권)">
              <SubSection title="7.1 회사의 권리">
                <ul>
                  <li>서비스에 포함된 소프트웨어, 디자인, 텍스트, 그래픽, 로고, 상표 등 모든 지식재산권은 회사 또는 라이선스 제공자에게 귀속됩니다.</li>
                </ul>
              </SubSection>
              <SubSection title="7.2 이용자 콘텐츠">
                <ul>
                  <li>이용자가 서비스 내에서 생성한 콘텐츠의 소유권은 이용자에게 있습니다.</li>
                  <li>단, 이용자는 회사에게 서비스 제공 및 개선 목적으로 해당 콘텐츠를 사용, 복제, 수정, 배포할 수 있는 전 세계적, 비독점적, 무상의 라이선스를 부여합니다.</li>
                </ul>
              </SubSection>
              <SubSection title="7.3 서비스 이용권">
                <ul>
                  <li>회사는 이용자에게 본 약관에 따라 서비스를 이용할 수 있는 제한적, 비독점적, 양도 불가능한 라이선스를 부여합니다.</li>
                </ul>
              </SubSection>
            </Section>

            {/* 제8조 */}
            <Section title="제8조 (비밀유지)">
              <SubSection title="8.1 비밀정보의 보호">
                <ul>
                  <li>이용자는 서비스를 통해 접근하게 된 비밀정보를 비밀로 유지하고 회사의 사전 서면 동의 없이 제3자에게 공개하지 않아야 합니다.</li>
                </ul>
              </SubSection>
              <SubSection title="8.2 예외사항">
                <ul>
                  <li>본 조항은 공개적으로 이용 가능한 정보, 이용자가 독자적으로 개발한 정보, 또는 비밀유지 의무 없이 제3자로부터 적법하게 취득한 정보에는 적용되지 않습니다.</li>
                </ul>
              </SubSection>
            </Section>

            {/* 제9조 */}
            <Section title="제9조 (이용자의 의무)">
              <p>이용자는 다음 행위를 해서는 안 됩니다:</p>
              <ul>
                <li>타인의 정보를 도용하거나 허위 정보를 등록하는 행위</li>
                <li>서비스를 이용하여 법령 또는 공서양속에 위반되는 행위</li>
                <li>회사의 지식재산권, 제3자의 지식재산권 등 기타 권리를 침해하는 행위</li>
                <li>서비스의 안정적 운영을 방해하는 행위 (해킹, 악성코드 배포 등)</li>
                <li>서비스를 역설계, 디컴파일, 분해하거나 소스코드를 추출하려는 시도</li>
                <li>AI 기능을 악용하여 허위 정보, 스팸, 불법 콘텐츠를 생성하는 행위</li>
                <li>기타 회사가 합리적으로 부적절하다고 판단하는 행위</li>
              </ul>
            </Section>

            {/* 제10조 */}
            <Section title="제10조 (서비스의 제공 및 변경)">
              <ul>
                <li>회사는 이용자에게 아래와 같은 서비스를 제공합니다:
                  <ul style={{ marginTop: '8px' }}>
                    <li>학원 운영 관리 기능 (상담 관리, 학생 관리 등)</li>
                    <li>AI 기반 콘텐츠 생성 기능 (블로그, 커리큘럼, 마케팅 자료 등)</li>
                    <li>데이터 분석 및 리포트 기능</li>
                    <li>기타 회사가 추가 개발하여 제공하는 서비스</li>
                  </ul>
                </li>
                <li>회사는 서비스의 품질 향상을 위해 서비스의 전부 또는 일부를 변경할 수 있습니다.</li>
                <li>서비스 변경 시 변경 내용과 적용 일자를 명시하여 사전에 공지합니다.</li>
              </ul>
            </Section>

            {/* 제11조 */}
            <Section title="제11조 (계약 해지)">
              <SubSection title="11.1 이용자에 의한 해지">
                <ul>
                  <li>이용자는 언제든지 계정 설정을 통해 또는 고객센터에 연락하여 서비스 이용 계약을 해지할 수 있습니다.</li>
                </ul>
              </SubSection>
              <SubSection title="11.2 회사에 의한 해지">
                <ul>
                  <li>회사는 이용자가 본 약관을 위반하거나, 미결제 상태가 지속되거나, 계정이 장기간 비활성 상태인 경우 이용 계약을 해지하거나 정지할 수 있습니다.</li>
                  <li>중대한 위반의 경우를 제외하고, 회사는 해지 전 합리적인 사전 통지를 제공합니다.</li>
                </ul>
              </SubSection>
              <SubSection title="11.3 해지 후 효과">
                <ul>
                  <li>해지 시 서비스 이용 권한은 즉시 소멸됩니다.</li>
                  <li>회사는 관련 법령에 따라 이용자의 계정 및 데이터를 삭제할 수 있으며, 환불 정책에 별도로 명시된 경우를 제외하고 환불 대상이 아닙니다.</li>
                  <li>비밀유지, 면책, 책임 제한, 분쟁 해결 조항은 해지 후에도 유효합니다.</li>
                </ul>
              </SubSection>
            </Section>

            {/* 제12조 */}
            <Section title="제12조 (면책조항)">
              <ul>
                <li>서비스는 "있는 그대로" 및 "이용 가능한 상태로" 제공되며, 회사는 상품성, 특정 목적에의 적합성, 비침해성에 대한 명시적 또는 묵시적 보증을 포함하여 어떠한 종류의 보증도 하지 않습니다.</li>
                <li>회사는 서비스가 중단 없이, 오류 없이, 안전하게 제공될 것을 보증하지 않습니다.</li>
                <li>AI 기능을 통해 생성된 콘텐츠의 정확성, 완전성, 적법성에 대해 회사는 보증하지 않으며, 이용자는 생성된 콘텐츠를 검토하고 적절히 수정하여 사용해야 합니다.</li>
              </ul>
            </Section>

            {/* 제13조 */}
            <Section title="제13조 (책임의 제한)">
              <ul>
                <li>회사 또는 그 관계사, 임직원, 대리인, 라이선스 제공자는 서비스 이용 또는 이용 불능으로 인해 발생하는 간접적, 부수적, 특별, 결과적, 징벌적 손해(이익 손실, 데이터 손실, 영업권 손실 등 포함)에 대해 책임지지 않습니다.</li>
                <li>본 약관에 따른 회사의 총 책임은 청구 원인이 발생한 날로부터 12개월 이내에 이용자가 회사에 지급한 금액을 초과하지 않습니다.</li>
                <li>일부 관할권에서는 특정 손해에 대한 책임 제한이 허용되지 않으므로, 위 제한은 해당 법률이 허용하는 범위 내에서 적용됩니다.</li>
              </ul>
            </Section>

            {/* 제14조 */}
            <Section title="제14조 (분쟁 해결)">
              <ul>
                <li>본 약관과 관련하여 발생하는 분쟁은 당사자 간의 협의로 우선 해결합니다.</li>
                <li>협의가 30일 내에 이루어지지 않을 경우, 대한상사중재원의 중재 규칙에 따라 중재로 해결하거나, 대한민국 법원의 관할에 따릅니다.</li>
                <li>중재는 서울특별시에서 진행되며, 중재 판정은 최종적이고 구속력을 가집니다.</li>
              </ul>
            </Section>

            {/* 제15조 */}
            <Section title="제15조 (준거법)">
              <p>본 약관 및 서비스 이용은 대한민국 법률에 따라 규율되고 해석됩니다.</p>
            </Section>

            {/* 제16조 */}
            <Section title="제16조 (기타)">
              <ul>
                <li><strong>분리가능성:</strong> 본 약관의 어떤 조항이 무효이거나 집행 불가능한 것으로 판명되더라도, 해당 조항은 약관에서 분리되며 나머지 조항은 계속 유효합니다.</li>
                <li><strong>완전합의:</strong> 본 약관은 서비스에 관한 당사자 간의 완전한 합의를 구성하며, 서비스에 관한 모든 이전의 구두 또는 서면 합의를 대체합니다.</li>
                <li><strong>양도:</strong> 이용자는 회사의 사전 서면 동의 없이 본 약관 또는 약관에 따른 권리를 양도하거나 이전할 수 없습니다. 회사는 제한 없이 본 약관을 양도하거나 이전할 수 있습니다.</li>
                <li><strong>통지:</strong> 회사는 이메일, 앱 내 알림 또는 서비스를 통해 이용자에게 통지할 수 있습니다. 이용자는 회사 이메일 주소로 통지할 수 있습니다.</li>
                <li><strong>불가항력:</strong> 천재지변, 자연재해, 전쟁, 테러, 폭동, 정부 조치, 노동 분쟁 등 합리적 통제를 벗어난 사유로 인한 이행 지연이나 불이행에 대해 어느 당사자도 책임지지 않습니다.</li>
                <li><strong>권리 불포기:</strong> 본 약관의 어떤 조항을 집행하지 않더라도 해당 조항이나 다른 조항에 대한 권리 포기로 간주되지 않습니다.</li>
              </ul>
            </Section>

            {/* 문의처 */}
            <Section title="문의처">
              <p>본 약관에 대한 문의사항이 있으시면 아래로 연락해 주시기 바랍니다:</p>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                padding: '24px',
                marginTop: '16px',
              }}>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li><strong>회사명:</strong> 마케팅다이어트</li>
                  <li><strong>이메일:</strong> support@marketingdiet.online</li>
                  <li><strong>웹사이트:</strong> www.edurichbrain.com</li>
                </ul>
              </div>
            </Section>

            {/* 부칙 */}
            <Section title="부칙">
              <p>본 약관은 2026년 1월 1일부터 시행합니다.</p>
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
            <Link href="/privacy" style={{
              color: 'rgba(255, 255, 255, 0.6)',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s',
            }}>
              개인정보처리방침
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
