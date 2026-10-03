import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    // Product photos are resized in the browser first, so 5mb is plenty.
    serverActions: { bodySizeLimit: "5mb" },
  },
};

export default nextConfig;
