import { extendTheme } from '@mui/joy'

const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        // 주 색 (네온 그린 계열)
        primary: {
          50: '#e6fff6',
          100: '#ccffee',
          200: '#99ffdd',
          300: '#66ffcc',
          400: '#33ffbb',
          500: '#00ffa3', // 베이스
          600: '#00d68a',
          700: '#00a16b',
          800: '#007e54',
          900: '#005c3f',
          // 글자에 직접 쓸 때 투명도 있는 버전 요청 반영
          plainColor: '#00ffa3e6',
        },

        // 배경
        background: {
          body: '#141517', // 기본 배경
          surface: '#141517',
          level1: '#1f2022', // 차등 배경
          level2: '#1f2022',
          popup: '#1f2022',
        },

        // 텍스트
        text: {
          primary: 'rgb(100% 100% 100%)', // 메인 텍스트
          secondary: '#dfe2ea', // 차등 텍스트
          tertiary: '#9da5b6', // 차차등 텍스트
        },

        // 구분선: 배경 사이 톤
        divider: '#26282b',
        // 중립(다크 UI용 그레이)
      },
    },

    // 라이트 모드(필요 시)
    light: {
      palette: {
        // 주 색
        primary: {
          50: '#eafaf4',
          100: '#d4f4e8',
          200: '#a9e9d1',
          300: '#7fddb9',
          400: '#54d2a2',
          500: '#1bb373', // 수정된 베이스 색상
          600: '#179d65',
          700: '#138756',
          800: '#0f7148',
          900: '#0a5b3a',
          plainColor: '#1bb373',
        },

        // 배경
        background: {
          body: '#ffffff', // 기본 배경
          surface: '#ffffff',
          level1: '#f5f5f5', // 차등 배경
          level2: '#f5f5f5',
          popup: '#ffffff',
        },

        // 텍스트
        // NOTE: 요청에 "메인 텍스트: #f5f5f5"가 있었지만 가독성 때문에 #2e3033로 설정
        text: {
          primary: '#2e3033', // (권장) 진한 본문색
          secondary: '#2e3033', // 요청의 "차등 텍스트" 값과 동일
          tertiary: '#666', // 차차등 텍스트
        },

        // 라이트 구분선: 연회색
        divider: '#e5e5e5',
      },
    },
  },
})

export default theme
