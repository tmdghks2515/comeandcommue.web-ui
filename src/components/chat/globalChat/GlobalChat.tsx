'use client'

import { ChatMessageDto } from '@/core/dto/chat/chat.dto'
import { formatDateTime } from '@/utils/time.utils'
import { styled } from '@mui/joy'
import { memo, useEffect, useRef, useState } from 'react'

const user = {
  nickname: '초록색 얼굴이 사각형인 고양이',
}

function GlobalChat() {
  const [messages, setMessages] = useState<ChatMessageDto[]>([])
  const [input, setInput] = useState('')
  const [isChatInputFocused, setIsChatInputFocused] = useState(false)
  const ws = useRef<WebSocket | null>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const messagesWrapperRef = useRef<HTMLDivElement>(null)

  // 2. 메시지 전송
  const sendMessage = () => {
    if (input && ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          content: input,
          sender: user.nickname,
        }),
      )
      setInput('')

      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const isAtBottom = () => {
    const wrapper = messagesWrapperRef.current
    if (!wrapper) return false

    const threshold = 0 // 여유 여백 허용 (px)
    return wrapper.scrollHeight - wrapper.scrollTop - wrapper.clientHeight < threshold
  }

  // 1. WebSocket 연결
  useEffect(() => {
    ws.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_BASE_URL}/chat`)

    ws.current.onopen = () => {
      console.log('✅ WebSocket 연결 성공')
    }

    ws.current.onmessage = (event) => {
      console.log('📩 메시지 수신:', event.data)
      setMessages((prev) => [...prev, JSON.parse(event.data)])
    }

    ws.current.onerror = (error) => {
      console.error('❌ WebSocket 에러:', error)
    }

    ws.current.onclose = () => {
      console.log('🔌 WebSocket 연결 종료')
    }

    // 엔터키 감지하여 입력 필드에 focus
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        setIsChatInputFocused(true)
        chatInputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // cleanup
    return () => {
      ws.current?.close()
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    // 스크롤을 항상 맨 아래로 유지
    if (isAtBottom()) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <GlobalChatWrapper>
      <MessagesWrapper>
        {messages.map((msg, idx) => (
          <MessageItem key={idx}>
            <span>{formatDateTime(msg.timestamp)}</span>
            <Nickname>{msg.sender}</Nickname>
            <span>{msg.content}</span>
          </MessageItem>
        ))}
        {/* 최하단 고정용 ref */}
        <div ref={bottomRef} />
      </MessagesWrapper>
      {/* Chat UI components will go here */}
      <GlobalChatInput
        ref={chatInputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter를 눌러 메시지를 전송하세요"
        onKeyDown={handleKeyDown}
      />
    </GlobalChatWrapper>
  )
}

export default memo(GlobalChat)

const GlobalChatWrapper = styled('div')(() => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  maxWidth: '50rem',
  maxHeight: '30vh',
}))

const GlobalChatInput = styled('input')(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  width: '100%',
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  fontSize: '1rem',
  color: '#fefefe',
}))

const MessagesWrapper = styled('div')(({ theme }) => ({
  flex: 1,
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
}))

const MessageItem = styled('p')(({ theme }) => ({
  margin: theme.spacing(0.5, 0),
  color: '#fefefe',
  '& span': {
    display: 'inline-block',
    marginRight: theme.spacing(1),
  },
  '& span:first-of-type': {
    color: theme.palette.text.secondary,
  },
  '& span:nth-of-type(2)': {
    fontWeight: 'bold',
  },
}))

const Nickname = styled('span')(({ theme }) => ({
  fontWeight: 'bold',
  // color: theme.palette.primary.main,
}))
