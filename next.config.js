/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["0.0.0.0", "your-other-domain.com"],
  },
  eslint: {
    dirs: ["src", "playwright-tests"],
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
