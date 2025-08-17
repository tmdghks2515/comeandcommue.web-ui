import { useEffect, useLayoutEffect, useRef } from 'react'

type UseStickyScrollArgs = {
  containerRef: React.RefObject<HTMLElement | null>
  bottomRef: React.RefObject<HTMLElement | null>
  deps: any[]
  threshold?: number // 바닥 판정 임계값(px)
}

export function useStickyScroll({ containerRef, bottomRef, deps, threshold = 64 }: UseStickyScrollArgs) {
  const autoStickRef = useRef(true) // 바닥에 붙어 있는지(사용자 스크롤로 해제될 수 있음)
  const didInitialScrollRef = useRef(false)

  // 1) 스크롤 시 바닥 근접 여부 추적 (리렌더 없이 ref에만 보관)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onScroll = () => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold
      autoStickRef.current = nearBottom
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // 초기 상태 계산
    return () => el.removeEventListener('scroll', onScroll)
  }, [containerRef, threshold])

  // 2) 컨테이너 리사이즈/이미지 로딩 등으로 높이 변경 시에도 바닥 유지
  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => {
      if (autoStickRef.current && bottomRef.current) {
        bottomRef.current.scrollIntoView({ block: 'end', behavior: 'auto' })
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [containerRef, bottomRef])

  // 3) 새 메시지 도착 시 스크롤 동작
  useLayoutEffect(() => {
    if (!bottomRef.current) return

    // 초기 1회 자동 스크롤
    if (!didInitialScrollRef.current) {
      bottomRef.current.scrollIntoView({ block: 'end', behavior: 'auto' })
      didInitialScrollRef.current = true
      return
    }

    // 평소에는 바닥에 붙어 있을 때만 자동 스크롤
    if (autoStickRef.current) {
      bottomRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' })
    }
  }, deps)
}
