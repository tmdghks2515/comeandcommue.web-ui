'use client'

import { CssVarsProvider } from '@mui/joy/styles'
import useCheckIsClient from '@/hooks/useCheckIsClient'
import theme from './theme'
import InitColorSchemeScript from '@mui/joy/InitColorSchemeScript'

export default function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  const isClient = useCheckIsClient()

  if (!isClient) return null
  return (
    <>
      <InitColorSchemeScript />
      <CssVarsProvider theme={theme} defaultMode="dark" modeStorageKey="comeandcommue_system_mode">
        {children}
      </CssVarsProvider>
    </>
  )
}
