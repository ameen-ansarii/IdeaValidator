import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preserve scroll position when navigating back
  experimental: {
    scrollRestoration: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/favicons',
      },
    ],
  },
};

export default nextConfig;
