import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  experimental: {
    turbopackFileSystemCacheForBuild: true,
  },
};

export default nextConfig;
