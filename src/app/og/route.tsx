import { ImageResponse } from 'next/og'
export const runtime = 'edge'
export const size = { width: 1200, height: 630 }

export async function GET(req: Request) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 72,
          background: '#101010',
          color: '#fff',
        }}
      >
        {'그랬대!'}
      </div>
    ),
    size,
  )
}
