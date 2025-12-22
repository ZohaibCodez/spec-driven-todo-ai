import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Note: Removed 'output: export' because Better Auth requires API routes (server-side)
  // Deploy to Vercel - supports Next.js API routes for Better Auth
  experimental: {
    // serverActions is now enabled by default in Next.js 16, so no need to explicitly set it
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
  },
};

export default nextConfig;
