import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root to this project. Stray package-lock.json files in
  // parent directories otherwise make Next infer the wrong root, which breaks
  // metadata routes (e.g. /icon.png) during "Collecting page data".
  outputFileTracingRoot: __dirname,
  images: {
    // Unsplash can exceed Next's optimizer timeout during local development
    // and cause otherwise healthy pages to return `/_next/image` 500s.
    // The browser can load these already-optimized editorial URLs directly.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
