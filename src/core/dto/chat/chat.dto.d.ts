type MessageDto = {
  content: string
  senderId: string
  senderNickname: string
  messageType: 'GLOBAL_CHAT' | 'POST_COMMENT'
  targetId?: string
  timestamp: Date
}

export type { MessageDto }
