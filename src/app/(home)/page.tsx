'use client'

import { communityValueLabels } from '@/constants/post.constants'
import { postQueryService } from '@/core/services/post.query.service'
import useApi from '@/hooks/useApi'
import { List, ListItem, Sheet, styled } from '@mui/joy'
import { useEffect, useRef, useState } from 'react'
import CommunityChips from './_components/CommunityChips'
import { PostDto } from '@/core/dto/post/post.dto'
import PostListItem from './_components/PostListItem'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import { RecentPostsQuery } from '@/core/dto/post/post.query'

export default function Home() {
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>(communityValueLabels.map((c) => c.value))
  const [posts, setPosts] = useState<PostDto[]>([])
  const [filteredPosts, setFilteredPosts] = useState<PostDto[]>([])
  const [lastCreatedAt, setLastCreatedAt] = useState<string>()
  const [isFetching, setIsFetching] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(true)

  const { execute } = useApi<RecentPostsQuery, PostDto[]>({
    api: postQueryService.getRecentPosts,
    executeImmediately: true,
    initalParams: {
      communityTypes: [],
      pageSize: 50,
    },
    onSuccess(data) {
      setPosts((prev) => [...prev, ...data])
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
    execute({ communityTypes: [], pageSize: 50, lastCreatedAt })
  }, [lastCreatedAt])

  useEffect(() => {
    if (posts) {
      const filtered = posts.filter((post) =>
        selectedCommunities.length > 0 ? selectedCommunities.includes(post.communityType) : true,
      )
      setFilteredPosts(filtered)
    }
  }, [posts, selectedCommunities])

  return (
    <>
      <Container>
        <CommunityChips selected={selectedCommunities} onChange={setSelectedCommunities} />

        <PostList>
          {filteredPosts?.map((post) => (
            <ListItem key={post.id} sx={{ padding: 0 }}>
              <PostListItem post={post} />
            </ListItem>
          ))}
        </PostList>

        <div ref={sentinelRef} style={{ height: '1px' }} />
        {isFetching && <p style={{ textAlign: 'center' }}>로딩 중...</p>}
      </Container>
    </>
  )
}

const Container = styled(Sheet)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
}))

const PostList = styled(List)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}))
