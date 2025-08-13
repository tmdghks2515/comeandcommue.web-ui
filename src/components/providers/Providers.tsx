'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MuiThemeProvider from '@/components/providers/theme/MuiThemeProvider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import SnackbarProvider from '@/components/providers/SnackbarProvider'
import LoginUserProvider from './LoginUserProvider'

export const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MuiThemeProvider>
        <LoginUserProvider />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
        <SnackbarProvider />
      </MuiThemeProvider>
    </QueryClientProvider>
  )
}
