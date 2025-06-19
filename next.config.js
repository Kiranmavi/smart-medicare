/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  distDir: 'out',
  trailingSlash: true,
  // basePath: '/Medicare',
  // assetPrefix: '/Medicare/',
};

module.exports = nextConfig;
