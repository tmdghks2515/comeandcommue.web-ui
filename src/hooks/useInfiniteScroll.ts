import { useEffect } from 'react'

interface UseInfiniteScrollProps {
  targetRef: React.RefObject<HTMLElement | null>
  onLoadMore: () => void
  hasNextPage: boolean
  fetching: boolean
  rootMargin?: string
}

export default function useInfiniteScroll({
  targetRef,
  onLoadMore,
  hasNextPage,
  fetching: isFetching,
  rootMargin = '100px',
}: UseInfiniteScrollProps) {
  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetching) {
          onLoadMore()
        }
      },
      {
        root: null,
        rootMargin,
        threshold: 0,
      },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [targetRef, onLoadMore, hasNextPage, isFetching, rootMargin])
}
