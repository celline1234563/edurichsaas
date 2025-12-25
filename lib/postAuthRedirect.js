// lib/postAuthRedirect.js

export const POST_AUTH_REDIRECT_KEY = 'post_auth_redirect_v1';

/**
 * SAAS의 /login, /signup 진입 시 쿼리로 들어온 redirect 정보를 저장
 * 예) /signup?redirect=diagnosis&token=xxxx
 */
export function rememberPostAuthRedirect(searchParams) {
  try {
    const redirect = searchParams?.get?.('redirect') || null;
    const token = searchParams?.get?.('token') || null;

    // diagnosis 케이스만 저장 (원하는 요구사항)
    if (redirect !== 'diagnosis') return;

    const payload = {
      redirect, // 'diagnosis'
      token: token || null,
      ts: Date.now()
    };

    sessionStorage.setItem(POST_AUTH_REDIRECT_KEY, JSON.stringify(payload));
  } catch (e) {
    // ignore
  }
}

export function readPostAuthRedirect() {
  try {
    const raw = sessionStorage.getItem(POST_AUTH_REDIRECT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPostAuthRedirect() {
  try {
    sessionStorage.removeItem(POST_AUTH_REDIRECT_KEY);
  } catch {
    // ignore
  }
}

/**
 * 로그인/회원가입 완료 후 호출.
 * redirect=diagnosis로 들어온 경우에만 Brain 진단 결과로 되돌림.
 *
 * @param {object} opts
 * @param {string} opts.BRAIN_BASE_URL 예) https://edurichbrain.ai.kr
 * @param {function} opts.fallbackNavigate SAAS 기본 이동(예: () => router.push('/dashboard'))
 */
export function performPostAuthRedirect({ BRAIN_BASE_URL, fallbackNavigate }) {
  const data = readPostAuthRedirect();

  // diagnosis로 들어온 경우만 처리
  if (!data || data.redirect !== 'diagnosis') {
    fallbackNavigate?.();
    return;
  }

  clearPostAuthRedirect();

  const token = data.token;

  // ✅ Brain 진단 결과 페이지 URL (너네 실제 라우트에 맞춰 수정)
  const target = token
    ? `${BRAIN_BASE_URL}/diagnosis/result?token=${encodeURIComponent(token)}`
    : `${BRAIN_BASE_URL}/diagnosis/result`;

  // 같은 탭에서 이동 (원하면 window.open으로 바꿔도 됨)
  window.location.href = target;
}
