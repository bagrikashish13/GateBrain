import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server.js for the Docker image (see Dockerfile).
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Public host behind the Cloudflare tunnel, in case the Host header ever arrives rewritten.
    serverActions: { allowedOrigins: process.env.PUBLIC_HOST ? [process.env.PUBLIC_HOST] : [] },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
