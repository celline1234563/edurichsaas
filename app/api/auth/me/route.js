import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { SESSION_COOKIE_NAME } from '@/lib/cookies'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  
  if (!token) return NextResponse.json({ loggedIn: false })

  const now = new Date().toISOString()

  const { data: session } = await supabaseAdmin
    .from('account_sessions')
    .select('account_id, expires_at')
    .eq('session_token', token)
    .gt('expires_at', now)
    .maybeSingle()

  if (!session) return NextResponse.json({ loggedIn: false })

  const { data: account } = await supabaseAdmin
    .from('accounts')
    .select('id,name,email,phone,role,academy_id')
    .eq('id', session.account_id)
    .maybeSingle()

  if (!account) return NextResponse.json({ loggedIn: false })

  return NextResponse.json({ loggedIn: true, account })
}
