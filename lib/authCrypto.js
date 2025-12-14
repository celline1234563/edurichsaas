import crypto from 'crypto'

const KEYLEN = 32

function scryptAsync(password, salt, keylen) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, (err, derivedKey) => {
      if (err) reject(err)
      else resolve(derivedKey)
    })
  })
}

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16)
  const derived = await scryptAsync(password, salt, KEYLEN)
  return `scrypt$${salt.toString('base64')}$${derived.toString('base64')}`
}

export async function verifyPassword(password, stored) {
  const [algo, saltB64, hashB64] = String(stored || '').split('$')
  if (algo !== 'scrypt' || !saltB64 || !hashB64) return false

  const salt = Buffer.from(saltB64, 'base64')
  const expected = Buffer.from(hashB64, 'base64')
  const derived = await scryptAsync(password, salt, expected.length)

  return crypto.timingSafeEqual(expected, derived)
}

export function newSessionToken() {
  return crypto.randomBytes(32).toString('base64url')
}

export function newUuid() {
  return crypto.randomUUID()
}
