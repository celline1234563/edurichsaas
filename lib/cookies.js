export const SESSION_DAYS = 7
export const SESSION_COOKIE_NAME = 'edurich_session'

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: false,      // 로컬 http면 false로 바꿔야 함
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  }
}
