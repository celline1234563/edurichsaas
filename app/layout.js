import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-47DWF7P13R" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-47DWF7P13R');
        `}</Script>
      </head>
      <body className={`${inter.className} antialiased`}>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <main style={{ flexGrow: 1 }}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
