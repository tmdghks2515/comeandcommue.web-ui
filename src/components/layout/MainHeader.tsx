'use client'

import { styled, Typography } from '@mui/joy'
import WhatshotIcon from '@mui/icons-material/Whatshot'

export default function MainHeader() {
  return (
    <HeaderWrapper>
      {/* 로고 */}

      <HeaderLeft>
        <Title>summit</Title>
      </HeaderLeft>

      <HeaderCenter>
        <NavLink active>
          <TrendingIcon />
          트렌딩
        </NavLink>
      </HeaderCenter>

      <HeaderRight>
        <Nickname>멍청한거대빨강원숭이</Nickname>
      </HeaderRight>
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled('header')(({ theme }) => ({
  padding: `${theme.spacing(2)} ${theme.spacing(1)}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  // gridTemplateColumns: 'auto 1fr auto',
  alignItems: 'baseline',

  // 태블릿 이상
  [theme.breakpoints.up('sm')]: {
    padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
  },
}))

const HeaderLeft = styled('div')({
  display: 'flex',
})

const HeaderCenter = styled('div')({
  display: 'flex',
  paddingLeft: '6rem',
})

const HeaderRight = styled('div')({
  display: 'flex',
})

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: theme.palette.primary.plainColor,
}))

const Nickname = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '.8rem',
  fontWeight: theme.fontWeight.lg,
}))

interface NavLinkProps {
  active?: boolean
}
const NavLink = styled('span', {
  shouldForwardProp: (prop) => prop !== 'active', // styled-components v5 방식 (Emotion도 유사)
})<NavLinkProps>(({ theme, active }) => ({
  fontSize: '.9rem',
  fontWeight: 'bold',
  color: active ? theme.palette.text.secondary : theme.palette.text.tertiary,
  cursor: 'pointer',
}))

const TrendingIcon = styled(WhatshotIcon)(({ theme }) => ({
  marginTop: '-.3rem',
  marginRight: '.2rem',
  fontSize: '1.5rem',
}))
