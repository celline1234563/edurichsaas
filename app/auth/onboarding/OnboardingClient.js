'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export default function OnboardingPage() {
  const sp = useSearchParams()
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const role = sp.get('role') || 'teacher'
  const redirect = sp.get('redirect')
  const token = sp.get('token')

  const [email, setEmail] = useState('')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    agree_marketing: false,
    academy_name: '',
    invite_code: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setEmail(user?.email || '')
      // 소셜에서 name이 metadata에 있으면 프리필
      const metaName = user?.user_metadata?.name || user?.user_metadata?.full_name
      if (metaName) setForm(v => ({ ...v, name: metaName }))
    })()
  }, [])

  const submit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/oauth-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          name: form.name,
          phone: form.phone,
          agree_marketing: !!form.agree_marketing,
          academy_name: role === 'owner' ? form.academy_name : null,
          invite_code: role === 'owner' ? null : form.invite_code,
          redirect,
          token,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        alert(data?.error || 'ONBOARDING_FAILED')
        return
      }

      // 완료 후 이동
      if (redirect === 'diagnosis' && token) {
        window.location.href = `/diagnosis/result?token=${encodeURIComponent(token)}`
      } else {
        router.replace('/')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>가입 마무리</h1>
      <p>로그인된 이메일: {email}</p>

      <div>
        <input placeholder="이름" value={form.name} onChange={(e)=>setForm(v=>({...v,name:e.target.value}))} />
        <input placeholder="전화번호" value={form.phone} onChange={(e)=>setForm(v=>({...v,phone:e.target.value}))} />

        {role === 'owner' ? (
          <input placeholder="학원명" value={form.academy_name} onChange={(e)=>setForm(v=>({...v,academy_name:e.target.value}))} />
        ) : (
          <input placeholder="초대코드" value={form.invite_code} onChange={(e)=>setForm(v=>({...v,invite_code:e.target.value.toUpperCase()}))} />
        )}

        <label>
          <input type="checkbox" checked={form.agree_marketing} onChange={(e)=>setForm(v=>({...v,agree_marketing:e.target.checked}))} />
          마케팅 수신 동의
        </label>

        <button disabled={loading} onClick={submit}>
          {loading ? '처리중...' : '가입완료'}
        </button>
      </div>
    </div>
  )
}
