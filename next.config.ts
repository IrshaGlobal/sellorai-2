/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'sellor.ai'],
  },
  // Fix for HMR issues
  webpack: (config: any) => {
    config.infrastructureLogging = {
      level: 'error',
    };
    return config;
  },
  // Prevent automatic redirects to login
  async redirects() {
    return [];
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '(?<subdomain>[^.]+).sellor.ai',
          },
        ],
        destination: '/store/:subdomain/:path*',
      },
    ];
  },
}

module.exports = nextConfig