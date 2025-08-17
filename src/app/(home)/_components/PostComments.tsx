'use client'

import { getColorFromNickname } from '@/components/chat/globalChat/GlobalChatMessages'
import { MessageDto } from '@/core/dto/chat/chat.dto'
import { chatService } from '@/core/services/chat.service'
import useApi from '@/hooks/useApi'
import { formatDateTime } from '@/utils/time.utils'
import { styled } from '@mui/joy'
import React, { useCallback, useLayoutEffect, useRef } from 'react'

const PostComments = ({ postId }: { postId: string }) => {
  const [messages, setMessages] = React.useState<MessageDto[]>([])
  const [input, setInput] = React.useState('')

  const bottomRef = useRef<HTMLDivElement>(null)

  useApi({
    api: chatService.getMessages,
    onSuccess: (data) => {
      setMessages(data.reverse())
    },
    initalParams: 0,
    executeImmediately: true,
  })

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior })
      }
    },
    [bottomRef],
  )

  useLayoutEffect(() => {
    scrollToBottom('auto')
  }, [messages])

  return (
    <>
      <MessagesRoot>
        {messages.map((msg, idx) => (
          <MessageItem key={idx} nicknameColor={getColorFromNickname(msg.senderNickname)}>
            <span>[{formatDateTime(msg.timestamp)}]</span>
            <span>{msg.senderNickname}</span>
            <span>{msg.content}</span>
          </MessageItem>
        ))}
      </MessagesRoot>
      <div ref={bottomRef} />

      <PostCommentInput value={input} onChange={(e) => setInput(e.target.value)} placeholder="댓글 작성 하기..." />
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
