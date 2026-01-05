// app/api/auth/login/route.js
import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 })
    }

    // Supabase Auth로 로그인
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login error:', error.message)
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 })
    }

    if (!data?.user) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 })
    }

    return NextResponse.json({ ok: true, user: { id: data.user.id, email: data.user.email } })
  } catch (e) {
    console.error('Login failed:', e)
    return NextResponse.json({ error: 'LOGIN_FAILED', detail: String(e?.message || e) }, { status: 500 })
  }
}
