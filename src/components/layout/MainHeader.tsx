import { Box, Typography } from '@mui/joy'

export default function MainHeader() {
  return (
    <header>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingY: 2,
          paddingX: 3,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: 'white',
        }}
      >
        {/* 로고 */}
        <Typography level="h4" sx={{ fontWeight: 'bold' }}>
          커뮤커뮤
        </Typography>

        {/* 사용자 정보 */}
        <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
          멍청한거대빨강원숭이
        </Typography>
      </Box>
    </header>
  )
}
