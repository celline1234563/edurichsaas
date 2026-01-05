'use client'

const PhoneFrame = ({ children }) => (
  <div style={{
    position: 'relative',
    margin: '0 auto',
    border: '14px solid #1f2937',
    background: '#1f2937',
    borderRadius: '40px',
    height: '600px',
    width: '300px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
  }}>
    {/* Notch */}
    <div style={{
      width: '148px',
      height: '18px',
      background: '#1f2937',
      borderRadius: '0 0 16px 16px',
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 20
    }}></div>

    {/* Side buttons */}
    <div style={{ height: '32px', width: '3px', background: '#1f2937', position: 'absolute', left: '-17px', top: '72px', borderRadius: '4px 0 0 4px' }}></div>
    <div style={{ height: '46px', width: '3px', background: '#1f2937', position: 'absolute', left: '-17px', top: '124px', borderRadius: '4px 0 0 4px' }}></div>
    <div style={{ height: '46px', width: '3px', background: '#1f2937', position: 'absolute', left: '-17px', top: '178px', borderRadius: '4px 0 0 4px' }}></div>
    <div style={{ height: '64px', width: '3px', background: '#1f2937', position: 'absolute', right: '-17px', top: '142px', borderRadius: '0 4px 4px 0' }}></div>

    {/* Screen Content */}
    <div style={{
      borderRadius: '32px',
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      background: '#bacee0',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Status Bar */}
      <div style={{
        background: '#bacee0',
        padding: '12px 24px 4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        fontWeight: '600',
        color: '#374151',
        zIndex: 10
      }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <span>Wifi</span>
          <div style={{ width: '16px', height: '12px', background: '#374151', borderRadius: '2px' }}></div>
        </div>
      </div>

      {/* Header */}
      <div style={{
        background: '#bacee0',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        zIndex: 10,
        flexShrink: 0
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '12px',
          background: '#facc15',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '8px',
          fontWeight: 'bold',
          color: '#3C1E1E'
        }}>에듀케어</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937' }}>에듀케어 알림</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ padding: '2px 6px', background: '#e5e7eb', fontSize: '10px', borderRadius: '4px', color: '#6b7280' }}>채널</span>
          </div>
        </div>
        <span style={{
          marginLeft: 'auto',
          padding: '4px 8px',
          background: '#facc15',
          fontSize: '10px',
          fontWeight: 'bold',
          borderRadius: '9999px',
          color: '#3C1E1E'
        }}>친구추가</span>
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {children}
      </div>

      {/* Input Area */}
      <div style={{
        background: 'white',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          background: '#f3f4f6',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9ca3af'
        }}>+</div>
        <div style={{
          flex: 1,
          background: '#f3f4f6',
          borderRadius: '9999px',
          height: '32px',
          padding: '0 12px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          color: '#9ca3af'
        }}>메시지를 입력하세요</div>
        <div style={{
          width: '32px',
          height: '32px',
          background: '#facc15',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#3C1E1E'
        }}>↑</div>
      </div>
    </div>
  </div>
);

const KakaoBubble = ({ children, time }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', maxWidth: '90%' }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '12px',
        background: '#facc15',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '8px',
        fontWeight: 'bold',
        color: '#3C1E1E'
      }}>에듀케어</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '12px', color: '#4b5563', fontWeight: '500' }}>에듀케어 알림</span>
        <div style={{
          background: 'white',
          padding: '12px',
          borderRadius: '0 12px 12px 12px',
          fontSize: '14px',
          color: '#1f2937',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          {children}
        </div>
      </div>
    </div>
    <span style={{ fontSize: '10px', color: '#6b7280', marginLeft: '40px' }}>{time}</span>
  </div>
);

const KakaoMessageContent = ({ type, studentName }) => {
  if (type === 'consultation') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>📅</span> <span>상담 예약 확정</span>
        </div>
        <p style={{ margin: 0 }}>안녕하세요, <b>{studentName}</b> 학부모님.</p>
        <p style={{ margin: 0 }}><b>리치영어학원</b> 상담이 예약되었습니다.</p>
        <div style={{ background: '#f9fafb', padding: '8px', borderRadius: '4px', fontSize: '12px', color: '#4b5563' }}>
          <p style={{ margin: '4px 0' }}>📅 일시: <span style={{ color: '#2563eb', fontWeight: 'bold' }}>12월 15일(일) 오후 2:00</span></p>
          <p style={{ margin: '4px 0' }}>📍 장소: 본원 상담실</p>
          <p style={{ margin: '4px 0' }}>👤 담당: 김원장</p>
        </div>
        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>※ 일정 변경이 필요하시면 학원으로 연락 부탁드립니다.</p>
        <div style={{ paddingTop: '8px' }}>
          <button style={{ width: '100%', background: '#f3f4f6', padding: '8px', borderRadius: '4px', fontSize: '12px', color: '#374151', fontWeight: '500', border: '1px solid #e5e7eb', cursor: 'pointer' }}>📍 학원 위치 보기</button>
        </div>
      </div>
    );
  }
  if (type === 'attendance') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>🏫</span> <span>등원 알림</span>
        </div>
        <p style={{ margin: 0 }}><b>{studentName}</b> 학생이</p>
        <p style={{ margin: 0 }}><span style={{ color: '#2563eb', fontWeight: 'bold' }}>오후 3:40</span>에 등원하였습니다. ✅</p>
        <p style={{ marginTop: '8px', marginBottom: 0 }}>오늘도 열심히 공부하겠습니다! 📖</p>
      </div>
    );
  }
  if (type === 'report') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>📊</span> <span>주간 학습 리포트</span>
        </div>
        <p style={{ margin: 0 }}><b>{studentName}</b> 학생의<br />12월 2주차 학습 리포트입니다.</p>
        <div style={{ background: '#f9fafb', padding: '8px', borderRadius: '4px', fontSize: '12px', marginTop: '8px' }}>
          <p style={{ margin: '4px 0' }}>✅ 출석률: <span style={{ color: '#2563eb', fontWeight: 'bold' }}>100%</span></p>
          <p style={{ margin: '4px 0' }}>📝 숙제완료: <span style={{ color: '#2563eb', fontWeight: 'bold' }}>4/4</span></p>
          <p style={{ margin: '4px 0' }}>📈 단어테스트: <span style={{ color: '#2563eb', fontWeight: 'bold' }}>92점</span></p>
        </div>
        <p style={{ fontSize: '12px', marginTop: '8px', marginBottom: 0 }}>이번 주도 열심히 했어요! 👏<br />문법 파트 복습 권장드립니다.</p>
        <div style={{ paddingTop: '8px' }}>
          <button style={{ width: '100%', background: '#f3f4f6', padding: '8px', borderRadius: '4px', fontSize: '12px', color: '#374151', fontWeight: '500', border: '1px solid #e5e7eb', cursor: 'pointer' }}>📋 상세 리포트 보기</button>
        </div>
      </div>
    );
  }
  if (type === 'payment') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>💳</span> <span>1월 수강료 안내</span>
        </div>
        <p style={{ margin: 0 }}>안녕하세요, <b>{studentName}</b> 학부모님.</p>
        <p style={{ margin: 0 }}><b>리치영어학원</b> 1월 수강료 안내드립니다.</p>
        <div style={{ background: '#f9fafb', padding: '8px', borderRadius: '4px', fontSize: '12px', color: '#4b5563' }}>
          <p style={{ margin: '4px 0' }}>📚 과목: 영어 정규반</p>
          <p style={{ margin: '4px 0' }}>💰 금액: <span style={{ color: '#2563eb', fontWeight: 'bold' }}>350,000원</span></p>
          <p style={{ margin: '4px 0' }}>🗓 납부기한: 12월 25일까지</p>
        </div>
        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>※ 카드결제/계좌이체 가능</p>
        <div style={{ paddingTop: '8px' }}>
          <button style={{ width: '100%', background: '#f3f4f6', padding: '8px', borderRadius: '4px', fontSize: '12px', color: '#374151', fontWeight: '500', border: '1px solid #e5e7eb', cursor: 'pointer' }}>💳 간편 결제하기</button>
        </div>
      </div>
    );
  }
  return <div>메시지 내용이 없습니다.</div>;
};

export function PhoneMockupDisplay({ type, studentName, time }) {
  return (
    <PhoneFrame>
      <KakaoBubble time={time}>
        <KakaoMessageContent type={type} studentName={studentName} />
      </KakaoBubble>
    </PhoneFrame>
  );
}
