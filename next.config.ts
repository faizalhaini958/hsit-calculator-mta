import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Empty turbopack config to silence Next.js 16 warning
  turbopack: {},
};

export default nextConfig;
