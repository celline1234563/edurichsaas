export const SESSION_COOKIE_NAME = 'edurich_session'
export const SESSION_DAYS = 7

export const cookieOptions = ({ days } = {}) => {
  const base = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  }

  // days가 있을 때만 maxAge 설정
  if (typeof days === 'number') {
    return {
      ...base,
      maxAge: days * 86400, // seconds
    }
  }

  // days 없으면 브라우저 세션 쿠키
  return base
}
