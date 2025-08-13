'use client'

import { Button, IconButton, styled, Typography, useColorScheme } from '@mui/joy'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import useLoginUserStore from '@/store/useLoginUserStore'

export default function MainHeader() {
  const { mode, setMode } = useColorScheme()
  const loginUser = useLoginUserStore((state) => state.loginUser)

  return (
    <HeaderRoot>
      <HeaderPart1>
        <Title>summit</Title>
      </HeaderPart1>

      <HeaderPart2>
        <Button startDecorator={<WhatshotIcon />} variant="plain" color="neutral" size="sm">
          트렌딩
        </Button>
      </HeaderPart2>

      <HeaderPart3>
        <IconButton onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <Nickname>{loginUser?.nickname}</Nickname>
      </HeaderPart3>
    </HeaderRoot>
  )
}

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
  gap: 8,
})

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  marginRight: theme.spacing(4),
}))

const Nickname = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '.8rem',
  fontWeight: theme.fontWeight.lg,
}))
