import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/providers/Providers'
import GlobalChat from '@/components/chat/globalChat/GlobalChat'
import MainHeader from '@/components/layout/MainHeader'
import MainLayout from '@/components/layout/MainLayout'
import ScrollTopButton from '@/components/common/ScrollTopButton'
import MainFooter from '@/components/layout/MainFooter'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.graetdae.daneyo.com'),
  title: {
    default: '커뮤니티 모음 | 그랬대!',
    template: '%s | 그랬대!',
  },
  description:
    '디시인사이드, 펨코(fmkorea), 루리웹, 인스티즈, 보배드림 등 주요 커뮤니티의 실시간 인기글을 한곳에서 모아보세요.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://www.graetdae.daneyo.com' },
  openGraph: {
    type: 'website',
    siteName: '그랬대!',
    url: 'https://www.graetdae.daneyo.com',
    title: '커뮤니티 모음 | 그랬대!',
    description: '인기 커뮤니티의 실시간 인기글을 한눈에!',
    images: ['/og'],
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning={true}>
      <body>
        <Providers>
          <MainLayout>
            <MainHeader />
            <main>
              {children}
              <GlobalChat />
            </main>

            <MainFooter />
          </MainLayout>
        </Providers>
      </body>
    </html>
  )
}
