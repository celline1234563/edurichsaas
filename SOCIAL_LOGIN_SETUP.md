# 소셜 로그인 설정 가이드

이 문서는 Google과 Kakao 소셜 로그인을 설정하는 방법을 설명합니다.

## 1. Google OAuth 설정

### 1.1 Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스** > **사용자 인증 정보** 메뉴로 이동
4. **사용자 인증 정보 만들기** > **OAuth 2.0 클라이언트 ID** 선택
5. 애플리케이션 유형: **웹 애플리케이션** 선택
6. 승인된 리디렉션 URI 추가:
   - 개발: `http://localhost:3001/api/auth/callback/google`
   - 프로덕션: `https://yourdomain.com/api/auth/callback/google`
7. **만들기** 클릭
8. **클라이언트 ID**와 **클라이언트 보안 비밀번호** 복사

### 1.2 동의 화면 구성

1. **OAuth 동의 화면** 메뉴로 이동
2. 사용자 유형: **외부** 선택 (테스트 사용자 추가 가능)
3. 앱 정보 입력:
   - 앱 이름: EduRichBrain
   - 사용자 지원 이메일
   - 개발자 연락처 정보
4. 범위 추가:
   - `userinfo.email`
   - `userinfo.profile`
5. 저장

## 2. Kakao 로그인 설정

### 2.1 Kakao Developers 설정

1. [Kakao Developers](https://developers.kakao.com/)에 접속
2. **내 애플리케이션** > **애플리케이션 추가하기**
3. 앱 이름, 사업자명 입력
4. 생성된 앱 선택
5. **앱 키** 탭에서 **REST API 키** 복사
6. **플랫폼** 탭에서 Web 플랫폼 추가:
   - 사이트 도메인: `http://localhost:3001` (개발)
   - 사이트 도메인: `https://yourdomain.com` (프로덕션)

### 2.2 Redirect URI 설정

1. **카카오 로그인** 메뉴로 이동
2. **활성화 설정** ON
3. **Redirect URI** 등록:
   - 개발: `http://localhost:3001/api/auth/callback/kakao`
   - 프로덕션: `https://yourdomain.com/api/auth/callback/kakao`

### 2.3 동의 항목 설정

1. **카카오 로그인** > **동의 항목** 메뉴
2. 필수 동의 항목 설정:
   - 닉네임
   - 프로필 사진
   - 카카오계정(이메일)

### 2.4 Client Secret 발급 (선택사항, 보안 강화)

1. **카카오 로그인** > **보안** 메뉴
2. **Client Secret** > **코드 생성** 클릭
3. 생성된 코드 복사
4. **활성화** 상태로 변경

## 3. 환경 변수 설정

`.env.local` 파일을 열고 다음 값을 입력:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-random-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Kakao OAuth
KAKAO_CLIENT_ID=your-kakao-rest-api-key
KAKAO_CLIENT_SECRET=your-kakao-client-secret (선택사항)
```

### NEXTAUTH_SECRET 생성 방법

터미널에서 다음 명령어 실행:

```bash
openssl rand -base64 32
```

또는 Node.js로:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 4. 프로덕션 배포 시 주의사항

### 4.1 환경 변수 설정

1. Vercel/Netlify 등 호스팅 플랫폼의 환경 변수 설정에 동일한 값 추가
2. `NEXTAUTH_URL`을 프로덕션 도메인으로 변경:
   ```
   NEXTAUTH_URL=https://yourdomain.com
   ```

### 4.2 Redirect URI 업데이트

1. Google Cloud Console에서 프로덕션 Redirect URI 추가
2. Kakao Developers에서 프로덕션 Redirect URI 추가
3. 도메인 등록 (Kakao의 경우 Web 플랫폼에 프로덕션 도메인 추가)

## 5. 테스트

### 5.1 로컬 테스트

1. 서버 재시작:
   ```bash
   npm run dev
   ```

2. `http://localhost:3001/signup` 접속

3. Google/Kakao 로그인 버튼 클릭하여 OAuth 플로우 테스트

### 5.2 확인 사항

- [ ] 소셜 로그인 버튼 클릭 시 해당 서비스 로그인 화면으로 이동
- [ ] 로그인 후 `/signup` 페이지로 정상 리다이렉트
- [ ] 세션 정보가 정상적으로 저장됨
- [ ] 로그아웃 후 재로그인 가능

## 6. 문제 해결

### Google 로그인 오류

**Error: redirect_uri_mismatch**
- Google Cloud Console의 Redirect URI가 정확한지 확인
- 프로토콜(http/https), 포트 번호 확인

**Error: access_denied**
- OAuth 동의 화면이 올바르게 설정되었는지 확인
- 테스트 사용자로 추가되었는지 확인 (외부 앱인 경우)

### Kakao 로그인 오류

**Error: KOE006 (invalid redirect_uri)**
- Kakao Developers의 Redirect URI가 정확한지 확인
- 플랫폼(Web) 도메인이 등록되었는지 확인

**Error: KOE101 (invalid client)**
- REST API 키가 올바른지 확인
- 앱이 활성화 상태인지 확인

## 7. 추가 기능 구현 (선택사항)

### 7.1 소셜 로그인 후 역할 선택

현재는 소셜 로그인 후 `/signup` 페이지로 리다이렉트됩니다.
역할 선택을 위해 추가 로직이 필요한 경우:

1. 소셜 로그인 성공 후 세션에 사용자 정보 저장
2. `/signup` 페이지에서 세션 확인 후 역할 선택 단계로 이동
3. 역할 선택 완료 후 DB에 저장

### 7.2 기존 계정 연동

동일한 이메일로 이메일/비밀번호 계정과 소셜 계정을 연동하려면:

1. NextAuth callbacks에서 이메일 확인
2. 기존 사용자 DB 조회
3. 계정 연동 로직 구현

## 8. 보안 권장사항

1. **Client Secret 사용**: Kakao의 경우 Client Secret을 설정하여 보안 강화
2. **HTTPS 사용**: 프로덕션에서는 반드시 HTTPS 사용
3. **환경 변수 보호**: `.env.local` 파일을 Git에 커밋하지 않기 (`.gitignore`에 추가)
4. **세션 보안**: `NEXTAUTH_SECRET`은 강력한 랜덤 문자열 사용
5. **CORS 설정**: 필요한 도메인만 허용

## 참고 자료

- [NextAuth.js 공식 문서](https://next-auth.js.org/)
- [Google OAuth 2.0 문서](https://developers.google.com/identity/protocols/oauth2)
- [Kakao 로그인 가이드](https://developers.kakao.com/docs/latest/ko/kakaologin/common)
