import { useEffect, useRef, useState } from 'react'

function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastExecuted = useRef<number>(Date.now())

  useEffect(() => {
    const now = Date.now()
    const remainingTime = delay - (now - lastExecuted.current)

    if (remainingTime <= 0) {
      // delay 경과 → 즉시 업데이트
      setThrottledValue(value)
      lastExecuted.current = now
    } else {
      // 아직 delay 안 지났으면 delay 끝날 때 한 번만 실행
      const timer = setTimeout(() => {
        setThrottledValue(value)
        lastExecuted.current = Date.now()
      }, remainingTime)

      return () => clearTimeout(timer)
    }
  }, [value, delay])

  return throttledValue
}

export default useThrottle
