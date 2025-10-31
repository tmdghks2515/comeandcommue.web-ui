import type { NextConfig } from 'next'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: true,
  webpack(config) {
    if (process.env.ANALYZE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 'auto',
          openAnalyzer: true,
        }),
      )
    }
    return config
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'churr-bucket.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      { source: '/api/user/:path*', destination: process.env.NEXT_PUBLIC_USER_API_URL + '/:path*' },
      { source: '/api/post/query/:path*', destination: process.env.NEXT_PUBLIC_POST_QUERY_API_URL + '/:path*' },
      { source: '/api/post/:path*', destination: process.env.NEXT_PUBLIC_POST_API_URL + '/:path*' },
      { source: '/api/chat/:path*', destination: process.env.NEXT_PUBLIC_CHAT_API_URL + '/:path*' },
    ]
  },
  output: 'standalone',
}

export default nextConfig
