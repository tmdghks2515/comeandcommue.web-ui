import { Sheet, Typography } from '@mui/joy'
import CommuFilterChips from './_components/CommuFilterChips'
import PostList from './_components/PostList'

export default function Home() {
  return (
    <>
      <Sheet
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: 1.5,
          bgcolor: 'background.body',
          maxWidth: { lg: '48rem' },
        }}
      >
        <Typography level="h1" fontSize={'md'} mb={1}>
          실시간 커뮤니티 인기글 모음
        </Typography>

        <CommuFilterChips />
        <section>
          <PostList />
        </section>
      </Sheet>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: '커뮤니티 모음',
            description:
              '디시인사이드, 펨코(fmkorea), 더쿠, 루리웹, 인스티즈, 보배드림 등 주요 커뮤니티의 실시간 인기글을 한곳에서 모아보세요.',
          }),
        }}
      />
    </>
  )
}
