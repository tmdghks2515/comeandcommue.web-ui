import { communityLabelMap } from '@/constants/post.constants'
import { MessageDto } from '@/core/dto/chat/chat.dto'
import { formatDateTime } from '@/utils/time.utils'
import { Chip, ListItem, styled } from '@mui/joy'
import { memo, useCallback } from 'react'

type Props = {
  messages: MessageDto[]
  topRef: React.RefObject<HTMLDivElement | null>
  bottomRef: React.RefObject<HTMLDivElement | null>
  wrapperRef?: React.RefObject<HTMLDivElement | null>
  folded: boolean
  onClickPostTarget: (postId: string) => void
}

export const nicknameColors = [
  '#00ffa3', // 청록(기준색)
  '#ff4fa3', // 핑크
  '#ff6f4f', // 주황빛 레드
  '#4f9fff', // 블루
  '#ffe14f', // 옐로우
]

export const getColorFromNickname = (nickname: string) => {
  let hash = 0
  for (let i = 0; i < nickname.length; i++) {
    hash = nickname.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % nicknameColors.length
  return nicknameColors[index]
}

function GlobalChatMessages({ messages, topRef, bottomRef, wrapperRef, folded, onClickPostTarget }: Props) {
  return (
    <MessagesRoot ref={wrapperRef} folded={folded}>
      <div ref={topRef} />
      {messages.map((msg, idx) => (
        <ListItem key={idx} sx={{ padding: 0 }}>
          <MessageItem nicknameColor={getColorFromNickname(msg.senderNickname)}>
            <span>{formatDateTime(msg.timestamp)}</span>
            <span>{msg.senderNickname}</span>
            {msg.messageType === 'POST_COMMENT' && msg.target ? (
              <MessageItemTarget onClick={() => onClickPostTarget(msg.target!.id)}>
                [{communityLabelMap[msg.target.communityType]}]{msg.target.title}
              </MessageItemTarget>
            ) : null}
            <span>{msg.content}</span>
          </MessageItem>
        </ListItem>
      ))}
      <div ref={bottomRef} />
    </MessagesRoot>
  )
}

export default memo(GlobalChatMessages)

const MessagesRoot = styled('div')<{ folded: boolean }>(({ theme, folded }) => ({
  flex: 1,
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(1),
  maxHeight: folded ? '4vh' : '20vh',
}))

const MessageItem = styled('p')<{ nicknameColor: string }>(({ theme, nicknameColor }) => ({
  margin: theme.spacing(0.5, 0),
  color: '#fefefe',
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

const MessageItemTarget = styled('span')(({ theme }) => ({
  fontStyle: 'italic',
  color: '#a3a3a3',
  '&:hover': {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
}))
