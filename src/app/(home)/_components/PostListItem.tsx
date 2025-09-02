'use client'

import CustomImage from '@/components/common/CustomImage'
import { communityLabelMap } from '@/constants/post.constants'
import { PostDto } from '@/core/dto/post/post.dto'
import { formatRelativeTime } from '@/utils/time.utils'
import { Button, Chip, IconButton, Stack, styled } from '@mui/joy'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import MouseOutlinedIcon from '@mui/icons-material/MouseOutlined'
import React from 'react'
import useApi from '@/hooks/useApi'
import { postService } from '@/core/services/post.service'
import ChatBubbleIcon from '@mui/icons-material/ChatOutlined'
import PostComments from './PostComments'

function PostListItem({ post: postParam }: { post: PostDto }) {
  const [post, setPost] = React.useState<PostDto>(postParam)
  const [commentsOpen, setCommentsOpen] = React.useState(false)

  const { execute: executeHitPost } = useApi({
    api: postService.hitPost,
    onSuccess: () => {
      setPost((prev) => ({
        ...prev,
        hitCount: prev.hitCount + 1,
      }))
    },
  })

  const { execute: executeLikePost } = useApi({
    api: postService.likePost,
    onSuccess: (data) => {
      setPost((prev) => ({
        ...prev,
        likeCount: data ? prev.likeCount + 1 : prev.likeCount - 1,
        liked: data,
      }))
    },
  })

  const handleLikePost = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    executeLikePost(post.id)
  }

  const handleCommentPostToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCommentsOpen((prev) => !prev)
  }

  const handleCommented = () => {
    setPost((prev) => ({
      ...prev,
      commentCount: (prev.commentCount || 0) + 1,
    }))
  }

  return (
    <PostListItemRoot>
      <PostLink href={post.linkHref} target="_blank" rel="noopener noreferrer" onClick={() => executeHitPost(post.id)}>
        <MetaWrapper spacing={1}>
          <HeaderRow>
            <Title>{post.title}</Title>
            {post.thumbnailSrc && (
              <Thumbnail src={post.thumbnailSrc} alt={post.title} width={60} height={60} placeholder="empty" />
            )}
          </HeaderRow>

          <InfoStack>
            <InfoGroup>
              <Chip size="sm" color="primary">
                {communityLabelMap[post.communityType]}
              </Chip>
              {post.authorName && (
                <span>
                  <span>by </span>
                  {post.authorName}
                </span>
              )}
            </InfoGroup>

            <InfoGroup2>
              <div>
                <span>{formatRelativeTime(new Date(post.createdAt))}</span>
                <span> · </span>
                <span>
                  <MouseOutlinedIcon fontSize="inherit" /> {post.hitCount.toLocaleString()}
                </span>
              </div>

              <StatGroup>
                <Button
                  color={commentsOpen ? 'primary' : 'neutral'}
                  variant="plain"
                  onClick={(e) => handleCommentPostToggle(e)}
                  size="sm"
                  startDecorator={<ChatBubbleIcon />}
                >
                  {post.commentCount?.toLocaleString() || 0}
                </Button>
                <Button
                  size="sm"
                  variant="plain"
                  color={post.liked ? 'primary' : 'neutral'}
                  startDecorator={<ThumbUpIcon />}
                  onClick={(e) => handleLikePost(e)}
                >
                  {post.likeCount?.toLocaleString() || 0}
                </Button>
              </StatGroup>
            </InfoGroup2>
          </InfoStack>
        </MetaWrapper>
      </PostLink>
      {commentsOpen && <PostComments post={post} onCommented={handleCommented} />}
    </PostListItemRoot>
  )
}

export default React.memo(PostListItem)

const PostListItemRoot = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',

  [theme.breakpoints.up('lg')]: {
    maxWidth: '48rem',
  },
}))

const PostLink = styled('a')(({ theme }) => ({
  borderRadius: theme.radius.md,
  backgroundColor: theme.vars.palette.background.level1,
  '&:hover': {
    backgroundColor: theme.vars.palette.background.level2,
  },
  textDecoration: 'none',
  color: 'inherit',
}))

const Thumbnail = styled(CustomImage)({
  borderRadius: 8,
  objectFit: 'cover',
  flexShrink: 0,
})

const MetaWrapper = styled(Stack)(({ theme }) => ({
  flex: 1,
  justifyContent: 'space-between',
  paddingLeft: theme.spacing(1),
  paddingBlock: theme.spacing(1),
  paddingRight: theme.spacing(1),
}))

const HeaderRow = styled('div')({
  marginBottom: 1,
  display: 'flex',
  justifyContent: 'space-between',
})

const Title = styled('div')(({ theme }) => ({
  ...theme.typography['body-sm'],
  fontWeight: theme.fontWeight.lg,
  color: theme.vars.palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  whiteSpace: 'normal',
  flexGrow: 1,
}))

const InfoStack = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  fontSize: theme.fontSize.xs,
  color: theme.vars.palette.text.secondary,
}))

const InfoGroup = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}))

const InfoGroup2 = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  '& div:first-of-type': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}))

const StatGroup = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  flexWrap: 'wrap',
}))
