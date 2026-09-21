import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NODE_ENV === "production" ? "/folio" : "",
  output: "export",
  allowedDevOrigins: ["10.90.70.144"],
};

export default nextConfig;
