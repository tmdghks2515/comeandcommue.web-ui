'use client'

import { Dropdown, IconButton, Menu, MenuButton, MenuItem, styled, Typography, useColorScheme } from '@mui/joy'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import useLoginUserStore from '@/store/useLoginUserStore'
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined'
import useApi from '@/hooks/useApi'
import { userService } from '@/core/services/user.service'
import { useCallback, memo } from 'react'

function MainHeader() {
  const { mode, setMode } = useColorScheme()
  const { loginUser, setLoginUser } = useLoginUserStore()

  const { execute: executeChangeNickname } = useApi({
    api: userService.changeNickname,
    onSuccess: (data) => {
      setLoginUser(data)
    },
    onError: (error) => {
      alert(error)
      // alert(error.response?.data?.message || '닉네임 변경에 실패했습니다. 잠시 후 다시 시도해주세요.')
    },
  })

  const handleChangeNickname = useCallback(() => {
    /* if (loginUser.dailyNicknameChangeRemain <= 0) {
      alert('오늘 닉네임 변경 가능 횟수를 모두 사용했습니다. 내일 다시 시도해주세요.')
      return
    } */

    executeChangeNickname()
  }, [executeChangeNickname, loginUser.dailyNicknameChangeRemain])

  return (
    <HeaderRoot>
      <HeaderPart1>
        <Title>summit</Title>
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
            <MenuItem>닉네임 변경 ({loginUser.dailyNicknameChangeRemain || 0}/3)</MenuItem>
          </Menu>
        </Dropdown>
      </HeaderPart3>
    </HeaderRoot>
  )
}

export default memo(MainHeader)

const HeaderRoot = styled('header')(({ theme }) => ({
  padding: `${theme.spacing(2)} ${theme.spacing(1)}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  // gridTemplateColumns: 'auto 1fr auto',

  // 태블릿 이상
  [theme.breakpoints.up('sm')]: {
    padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
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

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  marginRight: theme.spacing(4),
  paddingLeft: theme.spacing(1),
}))
