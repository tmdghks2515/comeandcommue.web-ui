'use client'

import { getColorFromNickname } from '@/components/chat/globalChat/GlobalChatMessages'
import { MessageDto } from '@/core/dto/chat/chat.dto'
import { chatService } from '@/core/services/chat.service'
import useApi from '@/hooks/useApi'
import useGlobalWebSocketStore from '@/store/useGlobalWebSocketStore'
import useLoginUserStore from '@/store/useLoginUserStore'
import { formatDateTime } from '@/utils/time.utils'
import { IconButton, styled } from '@mui/joy'
import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import SendIcon from '@mui/icons-material/Send'
import { PostDto } from '@/core/dto/post/post.dto'

type Props = {
  post: PostDto
  onCommented: () => void
}

const PostComments = ({ post, onCommented }: Props) => {
  const [comments, setComments] = React.useState<MessageDto[]>([])
  const [input, setInput] = React.useState('')

  const containerRef = useRef<HTMLDivElement>(null)
  const didInitialScroll = useRef(false)

  const loginUser = useLoginUserStore((state) => state.loginUser)
  const sendPostComment = useGlobalWebSocketStore((state) => state.send)
  const addMessageListener = useGlobalWebSocketStore((state) => state.addMessageListener)
  const removeMessageListener = useGlobalWebSocketStore((state) => state.removeMessageListener)

  useApi({
    api: chatService.getPostComments,
    onSuccess: (data) => {
      setComments(data.reverse())
    },
    initalParams: {
      postId: post.id,
      page: 0,
    },
    executeImmediately: true,
  })

  const sendComment = useCallback(() => {
    if (!input.trim()) {
      return
    }
    sendPostComment(
      JSON.stringify({
        content: input,
        senderNickname: loginUser.nickname,
        senderId: loginUser.id,
        messageType: 'POST_COMMENT',
        targetId: post.id,
        target: {
          id: post.id,
          communityType: post.communityType,
          title: post.title,
        },
      }),
    )

    setInput('')
  }, [input, sendPostComment, loginUser.nickname, loginUser.id, post])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendComment()
      }
    },
    [sendComment],
  )

  const isAtBottom = useCallback(
    (threshold = 180) => {
      const wrapper = containerRef.current
      if (!wrapper) return false

      const { scrollHeight, clientHeight } = wrapper
      // iOS 바운스 등으로 음수 방지
      const scrollTop = Math.max(0, wrapper.scrollTop)

      // 스크롤 불가능(내용이 짧음)하면 바닥으로 간주
      if (scrollHeight <= clientHeight) return true

      // '바닥에 충분히 가까운가?' 판정
      return scrollTop + clientHeight >= scrollHeight - threshold
    },
    [containerRef],
  )

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    const el = containerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior })
  }, [])

  useEffect(() => {
    const messageListener = (event: MessageEvent) => {
      console.log('PostComments messageListener', event.data)
      const message = JSON.parse(event.data) as MessageDto
      setComments((prev) => [...prev, message])
      onCommented()
    }
    addMessageListener(messageListener, 'POST_COMMENT', post.id)
    return () => {
      removeMessageListener(messageListener)
    }
  }, [addMessageListener, removeMessageListener, post.id])

  useLayoutEffect(() => {
    if (comments.length === 0) return

    if (!didInitialScroll.current) {
      scrollToBottom('auto')
      didInitialScroll.current = true
      return
    }

    if (!isAtBottom()) return

    // 다음 프레임에서 최신 scrollHeight 사용
    requestAnimationFrame(() => {
      scrollToBottom()
    })
  }, [comments.length, isAtBottom, scrollToBottom])

  return (
    <>
      <MessagesRoot ref={containerRef}>
        {comments.map((msg, idx) => (
          <MessageItem key={idx} nicknameColor={getColorFromNickname(msg.senderNickname)}>
            <span>{formatDateTime(msg.timestamp)}</span>
            <span>{msg.senderNickname}</span>
            <span>{msg.content}</span>
          </MessageItem>
        ))}
      </MessagesRoot>

      <PostCommentInputWrapper>
        <PostCommentInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="의견 남기기 .."
          onKeyDown={handleKeyDown}
        />
        <IconButton variant="soft" color="neutral" onClick={sendComment}>
          <SendIcon />
        </IconButton>
      </PostCommentInputWrapper>
    </>
  )
}

export default React.memo(PostComments)

const MessagesRoot = styled('div')(({ theme }) => ({
  flex: '1',
  minHeight: '3vh',
  maxHeight: '12vh',
  overflowY: 'auto',
  padding: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.56)',
  overscrollBehavior: 'contain',
}))

const MessageItem = styled('p')<{ nicknameColor: string }>(({ theme, nicknameColor }) => ({
  margin: theme.spacing(0.5, 0),
  color: '#fefefe',
  fontSize: '0.9rem',
  '& span': {
    marginRight: theme.spacing(1),
  },
  '& span:first-of-type': {
    color: '#cfcfcf',
  },
  '& span:nth-of-type(2)': {
    fontWeight: 'bold',
    color: nicknameColor,
  },
}))

const PostCommentInput = styled('input')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  fontSize: '1rem',
  outline: 'none',
  backgroundColor: 'white',
  borderRadius: '.3rem',
  flex: 1,
}))

const PostCommentInputWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}))
