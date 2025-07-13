import { useEffect, useState } from 'react'

export default function useCheckIsClient() {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}
