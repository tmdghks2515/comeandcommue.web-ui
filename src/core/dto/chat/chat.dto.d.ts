type MessageDto = {
  content: string
  senderId: string
  senderNickname: string
  messageType: 'GLOBAL_CHAT' | 'POST_COMMENT'
  target?: Record<string, any>
  timestamp: Date
}

export type { MessageDto }
