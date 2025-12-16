export const MESSAGE_TYPES = [
  {
    category: "4-1. 상담 관련",
    items: [
      { title: "상담 예약 확정", timing: "예약 완료 즉시", effect: "노쇼 방지" },
      { title: "상담 리마인더", timing: "1일 전 / 당일", effect: "출석률 향상" },
      { title: "일정 변경 안내", timing: "변경 시", effect: "혼선 방지" },
      { title: "상담 취소 안내", timing: "취소 시", effect: "명확한 커뮤니케이션" },
    ]
  },
  {
    category: "4-2. 등·하원 알림",
    items: [
      { title: "등원 알림", timing: "출석 체크 시", effect: "학부모 안심" },
      { title: "하원 알림", timing: "하원 체크 시", effect: "안전 확인" },
    ]
  },
  {
    category: "4-3. 학습 관련",
    items: [
      { title: "주간/월간 학습 리포트", timing: "정기 발송", effect: "신뢰도 상승" },
      { title: "숙제 미제출 알림", timing: "미제출 확인 시", effect: "학습 관리" },
      { title: "테스트 결과 안내", timing: "채점 완료 시", effect: "성과 공유" },
    ]
  },
  {
    category: "4-4. 행정·결제",
    items: [
      { title: "수강료 납부 안내", timing: "결제일 전", effect: "미납 감소" },
      { title: "결제 완료 확인", timing: "결제 완료 시", effect: "영수증 역할" },
      { title: "미납 안내", timing: "기한 경과 시", effect: "부드러운 독촉" },
    ]
  },
  {
    category: "4-5. 학원 운영 공지",
    items: [
      { title: "휴원 안내", timing: "휴원일 전", effect: "사전 공지" },
      { title: "보강 일정", timing: "보강 확정 시", effect: "일정 공유" },
      { title: "수업 일정 안내", timing: "주간 정기", effect: "스케줄 관리" },
    ]
  }
];

export const COMPARISON_DATA = [
  { category: "상담 노쇼율", before: "20~30%", after: "5% 이하" },
  { category: "등하원 문자 발송", before: "하루 30분", after: "0분 (자동)" },
  { category: "수강료 미납률", before: "10~15%", after: "5% 이하" },
  { category: "학부모 만족도", before: "보통", after: "높음" },
  { category: "월 문자 비용", before: "5~10만원", after: "절감" },
];

export const FAQ_DATA = [
  {
    question: "알림톡 vs 문자, 뭐가 다른가요?",
    answer: "알림톡은 카카오톡 채널을 통해 발송되어 스팸 스트레스가 없고, 문자보다 비용이 훨씬 저렴합니다 (건당 약 70% 절감). 또한 프로필 이미지를 통해 학원 브랜딩이 가능하며, '채널 추가'를 유도하여 마케팅 채널로도 활용할 수 있습니다.",
    comparison: [
      { label: "비용", sms: "건당 30~50원 (비쌈)", kakao: "건당 7~15원 (저렴)" },
      { label: "신뢰도", sms: "스팸 오인 가능성", kakao: "카카오 인증 마크로 신뢰" },
      { label: "표현력", sms: "텍스트 위주", kakao: "버튼, 이미지, 액션 포함" },
      { label: "도달률", sms: "보통", kakao: "매우 높음 (전국민 사용)" },
    ]
  }
];
