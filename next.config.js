/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["0.0.0.0", "your-other-domain.com"],
  },
  eslint: {
    dirs: ["src", "playwright-tests"],
  },
};

module.exports = nextConfig;
