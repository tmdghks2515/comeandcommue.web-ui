import useGlobalWebSocketStore from '@/store/useGlobalWebSocketStore'
import { useEffect } from 'react'

export default function GlobalWebSocketProvider({ children }: { children?: React.ReactNode }) {
  const connect = useGlobalWebSocketStore((state) => state.connect)
  const disconnect = useGlobalWebSocketStore((state) => state.disconnect)

  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  }, [])

  return <>{children}</>
}
