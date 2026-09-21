import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Replace 'your-repo-name' with the exact name of your GitHub repository
  basePath: "/next-portfolio",
};

module.exports = {
  allowedDevOrigins: ["10.90.70.144"],
};

export default nextConfig;
