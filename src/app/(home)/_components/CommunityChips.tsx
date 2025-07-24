'use client'

import { communityValueLabels } from '@/constants/post.constants'
import { Box, Button, Checkbox, Chip, IconButton, Typography } from '@mui/joy'
import React, { useEffect, useRef, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

interface CommunityChipsProps {
  selected: string[]
  onChange: (nextSelected: string[]) => void
}

function CommunityChips({ selected, onChange }: CommunityChipsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const chipsWrapperRef = useRef<HTMLDivElement>(null)

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
      onChange([...selected, value])
    } else {
      onChange(selected.filter((v) => v !== value))
    }
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
        }}
      >
        {/* Chip 목록 */}
        <Box
          ref={chipsWrapperRef}
          role="group"
          aria-label="커뮤니티 선택"
          sx={{
            display: 'flex',
            flexWrap: isExpanded ? 'wrap' : 'nowrap',
            gap: 1,
            flex: 1,
            overflow: isExpanded ? 'visible' : 'hidden',
          }}
        >
          {communityValueLabels.map(({ value, label }) => {
            const isChecked = selected.includes(value)
            return (
              <Chip
                key={value}
                variant="outlined"
                color={isChecked ? 'primary' : 'neutral'}
                sx={{
                  whiteSpace: 'nowrap',
                  pl: 1,
                  pr: 1.5,
                  py: 0.5,
                  borderRadius: 'md',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
                aria-pressed={isChecked}
                onClick={() => toggleSelection(value)}
              >
                {label}
              </Chip>
            )
          })}
        </Box>

        {/* 넘칠 때만 표시되는 버튼 */}
        {isOverflowing && (
          <Box sx={{ flexShrink: 0 }}>
            <IconButton variant="plain" size="sm" onClick={() => setIsExpanded((prev) => !prev)}>
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default React.memo(CommunityChips)
