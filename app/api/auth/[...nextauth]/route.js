import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import KakaoProvider from 'next-auth/providers/kakao'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions = {
  providers: [
    // 이메일/비밀번호 로그인 (데모 계정 포함)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          // 데모 계정 확인
          if (credentials?.email === 'demo@edurichbrain.com' && credentials?.password === 'demo1234') {
            return {
              id: 'demo-user-001',
              email: 'demo@edurichbrain.com',
              name: '데모 사용자',
              isDemo: true
            }
          }

          // TODO: 실제 DB에서 사용자 확인 로직 추가
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // 소셜 로그인 성공 시 실행
      return true
    },
    async jwt({ token, account, user }) {
      // JWT 토큰에 추가 정보 저장
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
      }
      if (user) {
        token.id = user.id
        token.isDemo = user.isDemo || false
      }
      return token
    },
    async session({ session, token }) {
      // 세션에 추가 정보 저장
      session.accessToken = token.accessToken
      session.provider = token.provider
      session.user.id = token.id
      session.user.isDemo = token.isDemo || false
      return session
    },
    async redirect({ url, baseUrl }) {
      // 로그인 후 리다이렉트 처리
      // signup 페이지에서 역할 선택할 수 있도록
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/signup`
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only',
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
