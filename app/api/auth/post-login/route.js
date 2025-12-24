import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'NO_SESSION' }, { status: 401 })
  }

  // accounts 존재 확인
  const { data: account } = await supabaseAdmin
    .from('accounts')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!account) {
    return NextResponse.json({ error: 'NO_ACCOUNT' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
