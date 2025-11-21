// 앱 설정 파일
// 두 프로젝트 간 연결을 위한 설정

export const APP_CONFIG = {
  // 프로덕션에서는 실제 도메인으로 변경
  MAIN_APP_URL: process.env.NEXT_PUBLIC_MAIN_APP_URL || 'http://localhost:3000',
  MARKETING_URL: process.env.NEXT_PUBLIC_MARKETING_URL || 'http://localhost:3002',

  // API 엔드포인트 (나중에 Supabase로 대체)
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',

  // 체험 설정
  TRIAL_TURNS_LIMIT: 3,
  TRIAL_DAYS: 14,

  // 기능 플래그
  FEATURES: {
    ENABLE_SOCIAL_LOGIN: false,
    ENABLE_PAYMENT: false,
    SHOW_DEMO_ACCOUNT: true
  }
}

// 두 프로젝트 간 데이터 공유를 위한 헬퍼 함수
export const CrossAppHelper = {
  // 메인 앱으로 리다이렉션
  redirectToMainApp: (path = '') => {
    window.location.href = `${APP_CONFIG.MAIN_APP_URL}${path}`
  },

  // 마케팅 사이트로 리다이렉션
  redirectToMarketing: (path = '') => {
    window.location.href = `${APP_CONFIG.MARKETING_URL}${path}`
  },

  // 사용자 데이터 저장 (localStorage)
  saveUserData: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    // 도메인이 같다면 다른 앱에서도 접근 가능
  },

  // 사용자 데이터 가져오기
  getUserData: () => {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  },

  // 로그아웃
  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('trialLogs')
    window.location.href = APP_CONFIG.MARKETING_URL
  }
}