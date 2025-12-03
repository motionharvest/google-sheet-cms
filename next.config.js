/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: false,
  },
  async rewrites() {
    return [
      {
        source: '/playbill/:slug/:tab*',
        destination: '/:slug/:tab*',
      },
    ];
  },
};

export default nextConfig;
