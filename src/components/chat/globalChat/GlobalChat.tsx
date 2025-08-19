'use client'

import { MessageDto } from '@/core/dto/chat/chat.dto'
import useLoginUserStore from '@/store/useLoginUserStore'
import { IconButton, styled } from '@mui/joy'
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import GlobalChatMessages from './GlobalChatMessages'
import useApi from '@/hooks/useApi'
import { chatService } from '@/core/services/chat.service'
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import ChatBubbleIcon from '@mui/icons-material/ChatOutlined'
import MinimizeIcon from '@mui/icons-material/Minimize'
import useGlobalWebSocketStore from '@/store/useGlobalWebSocketStore'

const globalChatFolded = 'globalChatFolded'
const globalChatMinimized = 'globalChatMinimized'

function GlobalChat() {
  const [messages, setMessages] = useState<MessageDto[]>([])
  const [input, setInput] = useState('')
  const [folded, setFolded] = useState(localStorage.getItem(globalChatFolded) === 'true')
  const [minimized, setMinimized] = useState(localStorage.getItem(globalChatMinimized) === 'true')

  const loginUser = useLoginUserStore((state) => state.loginUser)
  const chatInputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const messagesWrapperRef = useRef<HTMLDivElement>(null)
  // 초기 스크롤 수행 여부 가드
  const didInitialScroll = useRef(false)

  const sendGlobalChat = useGlobalWebSocketStore((state) => state.send)
  const addMessageListener = useGlobalWebSocketStore((state) => state.addMessageListener)
  const removeMessageListener = useGlobalWebSocketStore((state) => state.removeMessageListener)

  useApi({
    api: chatService.getMessages,
    onSuccess: (data) => {
      setMessages(data.reverse())
    },
    initalParams: 0,
    executeImmediately: true,
  })

  // 2. 메시지 전송
  const sendMessage = useCallback(() => {
    if (!input.trim()) {
      return
    }
    sendGlobalChat(
      JSON.stringify({
        content: input,
        senderNickname: loginUser.nickname,
        senderId: loginUser.id,
      }),
    )

    setInput('')
  }, [input, sendGlobalChat, loginUser.nickname, loginUser.id])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    },
    [sendMessage],
  )

  const isAtBottom = useCallback(
    (threshold = 180) => {
      const wrapper = messagesWrapperRef.current
      if (!wrapper) return false

      const { scrollHeight, clientHeight } = wrapper
      // iOS 바운스 등으로 음수 방지
      const scrollTop = Math.max(0, wrapper.scrollTop)

      // 스크롤 불가능(내용이 짧음)하면 바닥으로 간주
      if (scrollHeight <= clientHeight) return true

      // '바닥에 충분히 가까운가?' 판정
      return scrollTop + clientHeight >= scrollHeight - threshold
    },
    [messagesWrapperRef],
  )

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior })
      }
    },
    [bottomRef],
  )

  const handleFoldToggle = useCallback(() => {
    setFolded((prev) => !prev)
    localStorage.setItem(globalChatFolded, String(!folded))
  }, [folded, scrollToBottom])

  const handleMinimizeToggle = useCallback(() => {
    setMinimized((prev) => !prev)
    localStorage.setItem(globalChatMinimized, String(!minimized))
  }, [minimized, scrollToBottom])

  useEffect(() => {
    const messageListener = (event: MessageEvent) => {
      const message: MessageDto = JSON.parse(event.data)
      setMessages((prev) => [...prev, message])
    }

    addMessageListener(messageListener)
    // cleanup
    return () => {
      removeMessageListener(messageListener)
    }
  }, [])

  useLayoutEffect(() => {
    // 스크롤을 항상 맨 아래로 유지
    if (isAtBottom()) {
      scrollToBottom()
    }
  }, [messages.length])

  useLayoutEffect(() => {
    scrollToBottom('auto')
  }, [folded, minimized])

  // 렌더 직후(레이아웃 계산 후) 한 번만 바닥으로
  useLayoutEffect(() => {
    if (didInitialScroll.current) return
    if (messages.length === 0) return

    scrollToBottom('auto')

    didInitialScroll.current = true
  }, [messages.length])

  return !minimized ? (
    <GlobalChatRoot>
      <GlobalChatTop>
        <GlobalChatTitle>전체 채팅</GlobalChatTitle>

        <div>
          <IconButton size={'sm'} data-joy-color-scheme="dark">
            {<MinimizeIcon onClick={handleMinimizeToggle} />}
          </IconButton>
          <IconButton size={'sm'} data-joy-color-scheme="dark" onClick={handleFoldToggle}>
            {folded ? <UnfoldMoreIcon /> : <UnfoldLessIcon />}
          </IconButton>
        </div>
      </GlobalChatTop>
      <GlobalChatMessages
        messages={messages}
        topRef={topRef}
        bottomRef={bottomRef}
        wrapperRef={messagesWrapperRef}
        folded={folded}
      />

      <GlobalChatInput
        ref={chatInputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="무슨 생각 하고 계세요?"
        onKeyDown={handleKeyDown}
      />
    </GlobalChatRoot>
  ) : (
    <GlobalChatBubble size="lg" variant="outlined" color="neutral" onClick={handleMinimizeToggle}>
      <ChatBubbleIcon />
    </GlobalChatBubble>
  )
}

export default memo(GlobalChat)

const GlobalChatRoot = styled('div')(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(0, 0, 0, 0.56)',

  borderRadius: '.3rem',
  padding: theme.spacing(1),
  fontSize: '.9rem',

  width: '100%',

  // 데스크탑 (md 이상)
  [theme.breakpoints.up('md')]: {
    width: '30rem',
  },
}))

const GlobalChatTop = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: theme.spacing(0.8),
}))

const GlobalChatTitle = styled('span')(({ theme }) => ({
  fontWeight: 'bold',
  color: '#fefefe',

  fontSize: '1rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '.8rem',
  },
}))

const GlobalChatInput = styled('input')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  fontSize: '1rem',
  outline: 'none',
  backgroundColor: 'white',
  borderRadius: '.3rem',
}))

const GlobalChatBubble = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  left: theme.spacing(1),
}))
