'use client'

import CustomImage from '@/components/common/CustomImage'
import { communityLabelMap } from '@/constants/post.constants'
import { PostDto } from '@/core/dto/post/post.dto'
import { formatRelativeTime } from '@/utils/time.utils'
import { Chip, Stack, styled } from '@mui/joy'
import CommentIcon from '@mui/icons-material/Comment'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ViewIcon from '@mui/icons-material/Visibility'
import React from 'react'

function PostListItem({ post }: { post: PostDto }) {
  return (
    <PostLink href={post.linkHref} target="_blank" rel="noopener noreferrer">
      {post.thumbnailSrc && (
        <Thumbnail src={post.thumbnailSrc} alt={post.title} width={100} height={100} placeholder="empty" />
      )}

      <MetaWrapper spacing={1}>
        <HeaderRow>
          <Title>{post.title}</Title>
        </HeaderRow>

        <InfoStack>
          <InfoGroup>
            <Chip size="sm" color="primary">
              {communityLabelMap[post.communityType]}
            </Chip>
            {post.authorName && (
              <span>
                <span className="text-gray-500">by </span>
                {post.authorName}
              </span>
            )}
          </InfoGroup>

          <InfoGroup2>
            <span>{formatRelativeTime(new Date(post.postedAt || post.createdAt))}</span>
            <StatGroup>
              {post.likeCount > 0 && (
                <span>
                  <ThumbUpIcon fontSize="inherit" /> {post.likeCount.toLocaleString()}
                </span>
              )}
              {post.commentCount > 0 && (
                <span>
                  <CommentIcon fontSize="inherit" /> {post.commentCount.toLocaleString()}
                </span>
              )}
              {post.viewCount > 0 && (
                <span>
                  <ViewIcon fontSize="inherit" /> {post.viewCount.toLocaleString()}
                </span>
              )}
            </StatGroup>
          </InfoGroup2>
        </InfoStack>
      </MetaWrapper>
    </PostLink>
  )
}

export default React.memo(PostListItem)

const PostLink = styled('a')(({ theme }) => ({
  flex: 1,
  borderRadius: theme.radius.md,
  backgroundColor: theme.vars.palette.background.level1,
  '&:hover': {
    backgroundColor: theme.vars.palette.background.level2,
  },
  display: 'flex',
  flexDirection: 'row',
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
  minWidth: 0,
  justifyContent: 'space-between',
  paddingLeft: theme.spacing(1),
  paddingBlock: theme.spacing(1),
  paddingRight: theme.spacing(1.5),
}))

const HeaderRow = styled('div')({
  marginBottom: 1,
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
  gap: theme.spacing(0.5),
}))

const StatGroup = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
  color: theme.vars.palette.text.tertiary,
}))
