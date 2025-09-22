'use client'

import { IconButton, styled } from '@mui/joy'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { useCallback, useEffect, useState } from 'react'
import useThrottle from '@/hooks/useThrottle'

export default function ScrollTopButton() {
  const [scrollY, setScrollY] = useState(0)
  const throttledScrollY = useThrottle(scrollY, 150) // 150ms 단위로 갱신

  const handleScrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const showScrollTop = throttledScrollY > 1500

  return (
    <>
      {showScrollTop && (
        <ScrollTopBubble
          size="lg"
          variant="outlined"
          color="neutral"
          onClick={handleScrollTop}
          aria-label="스크롤 맨 위로 이동"
        >
          <ArrowUpwardIcon />
        </ScrollTopBubble>
      )}
    </>
  )
}

const ScrollTopBubble = styled(IconButton)(({ theme }) => ({}))
