'use client'

import { communityLabelMap } from '@/constants/post.constants'
import { postQueryService } from '@/core/services/post.query.service'
import useApi from '@/hooks/useApi'
import { Chip, List, ListItem, Sheet, Stack, styled, SvgIconPropsSizeOverrides } from '@mui/joy'
import Image from 'next/image'
import { useEffect } from 'react'
import CommentIcon from '@mui/icons-material/Comment'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ViewIcon from '@mui/icons-material/Visibility'

const PostList = styled(List)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
}))

const PostListItem = styled('a')(({ theme }) => ({
  borderRadius: theme.radius.md,
  backgroundColor: theme.vars.palette.background.level1,
  '&:hover': {
    backgroundColor: theme.vars.palette.background.level2,
  },
  width: '100%',
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(1),
}))

const CommunityName = styled(Sheet)(({ theme }) => ({
  ...theme.typography['body-sm'],
  textAlign: 'center',
  fontWeight: theme.fontWeight.md,
  fontSize: theme.fontSize.xs,
  color: theme.vars.palette.text.secondary,
  borderRadius: theme.radius.md,
  backgroundColor: 'transparent',
}))

const Title = styled(Sheet)(({ theme }) => ({
  ...theme.typography['body-md'],
  fontWeight: theme.fontWeight.md,
  fontSize: theme.fontSize.sm,
  backgroundColor: 'transparent',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  whiteSpace: 'normal',
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: '0',
}))

const InfoStack = styled(Stack)(({ theme }) => ({
  ...theme.typography['body-xs'],
  color: theme.vars.palette.text.tertiary,
  fontWeight: theme.fontWeight.md,
  fontSize: theme.fontSize.xs,
  marginTop: theme.spacing(0.5),
}))

export default function Home() {
  const { data: posts } = useApi({
    api: postQueryService.getRecentPosts,
    executeImmediately: true,
    initalParams: {
      communityTypes: [],
      pageSize: 50,
    },
  })

  useEffect(() => {
    console.log(posts)
  }, [posts])

  return (
    <main>
      <PostList>
        {posts?.map((post) => (
          <ListItem key={post.id}>
            <PostListItem href={post.linkHref} target="_blank" rel="noopener noreferrer">
              {post.thumbnailSrc && (
                <Image
                  src={post.thumbnailSrc}
                  alt={post.title}
                  width={80}
                  height={80}
                  style={{ borderRadius: '4px', objectFit: 'cover' }}
                />
              )}
              <Stack justifyContent="space-between">
                <div className="flex gap-1">
                  <Chip color="primary">{communityLabelMap[post.communityType]}</Chip>
                  <Title>{post.title}</Title>
                </div>
                <InfoStack direction="row" spacing={2}>
                  <span>{post.authorName}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  {post.likeCount && (
                    <span>
                      <ThumbUpIcon fontSize="sm" /> {post.likeCount}
                    </span>
                  )}
                  {post.commentCount && (
                    <span>
                      <CommentIcon fontSize="sm" /> {post.commentCount}
                    </span>
                  )}
                  {post.viewCount && (
                    <span>
                      <ViewIcon fontSize="sm" /> {post.viewCount}
                    </span>
                  )}
                </InfoStack>
              </Stack>
            </PostListItem>
          </ListItem>
        ))}
      </PostList>
    </main>
  )
}
