import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Preserve scroll position when navigating back
  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;
