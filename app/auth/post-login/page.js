'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BRAIN_BASE_URL } from '@/lib/constants'

export default function PostLoginPage() {
  const router = useRouter()

  useEffect(() => {
    const raw = localStorage.getItem('post_auth_redirect')

    if (raw) {
      try {
        const data = JSON.parse(raw)
        localStorage.removeItem('post_auth_redirect')

        if (data.type === 'diagnosis' && data.token) {
          window.location.href =
            `${BRAIN_BASE_URL}/diagnosis/result?token=${encodeURIComponent(data.token)}`
          return
        }
      } catch (e) {
        console.error(e)
      }
    }

    // 기본 fallback
    router.replace('/dashboard')
  }, [])

  return null
}
