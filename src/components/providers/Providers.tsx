'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MuiThemeProvider from '@/components/providers/theme/MuiThemeProvider'
import SnackbarProvider from '@/components/providers/SnackbarProvider'
import LoginUserProvider from './LoginUserProvider'
import GlobalWebSocketProvider from './GlobalWebSocketProvider'

export const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MuiThemeProvider>
        <GlobalWebSocketProvider>{children}</GlobalWebSocketProvider>
        <SnackbarProvider />
        <LoginUserProvider />
      </MuiThemeProvider>
    </QueryClientProvider>
  )
}
