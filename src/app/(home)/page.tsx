'use client'

import { postQueryService } from '@/core/services/post.query.service'
import useApi from '@/hooks/useApi'
import { List, ListItem, Sheet, styled, useColorScheme } from '@mui/joy'
import { useEffect, useRef, useState } from 'react'
import CommuFilterChips from './_components/CommuFilterChips'
import { PostDto } from '@/core/dto/post/post.dto'
import PostListItem from './_components/PostListItem'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import { RecentPostsQuery } from '@/core/dto/post/post.query'
import useCommuFilterStore from '@/store/useCommuFilterStore'

const pageSize = 50

export default function Home() {
  const [posts, setPosts] = useState<PostDto[]>([])
  const [lastCreatedAt, setLastCreatedAt] = useState<string>()
  const [isFetching, setIsFetching] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(true)

  const selectedCommunities = useCommuFilterStore((state) => state.selected)

  const { execute } = useApi({
    api: postQueryService.getRecentPosts,
    onSuccess(data, params) {
      if (params.lastCreatedAt) {
        setPosts((prev) => [...prev, ...data])
      } else {
        setPosts(data)
      }
      setHasNextPage(data.length > 0)
    },
    onComplete() {
      setIsFetching(false)
    },
  })

  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useInfiniteScroll({
    targetRef: sentinelRef,
    onLoadMore: () => setLastCreatedAt(posts?.[posts.length - 1]?.createdAt),
    hasNextPage,
    isFetching,
  })

  useEffect(() => {
    if (!lastCreatedAt || !hasNextPage) return

    setIsFetching(true)
    execute({ communityTypes: selectedCommunities, pageSize, lastCreatedAt, isNextPage: true } as RecentPostsQuery)
  }, [lastCreatedAt])

  useEffect(() => {
    if (lastCreatedAt) setLastCreatedAt(undefined)

    setIsFetching(true)
    execute({ communityTypes: selectedCommunities, pageSize, lastCreatedAt: undefined })
  }, [selectedCommunities])

  return (
    <Container>
      <CommuFilterChips />

      <PostList>
        {posts?.map((post) => (
          <ListItem key={post.id} sx={{ padding: 0 }}>
            <PostListItem post={post} />
          </ListItem>
        ))}
      </PostList>

      <div ref={sentinelRef} style={{ height: '1px' }} />
      {isFetching && <p style={{ textAlign: 'center' }}>로딩 중...</p>}
    </Container>
  )
}

const Container = styled(Sheet)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.body,
}))

const PostList = styled(List)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}))
