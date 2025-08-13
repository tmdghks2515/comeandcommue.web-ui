import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/providers/Providers'
import GlobalChat from '@/components/chat/globalChat/GlobalChat'
import MainHeader from '@/components/layout/MainHeader'
import MainLayout from '@/components/layout/MainLayout'

export const metadata: Metadata = {
  title: '커뮤커뮤',
  description: '',
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
            {children}
            <GlobalChat />
          </MainLayout>
        </Providers>
      </body>
    </html>
  )
}
