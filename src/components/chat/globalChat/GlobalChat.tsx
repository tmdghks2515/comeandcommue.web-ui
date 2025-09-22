'use client'

import { MessageDto } from '@/core/dto/chat/chat.dto'
import useLoginUserStore from '@/store/useLoginUserStore'
import { Box, IconButton, styled } from '@mui/joy'
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import GlobalChatMessages from './GlobalChatMessages'
import useApi from '@/hooks/useApi'
import { chatService } from '@/core/services/chat.service'
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import ChatBubbleIcon from '@mui/icons-material/ChatOutlined'
import MinimizeIcon from '@mui/icons-material/Minimize'
import useGlobalWebSocketStore from '@/store/useGlobalWebSocketStore'
import SendIcon from '@mui/icons-material/Send'
import PostCommentsModal from './PostCommentsModal'
import ScrollTopButton from '@/components/common/ScrollTopButton'

const globalChatFolded = 'globalChatFolded'
const globalChatMinimized = 'globalChatMinimized'

function GlobalChat() {
  const [messages, setMessages] = useState<MessageDto[]>([])
  const [input, setInput] = useState('')
  const [folded, setFolded] = useState(localStorage.getItem(globalChatFolded) === 'true')
  const [minimized, setMinimized] = useState(localStorage.getItem(globalChatMinimized) === 'true')
  const [postCommentsModalPostId, setPostCommentsModalPostId] = useState<string>()

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
    immediate: true,
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
  }, [folded])

  const handleMinimizeToggle = useCallback(() => {
    setMinimized((prev) => !prev)
    localStorage.setItem(globalChatMinimized, String(!minimized))
  }, [minimized])

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

  // 스크롤 맨 아래 유지
  useLayoutEffect(() => {
    if (messages.length === 0) return
    if (!didInitialScroll.current) {
      scrollToBottom('auto')
      didInitialScroll.current = true
    } else if (isAtBottom()) {
      scrollToBottom()
    }
  }, [messages.length])

  useLayoutEffect(() => {
    scrollToBottom('auto')
  }, [folded, minimized])

  return (
    <>
      <GlobalChatRoot>
        {/* scroll top 버튼 */}
        <ScrollTopButtonContainer>
          <ScrollTopButton />
        </ScrollTopButtonContainer>

        {minimized ? (
          <GlobalChatBubble size="lg" variant="outlined" color="neutral" onClick={handleMinimizeToggle}>
            <ChatBubbleIcon />
          </GlobalChatBubble>
        ) : (
          <GlobalChatContainer>
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
              onClickPostTarget={setPostCommentsModalPostId}
              messages={messages}
              topRef={topRef}
              bottomRef={bottomRef}
              wrapperRef={messagesWrapperRef}
              folded={folded}
            />

            <GlobalChatInputWrapper>
              <GlobalChatInput
                ref={chatInputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="무슨 생각 하고 계세요?"
                onKeyDown={handleKeyDown}
              />
              <IconButton variant="soft" color="neutral" onClick={sendMessage}>
                <SendIcon />
              </IconButton>
            </GlobalChatInputWrapper>
          </GlobalChatContainer>
        )}
      </GlobalChatRoot>

      <PostCommentsModal postId={postCommentsModalPostId} onClose={() => setPostCommentsModalPostId(undefined)} />
    </>
  )
}

export default memo(GlobalChat)

const ScrollTopButtonContainer = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },

  [theme.breakpoints.up('md')]: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },

  [theme.breakpoints.up('lg')]: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: '25%',
  },

  zIndex: 1000,
}))

const GlobalChatRoot = styled('div')(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,

  width: '100%',

  // 데스크탑 (md 이상)
  [theme.breakpoints.up('md')]: {
    width: '30rem',
  },
}))

const GlobalChatContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(0, 0, 0, 0.56)',

  borderRadius: '.3rem',
  padding: theme.spacing(1),
  fontSize: '.9rem',
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

const GlobalChatInputWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
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
  bottom: theme.spacing(1),
  left: theme.spacing(1),
}))
