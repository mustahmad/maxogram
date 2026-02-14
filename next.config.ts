import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/maxogram" : "",
  images: {
    unoptimized: true,
    remotePatterns: [
      { hostname: "i.pravatar.cc" },
      { hostname: "picsum.photos" },
      { hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
