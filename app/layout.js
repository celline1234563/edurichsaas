import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EduRichBrain - AI 학원 경영 비서',
  description: '750개 학원이 선택한 AI 학원 경영 솔루션. 상담, 커리큘럼, 마케팅까지 한 번에.',
  keywords: '학원경영, AI학원, 학원관리, 에듀리치브레인',
  openGraph: {
    title: 'EduRichBrain - AI 학원 경영 비서',
    description: '750개 학원이 선택한 AI 학원 경영 솔루션',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={`${inter.className} antialiased`}>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <main style={{ flexGrow: 1 }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
