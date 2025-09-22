'use client'

import { styled } from '@mui/joy'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import CloseIcon from '@mui/icons-material/Close'
import useApi from '@/hooks/useApi'
import { postQueryService } from '@/core/services/post.query.service'
import { usePolling } from '@/hooks/usePolling'
import { memo, useCallback } from 'react'

type Props = {
  createdAtTo: Date | undefined
  communityTypes: string[]
  onClick: () => void
}

function NewPostsNotice({ createdAtTo, communityTypes, onClick }: Props) {
  const {
    execute: countNewPosts,
    data: newPostsCount,
    setData: setNewPostsCount,
  } = useApi({
    api: postQueryService.countNewPosts,
  })

  const executeCountNewPosts = useCallback(() => {
    if (createdAtTo) countNewPosts({ createdAtTo, communityTypes })
  }, [createdAtTo, communityTypes, countNewPosts])

  usePolling({
    fn: executeCountNewPosts,
    interval: 3000,
    enabled: !!createdAtTo,
  })

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setNewPostsCount(0)
    onClick()
  }, [setNewPostsCount, onClick])

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setNewPostsCount(0)
    },
    [setNewPostsCount],
  )

  return (
    !!newPostsCount && (
      <NewPostsNoticeRoot onClick={handleClick}>
        <NewPostNoticeLeftSide>
          새 게시글 {newPostsCount}개 <AutorenewIcon />
        </NewPostNoticeLeftSide>

        <CloseIcon onClick={handleClose} />
      </NewPostsNoticeRoot>
    )
  )
}

export default memo(NewPostsNotice)

const NewPostsNoticeRoot = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: 0,
  color: 'white',
  backgroundColor: theme.vars.palette.secondary.plainColor,
  paddingInline: theme.spacing(1),
  paddingBlock: theme.spacing(0.3),
  fontSize: '0.9rem',
  borderRadius: theme.spacing(0.3),
  zIndex: 1,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',

  '& svg': {
    color: 'white',
  },
}))

const NewPostNoticeLeftSide = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
})
