/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript:{
    ignoreBuildErrors:true,
  },
  reactStrictMode: true,
  images:{}
}

module.exports = nextConfig
// const withTM = require('next-transpile-modules')(['three'])
// module.exports = withTM()