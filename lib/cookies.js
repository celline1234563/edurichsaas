// lib/cookies.js
export const SESSION_COOKIE_NAME = 'edurich_session'

// 크로스도메인(Brain -> SaaS) 쿠키 전송이 필요하면 SameSite=None + Secure 필수
export const cookieOptions = (overrides = {}) => {
  const isProd = process.env.NODE_ENV === 'production'

  const base = {
    httpOnly: true,
    secure: isProd,              // SameSite=None이면 prod에서 무조건 true여야 함
    sameSite: isProd ? 'none' : 'lax', // dev는 lax로 두고, prod는 none으로
    path: '/',
  }

  return { ...base, ...overrides }
}
