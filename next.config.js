/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/viralreels',
        destination: '/saas',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
