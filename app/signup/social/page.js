'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export default function SocialSignupPage() {
  const supabase = createSupabaseBrowserClient()

  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [role, setRole] = useState('teacher') // owner/teacher/manager/assistant
  const [form, setForm] = useState({
    academyName: '',
    inviteCode: '',
    name: '',
    phone: '',
    agree_marketing: false,
  })

  useEffect(() => {
    ;(async () => {
      const pending = localStorage.getItem('pending_role')
      if (pending) setRole(pending)

      const { data } = await supabase.auth.getUser()
      const email = data?.user?.email || ''
      setUserEmail(email)

      setLoading(false)
    })()
  }, [])

  const onSubmit = async () => {
    if (!form.name || !form.phone) return alert('이름/전화번호 필수')
    if (role === 'owner' && !form.academyName) return alert('학원명 필수')
    if (role !== 'owner' && !form.inviteCode) return alert('초대코드 필수')

    const res = await fetch('/api/auth/complete-social', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role,
        academyName: role === 'owner' ? form.academyName : null,
        inviteCode: role !== 'owner' ? form.inviteCode : null,
        name: form.name,
        phone: form.phone,
        agree_marketing: !!form.agree_marketing,
      }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) return alert(`가입완료 실패: ${data?.error || res.status} | ${data.detail}`)

    localStorage.removeItem('pending_role')
    alert('가입 완료!')
    window.location.href = '/' // 원하는 곳으로
  }

  if (loading) return <div style={{ padding: 40, color: '#fff' }}>Loading...</div>

  return (
    <div style={{ padding: 40, color: '#fff' }}>
      <h1>추가 정보 입력</h1>
      <p>이메일: <b>{userEmail || '(없음)'}</b></p>
      <p>역할: <b>{role}</b></p>

      {role === 'owner' ? (
        <input
          placeholder="학원명"
          value={form.academyName}
          onChange={(e) => setForm({ ...form, academyName: e.target.value })}
        />
      ) : (
        <input
          placeholder="초대코드"
          value={form.inviteCode}
          onChange={(e) => setForm({ ...form, inviteCode: e.target.value.toUpperCase() })}
        />
      )}

      <div>
        <input
          placeholder="이름"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div>
        <input
          placeholder="전화번호"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      <label style={{ display: 'block', marginTop: 12 }}>
        <input
          type="checkbox"
          checked={form.agree_marketing}
          onChange={(e) => setForm({ ...form, agree_marketing: e.target.checked })}
        />
        마케팅 동의
      </label>

      <button onClick={onSubmit} style={{ marginTop: 16 }}>
        가입완료
      </button>
    </div>
  )
}
