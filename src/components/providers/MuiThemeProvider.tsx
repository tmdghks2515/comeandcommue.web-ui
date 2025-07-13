'use client'

import { CssVarsProvider, extendTheme } from '@mui/joy'
import useCheckIsClient from '@/hooks/useCheckIsClient'

export default function MuiThemeProvider() {
  const isClient = useCheckIsClient()

  const theme = extendTheme({
    colorSchemes: {
      light: {
        palette: {
          primary: {
            50: '#fdf4ec', // very light apricot
            100: '#fae2c9',
            200: '#f7ca9e',
            300: '#f3b273',
            400: '#f1994c', // main soft orange
            500: '#ef8230', // base primary
            600: '#d96f25',
            700: '#b2581e',
            800: '#8b4218',
            900: '#6b3313', // very dark brown-orange
          },
        },
      },
      dark: {
        palette: {
          primary: {
            50: '#fdf4ec', // very light apricot
            100: '#fae2c9',
            200: '#f7ca9e',
            300: '#f3b273',
            400: '#f1994c', // main soft orange
            500: '#ef8230', // base primary
            600: '#d96f25',
            700: '#b2581e',
            800: '#8b4218',
            900: '#6b3313', // very dark brown-orange
          },
        },
      },
    },
  })

  if (!isClient) return null
  return <CssVarsProvider theme={theme} />
}
