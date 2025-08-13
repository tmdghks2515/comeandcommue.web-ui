'use client'

import { styled } from '@mui/joy'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayoutRoot>
      <MainLayoutContainer>{children}</MainLayoutContainer>
    </MainLayoutRoot>
  )
}

const MainLayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.body,
  minHeight: '100vh',
}))

const MainLayoutContainer = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',

  // 태블릿 이상
  [theme.breakpoints.up('sm')]: {
    maxWidth: '960px',
  },

  // 데스크탑 (md 이상)
  [theme.breakpoints.up('md')]: {
    maxWidth: '1200px',
  },

  // 대형 디스플레이 (lg 이상)
  [theme.breakpoints.up('lg')]: {
    maxWidth: '1440px',
  },
}))
