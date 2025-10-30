import { ValueLabel } from '@/types/common.types'

const communityValueLabels: ValueLabel[] = [
  {
    value: 'DCINSIDE',
    label: '디시',
  },
  {
    value: 'FMKOREA',
    label: '펨코',
  },
  {
    value: 'THEQOO',
    label: '더쿠',
  },
  {
    value: 'PPOMPPU',
    label: '뽐뿌',
  },
  {
    value: 'RULIWEB',
    label: '루리웹',
  },
  {
    value: 'BOBAEDREAM',
    label: '보배드림',
  },
  {
    value: 'MLBPARK',
    label: 'MLB파크',
  },
  {
    value: 'INVEN',
    label: '인벤',
  },
  {
    value: 'ARCALIVE',
    label: '아카라이브',
  },
  {
    value: 'NATEPANN',
    label: '네이트판',
  },
  {
    value: 'CLIEN',
    label: '클리앙',
  },
  {
    value: 'INSTIZ',
    label: '인스티즈',
  },
  {
    value: 'HUMORUNIV',
    label: '웃긴대학',
  },
  {
    value: 'ETOLAND',
    label: '이토랜드',
  },
  // {
  //   value: 'COOK82',
  //   label: '82쿡',
  // },
]

const communityLabelMap: Record<string, string> = communityValueLabels.reduce(
  (acc, { value, label }) => {
    acc[value] = label
    return acc
  },
  {} as Record<string, string>,
)

export { communityValueLabels, communityLabelMap }
