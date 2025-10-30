import { Typography } from '@mui/joy'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <Typography level="h1" fontSize="3rem" color="neutral" sx={{ marginTop: 6 }}>
        404
      </Typography>
      <Typography level="h2" color="neutral">
        페이지를 찾을 수 없습니다.
      </Typography>
      <Typography textColor="neutral.600" sx={{ marginTop: 2 }}>
        요청하신 페이지가 존재하지 않거나, 이동되었어요. 홈으로 돌아가 다시 시작해 보세요.
      </Typography>
      <Link href="/" style={{ marginTop: '1.5rem', display: 'inline-block', color: '#1976d2' }}>
        홈으로 가기
      </Link>
    </div>
  )
}
