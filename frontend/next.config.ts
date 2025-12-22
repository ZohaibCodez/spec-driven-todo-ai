import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Note: Removed 'output: export' because Better Auth requires API routes (server-side)
  // Deploy to Vercel, Netlify, or similar platforms that support Next.js API routes
  basePath: process.env.NODE_ENV === 'production' ? '/spec-driven-todo-ai' : '',
  experimental: {
    // serverActions is now enabled by default in Next.js 16, so no need to explicitly set it
  },
  images: {
    unoptimized: true,
    remotePatterns: [
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
