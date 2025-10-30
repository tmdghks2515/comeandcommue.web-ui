'use client'

import { Dropdown, IconButton, Menu, MenuButton, MenuItem, styled, useColorScheme } from '@mui/joy'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import useLoginUserStore from '@/store/useLoginUserStore'
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined'
import useApi from '@/hooks/useApi'
import { userService } from '@/core/services/user.service'
import { useCallback, memo } from 'react'
import Link from 'next/link'
import MainLogo from '../common/MainLogo'

function MainHeader() {
  const { mode, setMode } = useColorScheme()
  const { loginUser, setLoginUser } = useLoginUserStore()

  const { execute: executeChangeNickname } = useApi({
    api: userService.changeNickname,
    onSuccess: (data) => {
      setLoginUser(data)
    },
  })

  const handleChangeNickname = useCallback(() => {
    executeChangeNickname()
  }, [executeChangeNickname])

  return (
    <HeaderRoot>
      <HeaderPart1>
        <MainLogo />
      </HeaderPart1>

      <HeaderPart2>
        {/* <Button startDecorator={<WhatshotIcon />} variant="plain" color="neutral" size="sm">
          Hot
        </Button> */}
      </HeaderPart2>

      <HeaderPart3>
        <IconButton onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>

        <Dropdown>
          <MenuButton variant="plain" size="sm" endDecorator={<ArrowDropDownOutlinedIcon />}>
            {loginUser?.nickname}
          </MenuButton>
          <Menu placement="bottom-end" size="sm" onClick={handleChangeNickname}>
            <MenuItem>닉네임 변경</MenuItem>
          </Menu>
        </Dropdown>
      </HeaderPart3>
    </HeaderRoot>
  )
}

export default memo(MainHeader)

const HeaderRoot = styled('header')(({ theme }) => ({
  padding: `${theme.spacing(1)} ${theme.spacing(1)}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  // gridTemplateColumns: 'auto 1fr auto',

  // 태블릿 이상
  [theme.breakpoints.up('sm')]: {
    padding: `${theme.spacing(2)} ${theme.spacing(1)}`,
  },
}))

const HeaderPart1 = styled('div')({
  display: 'flex',
})

const HeaderPart2 = styled('div')({
  display: 'flex',
  flex: 1,
})

const HeaderPart3 = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
})
