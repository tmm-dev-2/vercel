/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  webpack: (config) => {
    config.ignoreWarnings = [/pages\/screenera_and_allert\/Screener_builter/];
    return config;
  }
}

module.exports = nextConfig