import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@radix-ui"],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        path: require.resolve("path-browserify"),
      };
    }
    return config;
  },
};

export default nextConfig;
