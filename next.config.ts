import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Netlify를 위한 설정
  trailingSlash: false,
};

export default nextConfig;
