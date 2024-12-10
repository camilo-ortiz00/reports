/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.daisyui.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
