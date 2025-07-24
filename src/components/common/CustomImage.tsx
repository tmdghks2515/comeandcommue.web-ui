import Image from 'next/image'
import React, { useState } from 'react'

function CustomImage({
  src,
  alt,
  width,
  height,
  placeholder = 'empty',
}: {
  src: string
  alt: string
  width?: number
  height?: number
  placeholder?: 'empty' | 'blur'
}) {
  const [hasError, setHasError] = useState(false)

  return (
    !hasError && (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{ objectFit: 'cover', borderRadius: '8px' }}
        loading="lazy"
        className={`custom-image ${placeholder === 'blur' ? 'blur-placeholder' : ''}`}
        onError={() => setHasError(true)}
      />
    )
  )
}

export default React.memo(CustomImage)
