'use client'

import { communityValueLabels } from '@/constants/post.constants'
import { Box, Chip, IconButton, styled } from '@mui/joy'
import React, { useEffect, useRef, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import useCommuFilterStore from '@/store/useCommuFilterStore'

function CommuFilterChips() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const chipsWrapperRef = useRef<HTMLDivElement>(null)

  const { selected, setSelected } = useCommuFilterStore()

  // overflow 여부 측정
  useEffect(() => {
    const wrapper = chipsWrapperRef.current
    if (!wrapper) return

    const checkOverflow = () => {
      const hasOverflow = wrapper.scrollWidth > wrapper.clientWidth
      setIsOverflowing(hasOverflow)
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [communityValueLabels])

  const toggleSelection = (value: string) => {
    const checked = selected.includes(value)
    if (!checked) {
      setSelected([...selected, value])
    } else {
      setSelected(selected.filter((v) => v !== value))
    }
  }

  const isSelectedAll = selected.length === communityValueLabels.length

  const toggleSelectAll = () => {
    if (isSelectedAll) {
      setSelected([])
    } else {
      setSelected(communityValueLabels.map((item) => item.value))
    }
  }

  return (
    <>
      <CommuFilterChipsRoot>
        {/* 전체 선택/해제 */}
        <CommuFilterChipsWrapper expended={isExpanded} ref={chipsWrapperRef} role="group" aria-label="커뮤니티 선택">
          <CommueFilterChip
            variant="outlined"
            color={isSelectedAll ? 'primary' : 'neutral'}
            aria-pressed={isSelectedAll}
            onClick={toggleSelectAll}
          >
            전체
          </CommueFilterChip>
          {communityValueLabels.map(({ value, label }) => {
            const isChecked = selected.includes(value)
            return (
              <CommueFilterChip
                key={value}
                variant="outlined"
                color={isChecked ? 'primary' : 'neutral'}
                aria-pressed={isChecked}
                onClick={() => toggleSelection(value)}
              >
                {label}
              </CommueFilterChip>
            )
          })}
        </CommuFilterChipsWrapper>

        {/* 넘칠 때만 표시되는 버튼 */}
        {isOverflowing && (
          <Box sx={{ flexShrink: 0 }}>
            <IconButton variant="plain" size="sm" onClick={() => setIsExpanded((prev) => !prev)}>
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        )}
      </CommuFilterChipsRoot>
    </>
  )
}

export default React.memo(CommuFilterChips)

const CommuFilterChipsRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}))

const CommuFilterChipsWrapper = styled('div')<{ expended: boolean }>(({ theme, expended }) => ({
  display: 'flex',
  flexWrap: expended ? 'wrap' : 'nowrap',
  gap: theme.spacing(1),
  flex: 1,
  overflow: expended ? 'visible' : 'hidden',
}))

const CommueFilterChip = styled(Chip)(({ theme }) => ({
  whiteSpace: 'nowrap',
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1.5),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  borderRadius: theme.radius.md,
  cursor: 'pointer',
  flexShrink: 0,
}))
