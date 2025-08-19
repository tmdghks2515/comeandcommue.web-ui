'use client'

import { getColorFromNickname } from '@/components/chat/globalChat/GlobalChatMessages'
import { MessageDto } from '@/core/dto/chat/chat.dto'
import { chatService } from '@/core/services/chat.service'
import useApi from '@/hooks/useApi'
import useGlobalWebSocketStore from '@/store/useGlobalWebSocketStore'
import useLoginUserStore from '@/store/useLoginUserStore'
import { formatDateTime } from '@/utils/time.utils'
import { styled } from '@mui/joy'
import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

const PostComments = ({ postId }: { postId: string }) => {
  const [comments, setComments] = React.useState<MessageDto[]>([])
  const [input, setInput] = React.useState('')

  const bottomRef = useRef<HTMLDivElement>(null)

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
      postId,
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
        targetId: postId,
      }),
    )

    setInput('')
  }, [input, sendPostComment, loginUser.nickname, loginUser.id, postId])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendComment()
      }
    },
    [sendComment],
  )

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      // if (bottomRef.current) {
      //   bottomRef.current.scrollIntoView({ behavior })
      // }
    },
    [bottomRef],
  )

  useEffect(() => {
    const messageListener = (event: MessageEvent) => {
      const message = JSON.parse(event.data) as MessageDto
      setComments((prev) => [...prev, message])
      scrollToBottom('auto')
    }
    addMessageListener(messageListener, 'POST_COMMENT', postId)
    return () => {
      removeMessageListener(messageListener)
    }
  }, [addMessageListener, removeMessageListener, postId, scrollToBottom])

  useLayoutEffect(() => {
    scrollToBottom('auto')
  }, [comments])

  return (
    <>
      <MessagesRoot>
        {comments.map((msg, idx) => (
          <MessageItem key={idx} nicknameColor={getColorFromNickname(msg.senderNickname)}>
            <span>[{formatDateTime(msg.timestamp)}]</span>
            <span>{msg.senderNickname}</span>
            <span>{msg.content}</span>
          </MessageItem>
        ))}
      </MessagesRoot>
      <div ref={bottomRef} />

      <PostCommentInput
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="의견 남기기 .."
        onKeyDown={handleKeyDown}
      />
    </>
  )
}

export default React.memo(PostComments)

const MessagesRoot = styled('div')(({ theme }) => ({
  flex: 1,
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(1),
  maxHeight: '12vh',
  backgroundColor: 'rgba(0, 0, 0, 0.56)',
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
}))
