import { MessageDto } from '@/core/dto/chat/chat.dto'
import { create } from 'zustand'

type MsgListener = ((event: MessageEvent) => void) & { messageType?: GlobalMessageType; targetId?: string }

type GlobalMessageType = 'GLOBAL_CHAT' | 'POST_COMMENT'

type GlobalWebSocket = {
  globalWebSocket: WebSocket | null
  listeners: Set<MsgListener> // 영속 리스너 모음
  messagesQueue: string[] // 소켓 열릴 때까지 보낼 메시지
  isConnecting: boolean
  connect: (retry?: number, delayMs?: number) => void
  disconnect: () => void
  send: (message: string) => void
  addMessageListener: (listener: MsgListener, messageType?: GlobalMessageType, targetId?: string) => void
  removeMessageListener: (listener: MsgListener) => void
}

const WS_URL = `${process.env.NEXT_PUBLIC_WS_BASE_URL}/chat`

export const useGlobalWebSocketStore = create<GlobalWebSocket>((set, get) => ({
  globalWebSocket: null,
  listeners: new Set<MsgListener>(),
  messagesQueue: [],
  isConnecting: false,

  connect: (retry = 5, delayMs = 800) => {
    // SSR/빌드 타임 가드
    if (typeof window === 'undefined' || typeof WebSocket === 'undefined') return

    const { globalWebSocket, isConnecting } = get()

    // 이미 연결되어 있거나 연결 중인 경우 패스
    if (
      isConnecting ||
      (globalWebSocket &&
        (globalWebSocket.readyState === WebSocket.OPEN || globalWebSocket.readyState === WebSocket.CONNECTING))
    ) {
      return
    }

    set({ isConnecting: true })

    const ws = new WebSocket(WS_URL)

    // 멀티플렉서: 단 하나의 onmessage에서 모든 리스너 호출
    ws.onmessage = (event) => {
      const { listeners } = get()
      const message = JSON.parse(event.data) as MessageDto
      for (const listener of Array.from(listeners)) {
        try {
          if (!listener.messageType || listener.messageType === message.messageType) {
            if (!listener.targetId || listener.targetId === message.targetId) {
              listener(event)
            }
          }
        } catch (e) {
          console.error('[WS listener error]', e)
        }
      }
    }

    ws.onopen = () => {
      console.log('✅ Global WebSocket 연결 성공')
      const { messagesQueue } = get()
      // 열리자마자 큐 플러시
      for (const msg of messagesQueue) {
        try {
          ws.send(msg)
        } catch (e) {
          console.error('[WS send flush error]', e)
        }
      }
      set({ messagesQueue: [], isConnecting: false, globalWebSocket: ws })
    }

    ws.onerror = (error) => {
      console.error('❌ Global WebSocket 에러:', error)
      // onerror는 참고용 로그만. 재시도는 onclose에서 일괄 처리
    }

    ws.onclose = () => {
      console.log('🔌 Global WebSocket 연결 종료')
      set({ globalWebSocket: null, isConnecting: false })
      if (retry > 0) {
        // 지수 백오프 예시
        const nextDelay = Math.min(delayMs * 1.6, 10_000)
        setTimeout(() => get().connect(retry - 1, nextDelay), delayMs)
      }
    }

    set({ globalWebSocket: ws })
  },

  disconnect: () => {
    const { globalWebSocket } = get()
    if (globalWebSocket) {
      try {
        globalWebSocket.close()
      } catch {}
      set({ globalWebSocket: null, isConnecting: false })
      console.log('🔌 Global WebSocket 수동 종료')
    } else {
      console.warn('Global WebSocket is not connected')
    }
  },

  addMessageListener: (listener, messageType, targetId) => {
    listener.messageType = messageType
    listener.targetId = targetId
    // Set에 영속 추가
    const next = new Set(get().listeners)
    next.add(listener)
    set({ listeners: next })

    // 이미 열린 상태여도 별도 attach 불필요(멀티플렉서가 호출)
    console.log('✅ Message listener registered (store)')
  },

  removeMessageListener: (listener) => {
    const next = new Set(get().listeners)
    if (next.delete(listener)) {
      set({ listeners: next })
    }
  },

  send: (message: string) => {
    const { globalWebSocket, connect } = get()
    if (globalWebSocket && globalWebSocket.readyState === WebSocket.OPEN) {
      try {
        globalWebSocket.send(message)
        return
      } catch (e) {
        console.error('[WS send error, will enqueue]', e)
      }
    }
    // 열려있지 않으면 큐에 저장 후 연결(또는 재연결) 시도
    set((s) => ({ messagesQueue: [...s.messagesQueue, message] }))
    connect()
  },
}))

export default useGlobalWebSocketStore
