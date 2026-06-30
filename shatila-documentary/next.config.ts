import type { NextConfig } from "next";

// In production we export a fully static site that lives under /shatila/ in the
// portfolio. In dev we keep the app at the root of localhost:3000.
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/shatila" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
