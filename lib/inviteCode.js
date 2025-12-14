import crypto from 'crypto'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 헷갈리는 문자 제거

export function generateInviteCode(len = 8) {
  const bytes = crypto.randomBytes(len)
  let out = ''
  for (let i = 0; i < len; i++) out += CHARS[bytes[i] % CHARS.length]
  return out
}
