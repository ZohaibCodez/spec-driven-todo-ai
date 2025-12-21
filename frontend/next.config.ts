import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Enable static export for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/spec-driven-todo-ai' : '',
  experimental: {
    // serverActions is now enabled by default in Next.js 16, so no need to explicitly set it
  },
  images: {
    unoptimized: true, // Required for static export
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
