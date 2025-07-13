type CommunityType =
  | 'DCINSIDE'
  | 'FMKOREA'
  | 'THEQOO'
  | 'PPOMPPU'
  | 'RULIWEB'
  | 'MLBPARK'
  | 'INVEN'
  | 'ARCALIVE'
  | 'NATEPANN'
  | 'CLIEN'
  | 'BOBAEDREAM'
  | 'INSTIZ'
  | 'HUMORUNIV'
  | 'ETOLAND'
  | 'COOK82'

type ValueLabel<T = string> = {
  value: T
  label: string
}

export type { CommunityType, ValueLabel }
