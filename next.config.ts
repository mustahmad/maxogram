import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "i.pravatar.cc" },
      { hostname: "picsum.photos" },
      { hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
