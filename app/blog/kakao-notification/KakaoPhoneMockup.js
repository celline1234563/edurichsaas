'use client'

const PhoneFrame = ({ title, children }) => (
  <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
    <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20"></div>
    <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
    <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
    <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
    <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>

    {/* Screen Content */}
    <div className="rounded-[2rem] overflow-hidden w-full h-full bg-[#bacee0] relative flex flex-col">
      {/* Status Bar */}
      <div className="bg-[#bacee0] px-6 pt-3 pb-1 flex justify-between items-center text-xs font-semibold text-gray-700 z-10">
        <span>9:41</span>
        <div className="flex gap-1">
          <span>Wifi</span>
          <div className="w-4 h-3 bg-gray-700 rounded-sm"></div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-[#bacee0] px-4 py-2 flex items-center gap-2 border-b border-black/5 z-10 shrink-0">
        <div className="w-8 h-8 rounded-[12px] bg-yellow-400 flex items-center justify-center text-xs font-bold text-[#3C1E1E]">
          에듀
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-800">에듀 알림</span>
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-gray-200 text-[10px] rounded text-gray-500">채널</span>
          </div>
        </div>
        <span className="ml-auto px-2 py-1 bg-yellow-400 text-[10px] font-bold rounded-full text-[#3C1E1E]">친구추가</span>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
        {children}
      </div>

      {/* Input Area */}
      <div className="bg-white p-2 flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-400">+</div>
        <div className="flex-1 bg-gray-100 rounded-full h-8 px-3 text-xs flex items-center text-gray-400">메시지를 입력하세요</div>
        <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center font-bold text-[#3C1E1E]">↑</div>
      </div>
    </div>
  </div>
);

const KakaoBubble = ({ children, time }) => (
  <div className="flex flex-col gap-1 w-full max-w-[90%]">
    <div className="flex items-start gap-2">
      <div className="w-8 h-8 rounded-[12px] bg-yellow-400 shrink-0 flex items-center justify-center text-[10px] font-bold text-[#3C1E1E]">
        에듀
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-600 font-medium">에듀 알림</span>
        <div className="bg-white p-3 rounded-r-lg rounded-bl-lg text-sm text-gray-800 shadow-sm relative">
          {/* Content */}
          {children}
        </div>
      </div>
    </div>
    <span className="text-[10px] text-gray-500 ml-10">{time}</span>
  </div>
);

const KakaoMessageContent = ({ type, studentName }) => {
  if (type === 'consultation') {
    return (
      <div className="space-y-3">
        <div className="font-bold border-b pb-2 mb-2 flex items-center gap-1">
          <span>📅</span> <span>상담 예약 확정</span>
        </div>
        <p>안녕하세요, <b>{studentName}</b> 학부모님.</p>
        <p><b>리치영어학원</b> 상담이 예약되었습니다.</p>
        <div className="bg-gray-50 p-2 rounded text-xs space-y-1 text-gray-600">
          <p>📅 일시: <span className="text-blue-600 font-bold">12월 15일(일) 오후 2:00</span></p>
          <p>📍 장소: 본원 상담실</p>
          <p>👤 담당: 김원장</p>
        </div>
        <p className="text-xs text-gray-500">※ 일정 변경이 필요하시면 학원으로 연락 부탁드립니다.</p>
        <div className="pt-2">
          <button className="w-full bg-gray-100 py-2 rounded text-xs text-gray-700 font-medium border border-gray-200">📍 학원 위치 보기</button>
        </div>
      </div>
    );
  }
  if (type === 'attendance') {
    return (
      <div className="space-y-3">
        <div className="font-bold border-b pb-2 mb-2 flex items-center gap-1">
          <span>🏫</span> <span>등원 알림</span>
        </div>
        <p><b>{studentName}</b> 학생이</p>
        <p><span className="text-blue-600 font-bold">오후 3:40</span>에 등원하였습니다. ✅</p>
        <p className="mt-2">오늘도 열심히 공부하겠습니다! 📖</p>
      </div>
    );
  }
  if (type === 'report') {
    return (
      <div className="space-y-3">
        <div className="font-bold border-b pb-2 mb-2 flex items-center gap-1">
          <span>📊</span> <span>주간 학습 리포트</span>
        </div>
        <p><b>{studentName}</b> 학생의<br />12월 2주차 학습 리포트입니다.</p>
        <div className="bg-gray-50 p-2 rounded text-xs space-y-1 mt-2">
          <p>✅ 출석률: <span className="text-blue-600 font-bold">100%</span></p>
          <p>📝 숙제완료: <span className="text-blue-600 font-bold">4/4</span></p>
          <p>📈 단어테스트: <span className="text-blue-600 font-bold">92점</span></p>
        </div>
        <p className="text-xs mt-2">이번 주도 열심히 했어요! 👏<br />문법 파트 복습 권장드립니다.</p>
        <div className="pt-2">
          <button className="w-full bg-gray-100 py-2 rounded text-xs text-gray-700 font-medium border border-gray-200">📋 상세 리포트 보기</button>
        </div>
      </div>
    );
  }
  if (type === 'payment') {
    return (
      <div className="space-y-3">
        <div className="font-bold border-b pb-2 mb-2 flex items-center gap-1">
          <span>💳</span> <span>1월 수강료 안내</span>
        </div>
        <p>안녕하세요, <b>{studentName}</b> 학부모님.</p>
        <p><b>리치영어학원</b> 1월 수강료 안내드립니다.</p>
        <div className="bg-gray-50 p-2 rounded text-xs space-y-1 text-gray-600">
          <p>📚 과목: 영어 정규반</p>
          <p>💰 금액: <span className="text-blue-600 font-bold">350,000원</span></p>
          <p>🗓 납부기한: 12월 25일까지</p>
        </div>
        <p className="text-xs text-gray-500">※ 카드결제/계좌이체 가능</p>
        <div className="pt-2">
          <button className="w-full bg-gray-100 py-2 rounded text-xs text-gray-700 font-medium border border-gray-200">💳 간편 결제하기</button>
        </div>
      </div>
    );
  }
  return <div>메시지 내용이 없습니다.</div>;
};

export function PhoneMockupDisplay({ type, studentName, time }) {
  return (
    <PhoneFrame title={type}>
      <KakaoBubble time={time}>
        <KakaoMessageContent type={type} studentName={studentName} />
      </KakaoBubble>
    </PhoneFrame>
  );
}
