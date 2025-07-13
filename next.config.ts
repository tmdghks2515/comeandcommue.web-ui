import type { NextConfig } from 'next'
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: false,
  trailingSlash: true,
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
}

export default nextConfig
