import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@radix-ui"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        "puppeteer-core": "puppeteer-core",
        "@sparticuz/chromium": "@sparticuz/chromium",
      });
    }
    return config;
  },
};

export default nextConfig;
