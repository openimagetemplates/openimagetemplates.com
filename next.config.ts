import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/templates/:id.json",
        destination: "/api/templates/:id",
      },
    ];
  },
};

export default nextConfig;
