'use client'

import Link from 'next/link'
import Flowchart from './Flowchart'
import { PhoneMockupDisplay } from './KakaoPhoneMockup'
import { MESSAGE_TYPES, COMPARISON_DATA, FAQ_DATA } from './constants'

export default function KakaoNotificationBlogPage() {
  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#f1f5f9',
      background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)'
    }}>

      {/* Top Navigation Bar */}
      <nav style={{
        position: 'fixed',
        width: '100%',
        zIndex: 50,
        background: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(55, 65, 81, 0.5)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/blog" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              transition: 'background 0.2s'
            }}>
              <svg style={{ width: '20px', height: '20px', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                background: '#2563eb',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>E</div>
              <span style={{ fontWeight: 'bold', fontSize: '18px', color: 'white' }}>EduRichBrain Blog</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/" className="login-btn" style={{ padding: '6px 12px', fontSize: '12px' }}>
              홈으로
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Background Image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src="https://img.hankyung.com/photo/202511/02.41917781.1.jpg"
            alt="KakaoTalk notification"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, #111827 0%, rgba(17, 24, 39, 0.6) 50%, rgba(17, 24, 39, 0.3) 100%)'
          }}></div>
        </div>

        {/* Hero Content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '1024px',
          padding: '0 16px',
          marginTop: '40px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
            <Link href="/blog" style={{
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '14px',
              color: '#93c5fd',
              textDecoration: 'none'
            }}>
              ← 목록으로
            </Link>
            <span style={{
              padding: '4px 12px',
              borderRadius: '9999px',
              background: '#2563eb',
              fontSize: '14px',
              fontWeight: 'bold',
              color: 'white'
            }}>
              EduRichBrain
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(24px, 5vw, 48px)',
            fontWeight: '900',
            color: 'white',
            lineHeight: 1.2,
            marginBottom: '24px',
            wordBreak: 'keep-all'
          }}>
            학부모님들께 우리 아이의 학습현황을<br /> 가장 빠르게 주는 방법 : 카카오톡 알림
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '14px', color: '#9ca3af' }}>
            <span>EduRichBrain</span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#6b7280' }}></span>
            <span>2025년 12월 16일</span>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 16px 80px',
        marginTop: '-128px',
        position: 'relative',
        zIndex: 20
      }}>
        <div style={{
          background: '#1f2937',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid #374151',
          overflow: 'hidden'
        }}>

          {/* Intro Section */}
          <div style={{
            padding: 'clamp(24px, 5vw, 48px)',
            borderBottom: '1px solid #374151',
            background: 'linear-gradient(180deg, #374151 0%, #1f2937 100%)'
          }}>
            <h2 style={{ fontSize: 'clamp(20px, 4vw, 30px)', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
              학부모님들께 우리 아이의 학습현황을 가장 빠르게 주는 방법 : 카카오톡 알림
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '18px', lineHeight: 1.7, marginBottom: '24px' }}>
              학원 운영의 모든 알림을 카카오톡으로 자동 발송 —<br />
              학부모는 안심하고, 원장님은 업무에서 해방됩니다.
            </p>

            <div style={{
              background: 'rgba(55, 65, 81, 0.5)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #4b5563'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#93c5fd', marginBottom: '12px' }}>
                왜 '학원 알림톡'이 필수일까요?
              </h3>
              <p style={{ color: '#d1d5db', lineHeight: 1.7, fontSize: '15px', marginBottom: '16px' }}>
                많은 원장님들이 여전히 <strong>학원 문자(LMS/SMS)</strong>를 통해 공지사항을 전달하고 계십니다.
                하지만 스팸 문자로 오인받아 확인되지 않거나, 발송 비용(건당 30~50원)이 만만치 않은 것이 현실입니다.
              </p>
              <p style={{ color: '#d1d5db', lineHeight: 1.7, fontSize: '15px' }}>
                <strong>학원 카카오톡 알림</strong>은 대한민국 국민 대부분이 사용하는 카카오톡을 통해 발송되므로
                도달률이 월등히 높습니다. 이제 <strong>학원 알림톡</strong>은 선택이 아닌 필수입니다.
              </p>
            </div>
          </div>

          {/* Problems Section */}
          <div style={{ padding: 'clamp(24px, 5vw, 48px)' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#f87171' }}>#</span> 원장님들의 현실적인 고민
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '32px'
            }}>
              {[
                "상담 예약했는데 노쇼 발생 🤯",
                "등하원 문자 일일이 발송 ⏰",
                "수강료 납부 안내 전화 민망함 😓",
                "학습 리포트 발송 번거로움 📉",
                "단체 문자 비용 부담 💸"
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#374151',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #4b5563'
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f87171', flexShrink: 0 }}></div>
                  <span style={{ color: '#d1d5db', fontWeight: '500', fontSize: '14px' }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{
              background: 'rgba(30, 58, 138, 0.2)',
              borderLeft: '4px solid #3b82f6',
              padding: '16px',
              borderRadius: '0 8px 8px 0'
            }}>
              <p style={{ color: '#d1d5db' }}>
                "아직도 등하원 체크를 위해 엑셀을 켜고, <strong>학원 문자</strong> 사이트에 접속하시나요?
                반복되는 행정 업무만 줄여도 원장님은 교육 퀄리티 향상에 집중할 수 있습니다."
              </p>
            </div>
          </div>

          {/* Solution Section */}
          <div style={{
            padding: 'clamp(24px, 5vw, 48px)',
            background: 'rgba(17, 24, 39, 0.5)',
            borderTop: '1px solid #374151',
            borderBottom: '1px solid #374151'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '32px', textAlign: 'center' }}>
              해결책: 에듀 알림 채널 구조
            </h3>
            <Flowchart />
            <div style={{ marginTop: '32px', textAlign: 'center', maxWidth: '640px', margin: '32px auto 0' }}>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                에듀리치브레인 시스템에서 설정만 하면, <strong style={{ color: '#d1d5db' }}>에듀 알림 채널</strong>을 통해 자동으로 발송됩니다.
                별도의 문자 사이트 접속 없이, 학원 관리 프로그램 내에서 모든 것이 이루어집니다.
              </p>
            </div>
          </div>

          {/* Phone Mockups */}
          <div style={{ padding: 'clamp(24px, 5vw, 48px)', background: 'rgba(55, 65, 81, 0.3)' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
                학부모가 받아보는 실제 화면
              </h3>
              <p style={{ color: '#9ca3af' }}>상담부터 결제, 리포트까지. <strong style={{ color: '#d1d5db' }}>학원 카카오톡</strong>으로 깔끔하게 전달됩니다.</p>
            </div>

            <div style={{
              display: 'flex',
              gap: '32px',
              overflowX: 'auto',
              paddingBottom: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {[
                { type: 'consultation', name: '김민준', time: '오전 9:30', label: '📌 상담 예약 알림', desc: '노쇼 방지를 위한 필수 알림' },
                { type: 'attendance', name: '김민준', time: '오후 3:40', label: '🏫 등·하원 알림', desc: '학부모님이 가장 안심하는 기능' },
                { type: 'payment', name: '김민준', time: '오전 10:00', label: '💳 수강료 납부 안내', desc: '미납률을 획기적으로 줄여줍니다' },
                { type: 'report', name: '김민준', time: '오후 6:00', label: '📊 학습 리포트', desc: '학원의 전문성을 보여주는 리포트' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <PhoneMockupDisplay type={item.type} studentName={item.name} time={item.time} />
                  <p style={{ marginTop: '16px', fontWeight: 'bold', color: '#93c5fd' }}>{item.label}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginTop: '16px' }}>
              * 이미지를 좌우로 스크롤하여 다양한 <strong>학원 알림톡</strong> 예시를 확인해보세요.
            </p>
          </div>

          {/* Message Types */}
          <div style={{ padding: 'clamp(24px, 5vw, 48px)' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '32px' }}>
              발송 가능한 알림톡 유형 상세
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {MESSAGE_TYPES.map((type, idx) => (
                <div key={idx} style={{
                  background: '#374151',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #4b5563'
                }}>
                  <h4 style={{ fontWeight: 'bold', color: '#60a5fa', marginBottom: '16px', fontSize: '18px', borderBottom: '1px solid #4b5563', paddingBottom: '8px' }}>
                    {type.category}
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {type.items.map((item, i) => (
                      <li key={i} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        padding: '8px 0',
                        borderBottom: i < type.items.length - 1 ? '1px solid rgba(75, 85, 99, 0.5)' : 'none'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '6px', height: '6px', background: '#6b7280', borderRadius: '50%' }}></span>
                          <span style={{ color: '#e5e7eb', fontWeight: '500', fontSize: '14px' }}>{item.title}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginLeft: '14px' }}>
                          <span style={{
                            color: '#9ca3af',
                            fontSize: '12px',
                            background: '#1f2937',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            border: '1px solid #374151'
                          }}>{item.timing}</span>
                          <span style={{ color: '#60a5fa', fontSize: '12px', fontWeight: 'bold' }}>{item.effect}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Effects Comparison Table */}
          <div style={{
            padding: 'clamp(24px, 5vw, 48px)',
            background: 'rgba(30, 58, 138, 0.2)',
            borderTop: '1px solid rgba(30, 58, 138, 0.3)',
            borderBottom: '1px solid rgba(30, 58, 138, 0.3)'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '32px', textAlign: 'center' }}>
              도입 기대 효과
            </h3>
            <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
                <thead>
                  <tr style={{ background: 'rgba(30, 58, 138, 0.4)' }}>
                    <th style={{ padding: '16px', fontWeight: '600', color: '#bfdbfe', textAlign: 'left' }}>항목</th>
                    <th style={{ padding: '16px', fontWeight: '600', color: '#bfdbfe', textAlign: 'center', opacity: 0.6 }}>Before (일반 문자)</th>
                    <th style={{ padding: '16px', fontWeight: '600', color: '#facc15', textAlign: 'center' }}>After (에듀알림)</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_DATA.map((row, idx) => (
                    <tr key={idx} style={{ background: idx % 2 === 0 ? 'rgba(30, 58, 138, 0.1)' : 'rgba(30, 58, 138, 0.05)' }}>
                      <td style={{ padding: '16px', fontWeight: '500', color: '#e5e7eb' }}>{row.category}</td>
                      <td style={{ padding: '16px', textAlign: 'center', color: '#6b7280', textDecoration: 'line-through' }}>{row.before}</td>
                      <td style={{ padding: '16px', textAlign: 'center', fontWeight: 'bold', color: '#60a5fa' }}>{row.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <p style={{ color: '#bfdbfe', fontWeight: '500' }}>
                "<strong>학원 문자</strong> 대비 비용은 줄이고, 효과는 높이세요.<br />
                스마트한 학원 운영의 첫걸음입니다."
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div style={{ padding: 'clamp(24px, 5vw, 48px)', background: '#1f2937' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}>자주 묻는 질문</h3>
            {FAQ_DATA.map((faq, idx) => (
              <div key={idx} style={{
                background: '#374151',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #4b5563'
              }}>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#60a5fa', marginBottom: '16px' }}>Q. {faq.question}</h4>
                <p style={{ color: '#d1d5db', lineHeight: 1.7, marginBottom: '24px' }}>{faq.answer}</p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  {faq.comparison.map((comp, cIdx) => (
                    <div key={cIdx} style={{
                      background: 'rgba(17, 24, 39, 0.6)',
                      borderRadius: '8px',
                      padding: '16px',
                      border: '1px solid #4b5563'
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{comp.label}</span>
                      <div style={{ display: 'flex', marginTop: '8px' }}>
                        <div style={{ flex: 1, paddingRight: '12px', borderRight: '1px solid #4b5563' }}>
                          <span style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>문자 (LMS)</span>
                          <span style={{ fontSize: '13px', color: '#6b7280' }}>{comp.sms}</span>
                        </div>
                        <div style={{ flex: 1, paddingLeft: '12px' }}>
                          <span style={{ display: 'block', fontSize: '11px', color: '#facc15', marginBottom: '4px' }}>알림톡</span>
                          <span style={{ fontSize: '13px', color: '#93c5fd', fontWeight: '500' }}>{comp.kakao}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div style={{
            padding: 'clamp(32px, 5vw, 64px)',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '256px',
              height: '256px',
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '50%',
              filter: 'blur(48px)',
              transform: 'translate(50%, -50%)'
            }}></div>
            <div style={{ position: 'relative', zIndex: 10 }}>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 30px)', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
                스마트한 학원 운영의 시작
              </h2>
              <p style={{ color: '#bfdbfe', marginBottom: '40px', maxWidth: '512px', margin: '0 auto 40px' }}>
                지금 바로 에듀리치브레인 데모를 체험해보고,<br />
                <strong>학원 알림톡</strong>으로 변화된 학원 운영을 경험하세요.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
                <Link
                  href="/demo"
                  className="cta-btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  예시 데모 써보기
                  <span>→</span>
                </Link>
                <button style={{
                  background: '#FEE500',
                  color: '#3C1E1E',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3c-4.97 0-9 3.13-9 7 0 2.49 1.66 4.7 4.26 5.95-.19.7-.69 2.53-.78 2.92-.12.53.19.53.4.35.26-.22 3.07-2.09 3.59-2.45.49.07 1 .11 1.53.11 4.97 0 9-3.13 9-7s-4.03-7-9-7z" />
                  </svg>
                  카톡 채널 친구추가
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', padding: '0 16px' }}>
          <Link href="/blog" style={{
            padding: '12px 24px',
            borderRadius: '8px',
            background: '#1f2937',
            color: '#d1d5db',
            fontWeight: '500',
            border: '1px solid #374151',
            textDecoration: 'none'
          }}>
            목록으로
          </Link>
          <button style={{
            padding: '12px 24px',
            borderRadius: '8px',
            background: '#1f2937',
            color: '#d1d5db',
            fontWeight: '500',
            border: '1px solid #374151',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
            </svg>
            공유하기
          </button>
        </div>
      </div>

    </div>
  );
}
