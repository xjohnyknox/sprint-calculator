/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Make sure CSS is properly processed
  webpack: (config) => {
    return config;
  },
  // Ensure static assets are properly handled
  images: {
    unoptimized: true,
  },
  // Disable experimental features that might cause issues
  experimental: {
    // Disable experimental features for now
  },
};

export default nextConfig;

