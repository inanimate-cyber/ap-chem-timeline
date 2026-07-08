import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages. BASE_PATH is set by the deploy workflow
  // to "/<repo-name>" so assets resolve under the project page URL.
  output: "export",
  basePath: process.env.BASE_PATH ?? "",
  images: { unoptimized: true },
};

export default nextConfig;
