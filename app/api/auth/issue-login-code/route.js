import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { randomUUID } from 'crypto'

export async function POST(req) {
  const { userId } = await req.json()

  const code = randomUUID()
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString() // 3분

  await supabaseAdmin.from('login_bridge_codes').insert({
    code,
    user_id: userId,
    expires_at: expiresAt,
    used: false,
  })

  return NextResponse.json({ code })
}
