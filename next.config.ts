import type { NextConfig } from "next";

const repo = "/Quran-Zertifikat";

const nextConfig: NextConfig = {
  output: "export",
  basePath: repo,
  assetPrefix: repo,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;