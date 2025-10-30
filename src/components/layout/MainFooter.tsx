import { Typography } from '@mui/joy'

export default function MainFooter() {
  return (
    <footer>
      <Typography color="neutral" level="body-sm">
        © 2025 다네요. All rights reserved.
      </Typography>
      <section aria-label="서비스 소개">
        <Typography level="h2" color="neutral" fontSize="sm" mt={1}>
          서비스 소개
        </Typography>
        <Typography level={'body-sm'} color="neutral">
          루리웹, 인스티즈, 보배드림 등 주요 커뮤니티의 인기글을 실시간으로 확인하세요.
        </Typography>
      </section>
    </footer>
  )
}
