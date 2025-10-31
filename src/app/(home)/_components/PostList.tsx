'use client'

import { postQueryService } from '@/core/services/post.query.service'
import useApi from '@/hooks/useApi'
import { CircularProgress, List, ListItem, styled } from '@mui/joy'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PostDto } from '@/core/dto/post/post.dto'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import { RecentPostsQuery } from '@/core/dto/post/post.query'
import useCommuFilterStore from '@/store/useCommuFilterStore'
import PostListItem from './PostListItem'
import NewPostsNotice from './NewPostsNotice'
import useLoginUserStore from '@/store/useLoginUserStore'

const pageSize = 50

export default function PostList() {
  const [posts, setPosts] = useState<PostDto[]>([])
  const [createdAtFrom, setCreatedAtFrom] = useState<Date>()
  const [createdAtTo, setCreatedAtTo] = useState<Date>()
  const [hasNextPage, setHasNextPage] = useState(true)

  const selectedCommunities = useCommuFilterStore((state) => state.selected)
  const { loginUser } = useLoginUserStore()

  const { execute, loading } = useApi({
    api: postQueryService.getRecentPosts,
    onSuccess(data, params) {
      if (params.createdAtFrom) {
        setPosts((prev) => [...prev, ...data])
      } else if (params.createdAtTo) {
        setCreatedAtTo(data?.[0]?.createdAt)
        setPosts((prev) => [...data, ...prev])
      } else {
        setPosts(data)
        setCreatedAtTo(data?.[0]?.createdAt)
      }
      setHasNextPage(data.length > 0)
    },
  })

  const handleLoadNewPosts = useCallback(() => {
    execute({ communityTypes: selectedCommunities, pageSize, createdAtFrom: undefined, createdAtTo })
  }, [selectedCommunities, execute, createdAtFrom])

  /** useEffect Start */
  useEffect(() => {
    if (!createdAtFrom || !hasNextPage || !loginUser) return

    execute({
      communityTypes: selectedCommunities,
      pageSize,
      createdAtFrom: createdAtFrom,
      isNextPage: true,
    } as RecentPostsQuery)
  }, [createdAtFrom, loginUser])

  useEffect(() => {
    if (createdAtFrom) setCreatedAtFrom(undefined)

    execute({ communityTypes: selectedCommunities, pageSize, createdAtFrom: undefined })
  }, [selectedCommunities])
  /** useEffect End */

  /** 무한 스크롤 Start */
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useInfiniteScroll({
    targetRef: sentinelRef,
    onLoadMore: () => setCreatedAtFrom(posts?.[posts.length - 1]?.createdAt),
    hasNextPage,
    fetching: loading,
  })
  /** 무한 스크롤 End */

  return (
    <>
      <NewPostsNotice createdAtTo={createdAtTo} onClick={handleLoadNewPosts} communityTypes={selectedCommunities} />

      <PostListRoot>
        {posts?.map((post) => (
          <ListItem key={post.id} sx={{ padding: 0 }}>
            <PostListItem post={post} />
          </ListItem>
        ))}

        <div ref={sentinelRef} style={{ height: '1px' }} />
        {loading && (
          <LoadingContainer>
            <CircularProgress size="sm" />
          </LoadingContainer>
        )}
      </PostListRoot>
    </>
  )
}

const PostListRoot = styled(List)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}))

const LoadingContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})
