'use client'

import { useColorScheme } from '@mui/joy'
import Image from 'next/image'
import Link from 'next/link'

export default function MainLogo() {
  const { mode } = useColorScheme()

  const logoSrc =
    mode === 'dark'
      ? 'https://churr-bucket.s3.ap-northeast-2.amazonaws.com/common/logo/%EA%B7%B8%EB%9E%AC%EB%8C%80_%EB%A1%9C%EA%B3%A0_%EB%8B%A4%ED%81%AC.png'
      : 'https://churr-bucket.s3.ap-northeast-2.amazonaws.com/common/logo/%EA%B7%B8%EB%9E%AC%EB%8C%80_%EB%A1%9C%EA%B3%A0.png'

  return (
    <Link href="/">
      <Image src={logoSrc} alt="그랬대 로고" width={120} height={40} />
    </Link>
  )
}
