import { useState, useEffect } from 'react'

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)

    return () => {
      clearTimeout(handler) // 입력이 계속되면 이전 타이머를 취소
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
