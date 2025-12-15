import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { BRAIN_BASE_URL, SAAS_BASE_URL } from '@/lib/constants'

const SESSION_COOKIE_NAME = 'edurich_session';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': BRAIN_BASE_URL,
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
      'Vary': 'Origin',
    },
  })
}

export async function GET() {
  try {
    const cookieStore = await cookies(); // ✅ Next 15: cookies() is async
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
      return NextResponse.json({ ok: false, reason: 'no_cookie' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('account_sessions')
      .select('id, account_id, expires_at')
      .eq('session_token', sessionToken)
      .single();

    if (error || !data) {
      const res = NextResponse.json({ ok: false, reason: 'no_session' }, { status: 401 });
      res.headers.set('Access-Control-Allow-Origin', BRAIN_BASE_URL)
      res.headers.set('Access-Control-Allow-Credentials', 'true')
      res.headers.set('Vary', 'Origin')
      return res
    }

    if (data.expires_at && new Date(data.expires_at) <= new Date()) {
      const res = NextResponse.json({ ok: false, reason: 'expired' }, { status: 401 });
      res.headers.set('Access-Control-Allow-Origin', BRAIN_BASE_URL)
      res.headers.set('Access-Control-Allow-Credentials', 'true')
      res.headers.set('Vary', 'Origin')
      return res
    }

    const res = NextResponse.json({ ok: true, userId: data.user_id }, { status: 200 });
    res.headers.set('Access-Control-Allow-Origin', BRAIN_BASE_URL)
    res.headers.set('Access-Control-Allow-Credentials', 'true')
    res.headers.set('Vary', 'Origin')
    return res
  } catch (e) {
    console.error('[me] error', e);
    const res = NextResponse.json({ ok: false, reason: 'server_error' }, { status: 500 });
    res.headers.set('Access-Control-Allow-Origin', BRAIN_BASE_URL)
    res.headers.set('Access-Control-Allow-Credentials', 'true')
    res.headers.set('Vary', 'Origin')
    return res
  }
}
