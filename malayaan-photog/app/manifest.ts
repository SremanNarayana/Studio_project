import type { MetadataRoute } from "next";
import { BUSINESS } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BUSINESS.name} — Wedding & Portrait Photography, Tamil Nadu`,
    short_name: BUSINESS.name,
    description: `${BUSINESS.tagline} Premium photography across Madurai, Melur & Tamil Nadu.`,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0e0d12",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
  };
}
