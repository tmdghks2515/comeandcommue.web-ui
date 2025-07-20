import type { Metadata } from 'next'
import './globals.css'
import { Suspense } from 'react'
import Providers from '@/components/providers/Providers'

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
    <html lang="ko">
      <body>
        <Providers>
          <div className="w-full flex justify-center items-center">
            <div className="min-h-screen flex flex-col w-full lg:max-w-5xl">
              <Suspense>{children}</Suspense>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
