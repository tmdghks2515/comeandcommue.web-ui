import PostListItem from '@/app/(home)/_components/PostListItem'
import { postQueryService } from '@/core/services/post.query.service'
import useApi from '@/hooks/useApi'
import { Box, CircularProgress, DialogContent, DialogTitle, Modal, ModalClose, ModalDialog, styled } from '@mui/joy'
import { memo, Suspense, useEffect } from 'react'

type Props = {
  postId?: string
  onClose: () => void
}

function PostCommentsModal({ postId, onClose }: Props) {
  const {
    execute: getPost,
    data: post,
    loading,
  } = useApi({
    api: postQueryService.getPost,
  })

  useEffect(() => {
    if (postId) {
      getPost(postId)
    }
  }, [postId])

  return (
    <Modal open={!!postId} onClose={onClose}>
      <ModalDialogStyled>
        <ModalClose />
        <DialogTitle>게시글</DialogTitle>
        <DialogContent>
          {loading ? (
            <LoadingContainer>
              <CircularProgress size="sm" />
            </LoadingContainer>
          ) : (
            post && <PostListItem post={post} />
          )}
        </DialogContent>
      </ModalDialogStyled>
    </Modal>
  )
}

export default memo(PostCommentsModal)

const ModalDialogStyled = styled(ModalDialog)(() => ({
  width: '600px',
}))

const LoadingContainer = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100px',
}))
