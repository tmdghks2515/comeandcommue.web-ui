'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MuiThemeProvider from '@/components/providers/MuiThemeProvider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import SnackbarProvider from '@/components/providers/SnackbarProvider'

export const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MuiThemeProvider />
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <SnackbarProvider />
    </>
  )
}
