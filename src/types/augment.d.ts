import '@mui/joy/styles'

declare module '@mui/joy/styles' {
  // 팔레트에 secondary 키 추가
  interface Palette {
    secondary: Palette['primary']
    info: Palette['primary']
  }
  interface PaletteOptions {
    secondary?: PaletteOptions['primary']
    info?: PaletteOptions['primary']
  }
  // 컴포넌트 color prop에서 secondary 허용
  interface ColorPalettePropOverrides {
    secondary: true
    info: true
  }
}
