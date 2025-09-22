'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  fn: () => void
  interval?: number // 기본 3000ms
  enabled?: boolean // 기본 true
  immediate?: boolean // 마운트/재개 시 즉시 1회 실행 (기본 true)
  pauseOnHidden?: boolean // 탭 숨김 시 일시정지 (기본 true)
}

export function usePolling({ fn, interval = 3000, enabled = true, immediate = false, pauseOnHidden = true }: Props) {
  const [error, setError] = useState<unknown>(null)
  const [isRunning, setIsRunning] = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fnRef = useRef(fn)
  // 최신 fn을 항상 참조
  useEffect(() => {
    fnRef.current = fn
  }, [fn])

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
  }

  const schedule = useCallback(() => {
    clearTimer()
    if (!enabled) return
    timerRef.current = setTimeout(() => {
      tick()
    }, interval)
  }, [enabled, interval])

  const tick = useCallback(() => {
    if (!enabled) return

    try {
      fnRef.current()
      setError(null)
      schedule()
    } catch (e) {
      setError(e)
      schedule() // 간단 버전: 실패해도 동일 주기로 재시도
    }
  }, [enabled, schedule])

  const start = useCallback(() => {
    if (!enabled || isRunning) return
    setIsRunning(true)
    if (immediate) tick()
    else schedule()
  }, [enabled, immediate, isRunning, schedule, tick])

  const stop = useCallback(() => {
    setIsRunning(false)
    clearTimer()
  }, [])

  // enabled 변경 반영
  useEffect(() => {
    if (enabled) start()
    else stop()
  }, [enabled])

  // 가시성에 따라 일시정지/재개 (옵션)
  useEffect(() => {
    if (!pauseOnHidden || typeof document === 'undefined') return
    const onVis = () => {
      if (document.hidden) stop()
      else if (enabled) start()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [enabled, pauseOnHidden, start, stop])

  // 언마운트 정리
  useEffect(() => {
    return () => {
      stop()
    }
  }, [])

  // 수동 1회 실행
  const runNow = useCallback(() => {
    if (!isRunning) setIsRunning(true)
    tick()
  }, [isRunning, tick])

  return { error, isRunning, start, stop, tick: runNow }
}
